import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui/button";
import { toast } from "../ui/use-toast";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl?: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [fileUrl, setFileUrl] = useState(mediaUrl);
  const [file, setFile] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpeg", ".jpg", ".svg"],
    },
    onError() {
      toast({ title: "Failed to upload image." });
    },
  });

  return (
    <div
      {...getRootProps()}
      className="flex flex-col items-center justify-center cursor-pointer bg-dark-3 rounded-xl"
    >
      <input {...getInputProps()} className="cursor-pointer" />
      {fileUrl ? (
        <>
          <div className="flex justify-center flex-1 w-full p-5 lg:p-10">
            <img
              src={fileUrl}
              alt="upload-image"
              className="h-80 lg:h-[480px] w-full rounded-lg object-cover object-top"
            />
          </div>
          <p className="w-full p-4 text-center border-t text-muted-foreground small-regular border-t-dark-4">
            Click or drag photo to replace
          </p>
        </>
      ) : (
        <div className="flex justify-center items-center flex-col p-7 h-80 lg:h-[612px]">
          <img
            src="/assets/icons/file-upload.svg"
            alt="upload"
            width={96}
            height={72}
          />

          <h3 className="mt-6 mb-2 base-medium text-muted-foreground">
            Drag photo here
          </h3>
          <p className="mb-6 text-xs text-muted-foreground">
            jpg, jpeg, png, svg
          </p>

          <Button variant="secondary">Select from computer</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
