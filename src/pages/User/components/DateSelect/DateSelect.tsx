import range from 'lodash/range'
import React from 'react'

interface Props {
  onChange: (value: Date) => void
  value?: Date
  errorMessage?: string
}

export default function DateSelect({ onChange, value, errorMessage }: Props) {
  // const [date, setDate] = useState({
  //   date: value?.getDate() || 1,
  //   month: value?.getMonth() || 0,
  //   year: value?.getFullYear() || 1990
  // })

  // useEffect(() => {
  //   if (value) {
  //     setDate({
  //       date: value?.getDate(),
  //       month: value?.getMonth(),
  //       year: value?.getFullYear()
  //     })
  //   }
  // }, [value])

  const date = {
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  }

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target

    const newDate = {
      ...date,
      [name]: value
    }

    // setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div className='mt-2 flex flex-col flex-wrap sm:flex-row'>
      <div className='truncate pt-3 capitalize sm:w-[20%] sm:text-right'>Bob</div>
      <div className='sm:w-[80%] sm:pl-5'>
        <div className='flex justify-between'>
          <select
            onChange={handleChange}
            name='date'
            value={date.date}
            className='h-10 w-[32%] cursor-pointer border border-gray-300 px-3 outline-none hover:border-orange'
          >
            <option disabled>Day</option>
            {range(1, 32).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='month'
            value={date.month}
            className='h-10 w-[32%] cursor-pointer border border-gray-300 px-3 outline-none hover:border-orange'
          >
            <option disabled>Month</option>
            {range(0, 12).map((item) => (
              <option key={item} value={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            onChange={handleChange}
            name='year'
            value={date.year}
            className='h-10 w-[32%] cursor-pointer border border-gray-300 px-3 outline-none hover:border-orange'
          >
            <option disabled>Year</option>
            {range(1990, new Date().getFullYear() + 1).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div>
      </div>
    </div>
  )
}
