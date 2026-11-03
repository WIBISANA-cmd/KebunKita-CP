import { faq, productCategory, review, service } from "./collections";
import { homePage } from "./home-page";
import { imageWithAlt, openingHours, productItem, socialLink, step } from "./objects";
import { siteSettings } from "./site-settings";

export const schemaTypes = [
  siteSettings,
  homePage,
  service,
  productCategory,
  review,
  faq,
  imageWithAlt,
  openingHours,
  socialLink,
  step,
  productItem,
];

export const SINGLETON_TYPES = new Set(["siteSettings", "homePage"]);
