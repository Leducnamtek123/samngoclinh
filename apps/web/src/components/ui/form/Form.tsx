'use client';

import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';
import * as React from 'react';
import type { ControllerFieldState, ControllerProps, FieldError, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';
import { Controller, FormProvider, useFormContext } from 'react-hook-form';

export type FormProps<TFieldValues extends FieldValues = FieldValues> = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form?: UseFormReturn<TFieldValues, any, any> | UseFormReturn<any, any, any>;
} & React.FormHTMLAttributes<HTMLFormElement>;

const Form = React.forwardRef<HTMLFormElement, FormProps<any>>(
  ({ className, onSubmit, children, form, noValidate = true, ...props }, ref) => {
    const formContent = (
      <form ref={ref} noValidate={noValidate} onSubmit={onSubmit} className={className} {...props}>
        {children}
      </form>
    );

    if (form) {
      return <FormProvider {...form}>{formContent}</FormProvider>;
    }

    return formContent;
  },
);
Form.displayName = 'Form';

type FormItemContextValue = {
  id: string;
  error?: FieldError | string | { message?: string };
};

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => (
  <FormItemContext.Provider value={{ id: props.name }}>
    <Controller {...props} />
  </FormItemContext.Provider>
);

const useFormField = () => {
  const fieldContext = React.useContext(FormItemContext);
  const formContext = useFormContext();

  const id = fieldContext?.id || '';

  let fieldState: Partial<ControllerFieldState> = {};
  if (formContext && id) {
    const { getFieldState, formState } = formContext;
    if (getFieldState) {
      fieldState = getFieldState(id, formState) || {};
    }
  }

  const error = fieldContext?.error || fieldState?.error;

  return {
    id,
    name: id,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    error,
    ...fieldState,
  };
};

export type FormItemProps = {
  fullWidth?: boolean;
  name?: string;
  error?: FieldError | string | { message?: string };
} & React.HTMLAttributes<HTMLDivElement>;

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, fullWidth = true, name = '', error, children, ...props }, ref) => (
    <FormItemContext.Provider value={{ id: name, error }}>
      <div
        ref={ref}
        className={`space-y-1.5 ${fullWidth ? 'w-full' : ''} ${className || ''}`}
        {...props}
      >
        {children}
      </div>
    </FormItemContext.Provider>
  ),
);
FormItem.displayName = 'FormItem';

export type FormLabelProps = {
  required?: boolean;
} & React.LabelHTMLAttributes<HTMLLabelElement>;

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, required, children, ...props }, ref) => {
    const { formItemId } = useFormField();

    return (
      <label
        ref={ref}
        htmlFor={formItemId}
        className={`block text-xs font-bold text-gray-700 uppercase dark:text-gray-300 ${className || ''}`}
        {...props}
      >
        {children}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
    );
  },
);
FormLabel.displayName = 'FormLabel';

export type FormControlProps = {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ className, children, ...props }, ref) => {
    const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

    return (
      <div
        ref={ref}
        id={formItemId}
        aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
        aria-invalid={Boolean(error)}
        className={className}
        {...props}
      >
        {children}
      </div>
    );
  },
);
FormControl.displayName = 'FormControl';

export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={`text-xs font-medium text-gray-500 dark:text-gray-400 ${className || ''}`}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

export type FormMessageProps = {
  error?: FieldError | string | { message?: string };
} & React.HTMLAttributes<HTMLParagraphElement>;

const FormMessage = React.forwardRef<HTMLParagraphElement, FormMessageProps>(
  ({ className, children, error: propError, ...props }, ref) => {
    const { error: contextError, formMessageId } = useFormField();
    const tVal = useTranslations('validation');

    const error = propError || contextError;
    let body = error
      ? typeof error === 'string'
        ? error
        : error.message || ''
      : children;

    if (typeof body === 'string' && body.startsWith('validation.')) {
      try {
        body = tVal(body.replace(/^validation\./, ''));
      } catch {
        // fallback if key missing
      }
    }

    if (!body) {
      return null;
    }

    return (
      <p
        ref={ref}
        id={formMessageId}
        className={`animate-in fade-in slide-in-from-top-1 flex items-center gap-1.5 pt-1 text-xs font-semibold text-red-600 duration-200 dark:text-red-400 ${className || ''}`}
        {...props}
      >
        <AlertCircle className="h-3.5 w-3.5 shrink-0 text-red-500" />
        <span>{body}</span>
      </p>
    );
  },
);
FormMessage.displayName = 'FormMessage';

export { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage };
