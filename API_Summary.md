# API Documentation Summary

This document provides a summary of the available API endpoints extracted from the generated Swagger definition.

## modules.public.country

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/public/country/list` | get all list country |

## modules.public.catalog

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/public/catalog/plants` | Get public catalog list of plants |
| **GET** | `/api/public/catalog/shop-items` | Get public catalog list of shop products |
| **GET** | `/api/public/catalog/plants/{id}` | Get details of a specific plant catalog item |
| **GET** | `/api/public/catalog/shop-items/{id}` | Get details of a specific shop product |

## modules.public.content

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/public/content/articles` | Get public content articles list |
| **GET** | `/api/public/content/articles/{idOrSlug}` | Get details of a specific article by ID or Slug |
| **POST** | `/api/v1/contact` | Submit a new support/contact request form |

## modules.public.hello

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/public/hello` | hello test api |

## modules.public.marketplace

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/public/marketplace/listings` | Get public marketplace listings |

## modules.public.promotion

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/public/promotion/free-tree` | Get public free tree campaign list |

## modules.public.user

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **POST** | `/api/v1/public/user/login/credential` | login with credential |
| **POST** | `/api/v1/public/user/login/social/google` | Login with social google |
| **POST** | `/api/v1/public/user/login/social/apple` | Login with social apple |
| **POST** | `/api/v1/public/user/sign-up` | User sign up |
| **PATCH** | `/api/v1/public/user/verify/email` | User Email Verification |
| **POST** | `/api/v1/public/user/send/email` | User resend email verification |
| **POST** | `/api/v1/public/user/password/forgot` | User forgot password |
| **PATCH** | `/api/v1/public/user/password/reset` | User reset password |
| **PATCH** | `/api/v1/public/user/login/2fa/verify` | User verify two factor during login |
| **POST** | `/api/v1/public/user/login/2fa/enable` | User enable two factor during login after reset by admin. Required setup 2FA flow |

## modules.public.termPolicy

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/public/term-policy/list` | Retrieve list of publish terms and policies |

## modules.system.user

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/system/user/list` | get all of users |
| **POST** | `/api/v1/system/user/check/username` | check user exist by username |
| **POST** | `/api/v1/system/user/check/email` | check user exist by email |

## modules.system.health

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/system/health/aws` | health check api for aws |
| **GET** | `/api/system/health/database` | health check api for database |
| **GET** | `/api/system/health/third-party` | health check api for third party services |
| **GET** | `/api/system/health/instance` | health check api for instance |

## modules.system.featureFlag

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/system/feature-flag/list` | get all of active feature flags |

## modules.system.provider-dashboard

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/system/provider-dashboard/overview` | Get provider dashboard overview metrics |

## modules.system.role

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/system/role/list` | get all of roles |
| **GET** | `/api/v1/system/role/get/{roleId}/abilities` | get detail a role |

## modules.user.user

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **DELETE** | `/api/v1/user/user/delete/self` | user delete their account |

## modules.user.profile

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/user/profile/me` | Get current user profile |
| **GET** | `/api/v1/user/profile/business` | Get current user business profile details (distributor info) |


## modules.user.wallet

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/user/wallet/summary` | Get wallet summary (balance, trees owned, transactions count) |
| **GET** | `/api/user/wallet/transactions` | Get wallet transaction list |

## modules.user.orders

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/user/orders` | Get user order list |
| **POST** | `/api/user/orders/checkout` | Checkout user shopping cart to create order |
| **POST** | `/api/user/orders/payment/webhook` | Webhook callback to process order payment from gateway |
| **GET** | `/api/user/orders/{id}` | Get user order detail by ID |

## modules.user.cultivation

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/user/cultivation/trees` | Get user tree portfolio grouped by age |
| **GET** | `/api/user/cultivation/gardens` | Get user garden summary |
| **GET** | `/api/user/cultivation/beds` | Get user beds list |
| **GET** | `/api/user/cultivation/logs` | Get care history logs for a bed or tree |
| **POST** | `/api/user/cultivation/bookings` | Create a new garden visit booking |
| **GET** | `/api/user/cultivation/bookings` | List user garden visit bookings |
| **GET** | `/api/v1/user/cultivation/gardens/{id}` | Get details of a specific garden by ID |
| **GET** | `/api/v1/user/cultivation/beds/{id}` | Get details of a specific bed by ID |
| **GET** | `/api/v1/user/cultivation/trees/{id}` | Get details of a specific tree by ID |

