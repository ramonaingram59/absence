import { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { FaceData } from "@/types";
import Webcam from "react-webcam";
import {
  checkFaceDetection,
  detectManyFace,
  handleCapture,
  handleDrawCanvas,
} from "@/lib/actions/faceRecognitionAction";
import { useAddRecordAttendance } from "@/lib/react-query/absence/absenceQueries";
import { useGetAllFaces, useSaveFaceDescriptors } from "@/lib/react-query/face/faceQueries";
import Loader from "./Loader";

const FaceCam = () => {
  const videoRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedFace, setDetectedFace] = useState<Float32Array | null>(null);
  const [detectedPerson, setDetectedPerson] = useState<FaceData | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isFaceSaved, setIsFaceSaved] = useState(false);
  const [facesData, setFacesData] = useState<FaceData[] | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [faceDetectCounter, setFaceDetectCounter] = useState(0);

  const { data: faces, isLoading, isSuccess } = useGetAllFaces();
  const { mutateAsync: saveFaces } = useSaveFaceDescriptors();
  const { mutateAsync: addRecordAtt } = useAddRecordAttendance();

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

      detectionsManyFace.forEach(async (detections) => {
        if (detections) {
          setDetectedFace(detections.descriptor);

          const person = await checkFaceDetection(
            detections.descriptor,
            facesData
          );
          setDetectedPerson(person)

          if (detectedPerson) {
            handleDrawCanvas(canvas, detections, displaySize, detectedPerson?.name);
            setFaceDetectCounter((prevCounter) => prevCounter + 1);

            if (faceDetectCounter + 1 >= 3) {
              handleAbsensi(detectedPerson.userId!, new Date());
            }
          }
        } else {
          setDetectedFace(null);
          setFaceDetectCounter(0);
          toast("No face detected. Please face the camera.");
        }
      });
    }

    setIsDetecting(false);
  }, [detectedFace]);

  const handleSaveFace = async () => {
    if (detectedFace && !isFaceSaved) {
      await saveFaces({
        userId: detectedPerson?.userId!,
        descriptor: detectedFace
      });
      setIsFaceSaved(true);
      toast.success("Face saved successfully!");
    } else {
      toast.error("No face detected to save.");
    }
  };

  const handleCaptureImg = () => {
    setImgSrc(handleCapture(videoRef));
  };

  const handleAbsensi = async (userId: string, time: Date) => {
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
  };

  if (!modelsLoaded || isLoading) {
    return <Loader color="lightgray" />
  }

  return (
    <div className="max-h-screen max-w-screen flex flex-col justify-center items-center">
      <h1>Face Recognition</h1>
      <div>
        <p>Recognized: {detectedPerson?.name}</p>
        <p>Counter: {faceDetectCounter}</p>
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
            facingMode: "user",
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
        <Button
          size="lg"
          className={`p-5 text-lg rounded-lg ${isFaceSaved
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900 hover:scale-105 active:scale-95 transition transform outline outline-dark-4 outline-1"
            } text-white`}
          onClick={handleSaveFace}
          disabled={isFaceSaved}
        >
          Save Face
        </Button>

        <Button
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
        </Button>
      </div>

      {imgSrc ? <img src={imgSrc} width={200} height={200} /> : <></>}
    </div>
  );
};

export default FaceCam;
