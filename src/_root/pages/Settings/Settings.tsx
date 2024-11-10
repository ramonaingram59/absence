import { buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ChevronRight } from "lucide-react"
import { Link } from "react-router-dom"


const Settings = () => {


  return (
    <div className="flex flex-1 p-4 flex-col">
      <h2 className="text-left text-xl pb-2 font-semibold">
        Settings
      </h2>
      <Card>
        <Link
          to={"/settings/faces"}
          className={cn(buttonVariants({ variant: "outline" }), "w-full flex justify-between items-center min-h-32")}>
          <div className="flex flex-col pl-2">
            <div className="flex flex-row items-center justify-between">
              <span className='text-lg'>
                Pendaftaran Wajah
              </span>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">
                Daftar atau hapus wajah karyawan untuk absensi.
              </span>
            </div>
          </div>
          <ChevronRight size={"32"} color="gray" />
        </Link>

        <Link
          to={"/settings/users"}
          className={cn(buttonVariants({ variant: "outline" }), "w-full flex justify-between items-center min-h-32")}>
          <div className="flex flex-col pl-2">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-between">
                <span className='text-lg'>
                  Pengaturan Pengguna
                </span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">
                Ubah atau hapus informasi karyawan.
              </span>
            </div>
          </div>
          <ChevronRight size={"32"} color="gray" />
        </Link>

        <Link
          to={"/settings/unknown-faces"}
          className={cn(buttonVariants({ variant: "outline" }), "w-full flex justify-between items-center min-h-32")}>
          <div className="flex flex-col pl-2">
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center justify-between">
                <span className='text-lg'>
                  Data Wajah tidak dikenali
                </span>
              </div>
            </div>
            <div>
              <span className="text-muted-foreground text-xs">
                Lihat riwayat data wajah tidak dikenali.
              </span>
            </div>
          </div>
          <ChevronRight size={"32"} color="gray" />
        </Link>

      </Card>
    </div>
  )
}

export default Settings