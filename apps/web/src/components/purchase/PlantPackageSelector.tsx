import { useTranslations } from 'next-intl';

type PlantPackageSelectorProps = {
  carePackagesList: any[];
  protectionPackagesList: any[];
  selectedCareId: string;
  setSelectedCareId: (id: string) => void;
  selectedProtectionId: string;
  setSelectedProtectionId: (id: string) => void;
};

export const PlantPackageSelector = ({
  carePackagesList,
  protectionPackagesList,
  selectedCareId,
  setSelectedCareId,
  selectedProtectionId,
  setSelectedProtectionId,
}: PlantPackageSelectorProps) => {
  const t = useTranslations('plantPackageSelector');

  return (
    <div className="space-y-5 border-t border-gray-150 pt-5">
      {/* Care Package Selection */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
          {t('careTitle')}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {carePackagesList.map((pkg) => {
            const pkgId = pkg.code || pkg.id;
            const isSelected = selectedCareId === pkgId;
            const pkgPrice = Number(pkg.price || 0);

            return (
              <button
                type="button"
                key={pkgId}
                onClick={() => setSelectedCareId(pkgId)}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#1C3F24] bg-emerald-50/50 ring-2 ring-[#1C3F24]/20 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900 line-clamp-1">{pkg.name}</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#1C3F24] bg-[#1C3F24]' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <p className="text-[11px] font-black text-[#1C3F24] mt-1">
                  +{pkgPrice.toLocaleString('vi-VN')} đ <span className="text-[9px] text-gray-400 font-normal">{t('perTree')}</span>
                </p>
                <span className="text-[9px] text-gray-400 block line-clamp-1 mt-0.5">{pkg.description || t('defaultCareDesc')}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Protection Package Selection */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-gray-800 uppercase tracking-wider block">
          {t('protectionTitle')}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {protectionPackagesList.map((pkg) => {
            const pkgId = pkg.code || pkg.id;
            const isSelected = selectedProtectionId === pkgId;
            const pkgPrice = Number(pkg.price || 0);

            return (
              <button
                type="button"
                key={pkgId}
                onClick={() => setSelectedProtectionId(pkgId)}
                className={`p-3 rounded-xl border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'border-[#1C3F24] bg-emerald-50/50 ring-2 ring-[#1C3F24]/20 shadow-xs'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-gray-900 line-clamp-1">{pkg.name}</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#1C3F24] bg-[#1C3F24]' : 'border-gray-300'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                  </div>
                </div>
                <p className="text-[11px] font-black text-[#1C3F24] mt-1">
                  +{pkgPrice.toLocaleString('vi-VN')} đ <span className="text-[9px] text-gray-400 font-normal">{t('perYear')}</span>
                </p>
                <span className="text-[9px] text-gray-400 block line-clamp-1 mt-0.5">{pkg.description || t('defaultProtectionDesc')}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

