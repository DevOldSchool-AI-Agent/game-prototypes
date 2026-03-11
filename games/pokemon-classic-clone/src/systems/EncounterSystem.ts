export class EncounterSystem {
  private invulnerableUntilMs = 0;
  private readonly cooldownMs: number;

  constructor(cooldownMs = 900) {
    this.cooldownMs = cooldownMs;
  }

  reset(): void {
    this.invulnerableUntilMs = 0;
  }

  canTakeDamage(nowMs: number): boolean {
    return nowMs >= this.invulnerableUntilMs;
  }

  registerDamage(nowMs: number): void {
    this.invulnerableUntilMs = nowMs + this.cooldownMs;
  }
}
