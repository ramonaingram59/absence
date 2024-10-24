import { BOTTOMBAR_LINKS } from '@/constants'
import { INavLink } from '@/types'
import { NavLink, useLocation } from 'react-router-dom'

const Bottombar = () => {
  const { pathname } = useLocation()

  return (
    <section className='fixed z-50 flex justify-between items-center w-full bottom-0 rounded-t-[20px] px-5 py-4 md:hidden bg-green-700 text-white'>
      {BOTTOMBAR_LINKS.map((link: INavLink) => {
        let isActive = pathname === link.route
        return <NavLink
          to={link.route}
          key={link.label}
          className={`${isActive && 'bg-green-50 rounded-[10px] text-black'} 
          flex justify-center items-center flex-col gap-1 p-2 transition`}
        >
          <img
            src={link.imgURL}
            alt={link.label}
            width={isActive ? 32 : 16}
            height={isActive ? 32 : 16}
            className={` ${isActive && 'invert brightness-0 transition '} brightness-200 `}
          />
          <p className={`${isActive && 'hidden'} text-sm text-light-2`}>
            {link.label}
          </p>
        </NavLink>
      })}
    </section>
  )
}

export default Bottombar