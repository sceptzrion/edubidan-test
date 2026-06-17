import { Prisma, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import {
  sendAccountCreatedEmail,
  sendAdminResetPasswordEmail,
} from "@/services/email/email.service";

const userSafeSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  phoneNumber: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
  mahasiswaProfile: {
    select: {
      id: true,
      npm: true,
    },
  },
  dosenProfile: {
    select: {
      id: true,
      nidnNip: true,
    },
  },
  notifPreference: true,
} satisfies Prisma.UserSelect;

type SafeUser = Prisma.UserGetPayload<{
  select: typeof userSafeSelect;
}>;

function normalizeOptionalString(value: unknown) {
  if (typeof value !== "string") return undefined;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeRequiredString(value: unknown) {
  if (typeof value !== "string") return null;

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : null;
}

function normalizeEmail(value: unknown) {
  const email = normalizeRequiredString(value);

  return email?.toLowerCase() ?? null;
}

function normalizeRole(value: unknown) {
  if (value === Role.MAHASISWA) return Role.MAHASISWA;
  if (value === Role.DOSEN) return Role.DOSEN;

  return null;
}

function isValidStudentEmail(email: string, npm: string) {
  return email === `${npm}@student.unsika.ac.id`;
}

function isValidDosenEmail(email: string) {
  return email.endsWith("@staff.unsika.ac.id");
}

function isValidNpm(npm: string) {
  return /^\d{10,20}$/.test(npm);
}

function isValidNidnNip(nidnNip: string) {
  return /^[A-Za-z0-9.-]{5,30}$/.test(nidnNip);
}

function generateTemporaryPassword() {
  const randomPart = Math.random().toString(36).slice(2, 8);
  const timestampPart = Date.now().toString(36).slice(-4);

  return `EduBidan-${randomPart}${timestampPart}`;
}

export async function getUsers() {
  return prisma.user.findMany({
    select: userSafeSelect,
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
    select: userSafeSelect,
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: userSafeSelect,
  });
}

export type CreateUserByAdminResult =
  | {
      success: true;
      user: SafeUser;
      email:
        | {
            sent: true;
            skipped: false;
            error: null;
          }
        | {
            sent: false;
            skipped: true;
            error: null;
          }
        | {
            sent: false;
            skipped: false;
            error: string;
          };
      error: null;
    }
  | {
      success: false;
      user: null;
      error:
        | "NAME_REQUIRED"
        | "EMAIL_REQUIRED"
        | "PASSWORD_REQUIRED"
        | "PASSWORD_TOO_SHORT"
        | "ROLE_INVALID"
        | "IDENTIFIER_REQUIRED"
        | "INVALID_NPM_FORMAT"
        | "INVALID_NIDN_NIP_FORMAT"
        | "INVALID_STUDENT_EMAIL_FORMAT"
        | "INVALID_DOSEN_EMAIL_FORMAT"
        | "EMAIL_ALREADY_USED"
        | "IDENTIFIER_ALREADY_USED";
    };

export async function createUserByAdmin(params: {
  name: unknown;
  email: unknown;
  password: unknown;
  role: unknown;
  identifier: unknown;
  phoneNumber?: unknown;
  avatarUrl?: unknown;
}): Promise<CreateUserByAdminResult> {
  const name = normalizeRequiredString(params.name);
  const email = normalizeEmail(params.email);
  const password =
    typeof params.password === "string" ? params.password : null;
  const role = normalizeRole(params.role);
  const identifier = normalizeRequiredString(params.identifier);
  const phoneNumber = normalizeOptionalString(params.phoneNumber);
  const avatarUrl = normalizeOptionalString(params.avatarUrl);

  if (!name) {
    return {
      success: false,
      user: null,
      error: "NAME_REQUIRED",
    };
  }

  if (!email) {
    return {
      success: false,
      user: null,
      error: "EMAIL_REQUIRED",
    };
  }

  if (!password) {
    return {
      success: false,
      user: null,
      error: "PASSWORD_REQUIRED",
    };
  }

  if (password.length < 8) {
    return {
      success: false,
      user: null,
      error: "PASSWORD_TOO_SHORT",
    };
  }

  if (!role) {
    return {
      success: false,
      user: null,
      error: "ROLE_INVALID",
    };
  }

  if (!identifier) {
    return {
      success: false,
      user: null,
      error: "IDENTIFIER_REQUIRED",
    };
  }

  if (role === Role.MAHASISWA) {
    if (!isValidNpm(identifier)) {
      return {
        success: false,
        user: null,
        error: "INVALID_NPM_FORMAT",
      };
    }

    if (!isValidStudentEmail(email, identifier)) {
      return {
        success: false,
        user: null,
        error: "INVALID_STUDENT_EMAIL_FORMAT",
      };
    }
  }

  if (role === Role.DOSEN) {
    if (!isValidNidnNip(identifier)) {
      return {
        success: false,
        user: null,
        error: "INVALID_NIDN_NIP_FORMAT",
      };
    }

    if (!isValidDosenEmail(email)) {
      return {
        success: false,
        user: null,
        error: "INVALID_DOSEN_EMAIL_FORMAT",
      };
    }
  }

  const existingEmail = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });

  if (existingEmail) {
    return {
      success: false,
      user: null,
      error: "EMAIL_ALREADY_USED",
    };
  }

  if (role === Role.MAHASISWA) {
    const existingNpm = await prisma.mahasiswaProfile.findUnique({
      where: {
        npm: identifier,
      },
      select: {
        id: true,
      },
    });

    if (existingNpm) {
      return {
        success: false,
        user: null,
        error: "IDENTIFIER_ALREADY_USED",
      };
    }
  }

  if (role === Role.DOSEN) {
    const existingNidnNip = await prisma.dosenProfile.findUnique({
      where: {
        nidnNip: identifier,
      },
      select: {
        id: true,
      },
    });

    if (existingNidnNip) {
      return {
        success: false,
        user: null,
        error: "IDENTIFIER_ALREADY_USED",
      };
    }
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      phoneNumber,
      avatarUrl,
      isActive: true,
      mahasiswaProfile:
        role === Role.MAHASISWA
          ? {
              create: {
                npm: identifier,
              },
            }
          : undefined,
      dosenProfile:
        role === Role.DOSEN
          ? {
              create: {
                nidnNip: identifier,
              },
            }
          : undefined,
      notifPreference: {
        create: {},
      },
      activityLogs: {
        create: {
          actionType: "CREATE_USER",
          description: `Admin membuat akun ${role.toLowerCase()} ${name}.`,
        },
      },
    },
    select: userSafeSelect,
  });

  const emailResult = await sendAccountCreatedEmail({
    to: email,
    name,
    email,
    password,
    createdByAdmin: true,
  });

  return {
    success: true,
    user,
    email: emailResult.success
      ? emailResult.skipped
        ? {
            sent: false,
            skipped: true,
            error: null,
          }
        : {
            sent: true,
            skipped: false,
            error: null,
          }
      : {
          sent: false,
          skipped: false,
          error: emailResult.error,
        },
    error: null,
  };
}

