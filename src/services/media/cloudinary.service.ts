import { v2 as cloudinary, type UploadApiResponse } from "cloudinary";

type CloudinaryResourceType = "image" | "video" | "raw";

type UploadBufferParams = {
  buffer: Buffer;
  folder: string;
  resourceType?: CloudinaryResourceType;
};

let isCloudinaryConfigured = false;

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}

function configureCloudinary() {
  if (isCloudinaryConfigured) return;

  cloudinary.config({
    cloud_name: getRequiredEnv("CLOUDINARY_CLOUD_NAME"),
    api_key: getRequiredEnv("CLOUDINARY_API_KEY"),
    api_secret: getRequiredEnv("CLOUDINARY_API_SECRET"),
    secure: true,
  });

  isCloudinaryConfigured = true;
}

export function getCloudinaryRootFolder() {
  return process.env.CLOUDINARY_UPLOAD_FOLDER || "edubidan";
}

export function uploadBufferToCloudinary({
  buffer,
  folder,
  resourceType = "image",
}: UploadBufferParams): Promise<UploadApiResponse> {
  configureCloudinary();

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
        unique_filename: true,
        overwrite: false,
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload failed"));
          return;
        }

        resolve(result);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function deleteCloudinaryAsset(
  publicId: string,
  resourceType: CloudinaryResourceType = "image"
) {
  configureCloudinary();

  return cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
}