import { useMutation, useQuery } from '@tanstack/react-query'
import purchaseApi from 'src/api/purchase.api'
import { purchasesStatus } from 'src/constants/purchase'
import path from 'src/constants/path'
import { formatCurrency, generateNameId } from 'src/utils/utils'
import { Link, useLocation } from 'react-router-dom'
import QuantityController from 'src/components/QuantityController'
import Button from 'src/components/Button'
import { useContext, useEffect, useMemo, useState } from 'react'
import { Purchase } from 'src/types/purchase.type'
import { produce } from 'immer'
import { keyBy } from 'lodash'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'

export default function Cart() {
  const { extendedPurchases, setExtendedPurchases } = useContext(AppContext)

  const location = useLocation()

  const purchaseIdFromLocation = (location.state as { purchaseId: string | null })?.purchaseId

  const { data: purchasesInCartData, refetch } = useQuery({
    queryKey: ['purchases', { status: purchasesStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchasesStatus.inCart })
  })

  const updatePurchaseMutation = useMutation({
    mutationFn: purchaseApi.updatePurchase,
    onSuccess: () => refetch()
  })

  const buyProductsMutation = useMutation({
    mutationFn: purchaseApi.buyProducts,
    onSuccess: (res) => {
      refetch()
      toast.success(res.data.message)
    }
  })

  const deleteProductMutation = useMutation({
    mutationFn: purchaseApi.deletePurchase,
    onSuccess: () => refetch()
  })

  const purchasesInCart = purchasesInCartData?.data.data
  const isAllChecked = useMemo(() => extendedPurchases.every((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchases = useMemo(() => extendedPurchases.filter((purchase) => purchase.checked), [extendedPurchases])
  const checkedPurchasesCount = checkedPurchases.length
  const totalCheckedPurchasePrice = useMemo(
    () =>
      checkedPurchases.reduce((total, current) => {
        return (total += current.product.price * current.buy_count)
      }, 0),
    [checkedPurchases]
  )

  const totalCheckedPurchaseSavePrice = useMemo(
    () =>
      checkedPurchases.reduce((total, current) => {
        return (total += (current.product.price_before_discount - current.product.price) * current.buy_count)
      }, 0),
    [checkedPurchases]
  )

  useEffect(() => {
    setExtendedPurchases((prev) => {
      const extendedPurchaseObject = keyBy(prev, '_id')
      return (
        purchasesInCart?.map((purchase) => ({
          ...purchase,
          disabled: false,
          checked:
            purchaseIdFromLocation === purchase._id ? true : Boolean(extendedPurchaseObject[purchase._id]?.checked)
        })) || []
      )
    })
  }, [purchasesInCart, purchaseIdFromLocation])

  useEffect(() => {
    return () => {
      history.replaceState(null, '')
    }
  }, [])

  const handleCheck = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[index].checked = e.target.checked
      })
    )
  }

  const handleCheckAll = () => {
    setExtendedPurchases((prev) =>
      prev.map((purchase) => ({
        ...purchase,
        checked: !isAllChecked
      }))
    )
  }

  const handlequantity = (index: number, value: number, enable: boolean) => {
    if (!enable) return
    const purchase = extendedPurchases[index]

    setExtendedPurchases(
      produce((draft) => {
        draft[index].disabled = true
      })
    )

    updatePurchaseMutation.mutate({
      product_id: purchase.product._id,
      buy_count: value
    })
  }

  const handleTypeQuantity = (index: number) => (value: number) => {
    setExtendedPurchases(
      produce((draft) => {
        draft[index].buy_count = value
      })
    )
  }

  const handleDelete = (_id: string) => () => {
    deleteProductMutation.mutate([_id])
  }

  const handleDeleteMany = () => {
    const purchaseIds = checkedPurchases.map((purchase) => purchase._id)
    deleteProductMutation.mutate(purchaseIds)
  }

  const handleBuy = () => {
    const body = checkedPurchases.map((purchase) => ({
      product_id: purchase.product._id,
      buy_count: purchase.buy_count
    }))
    buyProductsMutation.mutate(body)
  }

  return (
    <div className='bg-neutral-100 py-16'>
      <div className='container'>
        <div className='overflow-auto'>
          <div className='min-width-[1000px]'>
            <div className='grid grid-cols-12 rounded-sm bg-white py-5 px-9 text-sm capitalize text-gray-500 shadow'>
              <div className='col-span-6'>
                <div className='flex items-center'>
                  <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                    <input
                      type='checkbox'
                      className='h-5 w-5 accent-orange'
                      checked={isAllChecked}
                      onChange={handleCheckAll}
                    />
                  </div>
                  <div className='flex-grow text-black'>Product</div>
                </div>
              </div>
              <div className='col-span-6'>
                <div className='grid grid-cols-5 text-center'>
                  <div className='col-span-2'>Unit price</div>
                  <div className='col-span-1'>Quantity</div>
                  <div className='col-span-1'>Amount of money</div>
                  <div className='col-span-1'>Actions</div>
                </div>
              </div>
            </div>
            {extendedPurchases.length && (
              <div className='my-3 rounded-sm bg-white p-5 shadow'>
                {extendedPurchases?.map((purchase, index) => (
                  <div
                    key={purchase._id}
                    className='mt-5 grid grid-cols-12 items-center rounded-sm border border-gray-200 bg-white py-5 px-4 text-center text-sm text-gray-500 first:mt-0'
                  >
                    <div className='col-span-6'>
                      <div className='flex'>
                        <div className='flex flex-shrink-0 items-center justify-center pr-3'>
                          <input
                            type='checkbox'
                            className='h-5 w-5 accent-orange'
                            checked={purchase.checked}
                            onChange={handleCheck(index)}
                          />
                        </div>
                        <div className='flex-grow'>
                          <div className='flex'>
                            <Link
                              to={`${path.home}${generateNameId({
                                name: purchase.product.name,
                                id: purchase.product._id
                              })}`}
                              className='h-20 w-20 flex-shrink-0'
                            >
                              <img src={purchase.product.image} alt={purchase.product.name} />
                            </Link>
                            <div className='flex-grow px-5 pt-1 pb-2'>
                              <Link
                                to={`${path.home}${generateNameId({
                                  name: purchase.product.name,
                                  id: purchase.product._id
                                })}`}
                                className='text-left line-clamp-2'
                              >
                                {purchase.product.name}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-6'>
                      <div className='grid grid-cols-5 items-center'>
                        <div className='col-span-2'>
                          <div className='flex items-center justify-center'>
                            <span className='text-gray-300 line-through'>
                              ${formatCurrency(purchase.product.price_before_discount)}
                            </span>
                            <span className='ml-3'>${formatCurrency(purchase.product.price)}</span>
                          </div>
                        </div>
                        <div className='col-span-1'>
                          <QuantityController
                            max={purchase.product.quantity}
                            value={purchase.buy_count}
                            classNameWrapper='flex items-center'
                            onIncrease={(value) => handlequantity(index, value, value <= purchase.product.quantity)}
                            onDecrease={(value) => handlequantity(index, value, value >= 1)}
                            disabled={purchase.disabled}
                            onType={handleTypeQuantity(index)}
                            onFocusOut={(value) =>
                              handlequantity(
                                index,
                                value,
                                value >= 1 &&
                                  value <= purchase.product.quantity &&
                                  value != (purchasesInCart as Purchase[])[index].buy_count
                              )
                            }
                          />
                        </div>
                        <div className='col-span-1'>
                          <span className='text-orange'>
                            ${formatCurrency(purchase.product.price * purchase.buy_count)}
                          </span>
                        </div>
                        <div className='col-span-1'>
                          <button
                            className='bg-none text-black transition-colors hover:text-orange'
                            onClick={handleDelete(purchase._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className='sticky bottom-0 z-10 mt-8 flex flex-col rounded-sm border border-gray-100 bg-white p-5 shadow sm:flex-row sm:items-center'>
          <div className='flex items-center'>
            <div className='flex flex-shrink-0 items-center justify-center pr-3'>
              <input
                type='checkbox'
                className='h-5 w-5 accent-orange'
                checked={isAllChecked}
                onChange={handleCheckAll}
              />
            </div>
            <button className='mx-3 border-none bg-none' onClick={handleCheckAll}>
              Select all ({checkedPurchasesCount})
            </button>
            <button className='mx-3 border-none bg-none' onClick={handleDeleteMany}>
              Delete
            </button>
          </div>
          <div className='mt-5 flex-col sm:ml-auto sm:mt-0 sm:flex sm:flex-row sm:items-center'>
            <div className=''>
              <div className='flex items-center sm:justify-end'>
                <div>Total payment ({checkedPurchasesCount} product): </div>
                <div className='ml-2 text-2xl text-orange'>${formatCurrency(totalCheckedPurchasePrice)}</div>
              </div>
              <div className='flex items-center text-sm sm:justify-end'>
                <div className='text-gray-500'>Save</div>
                <div className='ml-6 text-orange'>${formatCurrency(totalCheckedPurchaseSavePrice)}</div>
              </div>
            </div>
            <Button
              className='mt-5 flex h-10 w-52 items-center justify-center bg-red-500 text-center text-sm uppercase text-white hover:bg-red-600 sm:ml-4 sm:mt-0'
              onClick={handleBuy}
              disabled={buyProductsMutation.isLoading}
            >
              Purchase
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
