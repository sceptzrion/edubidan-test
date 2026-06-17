type BaseEmailTemplateParams = {
  appUrl?: string;
};

type AccountCreatedEmailParams = BaseEmailTemplateParams & {
  name: string;
  email: string;
  password?: string;
  createdByAdmin?: boolean;
};

type RegisterSuccessEmailParams = BaseEmailTemplateParams & {
  name: string;
  email: string;
};

type ForgotPasswordOtpEmailParams = BaseEmailTemplateParams & {
  name: string;
  otpCode: string;
  expiresInMinutes: number;
};

type AdminResetPasswordEmailParams = BaseEmailTemplateParams & {
  name: string;
  email: string;
  temporaryPassword: string;
};

function getButtonHtml(label: string, href: string) {
  return `
    <a href="${href}" style="
      display: inline-block;
      padding: 12px 18px;
      background: #0f766e;
      color: #ffffff;
      border-radius: 12px;
      text-decoration: none;
      font-weight: 700;
      font-size: 14px;
    ">
      ${label}
    </a>
  `;
}

function getEmailLayout(params: {
  title: string;
  preview: string;
  content: string;
}) {
  return `
    <!doctype html>
    <html lang="id">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>${params.title}</title>
      </head>
      <body style="
        margin: 0;
        padding: 0;
        background: #f8fafc;
        font-family: Arial, sans-serif;
        color: #0f172a;
      ">
        <div style="display: none; max-height: 0; overflow: hidden;">
          ${params.preview}
        </div>

        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background: #f8fafc; padding: 32px 16px;">
          <tr>
            <td align="center">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="
                max-width: 560px;
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 20px;
                overflow: hidden;
              ">
                <tr>
                  <td style="padding: 24px 28px; background: #0f766e;">
                    <h1 style="margin: 0; color: #ffffff; font-size: 22px; line-height: 1.3;">
                      EduBidan
                    </h1>
                    <p style="margin: 6px 0 0; color: #ccfbf1; font-size: 13px;">
                      Platform LMS Kebidanan Digital
                    </p>
                  </td>
                </tr>

                <tr>
                  <td style="padding: 28px;">
                    ${params.content}
                  </td>
                </tr>

                <tr>
                  <td style="padding: 20px 28px; border-top: 1px solid #e2e8f0; background: #f8fafc;">
                    <p style="margin: 0; color: #64748b; font-size: 12px; line-height: 1.6;">
                      Email ini dikirim otomatis oleh sistem EduBidan. Abaikan email ini jika Anda merasa tidak melakukan aktivitas terkait.
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}

export function getRegisterSuccessEmailTemplate({
  name,
  email,
  appUrl = "http://localhost:3000",
}: RegisterSuccessEmailParams) {
  return {
    subject: "Pendaftaran Akun EduBidan Berhasil",
    html: getEmailLayout({
      title: "Pendaftaran Akun EduBidan Berhasil",
      preview: "Akun EduBidan Anda berhasil dibuat.",
      content: `
        <h2 style="margin: 0 0 12px; font-size: 20px;">Halo, ${name}</h2>

        <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">
          Pendaftaran akun EduBidan Anda berhasil. Anda sekarang dapat masuk menggunakan email berikut:
        </p>

        <div style="margin: 18px 0; padding: 16px; background: #f1f5f9; border-radius: 14px;">
          <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 700;">Email Login</p>
          <p style="margin: 6px 0 0; color: #0f172a; font-size: 15px; font-weight: 700;">${email}</p>
        </div>

        <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">
          Silakan masuk ke aplikasi untuk mulai mengakses modul pembelajaran EduBidan.
        </p>

        <div style="margin-top: 24px;">
          ${getButtonHtml("Masuk ke EduBidan", `${appUrl}/login`)}
        </div>
      `,
    }),
  };
}

export function getAccountCreatedEmailTemplate({
  name,
  email,
  password,
  appUrl = "http://localhost:3000",
  createdByAdmin = true,
}: AccountCreatedEmailParams) {
  const passwordBlock = password
    ? `
      <div style="margin: 18px 0; padding: 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 14px;">
        <p style="margin: 0; color: #9a3412; font-size: 12px; font-weight: 700;">Kata Sandi Awal</p>
        <p style="margin: 6px 0 0; color: #0f172a; font-size: 15px; font-weight: 800; font-family: monospace;">${password}</p>
        <p style="margin: 10px 0 0; color: #9a3412; font-size: 12px; line-height: 1.6;">
          Demi keamanan akun, segera ubah kata sandi setelah berhasil masuk.
        </p>
      </div>
    `
    : "";

  return {
    subject: createdByAdmin
      ? "Akun EduBidan Anda Telah Dibuat"
      : "Akun EduBidan Berhasil Dibuat",
    html: getEmailLayout({
      title: "Akun EduBidan Telah Dibuat",
      preview: "Akun EduBidan Anda telah dibuat.",
      content: `
        <h2 style="margin: 0 0 12px; font-size: 20px;">Halo, ${name}</h2>

        <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">
          ${
            createdByAdmin
              ? "Admin telah membuat akun EduBidan untuk Anda."
              : "Akun EduBidan Anda berhasil dibuat."
          }
          Silakan masuk menggunakan informasi akun berikut:
        </p>

        <div style="margin: 18px 0; padding: 16px; background: #f1f5f9; border-radius: 14px;">
          <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 700;">Email Login</p>
          <p style="margin: 6px 0 0; color: #0f172a; font-size: 15px; font-weight: 700;">${email}</p>
        </div>

        ${passwordBlock}

        <div style="margin-top: 24px;">
          ${getButtonHtml("Masuk ke EduBidan", `${appUrl}/login`)}
        </div>
      `,
    }),
  };
}

export function getForgotPasswordOtpEmailTemplate({
  name,
  otpCode,
  expiresInMinutes,
}: ForgotPasswordOtpEmailParams) {
  return {
    subject: "Kode Verifikasi Reset Kata Sandi EduBidan",
    html: getEmailLayout({
      title: "Kode Verifikasi Reset Kata Sandi",
      preview: "Gunakan kode OTP ini untuk mengatur ulang kata sandi EduBidan.",
      content: `
        <h2 style="margin: 0 0 12px; font-size: 20px;">Halo, ${name}</h2>

        <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">
          Kami menerima permintaan untuk mengatur ulang kata sandi akun EduBidan Anda. Gunakan kode OTP berikut:
        </p>

        <div style="margin: 22px 0; padding: 18px; background: #f1f5f9; border-radius: 16px; text-align: center;">
          <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 700;">Kode OTP</p>
          <p style="margin: 8px 0 0; color: #0f172a; font-size: 32px; letter-spacing: 8px; font-weight: 900; font-family: monospace;">
            ${otpCode}
          </p>
        </div>

        <p style="margin: 0; color: #334155; font-size: 14px; line-height: 1.7;">
          Kode ini berlaku selama <strong>${expiresInMinutes} menit</strong>. Jangan bagikan kode ini kepada siapa pun.
        </p>
      `,
    }),
  };
}

export function getAdminResetPasswordEmailTemplate({
  name,
  email,
  temporaryPassword,
  appUrl = "http://localhost:3000",
}: AdminResetPasswordEmailParams) {
  return {
    subject: "Kata Sandi EduBidan Anda Telah Direset",
    html: getEmailLayout({
      title: "Kata Sandi EduBidan Direset",
      preview: "Admin telah mereset kata sandi akun EduBidan Anda.",
      content: `
        <h2 style="margin: 0 0 12px; font-size: 20px;">Halo, ${name}</h2>

        <p style="margin: 0 0 16px; color: #334155; font-size: 14px; line-height: 1.7;">
          Admin telah mereset kata sandi akun EduBidan Anda. Silakan masuk menggunakan informasi berikut:
        </p>

        <div style="margin: 18px 0; padding: 16px; background: #f1f5f9; border-radius: 14px;">
          <p style="margin: 0; color: #64748b; font-size: 12px; font-weight: 700;">Email Login</p>
          <p style="margin: 6px 0 0; color: #0f172a; font-size: 15px; font-weight: 700;">${email}</p>
        </div>

        <div style="margin: 18px 0; padding: 16px; background: #fff7ed; border: 1px solid #fed7aa; border-radius: 14px;">
          <p style="margin: 0; color: #9a3412; font-size: 12px; font-weight: 700;">Kata Sandi Sementara</p>
          <p style="margin: 6px 0 0; color: #0f172a; font-size: 15px; font-weight: 800; font-family: monospace;">${temporaryPassword}</p>
          <p style="margin: 10px 0 0; color: #9a3412; font-size: 12px; line-height: 1.6;">
            Demi keamanan akun, segera ubah kata sandi setelah berhasil masuk.
          </p>
        </div>

        <div style="margin-top: 24px;">
          ${getButtonHtml("Masuk ke EduBidan", `${appUrl}/login`)}
        </div>
      `,
    }),
  };
}