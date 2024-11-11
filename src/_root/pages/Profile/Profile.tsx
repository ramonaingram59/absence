import Loader from "@/components/shared/Loader"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useUserContext } from "@/context/AuthContext"
import { useGetUserById } from "@/lib/react-query/auth/authQueries"
import { ProfileValidation } from "@/lib/validation"
import { ROLE } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const Profile = () => {
  const isSubmitting = true
  const navigate = useNavigate()
  const { id } = useParams();

  const { user, isLoading: isUserLoading } = useUserContext();
  const { data, isLoading: isUserByIdLoading } = useGetUserById(id!)

  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    mode: "onSubmit",
    defaultValues: {
      name: '',
      departement: '',
      email: '',
      position: '',
      status: '',
      role: '',
    },
  })
  const { reset, handleSubmit, control } = form



  useEffect(() => {

    if ((user.role !== ROLE.ADMIN) && (id !== user.id)) {
      toast.error('You are not an Admin, please contact your administrator.')
      navigate('/');
      return
    }

    if (data) {
      reset({
        name: data?.name!,
        departement: data?.departement!,
        email: data?.email!,
        position: data?.position!,
        NIK: data?.NIK!,
        status: data?.status!,
        role: data?.role!,
      })
    }

    return () => { }
  }, [data, isUserByIdLoading, user, isUserLoading])



  const onSubmit = async (values: z.infer<typeof ProfileValidation>) => {

    console.log(values, 'values')

    reset()
  }

  if (isUserLoading || isUserByIdLoading) return <Loader color="lightgray" />;

  return (
    <Form {...form}>

      <div className="w-full max-w-xl flex flex-col mx-4 p-2">

        <h2 className="text-xl font-semibold md:h2-bold">Profile</h2>
        <p className="text-light-3 text-xs md:base-regular mt-2">
          Update personal information to ensure smooth access to all features and services in IFCAbsence.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full mt-4 p-4 border rounded shadow-sm">
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormDescription className="text-xs">Nama lengkap karyawan sesuai dengan identitas resmi.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="departement"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departement</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormDescription className="text-xs">Departemen tempat karyawan bekerja.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" className="shad-input" {...field} />
                </FormControl>
                <FormDescription className="text-xs">Alamat email yang valid dan aktif.</FormDescription>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="position"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormDescription className="text-xs">Posisi atau jabatan karyawan di perusahaan.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="NIK"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIK</FormLabel>
                <FormControl>
                  <Input type="number" className="shad-input" {...field} />
                </FormControl>
                <FormDescription className="text-xs">Nomor Induk Karyawan sesuai dengan data resmi perusahaan.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field} />
                </FormControl>
                <FormDescription className="text-xs">Status karyawan (Karyawan Tetap, Karyawan Kontrak, Karyawan Magang).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {user && user?.role !== ROLE.ADMIN
            ? <></>
            :
            <FormField
              control={control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input type="text" className="shad-input" {...field} />
                  </FormControl>
                  <FormDescription className="text-xs">Peran yang dimiliki oleh karyawan di sistem ini.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />}



          <Button type="submit" className="shad-button_primary hover:invert-dark mb-24"
            disabled={isSubmitting}
          >
            {isSubmitting
              ?
              <div className="flex flex-row gap-2">
                <Loader /> Loading...
              </div>
              :
              "Save"
            }
          </Button>
        </form>
      </div>

    </Form>
  )
}

export default Profile