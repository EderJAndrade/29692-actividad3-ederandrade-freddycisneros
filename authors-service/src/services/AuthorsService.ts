import { AuthorsRepository } from "../repositories/AuthorsRepository";
import { AppError } from "../shared/errors/AppError";
import { CreateAuthorDto } from "../dto/CreateAuthorDto";
import { AuthorResponseDto } from "../dto/AuthorResponseDto";

export class AuthorsService {
  constructor(private readonly authorsRepo: AuthorsRepository) {}

  async create(dto: CreateAuthorDto): Promise<AuthorResponseDto> {
    const existing = await this.authorsRepo.findByEmail(dto.email);
    if (existing) {
      throw new AppError(409, "El correo electrónico ya existe");
    }
    const saved = await this.authorsRepo.create({
      name: dto.name,
      email: dto.email,
      penName: dto.penName ?? null,
      authorType: "writer",
    });
    return this.toDto(saved);
  }

  async getById(id: number): Promise<AuthorResponseDto> {
    const found = await this.authorsRepo.findById(id);
    if (!found) throw new AppError(404, "Autor no encontrado");
    return this.toDto(found);
  }

  async list(page = 1, limit = 10) {
    const p = Math.max(1, page);
    const l = Math.min(50, Math.max(1, limit));
    const { data, total } = await this.authorsRepo.list(p, l);
    return {
      page: p,
      limit: l,
      total,
      data: data.map((a) => this.toDto(a)),
    };
  }

  private toDto(a: any): AuthorResponseDto {
    return {
      id: a.id,
      name: a.name,
      email: a.email,
      authorType: a.authorType,
      penName: a.penName ?? null,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    };
  }
}
