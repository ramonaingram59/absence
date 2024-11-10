// import FaceCam from "@/components/shared/FaceCam"

import Loader from '@/components/shared/Loader';
import { useUserContext } from '@/context/AuthContext';
import { ROLE } from '@/types';
import { lazy, Suspense, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const FaceCamera = lazy(() => import('@/components/shared/FaceCamera'));

const Saved = () => {
  const { user, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate()

  useEffect(() => {

    if (!isUserLoading && user && user.role !== ROLE.ADMIN) {
      toast.error('You are not an Admin, please contact your administrator.')
      navigate('/');
    }

  }, [user, isUserLoading, navigate]);

  if (isUserLoading) {
    return <Loader />;
  }

  return (
    <div>Saved

      <Suspense fallback={<Loader />}>
        <FaceCamera />
      </Suspense>
    </div>
  )
}

export default Saved