## modules.provider.cultivation

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **POST** | `/api/user/cultivation/trees` | Record/Plant new trees in a garden bed |
| **POST** | `/api/user/cultivation/gardens` | Create a new cultivation garden |
| **POST** | `/api/user/cultivation/beds` | Create a new cultivation bed inside a garden |
| **POST** | `/api/user/cultivation/logs` | Create a new care history log for a bed or tree |
| **PUT** | `/api/user/cultivation/gardens/{id}` | Update garden details |
| **DELETE** | `/api/user/cultivation/gardens/{id}` | Delete a garden |
| **PUT** | `/api/user/cultivation/beds/{id}` | Update bed details |
| **DELETE** | `/api/user/cultivation/beds/{id}` | Delete a bed |
| **PUT** | `/api/user/cultivation/trees/{id}` | Update tree details |
| **DELETE** | `/api/user/cultivation/trees/{id}` | Delete a tree |

## modules.user.cart

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/user/cart` | Get user shopping cart summary |
| **DELETE** | `/api/user/cart` | Clear all items from shopping cart |
| **POST** | `/api/user/cart/items` | Add item to user shopping cart |
| **PUT** | `/api/user/cart/items/{productId}` | Update item quantity in shopping cart |
| **DELETE** | `/api/user/cart/items/{productId}` | Remove item from shopping cart |
| **GET** | `/api/cart` | Get user shopping cart summary |
| **DELETE** | `/api/cart` | Clear all items from shopping cart |
| **POST** | `/api/cart/items` | Add item to user shopping cart |
| **PUT** | `/api/cart/items/{productId}` | Update item quantity in shopping cart |
| **DELETE** | `/api/cart/items/{productId}` | Remove item from shopping cart |

## modules.user.identity-verification

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/user/identity-verification/status` | Get user identity verification status |
| **POST** | `/api/user/identity-verification/submit` | Submit identity verification request |

## modules.provider.marketplace

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/marketplace/me` | List active and pending listings created by the logged in user |
| **POST** | `/api/user/marketplace` | Create a new marketplace listing |
| **PUT** | `/api/user/marketplace/{id}` | Update an existing marketplace listing |
| **DELETE** | `/api/user/marketplace/{id}` | Archive/Delete a marketplace listing |

## modules.user.eContract

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/user/contracts` | Get list of contracts for the current logged in user |
| **GET** | `/api/user/contracts/{id}` | Get details of a contract |
| **POST** | `/api/user/contracts/{id}/sign` | Sign a contract |
| **POST** | `/api/user/contracts/{id}/renew` | Renew / Extend a contract |

## modules.user.packages

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/user/user/packages/care` | List all active care packages |
| **GET** | `/api/user/user/packages/protection` | List all active protection packages |
| **POST** | `/api/user/user/packages/subscribe` | Subscribe a plant to a care or protection package |
| **GET** | `/api/user/packages/care` | List all active care packages |
| **GET** | `/api/user/packages/protection` | List all active protection packages |
| **POST** | `/api/user/packages/subscribe` | Subscribe a plant to a care or protection package |

## modules.admin.orders

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/orders` | List all orders in the system |
| **GET** | `/api/v1/admin/orders/{id}` | Get details of any order |
| **PATCH** | `/api/v1/admin/orders/{id}/status` | Update status of an order |

