import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { PublicationStatus } from "../enums/PublicationStatus";
import { PublicationType } from "../enums/PublicationType";

export abstract class PublicationBase {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 160 })
  title!: string;

  @Column({ type: "text" })
  content!: string;

  @Column({ type: "enum", enum: PublicationStatus, default: PublicationStatus.DRAFT })
  status!: PublicationStatus;

  @Column()
  authorId!: number;

  @Column({ type: "enum", enum: PublicationType })
  type!: PublicationType;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
