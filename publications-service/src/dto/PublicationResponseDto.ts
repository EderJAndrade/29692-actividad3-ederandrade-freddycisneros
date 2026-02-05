import { PublicationStatus } from "../domain/enums/PublicationStatus";
import { PublicationType } from "../domain/enums/PublicationType";
import { AuthorViewDto } from "./AuthorViewDto";

export type PublicationResponseDto = {
  id: number;
  title: string;
  content: string;
  status: PublicationStatus;
  authorId: number;
  type: PublicationType;
  extra?: Record<string, unknown>;
  author?: AuthorViewDto;
  createdAt: string;
  updatedAt: string;
};