## modules.admin.marketplace

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/marketplace/listings` | List all marketplace listings (Admin) |
| **PATCH** | `/api/v1/admin/marketplace/listings/{id}/status` | Moderate (Approve/Reject) a marketplace listing |

## modules.admin.profile

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/profile/business` | List all CTV/Đại lý distributor profiles (Admin) |
| **PATCH** | `/api/v1/admin/profile/business/{id}/rank` | Update rank status of CTV/Đại lý (Admin) |

## modules.admin.wallet

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | \`/api/v1/admin/wallet/transactions` | List all wallet transactions across all CTVs (Admin) |
| **PATCH** | \`/api/v1/admin/wallet/balance` | Adjust (Credit/Debit) points to user wallet manually |

## modules.admin.promotion

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | \`/api/v1/admin/promotion/campaigns` | List all promotion campaigns (Admin) |
| **POST** | \`/api/v1/admin/promotion/campaigns` | Create a new promotion campaign (Admin) |
| **PUT** | \`/api/v1/admin/promotion/campaigns/{id}` | Update an existing promotion campaign (Admin) |
| **DELETE** | \`/api/v1/admin/promotion/campaigns/{id}` | Delete a promotion campaign (Admin) |

## modules.admin.notification

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **POST** | \`/api/v1/admin/notifications/send` | Send custom push notification to user(s) or broadcast to all (Admin) |

## modules.admin.contact

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | \`/api/v1/admin/contacts` | List all support/contact requests (Admin) |
| **GET** | \`/api/v1/admin/contacts/{id}` | Get details of a specific contact request and mark it as read (Admin) |

## modules.admin.setting

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | \`/api/v1/admin/settings` | List all system configuration settings (Admin) |
| **GET** | \`/api/v1/admin/settings/{key}` | Get details of a system setting key (Admin) |
| **PUT** | \`/api/v1/admin/settings/{key}` | Update or create a system configuration setting (Admin) |

## modules.admin.apiKey

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/api-key/list` | get list of api keys |
| **POST** | `/api/v1/admin/api-key/create` | create an api key |
| **PATCH** | `/api/v1/admin/api-key/update/{apiKeyId}/reset` | reset secret an api key |
| **PUT** | `/api/v1/admin/api-key/update/{apiKeyId}` | update data an api key |
| **PUT** | `/api/v1/admin/api-key/update/{apiKeyId}/date` | update date of api key |
| **PATCH** | `/api/v1/admin/api-key/update/{apiKeyId}/status` | update status of an api key |
| **DELETE** | `/api/v1/admin/api-key/delete/{apiKeyId}` | delete an api key |

## modules.admin.role

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/role/list` | get list of roles |
| **GET** | `/api/v1/admin/role/get/{roleId}` | get detail a role |
| **POST** | `/api/v1/admin/role/create` | create a role |
| **PUT** | `/api/v1/admin/role/update/{roleId}` | update data a role |
| **DELETE** | `/api/v1/admin/role/delete/{roleId}` | delete data a role |

## modules.admin.user

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/user/list` | get all users |
| **GET** | `/api/v1/admin/user/get/{userId}` | get detail an user |
| **POST** | `/api/v1/admin/user/create` | create a user |
| **PATCH** | `/api/v1/admin/user/update/{userId}/status` | update status of user |
| **PUT** | `/api/v1/admin/user/update/{userId}/password` | update password of user |
| **PATCH** | `/api/v1/admin/user/update/{userId}/2fa/reset` | Reset user's two-factor authentication |
| **POST** | `/api/v1/admin/user/import` | import users via csv file |
| **POST** | `/api/v1/admin/user/export` | export users via csv file |

## modules.admin.user.passwordHistory

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/user/{userId}/password-history/list` | get all user password histories |

## modules.admin.user.activityLog

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/user/{userId}/activity-log/list` | get all activity logs |

## modules.admin.user.session

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/user/{userId}/session/list` | admin get all user Sessions |
| **DELETE** | `/api/v1/admin/user/{userId}/session/revoke/{sessionId}` | admin revoke user Session |

