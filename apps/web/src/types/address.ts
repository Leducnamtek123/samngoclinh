export interface AddressItem {
  id: string;
  name?: string;
  recipient?: string;
  phone: string;
  address?: string;
  detail?: string;
  isDefault: boolean;
  label?: string;
}

export type ShippingAddressFormValues = {
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  notes?: string;
};
