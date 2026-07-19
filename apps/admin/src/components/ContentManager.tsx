'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '@/lib/api';
import {
  createArticleAction,
  updateArticleAction,
  deleteArticleAction,
  updateSettingAction
} from '@/app/actions/content';
import { ToastCard, ConfirmationDialog } from "@/components/ui/feedback-components"

type Article = {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  image?: string;
  summary?: string;
};

type ContentManagerProps = {
  initialArticles: Article[];
  initialBannerSettings: {
    homepage_banner_image_1: string;
    homepage_banner_image_2: string;
    homepage_banner_image_3: string;
    homepage_banner_image_4: string;
    homepage_banner_image_5: string;
    about_banner_image: string;
    news_banner_image: string;
    campaigns_banner_image: string;
  };
};

export const ContentManager = ({ initialArticles, initialBannerSettings }: ContentManagerProps) => {
  const router = useRouter();
  
  // Navigation tabs: 'articles' | 'banner'
  const [activeTab, setActiveTab] = useState<'articles' | 'banner'>('articles');
  
  // Articles state
  const [articles, setArticles] = useState<Article[]>(initialArticles);
  const [isOpen, setIsOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);
  
  // Article form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Tin tức');
  const [image, setImage] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Toast & Confirmation Dialog States
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmDialogTitle, setConfirmDialogTitle] = useState("");
  const [confirmDialogDesc, setConfirmDialogDesc] = useState("");
  const [confirmDialogAction, setConfirmDialogAction] = useState<() => void>(() => {});
  const [confirmDialogLoading, setConfirmDialogLoading] = useState(false);

  // Banner settings states
  const [homepageBanner1, setHomepageBanner1] = useState(initialBannerSettings.homepage_banner_image_1);
  const [homepageBanner2, setHomepageBanner2] = useState(initialBannerSettings.homepage_banner_image_2);
  const [homepageBanner3, setHomepageBanner3] = useState(initialBannerSettings.homepage_banner_image_3);
  const [homepageBanner4, setHomepageBanner4] = useState(initialBannerSettings.homepage_banner_image_4);
  const [homepageBanner5, setHomepageBanner5] = useState(initialBannerSettings.homepage_banner_image_5);
  
  const [aboutBanner, setAboutBanner] = useState(initialBannerSettings.about_banner_image);
  const [newsBanner, setNewsBanner] = useState(initialBannerSettings.news_banner_image);
  const [campaignsBanner, setCampaignsBanner] = useState(initialBannerSettings.campaigns_banner_image);

  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerError, setBannerError] = useState('');
  const [bannerSuccess, setBannerSuccess] = useState(false);

  const [uploadingImage, setUploadingImage] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    setError('');

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetchApi("/admin/catalog/upload", {
        method: "POST",
        body: fd,
      });

      const payload = await res.json();
      if (res.status >= 400) {
        setError(payload?.message || "Tải ảnh lên thất bại");
      } else {
        setImage(payload.data?.url || "");
      }
    } catch (err) {
      console.error(err);
      setError("Lỗi kết nối khi tải ảnh lên");
    } finally {
      setUploadingImage(false);
    }
  };

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle('');
    setCategory('Tin tức');
    setImage('');
    setSummary('');
    setError('');
    setIsOpen(true);
  };

  const slugify = (text: string) => {
    return text
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[đĐ]/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    
    const reverseCategoryMap: Record<string, string> = {
      'news': 'Tin tức',
      'faq': 'Kiến thức',
      'guide': 'Hướng dẫn sử dụng app',
      'event': 'Sự kiện'
    };
    setCategory(reverseCategoryMap[article.category] || article.category);
    setImage(article.image || '');
    setSummary(article.summary || '');
    setError('');
    setIsOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) {
      setError('Vui lòng nhập tiêu đề bài viết.');
      return;
    }

    setLoading(true);
    setError('');

    const categoryMap: Record<string, string> = {
      'Tin tức': 'news',
      'Kiến thức': 'faq',
      'Hướng dẫn sử dụng app': 'guide',
      'Sự kiện': 'event'
    };

    const dbCategory = categoryMap[category] || 'news';
    const generatedSlug = slugify(title);

    const payload = {
      slug: generatedSlug,
      title,
      category: dbCategory,
      coverImage: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8',
      summary,
      status: 'published',
    };

    let res;
    if (editingArticle) {
      res = await updateArticleAction(editingArticle.id, payload);
    } else {
      res = await createArticleAction(payload);
    }

    setLoading(false);

    if (res.success) {
      setIsOpen(false);
      router.refresh();
      const updatedArticle = {
        id: editingArticle?.id || 'new-' + Math.random(),
        ...payload,
        image: payload.coverImage,
        publishedAt: new Date().toLocaleDateString('vi-VN')
      };
      if (editingArticle) {
        setArticles(articles.map(a => a.id === editingArticle.id ? (updatedArticle as any) : a));
      } else {
        setArticles([updatedArticle as any, ...articles]);
      }
    } else {
      setError(res.error || 'Có lỗi xảy ra.');
    }
  };

  const handleDelete = (id: string) => {
    const article = articles.find((a) => a.id === id);
    setConfirmDialogTitle("Xóa bài viết?");
    setConfirmDialogDesc(`Hành động này sẽ xóa vĩnh viễn bài viết "${article?.title || ""}" khỏi hệ thống. Bạn không thể hoàn tác thao tác này.`);
    setConfirmDialogAction(() => () => performDelete(id));
    setConfirmDialogOpen(true);
  };

  const performDelete = async (id: string) => {
    setConfirmDialogLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await deleteArticleAction(id);
      if (res.success) {
        setArticles(articles.filter(a => a.id !== id));
        setSuccessMsg("Xóa bài viết thành công!");
        router.refresh();
      } else {
        setErrorMsg(res.error || 'Lỗi khi xóa bài viết.');
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("Lỗi hệ thống khi xóa bài viết.");
    } finally {
      setConfirmDialogOpen(false);
      setConfirmDialogLoading(false);
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerLoading(true);
    setBannerError('');
    setBannerSuccess(false);

    try {
      const results = await Promise.all([
        updateSettingAction('homepage_banner_image_1', homepageBanner1),
        updateSettingAction('homepage_banner_image_2', homepageBanner2),
        updateSettingAction('homepage_banner_image_3', homepageBanner3),
        updateSettingAction('homepage_banner_image_4', homepageBanner4),
        updateSettingAction('homepage_banner_image_5', homepageBanner5),
        updateSettingAction('about_banner_image', aboutBanner),
        updateSettingAction('news_banner_image', newsBanner),
        updateSettingAction('campaigns_banner_image', campaignsBanner),
      ]);

      const failedResult = results.find(res => !res.success);

      if (!failedResult) {
        setBannerSuccess(true);
        router.refresh();
      } else {
        setBannerError(failedResult.error || 'Lỗi khi cập nhật cài đặt banner.');
      }
    } catch (err: any) {
      setBannerError(err.message || 'Lỗi kết nối.');
    } finally {
      setBannerLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setActiveTab('articles')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'articles' ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Quản lý bài viết
        </button>
        <button
          onClick={() => setActiveTab('banner')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'banner' ? 'border-emerald-700 text-emerald-700' : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Cài đặt Banner trang chủ
        </button>
      </div>

      {activeTab === 'articles' && (
        <div className="space-y-6">
          {/* Header section */}
          <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Quản lý bài viết</h2>
              <p className="text-xs text-gray-400 font-medium">Soạn thảo, cập nhật và chỉnh sửa nội dung bài viết hiển thị trên trang web khách hàng</p>
            </div>
            <button
              onClick={openCreateModal}
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Thêm bài viết
            </button>
          </div>

          {/* Articles list table */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 font-bold text-gray-500 uppercase tracking-wider">
                    <th className="px-6 py-4">Hình ảnh</th>
                    <th className="px-6 py-4">Tiêu đề bài viết</th>
                    <th className="px-6 py-4">Danh mục</th>
                    <th className="px-6 py-4">Ngày đăng</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-150 text-gray-700 font-medium">
                  {articles.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                        Không có bài viết nào được tìm thấy.
                      </td>
                    </tr>
                  ) : (
                    articles.map((article) => (
                      <tr key={article.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <img
                            src={article.image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8'}
                            alt={article.title}
                            className="w-16 h-10 object-cover rounded-lg border border-gray-200 shadow-sm"
                          />
                        </td>
                        <td className="px-6 py-4 max-w-sm">
                          <p className="font-bold text-gray-900 line-clamp-1">{article.title}</p>
                          <p className="text-gray-400 text-[10px] line-clamp-1 mt-0.5">{article.summary || 'Không có mô tả ngắn'}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-100 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                            {article.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {article.publishedAt}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => openEditModal(article)}
                            className="text-emerald-700 hover:text-emerald-950 font-bold"
                          >
                            Sửa
                          </button>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="text-red-600 hover:text-red-800 font-bold"
                          >
                            Xóa
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'banner' && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Quản lý Banner Hệ Thống</h2>
            <p className="text-xs text-gray-400 font-medium">Cấu hình các hình ảnh hiển thị ở phần Banner chính trên Trang chủ và các Trang con</p>
          </div>

          <form onSubmit={handleSaveBanner} className="space-y-6">
            {bannerError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold">
                {bannerError}
              </div>
            )}

            {bannerSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-xs font-semibold">
                Cập nhật cấu hình Banner hệ thống thành công!
              </div>
            )}

            <div className="space-y-6">
              <div className="border-b border-gray-150 pb-4">
                <h3 className="text-sm font-bold text-emerald-800 mb-4">I. Banners Trang Chủ (5 ảnh slide hiển thị xoay vòng)</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-gray-500">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wider">Hình Banner Slide 1</label>
                    <input
                      type="text"
                      value={homepageBanner1}
                      onChange={(e) => setHomepageBanner1(e.target.value)}
                      placeholder="Đường dẫn ảnh slide 1 (URL)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wider">Hình Banner Slide 2</label>
                    <input
                      type="text"
                      value={homepageBanner2}
                      onChange={(e) => setHomepageBanner2(e.target.value)}
                      placeholder="Đường dẫn ảnh slide 2 (URL)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wider">Hình Banner Slide 3</label>
                    <input
                      type="text"
                      value={homepageBanner3}
                      onChange={(e) => setHomepageBanner3(e.target.value)}
                      placeholder="Đường dẫn ảnh slide 3 (URL)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wider">Hình Banner Slide 4</label>
                    <input
                      type="text"
                      value={homepageBanner4}
                      onChange={(e) => setHomepageBanner4(e.target.value)}
                      placeholder="Đường dẫn ảnh slide 4 (URL)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wider">Hình Banner Slide 5</label>
                    <input
                      type="text"
                      value={homepageBanner5}
                      onChange={(e) => setHomepageBanner5(e.target.value)}
                      placeholder="Đường dẫn ảnh slide 5 (URL)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-150 pb-4">
                <h3 className="text-sm font-bold text-emerald-800 mb-4">II. Banners Cho Các Trang Con</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-semibold text-gray-500">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wider">Banner trang Giới Thiệu (About)</label>
                    <input
                      type="text"
                      value={aboutBanner}
                      onChange={(e) => setAboutBanner(e.target.value)}
                      placeholder="Đường dẫn ảnh trang Giới Thiệu (URL)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wider">Banner trang Tin Tức (News)</label>
                    <input
                      type="text"
                      value={newsBanner}
                      onChange={(e) => setNewsBanner(e.target.value)}
                      placeholder="Đường dẫn ảnh trang Tin Tức (URL)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wider">Banner trang Khuyến Mãi (Campaigns)</label>
                    <input
                      type="text"
                      value={campaignsBanner}
                      onChange={(e) => setCampaignsBanner(e.target.value)}
                      placeholder="Đường dẫn ảnh trang Khuyến Mãi (URL)"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                    />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={bannerLoading}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-8 py-3.5 rounded-xl shadow-md transition-colors text-xs disabled:opacity-50"
                >
                  {bannerLoading ? 'Đang lưu...' : 'Lưu toàn bộ Banner'}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Modal create/edit */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl border border-gray-200 shadow-2xl max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-5 border-b border-gray-150 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-900 text-sm">
                {editingArticle ? 'Chỉnh sửa bài viết' : 'Thêm bài viết mới'}
              </h3>
              <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-semibold text-gray-500">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-medium">
                  {error}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="uppercase tracking-wider">Tiêu đề bài viết</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <label className="uppercase tracking-wider">Danh mục</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 bg-white focus:outline-none focus:border-primary text-gray-800 font-medium"
                >
                  <option>Tin tức</option>
                  <option>Kiến thức</option>
                  <option>Hướng dẫn sử dụng app</option>
                  <option>Sự kiện</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="uppercase tracking-wider">Hình ảnh bài viết</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="Đường dẫn ảnh hoặc tải lên..."
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                  />
                  <label className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-lg transition-colors text-xs flex items-center justify-center cursor-pointer min-w-[100px] text-center">
                    {uploadingImage ? 'Đang tải...' : 'Tải ảnh lên'}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploadingImage}
                      className="hidden"
                    />
                  </label>
                </div>
                {image && (
                  <div className="mt-2 relative w-full h-32 rounded-lg overflow-hidden border border-gray-200">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setImage('')}
                      className="absolute top-1.5 right-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-3.5 h-3.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="space-y-1.5">
                <label className="uppercase tracking-wider">Mô tả ngắn</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Nhập mô tả ngắn cho bài viết..."
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-150 justify-end">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-5 py-2.5 rounded-lg transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-2.5 rounded-lg transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  {loading ? 'Đang lưu...' : 'Lưu lại'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={confirmDialogAction}
        title={confirmDialogTitle}
        description={confirmDialogDesc}
        confirmLabel="Xác nhận"
        cancelLabel="Hủy bỏ"
        type="danger"
        isLoading={confirmDialogLoading}
      />

      {/* Toast notifications */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 pointer-events-auto">
        {successMsg && (
          <ToastCard
            type="success"
            title="Thành công"
            description={successMsg}
            onClose={() => setSuccessMsg("")}
          />
        )}
        {errorMsg && (
          <ToastCard
            type="error"
            title="Lỗi xảy ra"
            description={errorMsg}
            onClose={() => setErrorMsg("")}
          />
        )}
      </div>
    </div>
  );
};
