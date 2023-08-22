import { use } from 'i18next'
import { initReactI18next } from 'react-i18next'
import PRODUCT_EN from 'src/locate/en/product.json'
import PRODUCT_VI from 'src/locate/vi/product.json'

export const resources = {
  // en: {
  //   // namespace
  //   translation: {
  //     popular: 'Popular en'
  //   }
  // },
  // vi: {
  //   // namespace
  //   translation: {
  //     popular: 'Popular vi'
  //   }
  // }
  en: {
    product: PRODUCT_EN
  },
  vi: {
    product: PRODUCT_VI
  }
}

// defaut namespace
export const defaultNS = 'product'
const lng = localStorage.getItem('i18n-lng') || ''

use(initReactI18next).init({
  resources,
  lng,
  ns: ['product'],
  defaultNS,
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false // react already safes from xss
  }
})
