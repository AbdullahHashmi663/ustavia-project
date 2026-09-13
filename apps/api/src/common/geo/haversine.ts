/**
 * Great-circle distance in km. Plain application-code haversine rather than
 * a PostGIS ST_Distance query — the postgis extension's availability on
 * this Supabase instance hasn't been verified yet (ARCHITECTURE.md's
 * Hosting note). Fine for listing endpoints at today's scale; revisit with
 * a geography column + GiST index once "workers near me" needs a real
 * radius query pushed down to the database.
 */
export function haversineKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const EARTH_RADIUS_KM = 6371;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}
