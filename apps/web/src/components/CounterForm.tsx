'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { useRouter } from '@/libs/I18nNavigation';
import { CounterValidation } from '@/validations/CounterValidation';
import { Form, FormInput } from '@/components/ui/form';
import { ButtonLoading } from '@/components/ui/button';

export const CounterForm = () => {
  const t = useTranslations('CounterForm');
  const form = useForm({
    resolver: zodResolver(CounterValidation),
    defaultValues: {
      increment: 1,
    },
  });
  const router = useRouter();

  const handleIncrement = form.handleSubmit(async (formData) => {
    const response = await fetch(`/api/counter`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    if (response.ok) {
      await response.json();
    }

    router.refresh();
  });

  return (
    <Form form={form} onSubmit={handleIncrement} className="space-y-4">
      <p className="text-sm font-medium">{t('presentation')}</p>
      
      <FormInput
        control={form.control}
        name="increment"
        label={t('label_increment')}
        type="number"
        className="w-32"
      />

      <div className="mt-2">
        <ButtonLoading
          type="submit"
          isLoading={form.formState.isSubmitting}
          variant="default"
        >
          {t('button_increment')}
        </ButtonLoading>
      </div>
    </Form>
  );
};
