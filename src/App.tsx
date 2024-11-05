import { Routes, Route } from 'react-router-dom'
import './global.css'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import { Toaster } from './components/ui/toaster'
import { lazy, Suspense } from 'react'
import Loader from './components/shared/Loader'

const SigninForm = lazy(() => import('./_auth/forms/SigninForm'));
const SignupForm = lazy(() => import('./_auth/forms/SignupForm'));
const Home = lazy(() => import('./_root/pages/Home/Home'));
const History = lazy(() => import('./_root/pages/History/History'));
const Settings = lazy(() => import('./_root/pages/Settings/Settings'));
const RegisterFace = lazy(() => import('./_root/pages/Settings/pages/RegisterFace'));
const UnknownFace = lazy(() => import('./_root/pages/Settings/pages/UnknownFace'));
const UsersSettings = lazy(() => import('./_root/pages/Settings/pages/UsersSettings'));
const Saved = lazy(() => import('./_root/pages/Saved'));
const AllUsers = lazy(() => import('./_root/pages/AllUsers'));
const CreatePost = lazy(() => import('./_root/pages/CreatePost'));
const EditPost = lazy(() => import('./_root/pages/EditPost'));
const PostDetails = lazy(() => import('./_root/pages/PostDetails'));
const Profile = lazy(() => import('./_root/pages/Profile'));
const UpdateProfile = lazy(() => import('./_root/pages/UpdateProfile'));


const App = () => {
  return (
    <main className='flex h-screen'>
      <Suspense fallback={
        <Loader />
      }>
        <Routes>
          {/* PUBLIC */}
          <Route element={<AuthLayout />}>
            <Route path='/signin' element={<SigninForm />} />
            <Route path='/signup' element={<SignupForm />} />
          </Route>

          {/* PRIVATE */}
          <Route element={<RootLayout />}>
            <Route index element={<Home />} />
            <Route path='/history' element={<History />} />
            <Route path='/scan' element={<Saved />} />
            <Route path='/all-users' element={<AllUsers />} />
            <Route path='/create-post' element={<CreatePost />} />
            <Route path='/update-post/:id' element={<EditPost />} />
            <Route path='/posts/:id' element={<PostDetails />} />
            <Route path='/profile/:id/*' element={<Profile />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/settings/faces' element={<RegisterFace />} />
            <Route path='/settings/users' element={<UsersSettings />} />
            <Route path='/settings/unknown-faces' element={<UnknownFace />} />
            <Route path='/update-profile/:id' element={<UpdateProfile />} />
          </Route>

        </Routes>
      </Suspense>
      <Toaster />
    </main>
  )
}

export default App