import FileUploader from "@/components/shared/FileUploader";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/AuthContext";
import { RegisterFileUpload } from "@/lib/validation";
import { ROLE } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { lazy, Suspense, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";


const FaceCamera = lazy(() => import('@/components/shared/FaceCamera'));

const RegisterFace = () => {
  const { user, isLoading: isUserLoading } = useUserContext();
  const navigate = useNavigate()

  useEffect(() => {

    if (!isUserLoading && user && user.role !== ROLE.ADMIN) {
      toast.error('You are not an Admin, please contact your administrator.')
      navigate('/');
    }

  }, [user, isUserLoading, navigate]);

  const form = useForm<z.infer<typeof RegisterFileUpload>>({
    resolver: zodResolver(RegisterFileUpload),
    defaultValues: {
      file: [],
      fullName: '',
    },
  });
  const { handleSubmit, control, formState: { errors } } = form;


  const onSubmit = async (data: z.infer<typeof RegisterFileUpload>) => {
    // TODO
    console.log(data)
  }

  const onErr = async () => {
    // TODO
    console.log(errors)
  }

  return (
    <div className="py-4 w-full">
      <div className="px-4 pb-4">
        <span className='text-lg font-semibold '>
          Face Registration
        </span>
      </div>
      <Tabs defaultValue="upload" className="w-full flex flex-col justify-center items-center">
        <TabsList>
          <TabsTrigger value="upload">Upload Foto</TabsTrigger>
          <TabsTrigger value="scan">Scan Face</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" >
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit, onErr)}
            >
              <FormField
                control={control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="shad-form_label">Full Name</FormLabel>
                    <FormControl>
                      <Input type="text" className="shad-input" {...field} />
                    </FormControl>
                    <FormMessage className="shad-form_message" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="file"
                render={({ field }) => (
                  <FormItem className="w-full mt-2 px-20 flex flex-col justify-center items-center border rounded-lg shadow" >
                    <FormLabel className="text-lg">Face Photos</FormLabel>
                    <FormControl >
                      <FileUploader
                        fieldChange={field.onChange}
                        mediaUrl={undefined}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                // disabled={isCreatingPost || isLoadingUpdate}
                type="submit"
                className="capitalize whitespace-nowrap mt-2 w-full"
              >
                {/* {isCreatingPost || isLoadingUpdate ? (
              <div className="gap-2 flex justify-center items-center">
                <Loader /> Loading...
              </div>
            ) : (
              action
            )} */}
                Simpan
              </Button>

            </form>
          </Form>
        </TabsContent>
        <TabsContent value="scan">
          <Suspense fallback={<Loader color="lightgray" />}>
            <FaceCamera />
          </Suspense>
        </TabsContent>
      </Tabs>

    </div>
  )
}

export default RegisterFace