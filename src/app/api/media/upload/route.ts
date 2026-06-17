import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

import {
  getCloudinaryRootFolder,
  uploadBufferToCloudinary,
} from "@/services/media/cloudinary.service";
import { getCurrentSessionUser } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type UploadPurpose = "avatar" | "module-banner" | "question-image";

type UploadConfig = {
  folder: string;
  allowedMimeTypes: string[];
  maxSizeBytes: number;
  allowedRoles: Role[];
};

const uploadConfigs: Record<UploadPurpose, UploadConfig> = {
  avatar: {
    folder: "avatars",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSizeBytes: 2 * 1024 * 1024,
    allowedRoles: [Role.ADMIN, Role.DOSEN, Role.MAHASISWA],
  },
  "module-banner": {
    folder: "modules",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSizeBytes: 5 * 1024 * 1024,
    allowedRoles: [Role.DOSEN],
  },
  "question-image": {
    folder: "questions",
    allowedMimeTypes: ["image/jpeg", "image/png", "image/webp"],
    maxSizeBytes: 5 * 1024 * 1024,
    allowedRoles: [Role.DOSEN],
  },
};

function isUploadPurpose(value: unknown): value is UploadPurpose {
  return (
    value === "avatar" ||
    value === "module-banner" ||
    value === "question-image"
  );
}

function getFriendlyUploadError(message: string) {
  const messages: Record<string, string> = {
    "Authentication required": "Sesi login sudah berakhir. Silakan login ulang.",
    "Invalid upload purpose": "Tujuan upload media tidak valid.",
    "File is required": "File wajib dipilih.",
    "Invalid file type":
      "Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.",
    "File is too large": "Ukuran file terlalu besar.",
    "Upload permission denied": "Anda tidak memiliki akses untuk upload media ini.",
    "Cloudinary configuration is missing":
      "Konfigurasi Cloudinary belum lengkap di environment.",
  };

  return messages[message] ?? "Upload media gagal. Silakan coba lagi.";
}

function isCloudinaryEnvMissing(error: unknown) {
  return (
    error instanceof Error &&
    (error.message.includes("CLOUDINARY_CLOUD_NAME") ||
      error.message.includes("CLOUDINARY_API_KEY") ||
      error.message.includes("CLOUDINARY_API_SECRET"))
  );
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentSessionUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: getFriendlyUploadError("Authentication required"),
          data: null,
        },
        {
          status: 401,
        }
      );
    }

    const formData = await request.formData();
    const purpose = formData.get("purpose");
    const file = formData.get("file");

    if (!isUploadPurpose(purpose)) {
      return NextResponse.json(
        {
          success: false,
          message: getFriendlyUploadError("Invalid upload purpose"),
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const config = uploadConfigs[purpose];

    if (!config.allowedRoles.includes(currentUser.role)) {
      return NextResponse.json(
        {
          success: false,
          message: getFriendlyUploadError("Upload permission denied"),
          data: null,
        },
        {
          status: 403,
        }
      );
    }

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: getFriendlyUploadError("File is required"),
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (!config.allowedMimeTypes.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: getFriendlyUploadError("Invalid file type"),
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    if (file.size > config.maxSizeBytes) {
      return NextResponse.json(
        {
          success: false,
          message: getFriendlyUploadError("File is too large"),
          data: null,
        },
        {
          status: 400,
        }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const rootFolder = getCloudinaryRootFolder();
    const folder = `${rootFolder}/${config.folder}`;

    const uploadResult = await uploadBufferToCloudinary({
      buffer,
      folder,
      resourceType: "image",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Media berhasil diupload.",
        data: {
          purpose,
          url: uploadResult.secure_url,
          secureUrl: uploadResult.secure_url,
          publicId: uploadResult.public_id,
          width: uploadResult.width,
          height: uploadResult.height,
          format: uploadResult.format,
          bytes: uploadResult.bytes,
          resourceType: uploadResult.resource_type,
          originalFilename: file.name,
        },
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST /api/media/upload error:", error);

    const message = isCloudinaryEnvMissing(error)
      ? getFriendlyUploadError("Cloudinary configuration is missing")
      : getFriendlyUploadError("Upload failed");

    return NextResponse.json(
      {
        success: false,
        message,
        data: null,
      },
      {
        status: 500,
      }
    );
  }
}