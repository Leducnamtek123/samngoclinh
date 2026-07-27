import type { DictionaryType } from "@/lib/get-dictionary"

import { I18nProvider } from "@/providers/i18n-provider"
import {
  Auth,
  AuthDescription,
  AuthForm,
  AuthHeader,
  AuthTitle,
} from "./auth-layout"
import { SignInForm } from "./sign-in-form"

export function SignIn({ dictionary }: { dictionary: DictionaryType }) {
  return (
    <I18nProvider dictionary={dictionary}>
      <Auth imgSrc="/images/ginseng_admin.png" dictionary={dictionary}>
        <AuthHeader>
          <AuthTitle>Đăng nhập</AuthTitle>
          <AuthDescription>
            Nhập email và mật khẩu bên dưới để đăng nhập vào tài khoản của bạn
          </AuthDescription>
        </AuthHeader>
        <AuthForm>
          <SignInForm />
        </AuthForm>
      </Auth>
    </I18nProvider>
  )
}
