import { StarSvg } from 'src/assets/icons'

interface Props {
  rating: number
  activeClassname?: string
  nonActiveClassName?: string
}
export default function ProductRating({
  rating = 2.2,
  activeClassname = 'fill-yellow-300 text-yellow-300',
  nonActiveClassName = 'fill-current text-gray-300'
}: Props) {
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
                <StarSvg className={`h-3 w-3 ${activeClassname}`} />
              </div>
            }
            <StarSvg className={`h-3 w-3 ${nonActiveClassName}`} />
          </div>
        ))}
    </div>
  )
}
