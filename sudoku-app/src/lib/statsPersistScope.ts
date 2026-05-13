/** User id for stats localStorage key, or guest when signed out */
let statsPersistUserScope: string | null = null;

export function getStatsPersistScope(): string {
  return statsPersistUserScope ?? 'guest';
}

export function setStatsPersistUserScope(userId: string | null): void {
  statsPersistUserScope = userId;
}
