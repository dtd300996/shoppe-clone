import { StarSolidSvg } from 'src/assets/icons'

interface Props {
  rating: number
}
export default function ProductRating({ rating = 2.2 }: Props) {
  const caculateWidth = (order: number): string => {
    // if (order - rating < 0)
    if (rating - order > 0) {
      return '100%'
    }

    // if (order - rating < 1)
    if (rating - order > -1) {
      return `${(rating - Math.floor(rating)) * 100}%`
    }

    return '0%'
  }

  return (
    <div className='flex items-center'>
      {Array(5)
        .fill(1)
        .map((_, index) => (
          <div className='relative' key={index}>
            {
              <div
                className='absolute top-0 left-0 h-full overflow-hidden'
                style={{
                  width: caculateWidth(index + 1)
                }}
              >
                <StarSolidSvg className='h-3 w-3 fill-yellow-300 text-yellow-300 ' />
              </div>
            }
            <StarSolidSvg className='h-3 w-3 fill-current text-gray-300 ' />
          </div>
        ))}
    </div>
  )
}