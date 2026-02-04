import { Router } from "express";
import { AuthorsRepository } from "../repositories/AuthorsRepository";
import { AuthorsService } from "../services/AuthorsService";
import { validateDto } from "../shared/middleware/validateDto";
import { CreateAuthorDto } from "../dto/CreateAuthorDto";
import { AppError } from "../shared/errors/AppError";

export const authorsRouter = Router();

const service = new AuthorsService(new AuthorsRepository());

authorsRouter.post("/", validateDto(CreateAuthorDto), async (req, res) => {
  const created = await service.create(req.body as CreateAuthorDto);
  res.status(201).json(created);
});

authorsRouter.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  if (Number.isNaN(id)) throw new AppError(400, "Invalid id");
  const author = await service.getById(id);
  res.json(author);
});

authorsRouter.get("/", async (req, res) => {
  const page = req.query.page ? Number(req.query.page) : 1;
  const limit = req.query.limit ? Number(req.query.limit) : 10;
  const result = await service.list(page, limit);
  res.json(result);
});
