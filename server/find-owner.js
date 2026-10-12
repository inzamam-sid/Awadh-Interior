import mongoose from "mongoose";
import "dotenv/config";
import User from "./src/modules/auth/user.model.js";

try {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);

  const owners = await User.find({ role: "OWNER" })
    .select("name email role organizationId isActive")
    .lean();

  if (owners.length === 0) {
    console.log("No OWNER account found in this database.");
  } else {
    console.log("Owner accounts found:");
    console.table(
      owners.map(({ name, email, role, organizationId, isActive }) => ({
        name,
        email,
        role,
        organizationId: String(organizationId),
        isActive,
      }))
    );
  }
} catch (error) {
  console.error("Error:", error.message);
} finally {
  await mongoose.disconnect();
}
