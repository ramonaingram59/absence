// import FaceCam from "@/components/shared/FaceCam"

import Loader from '@/components/shared/Loader';
import { lazy, Suspense } from 'react';

const FaceCamera = lazy(() => import('@/components/shared/FaceCamera'));

const Saved = () => {
  return (
    <div>Saved

      <Suspense fallback={<Loader />}>
        <FaceCamera />
      </Suspense>
    </div>
  )
}

export default Saved