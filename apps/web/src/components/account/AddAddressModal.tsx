import { AddressModal, AddressModalProps } from '@/components/address/AddressModal';

export type AddAddressModalProps = Omit<AddressModalProps, 'mode'>;

export function AddAddressModal(props: AddAddressModalProps) {
  return <AddressModal mode="add" {...props} />;
}
