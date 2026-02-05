import { Entity, Column } from "typeorm";
import { PublicationBase } from "./PublicationBase";
import { PublicationType } from "../enums/PublicationType";

@Entity({ name: "publications" })
export class ArticlePublication extends PublicationBase {
  @Column({ type: "varchar", length: 120, nullable: true })
  topic: string | null = null;

  @Column({ type: "varchar", length: 160, nullable: true })
  sourceUrl: string | null = null;

  constructor() {
    super();
    this.type = PublicationType.ARTICLE;
  }
}
