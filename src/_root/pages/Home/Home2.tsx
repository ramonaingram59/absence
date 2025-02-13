import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useUserContext } from "@/context/AuthContext";
import { useAddMahasiswa } from "@/lib/react-query/auth/authQueries";
import { MahasiswaValidation } from "@/lib/validation";
import { ROLE } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";


const Home2 = () => {
  const navigate = useNavigate()
  const { id } = useParams();

  const { user, isLoading: isUserLoading } = useUserContext();
  const { mutateAsync: addMahasiswa, isPending: isSubmitting } = useAddMahasiswa()


  const form = useForm<z.infer<typeof MahasiswaValidation>>({
    resolver: zodResolver(MahasiswaValidation),
    mode: "onSubmit",
    defaultValues: {
      name: '',
      NIM: '',
    },
  })
  const { handleSubmit, control } = form

  useEffect(() => {

    if ((user.role === ROLE.USER) && (id !== user.id)) {
      toast.error('You are not an Admin, please contact your administrator.')
      navigate('/');
      return
    }

    return () => { }
  }, [])



  const onSubmit = async (data: z.infer<typeof MahasiswaValidation>) => {

    await addMahasiswa({
      nama: data?.name,
      nim: data?.NIM
    }, {
      onSuccess() {
        toast.success('Success')
      },
    })

  }


  if (isUserLoading ) return <Loader color="lightgray" />;

  return (
    <Form {...form}>

      <div className="w-full max-w-xl flex flex-col mx-4 p-2">

        <h2 className="text-xl font-semibold md:h2-bold">Data Mahasiswa</h2>
        {/* <p className="text-light-3 text-xs md:base-regular mt-2">
          Update personal information to ensure smooth access to all features and services in IFCAbsence.
        </p> */}

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
                <FormDescription className="text-xs">Nama lengkap sesuai dengan identitas resmi.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={control}
            name="NIM"
            render={({ field }) => (
              <FormItem>
                <FormLabel>NIK</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    className="shad-input"
                  />
                </FormControl>
                <FormDescription className="text-xs">Nomor Induk Mahasiswa sesuai dengan data resmi</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

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
  );
};

export default Home2;
