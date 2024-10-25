import { SIDEBAR_LINKS } from '@/constants'
import { useUserContext } from '@/context/AuthContext'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { INavLink } from '@/types'
import { useEffect } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'


const LeftSidebar = () => {
  const { pathname } = useLocation()
  const { user } = useUserContext()
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()

  useEffect(() => {
    if (isSuccess) navigate(0)

  }, [isSuccess])

  return (
    <nav className='hidden md:flex px-6 py-10 flex-col justify-between min-w-[270px] shadow'>
      <div className="flex flex-col gap-11">
        <Link to={"/"} className='flex gap-3 items-center justify-center'>
          <div className="flex flex-row items-center justify-center gap-2">
            <img
              src="/assets/image/side-img.gif"
              alt="logo"
              width={40}
              height={40}
            />
            <h2 className="text-xl italic font-semibold text-primary">IFCAbsence</h2>
          </div>
        </Link>

        <Link to={`/profile/${user?.id}`}
          className='flex gap-3 items-center'
        >
          <img
            src={user?.imageUrl || '/assets/icons/profile-placeholder.svg'}
            alt="profile"
            className='h-10 w-10 rounded-full'
          />
          <div className='flex flex-col'>
            <p className='font-bold leading-[140%] max-w-52 line-clamp-1'>
              {user?.name}
            </p>

            <p className='font-normal leading-[140%] text-muted-foreground'>
              @{user?.departement}
            </p>
          </div>
        </Link>

        <ul className='flex flex-col gap-1'>
          {SIDEBAR_LINKS.map((link: INavLink) => {
            let isActive = pathname === link.route

            return <li
              key={link.label}
              className={`rounded-lg hover:bg-green-300 transition group 
                ${isActive && 'bg-green-300'}`}
            >
              <NavLink
                to={link.route}
                className="flex gap-4 items-center p-4"
              >
                <img
                  src={link.imgURL}
                  alt={link.label}
                  className={
                    `group-hover:invert group-hover:brightness-0 brightness-50 group-hover:transition h-5 w-5
                    ${isActive && 'invert brightness-0 transition'} `}
                />
                {link.label}
              </NavLink>
            </li>
          })}

        </ul>
      </div>
      <Button
        variant={"ghost"}
        className='flex gap-4 items-center justify-start hover:bg-transparent group rounded-lg base-medium hover:bg-green-300 transition hover:brightness-75 hover:transition'
        onClick={() => signOut()}
      >
        <img
          src='/assets/icons/logout.svg'
          alt='logout'
          className={
            `group-hover:invert group-hover:brightness-0 brightness-50 group-hover:transition h-5 w-5`}
        />
        <p className='small-medium lg:base-medium'>
          Logout
        </p>
      </Button>
    </nav>
  )
}

export default LeftSidebar