import FileUploader from "@/components/shared/FileUploader";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserContext } from "@/context/AuthContext";
import { detectSingleFace, handleDrawCanvas } from "@/lib/actions/faceRecognitionAction";
import { useGetAllUsers } from "@/lib/react-query/auth/authQueries";
import { useSaveFaceDescriptors } from "@/lib/react-query/face/faceQueries";
import { RegisterFileUpload } from "@/lib/validation";
import { ROLE } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { lazy, Suspense, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { z } from "zod";
import * as faceapi from "face-api.js";


const FaceCamera = lazy(() => import('@/components/shared/FaceCamera'));

const RegisterFace = () => {
  const isSubmitting = false
  const navigate = useNavigate()
  const imageRef = useRef<HTMLImageElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const { user, isLoading: isUserLoading } = useUserContext();
  const { data: allUsers, isLoading: isAllUsersLoading } = useGetAllUsers()
  const { mutateAsync: saveFaces } = useSaveFaceDescriptors();

  const form = useForm<z.infer<typeof RegisterFileUpload>>({
    resolver: zodResolver(RegisterFileUpload),
    defaultValues: {
      file: [],
      userId: '',
    },
  });
  const { handleSubmit, control, reset } = form;

  useEffect(() => {

    if (!isUserLoading && user && user.role !== ROLE.ADMIN) {
      toast.error('You are not an Admin, please contact your administrator.')
      navigate('/');
    }

  }, [user, isUserLoading, navigate]);

  useEffect(() => {
    const loadModels = async () => {
      try {
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri("/models"),
          faceapi.nets.faceRecognitionNet.loadFromUri("/models"),
          faceapi.nets.faceLandmark68Net.loadFromUri("/models"),
          // faceapi.nets.faceExpressionNet.loadFromUri("/models"),
          // faceapi.nets.mtcnn.loadFromUri("/models"),
        ]);
        console.log('Models loaded')
      } catch (err) {
        console.error("Failed to load models", err);
      }
    };

    loadModels();

    return () => { }
  }, []);


  const onSubmit = async (data: z.infer<typeof RegisterFileUpload>) => {

    if (data.file.length === 0) {
      toast.error("Please upload an image.")
      return
    }

    if (imageRef.current) {
      let detections = await detectSingleFace(imageRef?.current);


      if (!detections) {
        toast.info("No face detected.");
        console.log('No Face detected')
      } else {
        console.log(detections.descriptor)

        let canvas = canvasRef.current

        if (!canvas) return

        const displaySize = {
          width: imageRef?.current.width,
          height: imageRef?.current.height,
        };
        faceapi.matchDimensions(canvas, displaySize);

        handleDrawCanvas(canvas, detections, displaySize, 'Wajah terdeteksi');

        // await saveFaces({
        //   userId: data.userId,
        //   descriptor: detections?.descriptor
        // },
        //   {
        //     onSuccess() {
        //       toast.success("Success save face.")
        //       navigate('/settings')
        //     },
        //   }
        // )

      }



    }

    // console.log(data)
  }

  const onErr = async (data: any) => {
    // TODO
    console.log(data)
  }

  if (isAllUsersLoading || isUserLoading) return <Loader color="lightgray" />

  return (
    <div className="py-4 w-full">
      <div className="px-4 pb-4">
        <span className='text-lg font-semibold '>
          Face Registration
        </span>
      </div>
      <Tabs defaultValue="upload" className="w-full flex flex-col justify-center items-center"
        onValueChange={() => reset()}
      >
        <TabsList>
          <TabsTrigger value="upload">Upload Foto</TabsTrigger>
          <TabsTrigger value="scan">Scan Face</TabsTrigger>
        </TabsList>
        <TabsContent value="upload">
          <Form {...form}>
            <form
              onSubmit={handleSubmit(onSubmit, onErr)}
            >
              <FormField
                control={control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Karyawan</FormLabel>
                    <Select onValueChange={field.onChange}
                      defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder="Pilih karyawan"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {
                          allUsers?.map((item, index) => (
                            <SelectItem
                              value={item.id}
                              key={index}
                              className="capitalize"
                            >
                              {item.name}
                            </SelectItem>
                          ))
                        }
                      </SelectContent>
                    </Select>
                    <FormDescription className="text-xs">Pilih karyawan untuk disimpan wajahnya ke dalam sistem.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="file"
                render={({ field }) => (
                  <FormItem className="w-full mt-2 px-20 flex flex-col justify-center items-center border rounded-lg shadow relative" >
                    <FormLabel className="text-lg">Face Photos</FormLabel>
                    <FormControl >
                      <FileUploader
                        ref={imageRef}
                        fieldChange={field.onChange}
                        mediaUrl={undefined}
                      />
                    </FormControl>
                    <canvas
                      ref={canvasRef}
                      width={imageRef.current?.width}
                      height={imageRef.current?.height}
                      className="absolute"
                      style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
                    />
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <Button
                disabled={isSubmitting}
                type="submit"
                className="capitalize whitespace-nowrap mt-2 w-full"
              >
                {isSubmitting ? (
                  <div className="gap-2 flex justify-center items-center">
                    <Loader /> Loading...
                  </div>
                ) : <></>}
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