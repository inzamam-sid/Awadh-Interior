import mongoose from "mongoose";
import "dotenv/config";
import bcrypt from "bcryptjs";
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import User from "./src/modules/auth/user.model.js";

const rl = createInterface({ input: stdin, output: stdout });

async function readHidden(prompt) {
  stdout.write(prompt);
  const { spawn } = await import("node:child_process");

  return await new Promise((resolve, reject) => {
    const child = spawn("bash", ["-c", 'read -s value; printf "%s" "$value"'], {
      stdio: ["inherit", "pipe", "inherit"],
    });
    let value = "";
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", (chunk) => value += chunk);
    child.on("error", reject);
    child.on("close", (code) => {
      stdout.write("\n");
      code === 0 ? resolve(value) : reject(new Error("Password input failed"));
    });
  });
}

try {
  await mongoose.connect(process.env.MONGO_URI);

  const user = await User.findOne({
    email: "awadh@gmail.com",
    role: "OWNER",
  });

  if (!user) throw new Error("Owner account not found.");

  const password = await readHidden("Enter new password (minimum 12 characters): ");
  if (password.length < 12) {
    throw new Error("Use at least 12 characters.");
  }

  const confirmation = await readHidden("Confirm new password: ");
  if (password !== confirmation) {
    throw new Error("Passwords do not match.");
  }

  user.passwordHash = await bcrypt.hash(password, 12);
  await user.save();

  console.log("Owner password reset successfully.");
} catch (error) {
  console.error("Reset failed:", error.message);
  process.exitCode = 1;
} finally {
  rl.close();
  await mongoose.disconnect();
}
