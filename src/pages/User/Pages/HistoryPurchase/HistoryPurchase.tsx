import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { useContext } from 'react'
import { Link, createSearchParams } from 'react-router-dom'
import purchaseApi from 'src/api/purchase.api'
import path from 'src/constants/path'
import { purchasesStatus } from 'src/constants/purchase'
import { AppContext } from 'src/contexts/app.context'
import useQueryParams from 'src/hooks/useQueryParams'
import { PurchaseListStatus } from 'src/types/purchase.type'
import { generateNameId } from 'src/utils/utils'

const purchaseTabs = [
  { name: 'All', status: purchasesStatus.all },
  { name: 'In Cart', status: purchasesStatus.inCart },
  { name: 'Wait for confirmation', status: purchasesStatus.waitForConfirmation },
  { name: 'Wait for getting', status: purchasesStatus.waitForGetting },
  { name: 'In progess', status: purchasesStatus.inProgess },
  { name: 'Cancel', status: purchasesStatus.cancel },
  { name: 'Delivered', status: purchasesStatus.delivered }
]

export default function HistoryPurchase() {
  const { isAuthenticated } = useContext(AppContext)
  const queryParams: { status?: string } = useQueryParams()
  const status: number = Number(queryParams.status) || purchasesStatus.all

  const { data: purchasesData } = useQuery({
    queryKey: ['purchase', { status }],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus }),
    enabled: isAuthenticated
  })

  const purchases = purchasesData?.data.data

  const renderPurchaseTabsLink = purchaseTabs.map((tab) => (
    <Link
      key={tab.status}
      to={{
        pathname: path.historyPurchase,
        search: createSearchParams({
          status: String(tab.status)
        }).toString()
      }}
      className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
        'border-b-orange text-orange': status === tab.status,
        'border-b-black/10 text-gray-900': status !== tab.status
      })}
    >
      {tab.name}
    </Link>
  ))

  return (
    <div className=''>
      <div className='sticky top-0 flex rounded-t-sm shadow-sm'>{renderPurchaseTabsLink}</div>

      <div>
        {purchases?.length ? (
          purchases.map((purchase) => (
            <div key={purchase._id} className='mt-4 '>
              <Link
                to={`${path.home}${generateNameId({
                  name: purchase.product.name,
                  id: purchase.product._id
                })}`}
              >
                {purchase.product.name}
              </Link>
            </div>
          ))
        ) : (
          <div className='mt-4'>No data</div>
        )}
      </div>
    </div>
  )
}
