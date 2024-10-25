import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/button'
import { useSignOutAccount } from '@/lib/react-query/queriesAndMutations'
import { useUserContext } from '@/context/AuthContext'

const Topbar = () => {
  const { mutate: signOut, isSuccess } = useSignOutAccount()
  const navigate = useNavigate()
  const { user } = useUserContext()

  useEffect(() => {
    // refresh page if signOut
    if (isSuccess) navigate(0)

  }, [isSuccess])

  return (
    <section className='fixed top-0 z-50 md:hidden w-full bg-gradient-to-tl from-green-100 to-transparent backdrop-blur-sm bg-opacity-60 shadow-sm'>
      <div className='flex justify-between items-center h-[6svh] px-5'>
        <Link to={"/"} className='flex gap-3 items-center'>
          <div className="flex flex-row items-center justify-center gap-2">
            <img
              src="/assets/image/side-img.png"
              alt="logo"
              width={30}
              height={50}
            />
            <h2 className="text-sm italic font-semibold text-primary">IFCAbsence</h2>
          </div>
        </Link>

        <div className="flex justify-center items-center gap-4">
          <Button
            variant={"ghost"}
            className='shad-button_ghost hover:invert-dark'
            onClick={() => signOut()}
          >
            <img
              src='/assets/icons/logout.svg'
              alt='logout'
              className='h-5 w-5'
            />
          </Button>

          <Link to={`/profile/${user?.id}`} className='flex-center gap-3'>
            <img
              src={user?.imageUrl || '/assets/icons/profile-placeholder.svg'}
              alt='profile'
              className='h-7 w-7 rounded-full'
            />
          </Link>
        </div>

      </div>
    </section>
  )
}

export default Topbar