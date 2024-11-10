import { BOTTOMBAR_LINKS } from '@/constants'
import { useUserContext } from '@/context/AuthContext'
import { cn } from '@/lib/utils'
import { INavLink, ROLE } from '@/types'
import { NavLink, useLocation } from 'react-router-dom'

const Bottombar = () => {
  const { pathname } = useLocation()
  const { user } = useUserContext()

  return (
    <section className='fixed z-50 flex justify-between items-center w-full bottom-0 rounded-t-[20px] px-5 py-4 md:hidden bg-green-700 text-white'>
      {BOTTOMBAR_LINKS.map((link: INavLink) => {
        let isActive = pathname === link.route
        const isAllow = user.role === ROLE.ADMIN || link.role === user.role;

        return (<NavLink
          to={link.route}
          key={link.label}
          className={cn(
            isActive && 'bg-green-50 rounded-[10px] text-black',
            'flex justify-center items-center flex-col gap-1 p-2 transition',
            !isAllow && 'hidden',
          )}
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
        </NavLink>)
      })}
    </section>
  )
}

export default Bottombar