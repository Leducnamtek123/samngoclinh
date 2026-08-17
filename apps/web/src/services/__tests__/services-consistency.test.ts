import { describe, it, expect } from 'vitest';
import { catalogService } from '@/services/catalog.service';
import { contentService, paymentService, settingsService } from '@/services/content.service';
import { cultivationService } from '@/services/cultivation.service';
import { econtractService } from '@/services/econtract.service';
import { notificationService } from '@/services/notification.service';
import { ordersService } from '@/services/orders.service';
import { userService } from '@/services/user.service';
import { walletService } from '@/services/wallet.service';

describe('Web Domain Services Contract Consistency', () => {
  it('catalogService should have all required contract methods', () => {
    expect(catalogService.getPlants).toBeTypeOf('function');
    expect(catalogService.getPlant).toBeTypeOf('function');
    expect(catalogService.getShopItems).toBeTypeOf('function');
    expect(catalogService.getShopItem).toBeTypeOf('function');
  });

  it('ordersService should have all required contract methods', () => {
    expect(ordersService.checkout).toBeTypeOf('function');
    expect(ordersService.getMyOrders).toBeTypeOf('function');
    expect(ordersService.getOrderDetail).toBeTypeOf('function');
    expect(ordersService.cancelOrder).toBeTypeOf('function');
  });

  it('econtractService should have all required contract methods', () => {
    expect(econtractService.getMyContracts).toBeTypeOf('function');
    expect(econtractService.getContract).toBeTypeOf('function');
    expect(econtractService.signContract).toBeTypeOf('function');
    expect(econtractService.renewContract).toBeTypeOf('function');
    expect(econtractService.getTemplate).toBeTypeOf('function');
    expect(econtractService.verifyContract).toBeTypeOf('function');
  });

  it('cultivationService should have all required contract methods', () => {
    expect(cultivationService.getMyTrees).toBeTypeOf('function');
    expect(cultivationService.getPublicBeds).toBeTypeOf('function');
    expect(cultivationService.getCarePackages).toBeTypeOf('function');
    expect(cultivationService.getProtectionPackages).toBeTypeOf('function');
    expect(cultivationService.subscribePackage).toBeTypeOf('function');
  });

  it('walletService should have all required contract methods', () => {
    expect(walletService.getSummary).toBeTypeOf('function');
    expect(walletService.getTransactions).toBeTypeOf('function');
  });

  it('notificationService should have all required contract methods', () => {
    expect(notificationService.getList).toBeTypeOf('function');
    expect(notificationService.markAsRead).toBeTypeOf('function');
    expect(notificationService.markAllAsRead).toBeTypeOf('function');
    expect(notificationService.getUserSetting).toBeTypeOf('function');
    expect(notificationService.updateUserSetting).toBeTypeOf('function');
  });

  it('userService should have all required contract methods', () => {
    expect(userService.getProfile).toBeTypeOf('function');
    expect(userService.updateProfile).toBeTypeOf('function');
    expect(userService.changePassword).toBeTypeOf('function');
    expect(userService.getIdentityDocument).toBeTypeOf('function');
    expect(userService.getIdentityDocumentHistories).toBeTypeOf('function');
    expect(userService.saveIdentityDocument).toBeTypeOf('function');
    expect(userService.getSignature).toBeTypeOf('function');
    expect(userService.saveSignature).toBeTypeOf('function');
    expect(userService.addAddress).toBeTypeOf('function');
    expect(userService.deleteAddress).toBeTypeOf('function');
  });

  it('contentService, paymentService, settingsService should have all required contract methods', () => {
    expect(contentService.getArticles).toBeTypeOf('function');
    expect(contentService.getBanner).toBeTypeOf('function');
    expect(paymentService.verifySepayOrder).toBeTypeOf('function');
    expect(settingsService.getShippingFee).toBeTypeOf('function');
  });
});
