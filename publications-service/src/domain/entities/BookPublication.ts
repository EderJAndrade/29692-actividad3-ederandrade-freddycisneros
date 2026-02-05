import { Entity, Column } from "typeorm";
import { PublicationBase } from "./PublicationBase";
import { PublicationType } from "../enums/PublicationType";

@Entity({ name: "publications" })
export class BookPublication extends PublicationBase {
  @Column({ type: "varchar", length: 120, nullable: true })
  isbn: string | null = null;

  @Column({ type: "varchar", length: 80, nullable: true })
  genre: string | null = null;

  constructor() {
    super();
    this.type = PublicationType.BOOK;
  }
}