## modules.admin.termPolicy

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/term-policy/list` | Retrieve list of terms and policies for admin |
| **POST** | `/api/v1/admin/term-policy/create` | Create a new term or policy |
| **DELETE** | `/api/v1/admin/term-policy/delete/{termPolicyId}` | Delete a term or policy by ID |
| **POST** | `/api/v1/admin/term-policy/generate/content/presign` | Generate presign url for term or policy content upload |
| **PUT** | `/api/v1/admin/term-policy/update/{termPolicyId}/content/update` | Update content of a term or policy by ID |
| **PUT** | `/api/v1/admin/term-policy/update/{termPolicyId}/content/add` | Add content to a term or policy by ID |
| **DELETE** | `/api/v1/admin/term-policy/update/{termPolicyId}/content/remove` | Remove content of a term or policy by ID |
| **POST** | `/api/v1/admin/term-policy/get/{termPolicyId}/content/{language}` | Get content of a term or policy by ID and language |
| **PATCH** | `/api/v1/admin/term-policy/publish/{termPolicyId}` | Publish a term or policy by ID |

## common.admin.featureFlag

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/feature-flag/list` | admin get all Feature Flags |
| **PATCH** | `/api/v1/admin/feature-flag/update/{featureFlagId}/status` | No summary |
| **PUT** | `/api/v1/admin/feature-flag/update/{featureFlagId}/metadata` | No summary |

## modules.admin.backoffice

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/admin/backoffice/overview` | Get admin backoffice overview metrics |

## modules.admin.user.device

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/admin/user/{userId}/device/list` | admin get all user Devices |
| **DELETE** | `/api/v1/admin/user/{userId}/device/remove/{deviceOwnershipId}` | admin remove user Device |

## modules.admin.identity-verification

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/admin/identity-verification` | List all pending KYC verification requests |
| **PATCH** | `/api/admin/identity-verification/{id}/approve` | Approve a KYC verification request |
| **PATCH** | `/api/admin/identity-verification/{id}/reject` | Reject a KYC verification request |

## modules.admin.cultivation

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/admin/cultivation/bookings` | List all garden visit bookings for admin review |
| **PATCH** | `/api/admin/cultivation/bookings/{id}/status` | Approve or reject a garden visit booking request |

