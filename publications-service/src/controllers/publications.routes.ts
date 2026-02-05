import { Router } from "express";
import { PublicationsService } from "../services/PublicationsService";
import { PublicationsRepository } from "../repositories/PublicationsRepository";
import { AuthorsHttpClient } from "../integrations/AuthorsHttpClient";
import { validateDto } from "../shared/middleware/validateDto";
import { CreatePublicationDto } from "../dto/CreatePublicationDto";
import { UpdateStatusDto } from "../dto/UpdateStatusDto";
import { AppError } from "../shared/errors/AppError";
import { PublicationStatus } from "../domain/enums/PublicationStatus";

export const publicationsRouter = Router();

const service = new PublicationsService(new PublicationsRepository(), new AuthorsHttpClient());

publicationsRouter.post("/", validateDto(CreatePublicationDto), async (req, res) => {
  const created = await service.create(req.body as CreatePublicationDto);
  res.status(201).json(created);
});

publicationsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) throw new AppError(400, "Invalid id");
  const pub = await service.getById(id, true);
  res.json(pub);
});

publicationsRouter.get("/", async (req, res) => {
  const status = req.query.status ? String(req.query.status) : undefined;
  const authorId = req.query.authorId ? Number(req.query.authorId) : undefined;
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;

  const parsedStatus = status ? (PublicationStatus as any)[status] : undefined;
  if (status && !parsedStatus) throw new AppError(400, "Invalid status filter");

  const result = await service.list({
    status: parsedStatus,
    authorId: Number.isNaN(authorId as any) ? undefined : authorId,
    page,
    limit,
  });

  res.json(result);
});

publicationsRouter.patch("/:id/status", validateDto(UpdateStatusDto), async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) throw new AppError(400, "Invalid id");
  const dto = req.body as UpdateStatusDto;
  const updated = await service.updateStatus(id, dto.status);
  res.json(updated);
});
