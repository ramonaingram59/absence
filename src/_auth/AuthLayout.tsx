import { useUserContext } from '@/context/AuthContext'
import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {
  const { isAuthenticated } = useUserContext()

  return (
    <>
      {
        isAuthenticated ?
          <Navigate to="/" />
          :
          <>
            <section className='flex flex-1 justify-center items-center flex-col py-10 px-8'>
              <Outlet />
            </section>
            <div className='p-72 hidden xl:block h-screen w-1/2 object-fill bg-no-repeat shadow-2xl text-center'>
              <img
                src='/assets/image/side-img.gif'
                className=''
              />
              <h2 className={`text-4xl italic font-semibold text-primary`}>IFCAbsence</h2>
            </div>
          </>
      }
    </>
  )
}

export default AuthLayout