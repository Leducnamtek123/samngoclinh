import type { Metadata } from "next"

import { ContractTemplatesManager } from "./_components/contract-templates-manager"

export const metadata: Metadata = {
  title: "Quản lý mẫu hợp đồng | Admin Sâm Ngọc Linh",
  description: "Quản lý và chỉnh sửa mẫu hợp đồng",
}

export default function ContractTemplatesSettingsPage() {
  return (
    <div className="p-4 md:p-6">
      <ContractTemplatesManager />
    </div>
  )
}
