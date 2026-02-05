import { IsEnum } from "class-validator";
import { PublicationStatus } from "../domain/enums/PublicationStatus";

export class UpdateStatusDto {
  @IsEnum(PublicationStatus)
  status!: PublicationStatus;
}
