import Purchases, { LOG_LEVEL, type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

export const fullGardenEntitlement = 'full_garden';
export const fullGardenIosProductId = 'com.ridamelkaoui.petalphone.fullgarden';
export const fullGardenAndroidProductId = 'full_garden';

let configured = false;

function publicApiKey() {
  const testKey = process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
  if (__DEV__ && testKey) return testKey;
  if (process.env.EXPO_OS === 'ios') return process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
  if (process.env.EXPO_OS === 'android') return process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;
  return undefined;
}

export function hasFullGarden(customerInfo: CustomerInfo) {
  return Boolean(customerInfo.entitlements.active[fullGardenEntitlement]);
}

export async function configurePurchases() {
  if (configured) return true;
  const apiKey = publicApiKey();
  if (!apiKey || process.env.EXPO_OS === 'web') return false;
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  Purchases.configure({ apiKey });
  configured = true;
  return true;
}

export async function loadFullGardenOffer(): Promise<{ package: PurchasesPackage; price: string } | null> {
  if (!(await configurePurchases())) return null;
  const offerings = await Purchases.getOfferings();
  const offering = offerings.current ?? offerings.all.default;
  if (!offering) return null;
  const lifetime = offering.availablePackages.find((item) => item.identifier === '$rc_lifetime') ?? offering.availablePackages[0];
  return lifetime ? { package: lifetime, price: lifetime.product.priceString } : null;
}

export async function readFullGardenEntitlement() {
  if (!(await configurePurchases())) return null;
  return hasFullGarden(await Purchases.getCustomerInfo());
}

export async function buyFullGarden(item: PurchasesPackage) {
  const result = await Purchases.purchasePackage(item);
  return hasFullGarden(result.customerInfo);
}

export async function restoreFullGarden() {
  if (!(await configurePurchases())) return false;
  return hasFullGarden(await Purchases.restorePurchases());
}
