"use client"

import React from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CreateContractWizardHeader } from "./create-contract-wizard-header"
import { CreateContractStepper } from "./create-contract-stepper"
import { CreateContractStep1General } from "./create-contract-step1-general"
import { CreateContractStep2Terms } from "./create-contract-step2-terms"
import { CreateContractStep3Preview } from "./create-contract-step3-preview"
import { CreateContractStep4Confirm } from "./create-contract-step4-confirm"
import { useCreateContractWizard } from "./use-create-contract-wizard"
import {
  STEPS,
  docTienBangChu,
  docSoLuongCay,
  formatPlaceholderLabel,
  formatLocalDate,
  parseLocalDate,
  formatDateViDisplay,
} from "./create-contract-wizard-helpers"

interface UserItem {
  id: string
  name?: string
  username?: string
  email?: string
  isVerified?: boolean
  mobileNumbers?: Array<{ number: string }>
}

interface TreeItem {
  id: string
  code: string
  name: string
  ageYear?: number
}

interface CreateContractWizardProps {
  users: UserItem[]
  trees: TreeItem[]
  lang: string
}

export function CreateContractWizard({ users, trees, lang }: CreateContractWizardProps) {
  const {
    currentStep,
    setCurrentStep,
    isSubmitting,
    selectedUserId,
    handleUserChange,
    selectedUser,
    contractType,
    setContractType,
    selectedTreeCode,
    setSelectedTreeCode,
    title,
    setTitle,
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    customerCccd,
    setCustomerCccd,
    customerAddress,
    setCustomerAddress,
    customerEmail,
    setCustomerEmail,
    treeQuantity,
    setTreeQuantity,
    contractValue,
    handleContractValueChange,
    careFee,
    setCareFee,
    paymentStatus,
    partyA,
    setPartyA,
    partyB,
    setPartyB,
    contractCode,
    expiredAt,
    setExpiredAt,
    customTerms,
    setCustomTerms,
    customPlaceholders,
    setCustomPlaceholders,
    selectedTemplateSlug,
    setSelectedTemplateSlug,
    renderedPreviewHtml,
    setRenderedPreviewHtml,
    isCustomEdited,
    setIsCustomEdited,
    step3ViewMode,
    setStep3ViewMode,
    allPlaceholders,
    handleResetToTemplate,
    isStep1Valid,
    isStep2Valid,
    handleNext,
    handlePrev,
    handleSubmit,
  } = useCreateContractWizard({ users, trees, lang })

  return (
    <div className="space-y-6 pb-12">
      <CreateContractWizardHeader
        lang={lang}
        currentStep={currentStep}
        isSubmitting={isSubmitting}
        isStep1Valid={isStep1Valid}
        isStep2Valid={isStep2Valid}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />

      <CreateContractStepper
        steps={STEPS}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
      />

      <div className="space-y-6">
        {currentStep === 1 && (
          <CreateContractStep1General
            users={users}
            trees={trees}
            selectedUserId={selectedUserId}
            selectedUser={selectedUser}
            onUserChange={handleUserChange}
            title={title}
            onTitleChange={setTitle}
            contractType={contractType}
            onContractTypeChange={setContractType}
            selectedTreeCode={selectedTreeCode}
            onTreeCodeChange={setSelectedTreeCode}
          />
        )}

        {currentStep === 2 && (
          <CreateContractStep2Terms
            contractValue={contractValue}
            onContractValueChange={handleContractValueChange}
            careFee={careFee}
            onCareFeeChange={setCareFee}
            treeQuantity={treeQuantity}
            onTreeQuantityChange={setTreeQuantity}
            expiredAt={expiredAt}
            onExpiredAtChange={setExpiredAt}
            partyA={partyA}
            onPartyAChange={setPartyA}
            partyB={partyB}
            onPartyBChange={setPartyB}
            customerName={customerName}
            onCustomerNameChange={setCustomerName}
            customerCccd={customerCccd}
            onCustomerCccdChange={setCustomerCccd}
            customerPhone={customerPhone}
            onCustomerPhoneChange={setCustomerPhone}
            customerEmail={customerEmail}
            onCustomerEmailChange={setCustomerEmail}
            customerAddress={customerAddress}
            onCustomerAddressChange={setCustomerAddress}
            customTerms={customTerms}
            onCustomTermsChange={setCustomTerms}
            customPlaceholders={customPlaceholders}
            onCustomPlaceholdersChange={setCustomPlaceholders}
            allPlaceholders={allPlaceholders}
            docTienBangChu={docTienBangChu}
            docSoLuongCay={docSoLuongCay}
            formatPlaceholderLabel={formatPlaceholderLabel}
            parseLocalDate={parseLocalDate}
            formatLocalDate={formatLocalDate}
          />
        )}

        {currentStep === 3 && (
          <CreateContractStep3Preview
            selectedTemplateSlug={selectedTemplateSlug}
            onTemplateChange={(val) => {
              setSelectedTemplateSlug(val)
              setIsCustomEdited(false)
            }}
            isCustomEdited={isCustomEdited}
            customerName={customerName}
            customerCccd={customerCccd}
            customerPhone={customerPhone}
            contractValue={contractValue}
            careFee={careFee}
            treeQuantity={treeQuantity}
            contractCode={contractCode}
            onResetToTemplate={handleResetToTemplate}
            step3ViewMode={step3ViewMode}
            onViewModeChange={setStep3ViewMode}
            renderedPreviewHtml={renderedPreviewHtml}
            onRenderedPreviewHtmlChange={(val) => {
              setRenderedPreviewHtml(val)
              setIsCustomEdited(true)
            }}
          />
        )}

        {currentStep === 4 && (
          <CreateContractStep4Confirm
            title={title}
            selectedUser={selectedUser}
            contractValue={contractValue}
            paymentStatus={paymentStatus}
            selectedTreeCode={selectedTreeCode}
            expiredAt={expiredAt}
            formatDateViDisplay={formatDateViDisplay}
            onBackToStep3={() => setCurrentStep(3)}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentStep === 1 || isSubmitting}
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Quay lại
        </Button>
        {currentStep < 4 && (
          <Button onClick={handleNext} className="gap-1.5">
            Tiếp tục bước {currentStep + 1} <ArrowRight className="w-4 h-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
