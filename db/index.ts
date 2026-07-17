// This site is static and does not use a database. Keep the helper as an
// explicit guard so an accidental future database call fails clearly.
export function getDb(): never {
  throw new Error("A database is not configured for the static site.");
}
