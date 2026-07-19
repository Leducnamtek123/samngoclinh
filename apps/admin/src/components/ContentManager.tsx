'use client';

import { useContentManager } from './use-content-manager';
import { ArticlesList } from './content/articles-list';
import { BannerSettings } from './content/banner-settings';
import { ArticleDialog } from './content/article-dialog';
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
  const {
    activeTab,
    setActiveTab,
    articles,
    isOpen,
    setIsOpen,
    title,
    setTitle,
    category,
    setCategory,
    image,
    setImage,
    summary,
    setSummary,
    loading,
    error,
    successMsg,
    setSuccessMsg,
    errorMsg,
    setErrorMsg,
    confirmDialog,
    setConfirmDialog,
    homepageBanner1,
    setHomepageBanner1,
    homepageBanner2,
    setHomepageBanner2,
    homepageBanner3,
    setHomepageBanner3,
    homepageBanner4,
    setHomepageBanner4,
    homepageBanner5,
    setHomepageBanner5,
    aboutBanner,
    setAboutBanner,
    newsBanner,
    setNewsBanner,
    campaignsBanner,
    setCampaignsBanner,
    bannerLoading,
    bannerError,
    bannerSuccess,
    uploadingImage,
    handleImageUpload,
    openCreateModal,
    editingArticle,
    openEditModal,
    handleSubmit,
    handleDelete,
    handleSaveBanner,
  } = useContentManager({ initialArticles, initialBannerSettings });

  return (
    <div className="space-y-6">
      {/* Tabs Navigation */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          type="button"
          onClick={() => setActiveTab('articles')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'articles'
              ? 'border-emerald-700 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Quản lý bài viết
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('banner')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === 'banner'
              ? 'border-emerald-700 text-emerald-700'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          Cài đặt Banner trang chủ
        </button>
      </div>

      {activeTab === 'articles' && (
        <ArticlesList
          articles={articles}
          openCreateModal={openCreateModal}
          openEditModal={openEditModal}
          handleDelete={handleDelete}
        />
      )}

      {activeTab === 'banner' && (
        <BannerSettings
          homepageBanner1={homepageBanner1}
          setHomepageBanner1={setHomepageBanner1}
          homepageBanner2={homepageBanner2}
          setHomepageBanner2={setHomepageBanner2}
          homepageBanner3={homepageBanner3}
          setHomepageBanner3={setHomepageBanner3}
          homepageBanner4={homepageBanner4}
          setHomepageBanner4={setHomepageBanner4}
          homepageBanner5={homepageBanner5}
          setHomepageBanner5={setHomepageBanner5}
          aboutBanner={aboutBanner}
          setAboutBanner={setAboutBanner}
          newsBanner={newsBanner}
          setNewsBanner={setNewsBanner}
          campaignsBanner={campaignsBanner}
          setCampaignsBanner={setCampaignsBanner}
          bannerLoading={bannerLoading}
          bannerError={bannerError}
          bannerSuccess={bannerSuccess}
          handleSaveBanner={handleSaveBanner}
        />
      )}

      {/* Article Create / Edit Dialog */}
      <ArticleDialog
        editingArticle={editingArticle}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        title={title}
        setTitle={setTitle}
        category={category}
        setCategory={setCategory}
        image={image}
        setImage={setImage}
        summary={summary}
        setSummary={setSummary}
        loading={loading}
        error={error}
        uploadingImage={uploadingImage}
        handleImageUpload={handleImageUpload}
        handleSubmit={handleSubmit}
      />

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog((prev) => ({ ...prev, isOpen: false }))}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        description={confirmDialog.description}
        confirmLabel="Xác nhận"
        cancelLabel="Hủy bỏ"
        type="danger"
        isLoading={confirmDialog.loading}
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
