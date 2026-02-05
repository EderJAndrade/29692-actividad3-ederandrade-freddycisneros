import { PublicationsRepository } from "../repositories/PublicationsRepository";
import { CreatePublicationDto } from "../dto/CreatePublicationDto";
import { PublicationResponseDto } from "../dto/PublicationResponseDto";
import { PublicationFactory } from "../domain/factory/PublicationFactory";
import { AuthorsHttpClient } from "../integrations/AuthorsHttpClient";
import { PublicationStatusMachine } from "../domain/status/PublicationStatusMachine";
import { PublicationStatus } from "../domain/enums/PublicationStatus";
import { AppError } from "../shared/errors/AppError";

export class PublicationsService {
  private statusMachine = new PublicationStatusMachine();

  constructor(
    private readonly repo: PublicationsRepository,
    private readonly authorsClient: AuthorsHttpClient
  ) {}

  async create(dto: CreatePublicationDto): Promise<PublicationResponseDto> {
    await this.authorsClient.getAuthor(dto.authorId);

    const entity = PublicationFactory.create(dto);
    const saved = await this.repo.save(entity);
    return this.toDto(saved, undefined);
  }

  async getById(id: number, enrich = true): Promise<PublicationResponseDto> {
    const found = await this.repo.findById(id);
    if (!found) throw new AppError(404, "Publicación no encontrada");

    if (!enrich) return this.toDto(found, undefined);

    const author = await this.authorsClient.getAuthor(found.authorId);
    return this.toDto(found, author);
  }

  async list(query: { status?: PublicationStatus; authorId?: number; page?: number; limit?: number }) {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(50, Math.max(1, query.limit ?? 10));
    const { data, total } = await this.repo.list(
      { status: query.status, authorId: query.authorId },
      page,
      limit
    );
    return {
      page,
      limit,
      total,
      data: data.map((p) => this.toDto(p, undefined)),
    };
  }

  async updateStatus(id: number, newStatus: PublicationStatus): Promise<PublicationResponseDto> {
    const found = await this.repo.findById(id);
    if (!found) throw new AppError(404, "Publicación no encontrada");

    this.statusMachine.assertCanTransition(found.status, newStatus);
    found.status = newStatus;

    const saved = await this.repo.save(found);
    const author = await this.authorsClient.getAuthor(saved.authorId);
    return this.toDto(saved, author);
  }

  private toDto(p: any, author?: any): PublicationResponseDto {
    const extra: Record<string, unknown> = {};
    if (p.type === "BOOK") {
      if (p.isbn) extra.isbn = p.isbn;
      if (p.genre) extra.genre = p.genre;
    }
    if (p.type === "ARTICLE") {
      if (p.topic) extra.topic = p.topic;
      if (p.sourceUrl) extra.sourceUrl = p.sourceUrl;
    }

    return {
      id: p.id,
      title: p.title,
      content: p.content,
      status: p.status,
      authorId: p.authorId,
      type: p.type,
      extra: Object.keys(extra).length ? extra : undefined,
      author,
      createdAt: p.createdAt.toISOString(),
      updatedAt: p.updatedAt.toISOString(),
    };
  }
}
