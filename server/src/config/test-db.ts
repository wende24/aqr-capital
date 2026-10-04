import { prisma } from "./prisma";

async function main() {
  const result = await prisma.$queryRawUnsafe(
    "SELECT 1 AS result",
  );

  console.log("PostgreSQL connection successful.");
  console.log(result);
}

main()
  .catch((error) => {
    console.error("PostgreSQL connection failed.");
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
