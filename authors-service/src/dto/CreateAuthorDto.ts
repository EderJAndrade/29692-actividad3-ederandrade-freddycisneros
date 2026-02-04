import { IsEmail, IsOptional, IsString, Length } from "class-validator";

export class CreateAuthorDto {
  @IsString()
  @Length(2, 120)
  name!: string;

  @IsEmail()
  @Length(5, 160)
  email!: string;

  @IsOptional()
  @IsString()
  @Length(2, 120)
  penName?: string;
}
