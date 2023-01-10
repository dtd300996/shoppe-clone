export interface Product {
  _id: string
  images: string[]
  price: number
  rating: number
  price_before_discount: number
  quantity: number
  sold: number
  view: number
  name: string
  category: {
    _id: string
    name: string
  }
  image: string
  createdAt: string
  updatedAt: string
}

interface Pagination {
  page: number
  limit: number
  page_size: number
}

export interface Products {
  products: Product[]
  pagination: Pagination
}

export interface ProductsConfig {
  page?: number
  limit?: number
  sort_by?: 'createAt' | 'view' | 'sold' | 'price'
  order?: 'asc' | 'desc'
  exclude?: string
  rating_filter?: number
  price_max?: number
  price_min?: number
  name?: string
}
