import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, User, QrCode, ArrowLeft } from 'lucide-react';
import type { CartItem } from '@/utils/cart';
import {
  Form,
  FormInput,
  FormPhoneInput,
  FormAddressPicker,
  FormTextarea,
} from '@/components/ui/form';
import { Button, ButtonLoading } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  shippingAddressSchema,
  type ShippingAddressFormValues,
} from '@/lib/validation/schemas';

type CartStepShippingProps = {
  items: CartItem[];
  totalAmount: number;
  recipientName: string;
  setRecipientName: (val: string) => void;
  recipientPhone: string;
  setRecipientPhone: (val: string) => void;
  shippingAddress: string;
  setShippingAddress: (val: string) => void;
  notes: string;
  setNotes: (val: string) => void;
  loading: boolean;
  t: (key: string) => string;
  onSubmit: (e: React.FormEvent) => void;
  onPrevStep: () => void;
};

export const CartStepShipping = ({
  items,
  totalAmount,
  recipientName,
  setRecipientName,
  recipientPhone,
  setRecipientPhone,
  shippingAddress,
  setShippingAddress,
  notes,
  setNotes,
  loading,
  t,
  onSubmit,
  onPrevStep,
}: CartStepShippingProps) => {
  const form = useForm<ShippingAddressFormValues>({
    resolver: zodResolver(shippingAddressSchema),
    defaultValues: {
      recipientName: recipientName || '',
      recipientPhone: recipientPhone || '',
      shippingAddress: shippingAddress || '',
      notes: notes || '',
    },
  });

  const handleValidSubmit = (data: ShippingAddressFormValues) => {
    setRecipientName(data.recipientName);
    setRecipientPhone(data.recipientPhone);
    setShippingAddress(data.shippingAddress);
    setNotes(data.notes || '');
    onSubmit({ preventDefault: () => {} } as React.FormEvent);
  };

  return (
    <Form
      form={form}
      onSubmit={form.handleSubmit(handleValidSubmit)}
      className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
    >
      {/* Shipping Form */}
      <Card className="lg:col-span-7 p-6 space-y-6 shadow-sm border-gray-200 dark:border-gray-800">
        <div className="border-b border-gray-100 dark:border-gray-800 pb-4">
          <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-lg flex items-center gap-2">
            <MapPin className="w-5 h-5 text-emerald-700" />
            <span>{t('deliveryAddress')}</span>
          </h3>
        </div>

        <div className="space-y-4">
          <FormInput
            control={form.control}
            name="recipientName"
            label={t('recipientName')}
            required
            prefixIcon={<User className="w-4 h-4" />}
          />

          <FormPhoneInput
            control={form.control}
            name="recipientPhone"
            label={t('phoneNumber')}
            required
          />

          <FormAddressPicker
            control={form.control}
            name="shippingAddress"
            label={t('deliveryAddress')}
            required
          />

          <FormTextarea
            control={form.control}
            name="notes"
            label="Ghi chú đơn hàng"
            rows={3}
            characterCounter
            maxLength={200}
          />
        </div>
      </Card>

      {/* Order Confirmation Summary */}
      <Card className="lg:col-span-5 p-6 space-y-6 shadow-sm border-gray-200 dark:border-gray-800">
        <h3 className="font-extrabold text-gray-900 dark:text-gray-100 text-base border-b border-gray-100 dark:border-gray-800 pb-3">
          Xác nhận đơn hàng
        </h3>

        <div className="divide-y divide-gray-100 dark:divide-gray-800 max-h-48 overflow-y-auto pr-1">
          {items.map((item) => (
            <div
              key={item.id}
              className="py-2.5 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <p className="font-bold text-gray-800 dark:text-gray-200 line-clamp-1">
                  {item.name}
                </p>
                <p className="text-[10px] text-gray-400 font-semibold">
                  {item.quantity} x {item.price.toLocaleString('vi-VN')} đ
                </p>
              </div>
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {(item.price * item.quantity).toLocaleString('vi-VN')} đ
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 dark:border-gray-800 pt-4 space-y-2 text-xs">
          <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
            <span>Tạm tính</span>
            <span>{totalAmount.toLocaleString('vi-VN')} đ</span>
          </div>
          <div className="flex justify-between font-semibold text-gray-600 dark:text-gray-400">
            <span>Phí vận chuyển</span>
            <span className="text-emerald-700 font-bold">Miễn phí</span>
          </div>
          <div className="flex justify-between text-base font-black text-gray-900 dark:text-gray-100 pt-3 border-t border-gray-100 dark:border-gray-800">
            <span>Tổng thanh toán</span>
            <span className="text-emerald-800 dark:text-emerald-400">
              {totalAmount.toLocaleString('vi-VN')} đ
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <ButtonLoading
            type="submit"
            isLoading={loading}
            variant="emerald"
            className="w-full flex items-center justify-center gap-2"
          >
            <QrCode className="w-4 h-4" />
            <span>Xác Nhận & Thanh Toán VietQR</span>
          </ButtonLoading>

          <Button
            type="button"
            variant="secondary"
            onClick={onPrevStep}
            className="w-full flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại Giỏ hàng</span>
          </Button>
        </div>
      </Card>
    </Form>
  );
};
