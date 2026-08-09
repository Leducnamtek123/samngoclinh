import { useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

type AddressSelectorProps = {
  addresses: any[];
  selectedAddressId: string | null;
  setSelectedAddressId: (id: string) => void;
  onOpenAddAddressModal: () => void;
};

export const AddressSelector = ({
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  onOpenAddAddressModal,
}: AddressSelectorProps) => {
  const t = useTranslations('addressSelector');

  return (
    <div className="space-y-3 border-t border-gray-150 pt-5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-gray-800 dark:text-gray-200 uppercase tracking-wider block">
          {t('title')}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenAddAddressModal}
          className="text-xs font-bold text-emerald-800 dark:text-emerald-400 hover:underline cursor-pointer"
        >
          {t('addNewAddress')}
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 font-medium flex justify-between items-center gap-2">
          <span>{t('emptyState.description')}</span>
          <Button
            type="button"
            size="sm"
            onClick={onOpenAddAddressModal}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shrink-0 cursor-pointer"
          >
            {t('emptyState.addAddress')}
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {addresses.map((addr) => {
            const isSelected = selectedAddressId === addr.id;

            return (
              <div
                key={addr.id}
                role="button"
                tabIndex={0}
                onClick={() => setSelectedAddressId(addr.id)}
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSelectedAddressId(addr.id)}
                className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-colors ${
                  isSelected
                    ? 'border-[#1C3F24] bg-emerald-50/50 ring-2 ring-[#1C3F24]/20'
                    : 'border-gray-200 hover:border-gray-300 bg-white dark:bg-gray-900'
                }`}
              >
                <div className="space-y-0.5 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 dark:text-gray-100">{addr.recipient || addr.name}</span>
                    <span className="text-gray-500">({addr.phone})</span>
                    {addr.isDefault && (
                      <Badge variant="secondary">{t('defaultBadge')}</Badge>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 text-[11px] line-clamp-1">{addr.detail || addr.address}</p>
                </div>
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${isSelected ? 'border-[#1C3F24] bg-[#1C3F24]' : 'border-gray-300'}`}>
                  {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

