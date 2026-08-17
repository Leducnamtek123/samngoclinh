import { useTranslations } from 'next-intl';
import { AddressCardItem } from '@/components/address/AddressCardItem';
import { Button } from '@/components/ui/button';
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
    <div className="border-gray-150 space-y-3 border-t pt-5 dark:border-gray-800">
      <div className="flex items-center justify-between">
        <span className="block text-xs font-bold tracking-wider text-gray-800 uppercase dark:text-gray-200">
          {t('title')}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenAddAddressModal}
          className="cursor-pointer text-xs font-bold text-emerald-800 hover:underline dark:text-emerald-400"
        >
          {t('addNewAddress')}
        </Button>
      </div>

      {addresses.length === 0 ? (
        <div className="flex items-center justify-between gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs font-medium text-amber-800 dark:border-amber-800/60 dark:bg-amber-950/40 dark:text-amber-300">
          <span>{t('emptyState.description')}</span>
          <Button
            type="button"
            size="sm"
            onClick={onOpenAddAddressModal}
            className="shrink-0 cursor-pointer bg-emerald-700 text-xs font-bold text-white hover:bg-emerald-800"
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
              onSelect={(id) => {
                setSelectedAddressId(id);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};
