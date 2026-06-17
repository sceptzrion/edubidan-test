import { Resend } from "resend";

import {
  getAccountCreatedEmailTemplate,
  getAdminResetPasswordEmailTemplate,
  getForgotPasswordOtpEmailTemplate,
  getRegisterSuccessEmailTemplate,
} from "@/services/email/email-templates";

type SendEmailResult =
  | {
      success: true;
      skipped: false;
      id: string | null;
      error: null;
    }
  | {
      success: true;
      skipped: true;
      id: null;
      error: null;
    }
  | {
      success: false;
      skipped: false;
      id: null;
      error: string;
    };

type SendEmailParams = {
  to: string;
  subject: string;
  html: string;
};

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_FROM = process.env.EMAIL_FROM || "EduBidan <noreply@edubidan.local>";
const APP_URL = process.env.APP_URL || "http://localhost:3000";

const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function sendEmail({
  to,
  subject,
  html,
}: SendEmailParams): Promise<SendEmailResult> {
  if (!resend) {
    console.info("[email:skipped]", {
      reason: "RESEND_API_KEY is not configured",
      to,
      subject,
    });

    return {
      success: true,
      skipped: true,
      id: null,
      error: null,
    };
  }

  try {
    const result = await resend.emails.send({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    });

    if (result.error) {
      return {
        success: false,
        skipped: false,
        id: null,
        error: result.error.message,
      };
    }

    return {
      success: true,
      skipped: false,
      id: result.data?.id ?? null,
      error: null,
    };
  } catch (error) {
    return {
      success: false,
      skipped: false,
      id: null,
      error:
        error instanceof Error
          ? error.message
          : "Unknown email service error",
    };
  }
}

export async function sendRegisterSuccessEmail(params: {
  to: string;
  name: string;
  email: string;
}) {
  const template = getRegisterSuccessEmailTemplate({
    name: params.name,
    email: params.email,
    appUrl: APP_URL,
  });

  return sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAccountCreatedEmail(params: {
  to: string;
  name: string;
  email: string;
  password?: string;
  createdByAdmin?: boolean;
}) {
  const template = getAccountCreatedEmailTemplate({
    name: params.name,
    email: params.email,
    password: params.password,
    createdByAdmin: params.createdByAdmin ?? true,
    appUrl: APP_URL,
  });

  return sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendForgotPasswordOtpEmail(params: {
  to: string;
  name: string;
  otpCode: string;
  expiresInMinutes: number;
}) {
  const template = getForgotPasswordOtpEmailTemplate({
    name: params.name,
    otpCode: params.otpCode,
    expiresInMinutes: params.expiresInMinutes,
    appUrl: APP_URL,
  });

  return sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
  });
}

export async function sendAdminResetPasswordEmail(params: {
  to: string;
  name: string;
  email: string;
  temporaryPassword: string;
}) {
  const template = getAdminResetPasswordEmailTemplate({
    name: params.name,
    email: params.email,
    temporaryPassword: params.temporaryPassword,
    appUrl: APP_URL,
  });

  return sendEmail({
    to: params.to,
    subject: template.subject,
    html: template.html,
  });
}