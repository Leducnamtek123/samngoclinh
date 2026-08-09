import { AddressModal, AddressModalProps } from '@/components/address/AddressModal';

export type ChangeAddressModalProps = Omit<AddressModalProps, 'mode'>;

export function ChangeAddressModal(props: ChangeAddressModalProps) {
  return <AddressModal mode="select" {...props} />;
}
