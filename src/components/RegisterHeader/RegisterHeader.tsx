import { Link } from 'react-router-dom'
import { ReactComponent as Logo } from 'src/assets/shopee.svg'

export default function RegisterHeader() {
  return (
    <header className='sticky top-0 bg-white py-5'>
      <div className='mx-auto max-w-7xl px-4'>
        <nav className='flex items-end'>
          <Link to='/'>
            <span>
              <Logo className='h8 fill-orange lg:h-11' />
            </span>
          </Link>
          <div className='ml-5 text-xl lg:text-2xl'>Register</div>
        </nav>
      </div>
    </header>
  )
}
