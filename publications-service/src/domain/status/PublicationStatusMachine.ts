import { PublicationStatus } from "../enums/PublicationStatus";
import { StatusTransitionStrategy } from "./StatusTransitionStrategy";
import { DefaultStatusTransitionStrategy } from "./DefaultStatusTransitionStrategy";
import { AppError } from "../../shared/errors/AppError";

export class PublicationStatusMachine {
  private readonly strategies: StatusTransitionStrategy[];

  constructor(strategies?: StatusTransitionStrategy[]) {
    this.strategies = strategies?.length ? strategies : [new DefaultStatusTransitionStrategy()];
  }

  assertCanTransition(from: PublicationStatus, to: PublicationStatus) {
    const ok = this.strategies.some((s) => s.canTransition(from, to));
    if (!ok) {
      const reason = this.strategies[0].reasonIfNotAllowed(from, to);
      throw new AppError(409, reason);
    }
  }
}
