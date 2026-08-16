import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { AddressCardItem } from '@/components/address/AddressCardItem';
import type { AddressItem } from '@/types';

type AddressSelectorProps = {
  addresses: AddressItem[];
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
    <div className="space-y-3 border-t border-gray-150 dark:border-gray-800 pt-5">
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
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl text-xs text-amber-800 dark:text-amber-300 font-medium flex justify-between items-center gap-2">
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
          {addresses.map((addr) => (
            <AddressCardItem
              key={addr.id}
              address={addr}
              isSelected={selectedAddressId === addr.id}
              defaultBadgeLabel={t('defaultBadge')}
              onSelect={(id) => setSelectedAddressId(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
