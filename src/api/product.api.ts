import { Product, Products, ProductsConfig } from 'src/types/product.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'products'
const productApi = {
  getProducts: (params: ProductsConfig) =>
    http.get<SuccessResponse<Products>>(URL, {
      params
    }),
  getProduct: (id: string) => http.get<SuccessResponse<Product>>(`${URL}/${id}`)
}

export default productApi
