import "reflect-metadata";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import { AppDataSource } from "./data-source";
import { User, UserRole } from "./entities/User";
import authRoutes from "./routes/auth.routes";
import articleRoutes from "./routes/article.routes";
import commentRoutes from "./routes/comment.routes";
import tagRoutes from "./routes/tag.routes";
import userRoutes from "./routes/user.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/articles", commentRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/users", userRoutes);

app.use(errorMiddleware);

async function seedAdmin() {
  const { ADMIN_EMAIL, ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_EMAIL || !ADMIN_USERNAME || !ADMIN_PASSWORD) return;

  const repo = AppDataSource.getRepository(User);
  const existing = await repo.findOneBy({ email: ADMIN_EMAIL });
  if (existing) return;

  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = repo.create({
    email: ADMIN_EMAIL,
    username: ADMIN_USERNAME,
    password: hashed,
    role: UserRole.ADMIN,
  });
  await repo.save(admin);
  console.log(`Admin user created: ${ADMIN_EMAIL}`);
}

AppDataSource.initialize()
  .then(async () => {
    console.log("Database connected");
    await seedAdmin();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });

process.on("SIGINT", function () {
  console.log("\nGracefully shutting down from SIGINT (Ctrl-C)");
  // some other closing procedures go here
  process.exit(0);
});
