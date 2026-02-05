import { PublicationStatus } from "../enums/PublicationStatus";

export interface StatusTransitionStrategy {
  canTransition(from: PublicationStatus, to: PublicationStatus): boolean;
  reasonIfNotAllowed(from: PublicationStatus, to: PublicationStatus): string;
}