## modules.admin.eContract

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/admin/contracts` | List all contracts |
| **POST** | `/api/admin/contracts` | Create a new contract for a user |
| **PUT** | `/api/admin/contracts/{id}` | Update details of a contract |
| **DELETE** | `/api/admin/contracts/{id}` | Delete a contract |
| **POST** | `/api/admin/contracts/check-expiry` | Trigger contract expiry scans and reminder alerts |

## modules.admin.packages

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **POST** | `/api/admin/admin/packages/care` | Create a new care package |
| **PUT** | `/api/admin/admin/packages/care/{id}` | Update a care package |
| **DELETE** | `/api/admin/admin/packages/care/{id}` | Delete a care package |
| **POST** | `/api/admin/admin/packages/protection` | Create a new protection package |
| **PUT** | `/api/admin/admin/packages/protection/{id}` | Update a protection package |
| **DELETE** | `/api/admin/admin/packages/protection/{id}` | Delete a protection package |
| **POST** | `/api/admin/packages/care` | Create a new care package |
| **PUT** | `/api/admin/packages/care/{id}` | Update a care package |
| **DELETE** | `/api/admin/packages/care/{id}` | Delete a care package |
| **POST** | `/api/admin/packages/protection` | Create a new protection package |
| **PUT** | `/api/admin/packages/protection/{id}` | Update a protection package |
| **DELETE** | `/api/admin/packages/protection/{id}` | Delete a protection package |

## modules.admin.catalog

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **POST** | `/api/admin/admin/catalog/plants` | Create a new plant catalog entry |
| **PUT** | `/api/admin/admin/catalog/plants/{id}` | Update a plant catalog entry |
| **DELETE** | `/api/admin/admin/catalog/plants/{id}` | Delete a plant catalog entry |
| **POST** | `/api/admin/admin/catalog/shop-items` | Create a new shop product |
| **PUT** | `/api/admin/admin/catalog/shop-items/{id}` | Update a shop product |
| **DELETE** | `/api/admin/admin/catalog/shop-items/{id}` | Delete a shop product |

## modules.admin.content

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **POST** | `/api/admin/admin/content/articles` | Create a new content article |
| **PUT** | `/api/admin/admin/content/articles/{id}` | Update a content article |
| **DELETE** | `/api/admin/admin/content/articles/{id}` | Delete a content article |

## modules.shared.user

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **POST** | `/api/v1/shared/user/refresh` | refresh token |
| **GET** | `/api/v1/shared/user/profile` | get profile |
| **PUT** | `/api/v1/shared/user/profile/update` | update profile |
| **POST** | `/api/v1/shared/user/profile/generate-presign/photo` | generate upload photo profile presign |
| **PUT** | `/api/v1/shared/user/profile/update/photo` | update photo profile |
| **POST** | `/api/v1/shared/user/profile/upload/photo` | upload photo profile |
| **PATCH** | `/api/v1/shared/user/change-password` | change password |
| **POST** | `/api/v1/shared/user/mobile-number/add` | user add mobile number |
| **PUT** | `/api/v1/shared/user/mobile-number/update/{mobileNumberId}` | user update mobile number |
| **DELETE** | `/api/v1/shared/user/mobile-number/delete/{mobileNumberId}` | user delete mobile number |
| **POST** | `/api/v1/shared/user/username/claim` | user claim username |
| **GET** | `/api/v1/shared/user/2fa/status` | Get current two-factor authentication status |
| **POST** | `/api/v1/shared/user/2fa/setup` | Start two-factor setup and receive secret |
| **POST** | `/api/v1/shared/user/2fa/enable` | Enable two-factor authentication |
| **DELETE** | `/api/v1/shared/user/2fa/disable` | Disable two-factor authentication |
| **POST** | `/api/v1/shared/user/2fa/regenerate-backup-codes` | Regenerate two-factor backup codes |
| **POST** | `/api/v1/shared/user/logout` | Logout from current session, invalidating the access token and deleting the session. |

## modules.shared.user.passwordHistory

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/shared/user/password-history/list` | get all user password Histories |

## modules.shared.user.activityLog

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/shared/user/activity-log/list` | get all activity logs |

## modules.shared.user.session

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/shared/user/session/list` | get all user Sessions |
| **DELETE** | `/api/v1/shared/user/session/revoke/{sessionId}` | revoke user Session |

## modules.shared.user.termPolicy

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/shared/user/term-policy/list/accepted` | List of terms or policies accepted by the user |
| **POST** | `/api/v1/shared/user/term-policy/accept` | User accepts term or policy |

## modules.shared.user.device

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/shared/user/device/list` | get all user devices |
| **POST** | `/api/v1/shared/user/device/refresh` | Refresh device information |
| **DELETE** | `/api/v1/shared/user/device/remove/{deviceOwnershipId}` | remove a user device |

## modules.shared.notification

| Method | Path | Summary / Description |
| :--- | :--- | :--- |
| **GET** | `/api/v1/shared/notification/list` | Get all notifications for current user |
| **GET** | `/api/v1/shared/notification/list/user-setting` | Get all notification settings for current user |
| **PATCH** | `/api/v1/shared/notification/update/read/{notificationId}` | Mark a notification as read |
| **POST** | `/api/v1/shared/notification/update/read-all` | Mark all notifications as read |
| **PUT** | `/api/v1/shared/notification/update/setting` | update notification setting |

