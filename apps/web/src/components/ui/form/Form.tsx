'use client';

import * as React from 'react';
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
  UseFormReturn,
} from 'react-hook-form';
import { AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export interface FormProps<TFieldValues extends FieldValues = FieldValues>
  extends React.FormHTMLAttributes<HTMLFormElement> {
  form?: UseFormReturn<TFieldValues, any, any>;
}

const Form = React.forwardRef<HTMLFormElement, FormProps<any>>(
  ({ className, onSubmit, children, form, noValidate = true, ...props }, ref) => {
    const formContent = (
      <form
        ref={ref}
        noValidate={noValidate}
        onSubmit={onSubmit}
        className={className}
        {...props}
      >
        {children}
      </form>
    );

    if (form) {
      return <FormProvider {...form}>{formContent}</FormProvider>;
    }

    return formContent;
  }
);
Form.displayName = 'Form';

type FormItemContextValue = {
  id: string;
  error?: any;
};

const FormItemContext = React.createContext<FormItemContextValue>(
  {} as FormItemContextValue
);

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormItemContext.Provider value={{ id: props.name }}>
      <Controller {...props} />
    </FormItemContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormItemContext);
  const formContext = useFormContext();

  const id = fieldContext?.id || '';

  let fieldState: any = {};
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

export interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {
  fullWidth?: boolean;
  name?: string;
  error?: any;
}

const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, fullWidth = true, name = '', error, children, ...props }, ref) => {
    return (
      <FormItemContext.Provider value={{ id: name, error }}>
        <div
          ref={ref}
          className={`space-y-1.5 ${fullWidth ? 'w-full' : ''} ${className || ''}`}
          {...props}
        >
          {children}
        </div>
      </FormItemContext.Provider>
    );
  }
);
FormItem.displayName = 'FormItem';

type FormLabelProps = React.LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, children, required, ...props }, ref) => {
    const { error, formItemId } = useFormField();

    return (
      <label
        ref={ref}
        htmlFor={formItemId}
        className={`text-xs font-bold uppercase tracking-wider block ${
          error ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'
        } ${className || ''}`}
        {...props}
      >
        {children}
      </label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

const FormControl = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <div
      ref={ref}
      id={formItemId}
      aria-describedby={
        !error
          ? `${formDescriptionId}`
          : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!error}
      {...props}
    />
  );
});
FormControl.displayName = 'FormControl';

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={`text-xs text-gray-500 dark:text-gray-400 font-medium ${className || ''}`}
      {...props}
    />
  );
});
FormDescription.displayName = 'FormDescription';

export interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  error?: any;
}

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, children, error: propError, ...props }, ref) => {
  const { error: contextError, formMessageId } = useFormField();
  const tVal = useTranslations('validation');

  const error = propError || contextError;
  let body = error ? String((error as any)?.message || error) : children;

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
      className={`text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5 pt-1 animate-in fade-in slide-in-from-top-1 duration-200 ${className || ''}`}
      {...props}
    >
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-red-500" />
      <span>{body}</span>
    </p>
  );
});
FormMessage.displayName = 'FormMessage';

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
};
