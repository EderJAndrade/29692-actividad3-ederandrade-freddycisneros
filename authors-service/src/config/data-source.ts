import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { WriterAuthor } from "../domain/entities/WriterAuthor";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  entities: [WriterAuthor],
  synchronize: true,
  logging: false,
});
