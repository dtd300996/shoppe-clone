const path = {
  home: '/',
  user: '/user',
  profile: '/user/profile',
  changePassword: '/user/change-password',
  historyPurchase: '/user/history-purchase',
  login: '/login',
  register: '/register',
  logout: '/logout',
  cart: '/cart',
  productDetail: '/:nameId'
} as const

export default path
