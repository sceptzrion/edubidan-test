import { NextResponse } from "next/server";

import { createDemoAccount } from "@/services/demo-account.service";

export const runtime = "nodejs";

type DemoAccountRequest = {
  role?: string;
};

export async function POST(request: Request) {
  try {
    if (process.env.DEMO_ACCOUNT_ENABLED !== "true") {
      return NextResponse.json(
        {
          success: false,
          message: "Fitur akun demo sedang tidak aktif.",
          data: null,
        },
        { status: 403 }
      );
    }

    const body = (await request.json()) as DemoAccountRequest;
    const role = body.role;

    if (role !== "MAHASISWA" && role !== "DOSEN") {
      return NextResponse.json(
        {
          success: false,
          message: "Role demo tidak valid.",
          data: null,
        },
        { status: 400 }
      );
    }

    const account = await createDemoAccount(role);

    return NextResponse.json({
      success: true,
      message: "Akun demo berhasil dibuat.",
      data: account,
    });
  } catch (error) {
    console.error("Generate demo account error:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Gagal membuat akun demo.",
        data: null,
      },
      { status: 500 }
    );
  }
}