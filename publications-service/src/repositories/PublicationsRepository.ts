import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { PublicationBase } from "../domain/entities/PublicationBase";
import { BookPublication } from "../domain/entities/BookPublication";
import { ArticlePublication } from "../domain/entities/ArticlePublication";
import { PublicationStatus } from "../domain/enums/PublicationStatus";

export class PublicationsRepository {
  private bookRepo: Repository<BookPublication>;
  private articleRepo: Repository<ArticlePublication>;

  constructor() {
    this.bookRepo = AppDataSource.getRepository(BookPublication);
    this.articleRepo = AppDataSource.getRepository(ArticlePublication);
  }

  async save(entity: PublicationBase) {
    if (entity instanceof BookPublication) return this.bookRepo.save(entity);
    if (entity instanceof ArticlePublication) return this.articleRepo.save(entity);
    return this.bookRepo.save(entity as any);
  }

  async findById(id: number): Promise<PublicationBase | null> {
    return (await this.bookRepo.findOne({ where: { id } })) ?? (await this.articleRepo.findOne({ where: { id } }));
  }

  async list(filters: { status?: PublicationStatus; authorId?: number }, page: number, limit: number) {
    const qb = this.bookRepo.createQueryBuilder("p");
    if (filters.status) qb.andWhere("p.status = :status", { status: filters.status });
    if (filters.authorId) qb.andWhere("p.authorId = :authorId", { authorId: filters.authorId });
    qb.orderBy("p.id", "DESC").skip((page - 1) * limit).take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total };
  }
}