export type UpdateUserByAdminResult =
  | {
      success: true;
      user: SafeUser;
      error: null;
    }
  | {
      success: false;
      user: null;
      error:
        | "USER_NOT_FOUND"
        | "NAME_EMPTY"
        | "EMAIL_EMPTY"
        | "IDENTIFIER_EMPTY"
        | "INVALID_NPM_FORMAT"
        | "INVALID_NIDN_NIP_FORMAT"
        | "INVALID_STUDENT_EMAIL_FORMAT"
        | "INVALID_DOSEN_EMAIL_FORMAT"
        | "EMAIL_ALREADY_USED"
        | "IDENTIFIER_ALREADY_USED";
    };

export async function updateUserByAdmin(params: {
  id: number;
  name?: unknown;
  email?: unknown;
  identifier?: unknown;
  phoneNumber?: unknown;
  avatarUrl?: unknown;
}): Promise<UpdateUserByAdminResult> {
  const existingUser = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      role: true,
      email: true,
      mahasiswaProfile: {
        select: {
          npm: true,
        },
      },
      dosenProfile: {
        select: {
          nidnNip: true,
        },
      },
    },
  });

  if (!existingUser) {
    return {
      success: false,
      user: null,
      error: "USER_NOT_FOUND",
    };
  }

  const data: Prisma.UserUpdateInput = {};

  if (params.name !== undefined) {
    const name = normalizeRequiredString(params.name);

    if (!name) {
      return {
        success: false,
        user: null,
        error: "NAME_EMPTY",
      };
    }

    data.name = name;
  }

  if (params.phoneNumber !== undefined) {
    data.phoneNumber = normalizeOptionalString(params.phoneNumber);
  }

  if (params.avatarUrl !== undefined) {
    data.avatarUrl = normalizeOptionalString(params.avatarUrl);
  }

  const nextIdentifier =
    params.identifier !== undefined
      ? normalizeRequiredString(params.identifier)
      : existingUser.role === Role.MAHASISWA
        ? existingUser.mahasiswaProfile?.npm ?? null
        : existingUser.dosenProfile?.nidnNip ?? null;

  if (params.identifier !== undefined && !nextIdentifier) {
    return {
      success: false,
      user: null,
      error: "IDENTIFIER_EMPTY",
    };
  }

  if (params.email !== undefined) {
    const email = normalizeEmail(params.email);

    if (!email) {
      return {
        success: false,
        user: null,
        error: "EMAIL_EMPTY",
      };
    }

    if (existingUser.role === Role.MAHASISWA) {
      if (!nextIdentifier || !isValidStudentEmail(email, nextIdentifier)) {
        return {
          success: false,
          user: null,
          error: "INVALID_STUDENT_EMAIL_FORMAT",
        };
      }
    }

    if (existingUser.role === Role.DOSEN) {
      if (!isValidDosenEmail(email)) {
        return {
          success: false,
          user: null,
          error: "INVALID_DOSEN_EMAIL_FORMAT",
        };
      }
    }

    const duplicateEmail = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
      },
    });

    if (duplicateEmail && duplicateEmail.id !== params.id) {
      return {
        success: false,
        user: null,
        error: "EMAIL_ALREADY_USED",
      };
    }

    data.email = email;
  }

  if (params.identifier !== undefined && nextIdentifier) {
    if (existingUser.role === Role.MAHASISWA) {
      if (!isValidNpm(nextIdentifier)) {
        return {
          success: false,
          user: null,
          error: "INVALID_NPM_FORMAT",
        };
      }

      const duplicateNpm = await prisma.mahasiswaProfile.findUnique({
        where: {
          npm: nextIdentifier,
        },
        select: {
          userId: true,
        },
      });

      if (duplicateNpm && duplicateNpm.userId !== params.id) {
        return {
          success: false,
          user: null,
          error: "IDENTIFIER_ALREADY_USED",
        };
      }

      data.mahasiswaProfile = {
        upsert: {
          create: {
            npm: nextIdentifier,
          },
          update: {
            npm: nextIdentifier,
          },
        },
      };
    }

    if (existingUser.role === Role.DOSEN) {
      if (!isValidNidnNip(nextIdentifier)) {
        return {
          success: false,
          user: null,
          error: "INVALID_NIDN_NIP_FORMAT",
        };
      }

      const duplicateNidnNip = await prisma.dosenProfile.findUnique({
        where: {
          nidnNip: nextIdentifier,
        },
        select: {
          userId: true,
        },
      });

      if (duplicateNidnNip && duplicateNidnNip.userId !== params.id) {
        return {
          success: false,
          user: null,
          error: "IDENTIFIER_ALREADY_USED",
        };
      }

      data.dosenProfile = {
        upsert: {
          create: {
            nidnNip: nextIdentifier,
          },
          update: {
            nidnNip: nextIdentifier,
          },
        },
      };
    }
  }

  const user = await prisma.user.update({
    where: {
      id: params.id,
    },
    data: {
      ...data,
      activityLogs: {
        create: {
          actionType: "UPDATE_USER",
          description: "Admin memperbarui data pengguna.",
        },
      },
    },
    select: userSafeSelect,
  });

  return {
    success: true,
    user,
    error: null,
  };
}

