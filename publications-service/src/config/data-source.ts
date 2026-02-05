import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { BookPublication } from "../domain/entities/BookPublication";
import { ArticlePublication } from "../domain/entities/ArticlePublication";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: env.db.host,
  port: env.db.port,
  username: env.db.user,
  password: env.db.password,
  database: env.db.name,
  entities: [BookPublication, ArticlePublication],
  synchronize: true,
  logging: false,
});
