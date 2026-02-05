import { PublicationStatus } from "../enums/PublicationStatus";
import { StatusTransitionStrategy } from "./StatusTransitionStrategy";

export class DefaultStatusTransitionStrategy implements StatusTransitionStrategy {
  canTransition(from: PublicationStatus, to: PublicationStatus): boolean {
    const allowed: Record<PublicationStatus, PublicationStatus[]> = {
      [PublicationStatus.DRAFT]: [PublicationStatus.IN_REVIEW],
      [PublicationStatus.IN_REVIEW]: [PublicationStatus.APPROVED, PublicationStatus.REJECTED],
      [PublicationStatus.APPROVED]: [PublicationStatus.PUBLISHED],
      [PublicationStatus.PUBLISHED]: [],
      [PublicationStatus.REJECTED]: [],
    };
    return allowed[from].includes(to);
  }

  reasonIfNotAllowed(from: PublicationStatus, to: PublicationStatus): string {
    return `Transition not allowed: ${from} -> ${to}`;
  }
}
