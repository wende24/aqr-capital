import bcrypt from "bcrypt";
import { createInterface } from "node:readline/promises";
import {
  stdin as input,
  stdout as output,
} from "node:process";
import { prisma } from "./prisma";

async function main() {
  const readline = createInterface({
    input,
    output,
  });

  try {
    const email = (
      await readline.question("Admin email: ")
    )
      .trim()
      .toLowerCase();

    const fullName = (
      await readline.question("Admin full name: ")
    ).trim();

    const password = await readline.question(
      "Admin password: ",
      {
        hideEchoBack: true,
      },
    );

    if (!email || !fullName || !password) {
      throw new Error(
        "Email, full name and password are required.",
      );
    }

    if (password.length < 8) {
      throw new Error(
        "Password must be at least 8 characters.",
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10,
    );

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    let user;

    if (existingUser) {
      user = await prisma.user.update({
        where: {
          id: existingUser.id,
        },
        data: {
          fullName,
          password: hashedPassword,
          role: "ADMIN",
        },
      });

      console.log(
        `Existing user promoted to ADMIN: ${user.email}`,
      );
    } else {
      user = await prisma.user.create({
        data: {
          email,
          fullName,
          password: hashedPassword,
          role: "ADMIN",
          account: {
            create: {
              accountType: "managed",
              capital: 0,
              cashBalance: 0,
              totalValue: 0,
            },
          },
        },
      });

      console.log(
        `Admin created successfully: ${user.email}`,
      );
    }
  } finally {
    readline.close();
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error("Create admin failed:", error);
  process.exit(1);
});