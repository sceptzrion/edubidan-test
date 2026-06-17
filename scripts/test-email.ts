import "dotenv/config";

import { sendRegisterSuccessEmail } from "@/services/email/email.service";

async function main() {
  const to = process.argv[2];

  if (!to) {
    console.error("Usage: npx tsx scripts/test-email.ts email@example.com");
    process.exit(1);
  }

  const result = await sendRegisterSuccessEmail({
    to,
    name: "Mahasiswa EduBidan",
    email: to,
  });

  console.log(result);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});