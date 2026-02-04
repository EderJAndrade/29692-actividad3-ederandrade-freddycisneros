import { Entity, Column } from "typeorm";
import { AuthorBase } from "./AuthorBase";

@Entity({ name: "authors" })
export class WriterAuthor extends AuthorBase {
  @Column({ type: "varchar", length: 60, default: "writer" })
  authorType!: string;

  @Column({ type: "varchar", length: 120, nullable: true })
  penName: string | null = null;
}
