import { IsEnum, IsInt, IsOptional, IsString, Length, Min } from "class-validator";
import { PublicationType } from "../domain/enums/PublicationType";

export class CreatePublicationDto {
  @IsString()
  @Length(2, 160)
  title!: string;

  @IsString()
  @Length(1, 100000)
  content!: string;

  @IsInt()
  @Min(1)
  authorId!: number;

  @IsEnum(PublicationType)
  type!: PublicationType;

  @IsOptional()
  @IsString()
  @Length(5, 120)
  isbn?: string;

  @IsOptional()
  @IsString()
  @Length(2, 80)
  genre?: string;

  @IsOptional()
  @IsString()
  @Length(2, 120)
  topic?: string;

  @IsOptional()
  @IsString()
  @Length(5, 160)
  sourceUrl?: string;
}
