import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-5 border-t border-border pt-5">
      {/* Care Package Selection */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
          {t('careTitle')}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {carePackagesList.map((pkg) => {
            const pkgId = pkg.code || pkg.id;
            const isSelected = selectedCareId === pkgId;
            const pkgPrice = Number(pkg.price || 0);

            return (
              <Button
                type="button"
                key={pkgId}
                variant="ghost"
                onClick={() => setSelectedCareId(pkgId)}
                className={`p-3 h-auto rounded-xl border text-left flex-col items-start justify-between transition-colors cursor-pointer whitespace-normal ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                    : 'border-border hover:border-muted-foreground/30 bg-card'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs text-foreground line-clamp-1">{pkg.name}</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-background"></div>}
                  </div>
                </div>
                <p className="text-[11px] font-black text-primary mt-1">
                  +{pkgPrice.toLocaleString('vi-VN')} đ <span className="text-[9px] text-muted-foreground font-normal">{t('perTree')}</span>
                </p>
                <span className="text-[9px] text-muted-foreground block line-clamp-1 mt-0.5">{pkg.description || t('defaultCareDesc')}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Protection Package Selection */}
      <div className="space-y-2">
        <span className="text-xs font-bold text-foreground uppercase tracking-wider block">
          {t('protectionTitle')}
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {protectionPackagesList.map((pkg) => {
            const pkgId = pkg.code || pkg.id;
            const isSelected = selectedProtectionId === pkgId;
            const pkgPrice = Number(pkg.price || 0);

            return (
              <Button
                type="button"
                key={pkgId}
                variant="ghost"
                onClick={() => setSelectedProtectionId(pkgId)}
                className={`p-3 h-auto rounded-xl border text-left flex-col items-start justify-between transition-colors cursor-pointer whitespace-normal ${
                  isSelected
                    ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-xs'
                    : 'border-border hover:border-muted-foreground/30 bg-card'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="font-bold text-xs text-foreground line-clamp-1">{pkg.name}</span>
                  <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}>
                    {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-background"></div>}
                  </div>
                </div>
                <p className="text-[11px] font-black text-primary mt-1">
                  +{pkgPrice.toLocaleString('vi-VN')} đ <span className="text-[9px] text-muted-foreground font-normal">{t('perYear')}</span>
                </p>
                <span className="text-[9px] text-muted-foreground block line-clamp-1 mt-0.5">{pkg.description || t('defaultProtectionDesc')}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
