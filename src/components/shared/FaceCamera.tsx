import { useCallback, useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { FaceData } from "@/types";
import {
  useGetAllFaces,
  useSaveFaceDescriptors,
} from "@/lib/react-query/queriesAndMutations";
import Webcam from "react-webcam";
import { checkFaceDetection, detectManyFace, detectSingleFace, handleCapture, handleDrawCanvas } from "@/lib/actions/faceRecognitionAction";



const FaceCam = () => {
  const videoRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  // const videoRef2 = useRef<HTMLImageElement | null>(null);
  // const canvasRef2 = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [detectedFace, setDetectedFace] = useState<Float32Array | null>(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const [isFaceSaved, setIsFaceSaved] = useState(false);
  const [facesData, setFacesData] = useState<FaceData[] | null>(null);
  const [imgSrc, setImgSrc] = useState<string | null>(null);
  let personName: string = ''

  const { data: faces, isLoading, isSuccess } = useGetAllFaces();
  const { mutateAsync: saveFaces } = useSaveFaceDescriptors();

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

    return () => streamRef?.current?.getTracks().forEach((track) => track.stop());
  }, []);

  useEffect(() => {
    const intervalId = setInterval(
      () => {
        if (modelsLoaded && !isDetecting && videoRef.current?.video!.readyState == 4) {
          handleDetectFace();
        }
      },
      personName !== "" ? 1000 : 250
    ); // Detect face every 500

    return () => clearInterval(intervalId); // Clean up the interval on unmount
  }, [modelsLoaded, isDetecting]);


  // useEffect(() => {
  //   const initializeWebcam = async () => {
  //     if (modelsLoaded && navigator.mediaDevices.getUserMedia) {
  //       try {
  //         const stream = await navigator.mediaDevices.getUserMedia({
  //           video: {},
  //         });
  //         if (videoRef.current) {
  //           videoRef.current.srcObject = stream;
  //           streamRef.current = stream;
  //         }
  //       } catch (err) {
  //         console.error("Error accessing webcam: ", err);
  //       }
  //     }
  //   };

  //   initializeWebcam();
  // }, [modelsLoaded]);


  const handleDetectFace = useCallback(async () => {
    console.log('Detecting face')
    if (!videoRef.current || !canvasRef.current || isDetecting) return

    setIsDetecting(true);

    const video = videoRef.current.video;
    const canvas = canvasRef.current;
    const displaySize = { width: video?.videoWidth!, height: video?.videoHeight! };
    faceapi.matchDimensions(canvas, displaySize);

    if (video && canvas) {

      let detectionsManyFace = await detectManyFace(video)

      detectionsManyFace.forEach(async (detections) => {
        if (detections) {
          setDetectedFace(detections.descriptor);
          personName = await checkFaceDetection(detections.descriptor, facesData);
          handleDrawCanvas(canvas, detections, displaySize, personName)

        } else {
          console.warn("No detections");
        }

      });

      // #### For Single detection face ####
      // let detections = await detectSingleFace(video)
      // if (detections) {
      //   setDetectedFace(detections.descriptor);
      //   personName = await checkFaceDetection(detections.descriptor, facesData);
      //   handleDrawCanvas(canvas, detections, displaySize, personName)
      // } else {
      //   console.warn("No detections");
      // }
    }

    setIsDetecting(false)
  }, [detectedFace]);



  const handleSaveFace = async () => {
    if (detectedFace && !isFaceSaved) {
      await saveFaces(detectedFace);
      setIsFaceSaved(true);
      toast.success("Face saved successfully!");
    } else {
      toast.error("No face detected to save.");
    }
  };

  if (videoRef.current && videoRef?.current?.video?.readyState == 4) {
    const video = videoRef.current;
    // Proceed with detection
    console.log(video, "video");
  } else {
    console.warn("Webcam not ready for detection");
  }

  const handleCaptureImg = () => {
    setImgSrc(handleCapture(videoRef))
  }


  return (
    <div className="max-h-screen max-w-screen flex flex-col justify-center items-center">
      <h1>Face Recognition</h1>
      <div>
        <p>Recognized: {personName}</p>
      </div>


      {/* Kamera dan Canvas untuk Face Recognition */}
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
        {/* <Camera
          ref={videoRef}
          errorMessages={{}}
          // onCameraStart={() => { detectFace }}
        /> */}

        {/* <video
          ref={videoRef}
          autoPlay
          muted
          width={320}
          height={240}
          className="relative z-[1]"
        /> */}
        <canvas
          ref={canvasRef}
          width={320}
          height={240}
          className="absolute top-0 left-0 z-[2]"
        />
      </div>

      {/* Image dan Canvas tambahan */}
      {/* <div className="relative mb-5">
        <img
          ref={videoRef2}
          width={50}
          height={50}
          style={{ position: "relative", zIndex: 1 }}
          src="/assets/ifca.jpeg"
        />
        <canvas
          ref={canvasRef2}
          width={50}
          height={50}
          className="absolute "
          style={{ position: "absolute", top: 0, left: 0, zIndex: 2 }}
        />
      </div> */}

      {/* Button Section with Flexbox */}
      <div className="flex justify-center items-center mt-5 space-x-4 z-10">
        <Button
          size="lg"
          className={`p-5 text-lg rounded-lg ${isFaceSaved
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gray-900 hover:scale-105 active:scale-95 transition transform outline outline-dark-4 outline-1'
            } text-white`}
          onClick={handleSaveFace}
          disabled={isFaceSaved}
        >
          Save Face
        </Button>

        <Button
          className="p-5 text-lg rounded-lg bg-gray-900 hover:scale-105 active:scale-95 transition transform text-white ml-4  outline outline-dark-4 outline-1"
          size="lg"
          onClick={handleDetectFace}>
          Scan Face Now
        </Button>

        <Button
          className="p-5 text-lg rounded-lg bg-gray-900 hover:scale-105 active:scale-95 transition transform text-white ml-4  outline outline-dark-4 outline-1"
          size="lg"
          onClick={handleCaptureImg}>
          Capture
        </Button>
      </div>

      {imgSrc ?
        <img
          src={imgSrc}
          width={200}
          height={200}
        />
        :
        <>
        </>
      }

    </div>
  );
};

export default FaceCam;
