import {
  checkFaceDetection,
  detectManyFace,
  handleCapture,
  handleDrawCanvas,
} from "@/lib/actions/faceRecognitionAction";
import { useAddRecordAttendance } from "@/lib/react-query/absence/absenceQueries";
import { useGetAllFaces, useRecordUnknownFaces, useSaveFaceDescriptors } from "@/lib/react-query/face/faceQueries";
import { FaceData } from "@/types";
import * as faceapi from "face-api.js";
import { useCallback, useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { toast } from "sonner";
import { Button } from "../ui/button";
import Loader from "./Loader";

const FaceCam = ({ userId }: { userId?: string }) => {
  const videoRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const isScanPage = location.pathname === "/scan"

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedFace, setDetectedFace] = useState<Float32Array | null>(null);
  const [detectedPerson, setDetectedPerson] = useState<FaceData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isFaceSaved, setIsFaceSaved] = useState(false);
  const [facesData, setFacesData] = useState<FaceData[] | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [faceDetectCounter, setFaceDetectCounter] = useState(0);
  const [noFaceDetectCounter, setNoFaceDetectCounter] = useState(0);

  const { data: faces, isLoading, isSuccess } = useGetAllFaces();
  const { mutateAsync: saveFaces } = useSaveFaceDescriptors();
  const { mutateAsync: addRecordAtt } = useAddRecordAttendance();
  const { mutateAsync: recordUnknownFaces } = useRecordUnknownFaces()

  useEffect(() => {
    if (faces) setFacesData(faces);
  }, [faces, isLoading, isSuccess]);

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
        setModelsLoaded(true);
      } catch (err) {
        console.error("Failed to load models", err);
      }
    };

    loadModels();

    return () =>
      streamRef?.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        if (
          modelsLoaded &&
          !isDetecting &&
          videoRef.current?.video!.readyState == 4
        ) {
          handleDetectFace();
        }
      },
      detectedPerson?.name !== "" ? 500 : 250
    );

    return () => clearInterval(intervalId);
  }, [modelsLoaded, isDetecting]);

  const createNotes = (detectionResults: { person: FaceData | null, name: string }[]) => {
    const recognizedFaces = detectionResults.filter(result => result.person !== null);
    const unrecognizedCount = detectionResults.length - recognizedFaces.length;

    if (detectionResults.length === 1) {
      return "Wajah tidak dikenali";
    }

    let notes = "";

    // Add recognized faces
    recognizedFaces.forEach((face, index) => {
      if (index === 0) {
        notes += `Wajah dikenali (${face.name})`;
      } else if (index === recognizedFaces.length - 1 && unrecognizedCount === 0) {
        notes += `, dan ${face.name}`;
      } else {
        notes += `, ${face.name}`;
      }
    });

    // Add unrecognized faces if any
    if (unrecognizedCount > 0) {
      if (recognizedFaces.length > 0) {
        notes += ", dan wajah tidak dikenali";
      } else {
        notes = "Wajah tidak dikenali";
      }
    }

    return notes;
  };

  const handleDetectFace = useCallback(async () => {
    console.log("Detecting face");
    if (!videoRef.current || !canvasRef.current || isDetecting) return;

    setIsDetecting(true);

    const video = videoRef.current.video;
    const canvas = canvasRef.current;
    const displaySize = {
      width: video?.videoWidth!,
      height: video?.videoHeight!,
    };
    faceapi.matchDimensions(canvas, displaySize);

    if (video && canvas) {
      let detectionsManyFace = await detectManyFace(video);

      if (detectManyFace.length > 0) {
        const context = canvas.getContext("2d");
        context?.clearRect(0, 0, canvas.width, canvas.height);

        const detectionResults = [];

        for (const detections of detectionsManyFace) {
          if (detections) {
            setDetectedFace(detections.descriptor);

            const person = await checkFaceDetection(
              detections.descriptor,
              facesData
            );
            setDetectedPerson(person)

            const personName = person ? person.name : 'Tidak dikenali'
            detectionResults.push({ person, name: personName });

            if (isScanPage) {
              handleDrawCanvas(
                canvas,
                detections,
                displaySize,
                // isScanPage ? personName : 'Terdeteksi'
                personName
              )
            } else {
              handleDrawCanvas(
                canvas,
                detections,
                displaySize,
                'Terdeteksi'
                // personName
              )
            }
            if (person) {
              setFaceDetectCounter((prevCounter) => prevCounter + 1);

              if (faceDetectCounter + 1 >= 3) {
                handleAbsensi(person.userId!, new Date())
                setFaceDetectCounter(0);
              }
            } else {
              await handleCaptureImg()
              setNoFaceDetectCounter((prevCounter) => prevCounter + 1);

              // handleDrawCanvas(
              //   canvas,
              //   detections,
              //   displaySize,
              //   'Tidak dikenali'
              // )

              const notes = createNotes(detectionResults);
              console.log(notes)
              if (noFaceDetectCounter + 1 >= 3) {
                if (isScanPage) {
                  await recordUnknownFaces({
                    descriptor: detections.descriptor,
                    faceImage: imgSrc!,
                    timestamp: new Date(),
                    // notes: notes,
                    notes: ''
                  }, {
                    onSuccess() {
                      toast.info("Success save unknown face")
                    },
                  })
                  setNoFaceDetectCounter(0);
                }
              }

            }
          } else {
            setDetectedFace(null);
            setFaceDetectCounter(0);
            toast("No face detected. Please face the camera.");
          }
        }
      } else {
        toast("No face detected. Please face the camera.");
      }
    }

    setIsDetecting(false);
  }, [detectedFace,
    detectedPerson,
    faceDetectCounter,
    facesData,
    isDetecting,
    isScanPage,
    noFaceDetectCounter
  ]);

  const handleSaveFace = async () => {
    console.log({ userId })
    if (!userId) {
      toast.error("Please select employee to save the face");
      return
    }

    if (detectedFace && !isFaceSaved) {
      await saveFaces({
        userId: userId,
        descriptor: detectedFace
      });
      setIsFaceSaved(true);
      toast.success("Face saved successfully!");
    } else {
      toast.error("No face detected to save.");
    }
  };

  const handleCaptureImg = async () => {
    setImgSrc(await handleCapture(videoRef, canvasRef));
  };

  const handleAbsensi = async (userId: string, time: Date) => {
    if (isScanPage) {

      await addRecordAtt(
        {
          userId,
          time,
        },
        {
          onSuccess(data) {
            if (!data) return;
            toast.success("Absensi dilakukan secara otomatis!");
          },
        }
      );

      setFaceDetectCounter(0);
    }
  };

  if (!modelsLoaded || isLoading) {
    return <Loader color="lightgray" />
  }

  return (
    <div className="max-h-screen max-w-screen flex flex-col justify-center items-center">
      <h1>Face Recognition</h1>
      <div>
        {isScanPage && <p>Recognized: {detectedPerson?.name}</p>}
        {/* <p>Counter: {faceDetectCounter}</p> */}
      </div>

      <div className="relative justify-center items-center w-full mb-5">
        <Webcam
          ref={videoRef}
          // onPlay={handleDetectFace}
          autoPlay
          onLoadedData={handleDetectFace}
          width={240}
          height={320}
          className="w-full h-auto max-w-full aspect-ratio-[3/4] md:max-w-lg md:h-auto rounded"
          videoConstraints={{
            facingMode: "environment",
            aspectRatio: 3 / 4,
            // width: 240,
            // height: 320
          }}
        />
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="absolute top-0 left-0 z-[2]"
        />
      </div>

      <div className="flex justify-center items-center mt-5 space-x-4 z-10">
        {!isScanPage && <Button
          size="lg"
          className={`p-5 text-lg rounded-lg ${isFaceSaved
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-gray-900 hover:scale-105 active:scale-95 transition transform outline outline-dark-4 outline-1"
            } text-white`}
          onClick={handleSaveFace}
          disabled={isFaceSaved}
        >
          Save Face
        </Button>}

        {/* <Button
          className="p-5 text-lg rounded-lg bg-gray-900 hover:scale-105 active:scale-95 transition transform text-white ml-4  outline outline-dark-4 outline-1"
          size="lg"
          onClick={handleDetectFace}
        >
          Scan Face Now
        </Button>

        <Button
          className="p-5 text-lg rounded-lg bg-gray-900 hover:scale-105 active:scale-95 transition transform text-white ml-4  outline outline-dark-4 outline-1"
          size="lg"
          onClick={handleCaptureImg}
        >
          Capture
        </Button> */}
      </div>

      {/* {imgSrc ? <img src={imgSrc} width={200} height={200} /> : <></>} */}
    </div>
  );
};

export default FaceCam;