export type UpdateUserStatusByAdminResult =
  | {
      success: true;
      user: SafeUser;
      error: null;
    }
  | {
      success: false;
      user: null;
      error: "USER_NOT_FOUND" | "STATUS_REQUIRED";
    };

export async function updateUserStatusByAdmin(params: {
  id: number;
  isActive: unknown;
}): Promise<UpdateUserStatusByAdminResult> {
  if (typeof params.isActive !== "boolean") {
    return {
      success: false,
      user: null,
      error: "STATUS_REQUIRED",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: {
      id: params.id,
    },
    select: {
      id: true,
      name: true,
    },
  });

  if (!existingUser) {
    return {
      success: false,
      user: null,
      error: "USER_NOT_FOUND",
    };
  }

  const user = await prisma.user.update({
    where: {
      id: params.id,
    },
    data: {
      isActive: params.isActive,
      activityLogs: {
        create: {
          actionType: params.isActive ? "ACTIVATE_USER" : "DEACTIVATE_USER",
          description: `Admin ${
            params.isActive ? "mengaktifkan" : "menonaktifkan"
          } akun ${existingUser.name}.`,
        },
      },
    },
    select: userSafeSelect,
  });

  return {
    success: true,
    user,
    error: null,
  };
}

export type DeleteUserByAdminResult =
  | {
      success: true;
      deletedUserId: number;
      error: null;
    }
  | {
      success: false;
      deletedUserId: null;
      error:
        | "USER_NOT_FOUND"
        | "ADMIN_CANNOT_BE_DELETED"
        | "USER_MUST_BE_INACTIVE"
        | "USER_HAS_RELATED_DATA";
    };

