'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createArticleAction,
  updateArticleAction,
  deleteArticleAction,
  updateSettingAction
} from '@/app/actions/content';

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
    largeImage: string;
    smallImage: string;
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

  // Banner settings states
  const [largeBanner, setLargeBanner] = useState(initialBannerSettings.largeImage);
  const [smallBanner, setSmallBanner] = useState(initialBannerSettings.smallImage);
  const [bannerLoading, setBannerLoading] = useState(false);
  const [bannerError, setBannerError] = useState('');
  const [bannerSuccess, setBannerSuccess] = useState(false);

  const openCreateModal = () => {
    setEditingArticle(null);
    setTitle('');
    setCategory('Tin tức');
    setImage('');
    setSummary('');
    setError('');
    setIsOpen(true);
  };

  const openEditModal = (article: Article) => {
    setEditingArticle(article);
    setTitle(article.title);
    setCategory(article.category);
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

    const payload = {
      title,
      category,
      image: image || 'https://lh3.googleusercontent.com/aida-public/AB6AXuD0gUrpDrfeFU_Yv52ojl__qDMu2iJBO5s34hrrsjYkLHK6Bhkz9mXaPsd4VPh7xDjttnsKtxie18TWAQSN-a44V3A3J9nHUQ15fnz3b8q9I_jGsiyWBzQoJcFp_LxW2lLvdKKOkoavmo-dncTVg7pAmy5QugtUYr9GgiW25eWHkOaLN8OkMDTpDqT1KRBXZjmHNuWHC9b20wnUhbHEHn9I_7KyjAWxOoh3g2MxGyF4yMbVilr4Z-Q8',
      summary,
      publishedAt: new Date().toLocaleDateString('vi-VN')
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
      if (editingArticle) {
        setArticles(articles.map(a => a.id === editingArticle.id ? { ...a, ...payload } : a));
      } else {
        setArticles([{ id: 'new-' + Math.random(), ...payload }, ...articles]);
      }
    } else {
      setError(res.error || 'Có lỗi xảy ra.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      return;
    }

    const res = await deleteArticleAction(id);
    if (res.success) {
      setArticles(articles.filter(a => a.id !== id));
      router.refresh();
    } else {
      alert(res.error || 'Lỗi khi xóa bài viết.');
    }
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    setBannerLoading(true);
    setBannerError('');
    setBannerSuccess(false);

    try {
      const [resLarge, resSmall] = await Promise.all([
        updateSettingAction('homepage_banner_large_image', largeBanner),
        updateSettingAction('homepage_banner_small_image', smallBanner)
      ]);

      if (resLarge.success && resSmall.success) {
        setBannerSuccess(true);
        router.refresh();
      } else {
        setBannerError(resLarge.error || resSmall.error || 'Lỗi khi cập nhật cài đặt banner.');
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
            <h2 className="text-xl font-bold text-gray-900">Quản lý Banner Trang chủ</h2>
            <p className="text-xs text-gray-400 font-medium">Cấu hình các hình ảnh hiển thị ở phần Banner chính của trang web khách hàng</p>
          </div>

          <form onSubmit={handleSaveBanner} className="space-y-6">
            {bannerError && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-xs font-semibold">
                {bannerError}
              </div>
            )}

            {bannerSuccess && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 p-4 rounded-xl text-xs font-semibold">
                Cập nhật cấu hình Banner trang chủ thành công!
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Inputs */}
              <div className="lg:col-span-7 space-y-5 text-xs font-semibold text-gray-500">
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wider">Hình Tròn Lớn (Mặc định: Rừng Sâm)</label>
                  <input
                    type="text"
                    value={largeBanner}
                    onChange={(e) => setLargeBanner(e.target.value)}
                    placeholder="Đường dẫn ảnh lớn (URL)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="uppercase tracking-wider">Hình Tròn Nhỏ (Mặc định: Cây Giống non)</label>
                  <input
                    type="text"
                    value={smallBanner}
                    onChange={(e) => setSmallBanner(e.target.value)}
                    placeholder="Đường dẫn ảnh nhỏ (URL)"
                    className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                  />
                </div>

                <button
                  type="submit"
                  disabled={bannerLoading}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-3 rounded-xl shadow-md transition-colors text-xs disabled:opacity-50"
                >
                  {bannerLoading ? 'Đang lưu...' : 'Lưu cấu hình Banner'}
                </button>
              </div>

              {/* Live Preview box */}
              <div className="lg:col-span-5 bg-gray-50 border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
                <span className="absolute top-3 left-3 bg-gray-200 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">Xem trước</span>
                
                {/* Banner Graphics mockup */}
                <div className="relative w-44 h-44 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white flex items-center justify-center">
                  <img
                    className="w-full h-full object-cover"
                    src={largeBanner || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMsiW4ViCyUtMk4AfTXxRrJiQcT8tKQAUyVZSXqxfcf1L9lTee9CFuEtFGMMjXYCiQ171omUJD_nKj17QENbeUhZY9asWGZwU2oUtaEVYL2WrPG-leo-Rl4Z4xzRajZWEEFUdZuNQ-Oabmc8mly-VTAvsgCjL5V8dXv3dSEEgjgGwV9kzzLxA9nRYYRqkuY1002C6NkxdMXfId3twLyXv07FUV5yuZvj7I3k8B5ftQ2qY81eNSId_e'}
                    alt="Lớn"
                  />
                </div>
                <div className="absolute bottom-6 right-16 w-16 h-16 rounded-full overflow-hidden border-2 border-white shadow-md bg-white">
                  <img
                    className="w-full h-full object-cover"
                    src={smallBanner || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMm0MsRntVMXJuZkq_isCb_qWD3-uvCuw7p3HKx0E-SWSpRdnCX13R14A5EkaBtLx0vmjYQa9E1AquPBXvMm4zbWQDvVaQQPjjBm16XxTYavFOm4o1KWFxMlGCevWg0QI8T27IldHLjvAOiCs1EeCWCXrhj79MnkffrdbmPfTMyjAjF3Wv0iwhVac1vCXcUBBnMZ7ZMLMT_ih8W6NH1PapFilnZDUzOs5D6CkUAPi6cZLtA3IMEEkn'}
                    alt="Nhỏ"
                  />
                </div>
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
                <label className="uppercase tracking-wider">Hình ảnh (URL)</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="Nhập đường dẫn hình ảnh"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-xs focus:outline-none focus:border-primary text-gray-800 font-medium"
                />
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
    </div>
  );
};
