import { Role } from "@prisma/client";
import { NextResponse } from "next/server";

import { getCurrentSessionUser } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parsePositiveId(value: string) {
  const id = Number(value);

  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }

  return id;
}

export async function PATCH(_request: Request, context: RouteContext) {
  try {
    const currentUser = await getCurrentSessionUser();

    if (!currentUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required",
          data: null,
        },
        { status: 401 }
      );
    }

    if (currentUser.role !== Role.MAHASISWA) {
      return NextResponse.json(
        {
          success: false,
          message: "Only mahasiswa can leave modules",
          data: null,
        },
        { status: 403 }
      );
    }

    const { id } = await context.params;
    const moduleId = parsePositiveId(id);

    if (!moduleId) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid module id",
          data: null,
        },
        { status: 400 }
      );
    }

    const moduleData = await prisma.module.findUnique({
      where: {
        id: moduleId,
      },
      select: {
        id: true,
        title: true,
      },
    });

    if (!moduleData) {
      return NextResponse.json(
        {
          success: false,
          message: "Module not found",
          data: null,
        },
        { status: 404 }
      );
    }

    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_moduleId: {
          userId: currentUser.id,
          moduleId,
        },
      },
      select: {
        id: true,
        isKicked: true,
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        {
          success: false,
          message: "Enrollment not found",
          data: null,
        },
        { status: 404 }
      );
    }

    if (enrollment.isKicked) {
      return NextResponse.json(
        {
          success: false,
          message: "Enrollment already inactive",
          data: null,
        },
        { status: 409 }
      );
    }

    const updatedEnrollment = await prisma.enrollment.update({
      where: {
        id: enrollment.id,
      },
      data: {
        isKicked: true,
        kickReason: "Mahasiswa keluar dari modul secara mandiri.",
      },
      select: {
        id: true,
        moduleId: true,
        userId: true,
        isKicked: true,
        kickReason: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Module left successfully",
      data: {
        enrollment: updatedEnrollment,
        module: moduleData,
      },
    });
  } catch (error) {
    console.error("PATCH /api/modules/[id]/leave error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to leave module",
        data: null,
      },
      { status: 500 }
    );
  }
}