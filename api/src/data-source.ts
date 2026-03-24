import { DataSource } from "typeorm";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const AppDataSource = new DataSource({
    type: "better-sqlite3",
    database: path.join(__dirname, "..", process.env.DB_DATABASE || "blog.db"),
    synchronize: true,
    logging: false,
    entities: [__dirname + "/entities/**/*{.js,.ts}"],
});
