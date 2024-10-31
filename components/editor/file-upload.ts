import { createImageUpload } from "novel/plugins";
import { toast } from "sonner";
import {acceptedTypes, acceptedImageTypes} from '@/lib/config/constant/acceptedTypes'


const onUpload = (file: File) => {
  const promise = fetch("/api/upload", {
    method: "POST",
    headers: {
      "content-type": file?.type || "application/octet-stream",
      "x-vercel-filename": file?.name || "file",
    },
    body: file,
  });

  return new Promise((resolve, reject) => {
    toast.promise(
      promise.then(async (res) => {
        // Successfully uploaded image
        if (res.status === 200) {
          const { url } = (await res.json()) as { url: string };
          console.log(url);
          resolve(url);
          // No blob store configured
        } else if (res.status === 401) {
          resolve(file);
          throw new Error("`FILE_READ_WRITE_TOKEN` environment variable not found, reading file locally instead.");
          // Unknown error
        } else {
          throw new Error("Error uploading file. Please try again.");
        }
      }),
      {
        loading: "Uploading file...",
        success: "File uploaded successfully.",
        error: (e) => {
          reject(e);
          return e.message;
        },
      },
    );
  });
};

export const uploadFileFn = createImageUpload({
  onUpload,
  validateFn: (file) => {
    if (!file.type.includes("csv")) {
      toast.error(`File type not supported. File type ${file.type}`);
      return false;
    }
    if (file.size / 1024 / 1024 > 20) {
      toast.error("File size too big (max 20MB).");
      return false;
    }
    return true;
  },
});