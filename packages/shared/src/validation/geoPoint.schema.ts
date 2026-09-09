import { z } from 'zod';

/** Plain lat/lng pair — PostGIS geography storage is an apps/api concern. */
export const geoPointSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type GeoPoint = z.infer<typeof geoPointSchema>;
