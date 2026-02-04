import { Repository } from "typeorm";
import { AppDataSource } from "../config/data-source";
import { WriterAuthor } from "../domain/entities/WriterAuthor";

export class AuthorsRepository {
  private repo: Repository<WriterAuthor>;

  constructor() {
    this.repo = AppDataSource.getRepository(WriterAuthor);
  }

  async create(author: Partial<WriterAuthor>): Promise<WriterAuthor> {
    const entity = this.repo.create(author);
    return this.repo.save(entity);
  }

  async findById(id: number): Promise<WriterAuthor | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<WriterAuthor | null> {
    return this.repo.findOne({ where: { email } });
  }

  async list(page: number, limit: number): Promise<{ data: WriterAuthor[]; total: number }> {
    const [data, total] = await this.repo.findAndCount({
      order: { id: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total };
  }
}
