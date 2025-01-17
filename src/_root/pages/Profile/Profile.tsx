import Loader from "@/components/shared/Loader"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useUserContext } from "@/context/AuthContext"
import { useGetAllDepartments, useGetUserById, useUpdateUserById } from "@/lib/react-query/auth/authQueries"
import { ProfileValidation } from "@/lib/validation"
import { ROLE, STATUS } from "@/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import { z } from "zod"

const Profile = () => {
  const navigate = useNavigate()
  const { id } = useParams();

  const { user, isLoading: isUserLoading } = useUserContext();
  const { data, isLoading: isUserByIdLoading } = useGetUserById(id!)
  const { data: allDepts, isLoading: isDeptsLoading } = useGetAllDepartments()
  const { mutateAsync: updateUserById, isPending: isSubmitting } = useUpdateUserById()


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
      NIK: 0,
    },
  })
  const { reset, handleSubmit, control, getValues, setValue } = form



  useEffect(() => {

    if ((user.role === ROLE.USER) && (id !== user.id)) {
      toast.error('You are not an Admin, please contact your administrator.')
      navigate('/');
      return
    }

    // if (!data) {
    //   return
    // }

    if (data) {
      setValue("name", data?.name!)
      setValue("departement", data?.departement!)
      setValue("email", data?.email!)
      setValue("position", data?.position!)
      setValue("NIK", data?.NIK!)
      setValue("status", data?.status!)
      setValue("role", data?.role!)
    }

    return () => { }
  }, [data, isUserByIdLoading])



  const onSubmit = async (data: z.infer<typeof ProfileValidation>) => {
    if (!id) {
      toast.error("No user id provided.")
      navigate('/');
      return
    }

    await updateUserById({
      id: id,
      departement: data?.departement,
      name: data?.name,
      email: data?.email,
      position: data?.position,
      NIK: data?.NIK,
      status: data?.status,
      role: data.role
    },
      {
        onSuccess() {
          reset()
          toast.success("Success update data karyawan.")
          navigate('/settings');
        }
      }
    )


  }


  if (isUserLoading || isUserByIdLoading || isDeptsLoading) return <Loader color="lightgray" />;

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
            defaultValue={getValues("name")}
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
            defaultValue={getValues("departement")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departement</FormLabel>
                <Select onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={getValues("departement")}
                        defaultValue={getValues("departement")}
                        className="capitalize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {
                      allDepts?.map((item, index) => (
                        <SelectItem
                          value={item.name}
                          key={index}
                          className="capitalize"
                        >
                          {item.name}
                        </SelectItem>
                      ))
                    }
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">Departemen tempat karyawan bekerja.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="email"
            defaultValue={getValues("email")}
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
            defaultValue={getValues("position")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Position</FormLabel>
                <FormControl>
                  <Input type="text" className="shad-input" {...field}
                    defaultValue={getValues("position")}
                  />
                </FormControl>
                <FormDescription className="text-xs">Posisi atau jabatan karyawan di perusahaan.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="NIK"
            defaultValue={getValues("NIK")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIK</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    className="shad-input"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    defaultValue={getValues("NIK")}
                  />
                </FormControl>
                <FormDescription className="text-xs">Nomor Induk Karyawan sesuai dengan data resmi perusahaan.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="status"
            defaultValue={getValues("status")}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={getValues("status")}
                        defaultValue={getValues("status")}
                        className="capitalize" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={STATUS.TETAP} className="capitalize">
                      {STATUS.TETAP}
                    </SelectItem>
                    <SelectItem value={STATUS.KONTRAK} className="capitalize">
                      {STATUS.KONTRAK}
                    </SelectItem>
                    <SelectItem value={STATUS.MAGANG} className="capitalize">
                      {STATUS.MAGANG}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription className="text-xs">Status karyawan (Karyawan Tetap, Karyawan Kontrak, Karyawan Magang).</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {user && user?.role === ROLE.USER
            ? <></>
            :
            <FormField
              control={control}
              name="role"
              defaultValue={getValues("role")}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={getValues("role")}
                          defaultValue={getValues("role")}
                          className="capitalize" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={ROLE.ADMIN} className="capitalize">
                        {ROLE.ADMIN}
                      </SelectItem>
                      <SelectItem value={ROLE.USER} className="capitalize">
                        {ROLE.USER}
                      </SelectItem>
                      <SelectItem value={ROLE.SUPERVISOR} className="capitalize">
                        {ROLE.SUPERVISOR}
                      </SelectItem>
                    </SelectContent>
                  </Select>
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