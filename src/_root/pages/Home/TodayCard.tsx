import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { formatDate } from '@/lib/utils'

const TodayCard = () => {
  return (
    <div className='w-full'>
      <Card>
        <CardHeader>
          <CardTitle>
            <span className='text-xl'>
              Today ( {formatDate(new Date())} )
            </span>
          </CardTitle>
          <CardDescription>
            Shift: Fixed 9 hours (08:30 - 17:30)
          </CardDescription>
        </CardHeader>

        <Separator orientation='horizontal' />

        <CardContent className='py-4'>
          <div className='flex flex-row w-full gap-4'>
            <div className="flex-1">
              <p className='font-medium text-muted-foreground'>Start Time</p>
              <div className='flex flex-row gap-4 items-end'>
                <p className='text-xl font-medium'>
                  08:30
                  {/* HEREEEE */}
                </p>
                <div className='bg-primary rounded-lg w-6 h-6'>
                  <img
                    src='/assets/icons/face-scan.svg'
                  />
                </div>
              </div>

            </div>

            <Separator orientation='vertical' className='h-16 my-1' />

            <div className="flex-1">
              <p className='font-medium text-muted-foreground'>End Time</p>
              <div className='flex flex-row gap-4 items-end'>
                <p className='text-xl font-medium'>
                  --:--
                  {/* HEREEEE */}
                </p>
                <div className='bg-primary-foreground rounded-lg w-6 h-6'>
                  <img
                    src='/assets/icons/face-scan.svg'
                  />
                </div>
              </div>

            </div>

          </div>
        </CardContent>

        <Separator orientation='horizontal' />

        <CardFooter className='w-full flex justify-center items-center py-4'>
          <Button className='w-full'>
            Record Time
          </Button>
        </CardFooter>

      </Card>
    </div >
  )
}

export default TodayCard