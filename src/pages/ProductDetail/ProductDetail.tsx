import { QueryClient, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import productApi from 'src/api/product.api'
import { CartSvg, ChevronLeftSvg, ChevronRightSvg } from 'src/assets/icons'
import InputNumber from 'src/components/InputNumber'
import ProductRating from 'src/components/ProductRating'
import { Product as ProductType, ProductsConfig } from 'src/types/product.type'
import { formatCurrency, formatNumberToSocialStyle, getIdFromNameId, rateSale } from 'src/utils/utils'
import Product from '../Producs/components/Product'
import QuantityController from 'src/components/QuantityController'
import purchaseApi from 'src/api/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import { toast } from 'react-toastify'
import path from 'src/constants/path'

export default function ProductDetail() {
  const queryClient = useQueryClient()
  const { isAuthenticated } = useContext(AppContext)
  const navigate = useNavigate()

  const [buyCount, setBuyCount] = useState(1)
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)

  const { data: productDetail } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProduct(id as string)
  })
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const [imagePosition, setImagePosition] = useState<0 | 4>(0)

  const product = productDetail?.data.data
  const imageRef = useRef<HTMLImageElement>(null)
  const currentImages = useMemo(
    () => (product ? product?.images.slice(...currentIndexImages) : []),
    [currentIndexImages, product]
  )

  const queryConfig: ProductsConfig = { limit: '20', page: '1', category: product?.category._id }

  const { data: productsData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => {
      return productApi.getProducts(queryConfig)
    },
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  const addToCartMutation = useMutation(purchaseApi.addToCart)

  const products = productsData?.data.data.products

  useEffect(() => {
    if (product && product.images.length) {
      setActiveImage(product.images[0])
    }
  }, [product])

  useEffect(() => {
    if (currentImages.length && !currentImages.includes(activeImage)) {
      setActiveImage(currentImages[imagePosition])
    }
  }, [currentImages, activeImage, imagePosition])

  const chooseActive = (img: string) => () => {
    setActiveImage(img)
  }

  const next = () => {
    if (currentIndexImages[1] < (product as ProductType).images.length) {
      setCurrentIndexImages((prev) => [prev[0] + 1, prev[1] + 1])

      if (currentImages.indexOf(activeImage) === 1) {
        setImagePosition(0)
      }
    }
  }

  const previous = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1])

      if (currentImages.indexOf(activeImage) === 4) {
        setImagePosition(4)
      }
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { naturalWidth, naturalHeight } = image
    // 1. get offsetX, offsetY simple when we can handle bubble event
    // const { offsetY, offsetX } = event.nativeEvent

    // 2. get offsetX, offsetY when we can't handle bubble event
    const offsetX = event.pageX - (rect.x + window.scrollX)
    const offsetY = event.pageY - (rect.y + window.scrollY)

    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.width = naturalWidth + 'px'
    image.style.maxWidth = 'unset'
    image.style.height = naturalHeight + 'px'
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    imageRef.current?.removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const buyNow = async () => {
    const res = await addToCartMutation.mutateAsync({ buy_count: buyCount, product_id: product?._id as string })
    const purchase = res.data.data
    navigate(path.cart, {
      state: {
        purchaseId: purchase._id
      }
    })
  }

  const addToCart = () => {
    if (!isAuthenticated) {
      navigate(`/login`)
      return
    }
    addToCartMutation.mutate(
      {
        buy_count: buyCount,
        product_id: product?._id as string
      },
      {
        onSuccess: (data) => {
          queryClient.invalidateQueries({
            queryKey: ['purchase', { status: purchasesStatus.inCart }]
          })
          toast.success(data.data.message, { autoClose: 1000 })
        }
      }
    )
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full overflow-hidden pt-[100%] shadow hover:cursor-zoom-in'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className='pointer-events-none absolute top-0 left-0 h-full w-full bg-white object-cover' // handle bubble event = pointer-events-none
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='top absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={previous}
                >
                  <ChevronLeftSvg />
                </button>

                {currentImages.slice(0, 5).map((img) => {
                  const isActive = img === activeImage
                  return (
                    <div key={img} className='relative w-full pt-[100%]' onMouseEnter={chooseActive(img)}>
                      <img
                        src={img}
                        alt={product.name}
                        className='absolute top-0 left-0 h-full w-full bg-white object-cover'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                    </div>
                  )
                })}

                <button
                  className='top absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white'
                  onClick={next}
                >
                  <ChevronRightSvg />
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='fill-orange text-orange h-4 w-4'
                    nonActiveClassName='fill-gray-300 text-gray-300 h-4 w-4'
                  />
                </div>
                <div className='mx-4 h-4 w-[1px] bg-gray-300'></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.sold)}</span>
                  <span className='ml-1 text-gray-500'>Sold</span>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>{formatCurrency(product.price)}$</div>
                <div className='text-sx ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white'>
                  {rateSale(product.price_before_discount, product.price)} discount
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-500'>Quantity</div>
                <QuantityController
                  max={product.quantity}
                  onDecrease={handleBuyCount}
                  onIncrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                />
                <div className='ml-6 text-sm text-gray-500'>{product.quantity} products available</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  onClick={addToCart}
                  className='flex h-12 items-center justify-center rounded-sm border border-orange bg-orange/10 px-5 capitalize text-orange hover:bg-orange/5'
                >
                  <CartSvg className='mr-[10px] h-5 w-5 fill-current stroke-orange text-orange' /> Add to cart
                </button>
                <button
                  className='ml-4 flex h-12 min-w-[5rem] items-center justify-center rounded-sm bg-orange px-5 capitalize text-white shadow-sm outline-none hover:bg-orange/90'
                  onClick={buyNow}
                >
                  Buy now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='container'>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Product description </div>
          <div className='leading-lose mx-4 mt-12 mb-4 text-sm'>
            <div
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.description)
              }}
            ></div>
          </div>
        </div>
      </div>
      {products && (
        <div className='container'>
          <div className='mt-8 bg-white p-4 shadow'>
            <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Maybe you like </div>
            <div className='mt-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
              {products.map((product) => (
                <div className='col-span-1' key={product._id}>
                  <Product product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
