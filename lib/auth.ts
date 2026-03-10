export type RouteProtectionMode = "unprotected" | "protected";

/**
 * MICO-9: Access protection is implemented at the Traefik proxy layer via HTTP Basic Auth.
 * The app itself has no authentication logic in Sprint 1.
 *
 * This placeholder will become the hook for app-level auth when Basic Auth is replaced
 * by Google OAuth in a later sprint.
 */
export const routeProtection: RouteProtectionMode = "unprotected";
