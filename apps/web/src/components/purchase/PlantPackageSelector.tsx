import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import type { CarePackage, ProtectionPackage } from '@/types';
import { formatVNDPrice } from '@/utils/formatters';

type PlantPackageSelectorProps = {
  carePackagesList: CarePackage[];
  protectionPackagesList: ProtectionPackage[];
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
        <span className="block text-xs font-bold tracking-wider text-foreground uppercase">
          {t('careTitle')}
        </span>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {carePackagesList.map((pkg) => {
            const pkgId = String(pkg.code || pkg.id || '');
            const isSelected = selectedCareId === pkgId;
            const pkgPrice = Number(pkg.price || 0);

            return (
              <Button
                type="button"
                key={pkgId}
                variant="ghost"
                onClick={() => {
                  setSelectedCareId(pkgId);
                }}
                className={`h-auto cursor-pointer flex-col items-start justify-between rounded-xl border p-3 text-left whitespace-normal transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="line-clamp-1 text-xs font-bold text-foreground">{pkg.name}</span>
                  <div
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                  </div>
                </div>
                <p className="mt-1 text-[11px] font-black text-primary">
                  +{formatVNDPrice(pkgPrice)}{' '}
                  <span className="text-[9px] font-normal text-muted-foreground">
                    {t('perTree')}
                  </span>
                </p>
                <span className="mt-0.5 line-clamp-1 block text-[9px] text-muted-foreground">
                  {pkg.description || t('defaultCareDesc')}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Protection Package Selection */}
      <div className="space-y-2">
        <span className="block text-xs font-bold tracking-wider text-foreground uppercase">
          {t('protectionTitle')}
        </span>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {protectionPackagesList.map((pkg) => {
            const pkgId = String(pkg.code || pkg.id || '');
            const isSelected = selectedProtectionId === pkgId;
            const pkgPrice = Number(pkg.price || 0);

            return (
              <Button
                type="button"
                key={pkgId}
                variant="ghost"
                onClick={() => {
                  setSelectedProtectionId(pkgId);
                }}
                className={`h-auto cursor-pointer flex-col items-start justify-between rounded-xl border p-3 text-left whitespace-normal transition-colors ${
                  isSelected
                    ? 'border-primary bg-primary/5 shadow-xs ring-2 ring-primary/20'
                    : 'border-border bg-card hover:border-muted-foreground/30'
                }`}
              >
                <div className="flex w-full items-center justify-between">
                  <span className="line-clamp-1 text-xs font-bold text-foreground">{pkg.name}</span>
                  <div
                    className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border ${isSelected ? 'border-primary bg-primary' : 'border-border'}`}
                  >
                    {isSelected && <div className="h-1.5 w-1.5 rounded-full bg-background" />}
                  </div>
                </div>
                <p className="mt-1 text-[11px] font-black text-primary">
                  +{formatVNDPrice(pkgPrice)}{' '}
                  <span className="text-[9px] font-normal text-muted-foreground">
                    {t('perYear')}
                  </span>
                </p>
                <span className="mt-0.5 line-clamp-1 block text-[9px] text-muted-foreground">
                  {pkg.description || t('defaultProtectionDesc')}
                </span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
