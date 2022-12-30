import { Link } from 'react-router-dom'
import { LogoSvg } from 'src/assets/icons'

export default function RegisterHeader() {
  return (
    <header className='sticky top-0 bg-white py-5'>
      <div className='mx-auto max-w-7xl px-4'>
        <nav className='flex items-end'>
          <Link to='/'>
            <span>
              <LogoSvg className='h-8 fill-orange lg:h-11' />
            </span>
          </Link>
          <div className='ml-5 text-xl lg:text-2xl'>Register</div>
        </nav>
      </div>
    </header>
  )
}
