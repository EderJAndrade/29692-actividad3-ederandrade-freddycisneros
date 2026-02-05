import axios, { AxiosInstance } from "axios";
import { env } from "../config/env";
import { AppError } from "../shared/errors/AppError";
import { AuthorViewDto } from "../dto/AuthorViewDto";

export class AuthorsHttpClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: env.authors.baseUrl,
      timeout: env.authors.timeoutMs,
    });
  }

  async getAuthor(authorId: number): Promise<AuthorViewDto> {
    try {
      const res = await this.client.get(`/authors/${authorId}`);
      return res.data as AuthorViewDto;
    } catch (err: any) {
      if (err.code === "ECONNABORTED") {
        throw new AppError(504, "Timeout contacting Authors Service");
      }
      const status = err.response?.status;
      if (status === 404) {
        throw new AppError(400, "El autor no existe");
      }
      throw new AppError(502, "Error contacting Authors Service", {
        upstreamStatus: status ?? null,
      });
    }
  }
}
