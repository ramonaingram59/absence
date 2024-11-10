import { FaceData } from "@/types";
import * as faceapi from "face-api.js";
import { RefObject } from "react";
import Webcam from "react-webcam";

export const detectSingleFace = async (video: HTMLVideoElement) => {
  let detection = await faceapi
    .detectSingleFace(video)
    .withFaceLandmarks()
    .withFaceDescriptor();

  return detection;
};

export const detectManyFace = async (video: HTMLVideoElement) => {
  const detectionsManyFace = await faceapi
    .detectAllFaces(video)
    .withFaceLandmarks()
    .withFaceDescriptors();

  return detectionsManyFace;
};

export const checkFaceDetection = async (
  descriptor: Float32Array,
  facesData: FaceData[] | null
): Promise<FaceData | null> => {
  let bestMatch: FaceData | null = null;
  let smallestDistance = Infinity;

  facesData?.forEach((face: FaceData) => {
    const savedDescriptor = new Float32Array(
      JSON.parse(face.descriptor as string)
    );

    const distance = faceapi.euclideanDistance(descriptor, savedDescriptor);

    if (distance < smallestDistance) {
      smallestDistance = distance;
      bestMatch = face;
    }
  });

  const THRESHOLD = 0.5;
  if (smallestDistance < THRESHOLD && bestMatch) {
    return bestMatch;
  } else {
    return null;
  }
};

export const handleDrawCanvas = (
  canvas: HTMLCanvasElement,
  detections: any,
  displaySize: { width: number; height: number },
  personName: string
) => {
  const resizedDetections = faceapi.resizeResults(detections, displaySize);
  const context = canvas.getContext("2d");
  context?.clearRect(0, 0, canvas.width, canvas.height);

  faceapi.draw.drawDetections(canvas, resizedDetections);

  const { box } = resizedDetections.detection;
  const text = personName ? personName : "Tidak dikenali";
  new faceapi.draw.DrawTextField([text], box.bottomLeft, { fontSize: 12 }).draw(
    canvas
  );
};

export const handleCapture = (videoRef: RefObject<Webcam>) => {
  let imageBlob = videoRef?.current?.getScreenshot() ?? null;

  return imageBlob;
};