export async function deleteUserByAdmin(
  id: number
): Promise<DeleteUserByAdminResult> {
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      role: true,
      isActive: true,
    },
  });

  if (!existingUser) {
    return {
      success: false,
      deletedUserId: null,
      error: "USER_NOT_FOUND",
    };
  }

  if (existingUser.role === Role.ADMIN) {
    return {
      success: false,
      deletedUserId: null,
      error: "ADMIN_CANNOT_BE_DELETED",
    };
  }

  if (existingUser.isActive) {
    return {
      success: false,
      deletedUserId: null,
      error: "USER_MUST_BE_INACTIVE",
    };
  }

  try {
    await prisma.user.delete({
      where: {
        id,
      },
    });

    return {
      success: true,
      deletedUserId: id,
      error: null,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2003"
    ) {
      return {
        success: false,
        deletedUserId: null,
        error: "USER_HAS_RELATED_DATA",
      };
    }

    throw error;
  }
}

export type ResetUserPasswordByAdminResult =
  | {
      success: true;
      temporaryPassword: string;
      email:
        | {
            sent: true;
            skipped: false;
            error: null;
          }
        | {
            sent: false;
            skipped: true;
            error: null;
          }
        | {
            sent: false;
            skipped: false;
            error: string;
          };
      error: null;
    }
  | {
      success: false;
      temporaryPassword: null;
      email: null;
      error: "USER_NOT_FOUND" | "ADMIN_CANNOT_BE_RESET";
    };

export async function resetUserPasswordByAdmin(
  id: number
): Promise<ResetUserPasswordByAdminResult> {
  const existingUser = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  if (!existingUser) {
    return {
      success: false,
      temporaryPassword: null,
      email: null,
      error: "USER_NOT_FOUND",
    };
  }

  if (existingUser.role === Role.ADMIN) {
    return {
      success: false,
      temporaryPassword: null,
      email: null,
      error: "ADMIN_CANNOT_BE_RESET",
    };
  }

  const temporaryPassword = generateTemporaryPassword();
  const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

  await prisma.user.update({
    where: {
      id,
    },
    data: {
      password: hashedPassword,
      activityLogs: {
        create: {
          actionType: "RESET_PASSWORD",
          description: `Admin mereset password akun ${existingUser.name}.`,
        },
      },
    },
  });

  const emailResult = await sendAdminResetPasswordEmail({
    to: existingUser.email,
    name: existingUser.name,
    email: existingUser.email,
    temporaryPassword,
  });

  return {
    success: true,
    temporaryPassword,
    email: emailResult.success
      ? emailResult.skipped
        ? {
            sent: false,
            skipped: true,
            error: null,
          }
        : {
            sent: true,
            skipped: false,
            error: null,
          }
      : {
          sent: false,
          skipped: false,
          error: emailResult.error,
        },
    error: null,
  };
}