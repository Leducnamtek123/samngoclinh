import { describe, expect, it } from "vitest"

import {
  apiAdminRegister,
  apiAdminVerifyEmail,
  catalogService,
  contentService,
  cultivationService,
  legalService,
  ordersService,
  packagesService,
  settingsService,
  usersService,
} from "../index"

describe("Admin Domain Services Contract Consistency", () => {
  it("catalogService should have all required contract methods", () => {
    expect(catalogService.getShopItems).toBeTypeOf("function")
    expect(catalogService.getShopCategories).toBeTypeOf("function")
    expect(catalogService.getShopItemDetail).toBeTypeOf("function")
  })

  it("contentService should have all required contract methods", () => {
    expect(contentService.getBanners).toBeTypeOf("function")
    expect(contentService.createBanner).toBeTypeOf("function")
    expect(contentService.updateBanner).toBeTypeOf("function")
    expect(contentService.deleteBanner).toBeTypeOf("function")
    expect(contentService.getArticles).toBeTypeOf("function")
    expect(contentService.createArticle).toBeTypeOf("function")
    expect(contentService.updateArticle).toBeTypeOf("function")
    expect(contentService.deleteArticle).toBeTypeOf("function")
  })

  it("cultivationService should have all required contract methods", () => {
    expect(cultivationService.getGardens).toBeTypeOf("function")
    expect(cultivationService.getGardenDetail).toBeTypeOf("function")
    expect(cultivationService.getBeds).toBeTypeOf("function")
    expect(cultivationService.getTrees).toBeTypeOf("function")
    expect(cultivationService.getCareLogs).toBeTypeOf("function")
    expect(cultivationService.getQrTraceability).toBeTypeOf("function")
  })

  it("legalService should have all required contract methods", () => {
    expect(legalService.getKycList).toBeTypeOf("function")
    expect(legalService.approveKyc).toBeTypeOf("function")
    expect(legalService.rejectKyc).toBeTypeOf("function")
    expect(legalService.getContracts).toBeTypeOf("function")
    expect(legalService.getContractDetail).toBeTypeOf("function")
    expect(legalService.createContract).toBeTypeOf("function")
    expect(legalService.updateContract).toBeTypeOf("function")
    expect(legalService.issueContract).toBeTypeOf("function")
    expect(legalService.deleteContract).toBeTypeOf("function")
    expect(legalService.getAmendments).toBeTypeOf("function")
    expect(legalService.createAmendment).toBeTypeOf("function")
    expect(legalService.getContractTemplates).toBeTypeOf("function")
    expect(legalService.getTemplate).toBeTypeOf("function")
    expect(legalService.updateTemplate).toBeTypeOf("function")
    expect(legalService.getContacts).toBeTypeOf("function")
    expect(legalService.deleteContact).toBeTypeOf("function")
  })

  it("ordersService should have all required contract methods", () => {
    expect(ordersService.getOrders).toBeTypeOf("function")
    expect(ordersService.getOrderDetail).toBeTypeOf("function")
    expect(ordersService.updateOrderStatus).toBeTypeOf("function")
  })

  it("packagesService should have all required contract methods", () => {
    expect(packagesService.getCarePackages).toBeTypeOf("function")
    expect(packagesService.createCarePackage).toBeTypeOf("function")
    expect(packagesService.updateCarePackage).toBeTypeOf("function")
    expect(packagesService.deleteCarePackage).toBeTypeOf("function")
    expect(packagesService.getProtectionPackages).toBeTypeOf("function")
    expect(packagesService.createProtectionPackage).toBeTypeOf("function")
    expect(packagesService.updateProtectionPackage).toBeTypeOf("function")
    expect(packagesService.deleteProtectionPackage).toBeTypeOf("function")
  })

  it("settingsService should have all required contract methods", () => {
    expect(settingsService.getSettings).toBeTypeOf("function")
    expect(settingsService.getSetting).toBeTypeOf("function")
    expect(settingsService.updateSetting).toBeTypeOf("function")
    expect(settingsService.getShippingSettings).toBeTypeOf("function")
    expect(settingsService.getPointsSettings).toBeTypeOf("function")
    expect(settingsService.getGeneralSettings).toBeTypeOf("function")
  })

  it("usersService should have all required contract methods", () => {
    expect(usersService.getUsers).toBeTypeOf("function")
    expect(usersService.getRoles).toBeTypeOf("function")
    expect(usersService.getUserDetail).toBeTypeOf("function")
  })

  it("auth-admin service should have register and verify email methods", () => {
    expect(apiAdminRegister).toBeTypeOf("function")
    expect(apiAdminVerifyEmail).toBeTypeOf("function")
  })
})
