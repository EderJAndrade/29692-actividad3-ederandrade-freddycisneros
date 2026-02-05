import { CreatePublicationDto } from "../../dto/CreatePublicationDto";
import { PublicationType } from "../enums/PublicationType";
import { BookPublication } from "../entities/BookPublication";
import { ArticlePublication } from "../entities/ArticlePublication";
import { AppError } from "../../shared/errors/AppError";

export class PublicationFactory {
  static create(dto: CreatePublicationDto) {
    switch (dto.type) {
      case PublicationType.BOOK: {
        const p = new BookPublication();
        p.title = dto.title;
        p.content = dto.content;
        p.authorId = dto.authorId;
        p.isbn = dto.isbn ?? null;
        p.genre = dto.genre ?? null;
        return p;
      }
      case PublicationType.ARTICLE: {
        const p = new ArticlePublication();
        p.title = dto.title;
        p.content = dto.content;
        p.authorId = dto.authorId;
        p.topic = dto.topic ?? null;
        p.sourceUrl = dto.sourceUrl ?? null;
        return p;
      }
      default:
        throw new AppError(400, "Unsupported publication type");
    }
  }
}
