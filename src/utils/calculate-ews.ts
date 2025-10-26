import fs from 'fs';
import { FeatureCollection, Polygon, MultiPolygon, LineString } from 'geojson';
import { point } from '@turf/helpers';
import distance from '@turf/distance';
import nearestPointOnLine from '@turf/nearest-point-on-line';

/**
 * Find nearest coastal distance (in meters) to a given lat/lon
 */
export const findNearestCoastDistance = (
  geojsonFile: string,
  lat: number,
  lon: number,
): number => {
  const geojsonData = JSON.parse(
    fs.readFileSync(geojsonFile, 'utf8'),
  ) as FeatureCollection<Polygon | MultiPolygon>;

  const pt = point([lon, lat]);

  let minDistance: number | null = null;

  for (const feature of geojsonData.features) {
    const geom = feature.geometry;

    if (geom.type === 'Polygon') {
      const coords = geom.coordinates[0];
      const line = { type: 'LineString', coordinates: coords } as const;

      const nearest = nearestPointOnLine(line, pt);
      const d = distance(pt, nearest, { units: 'meters' });

      if (minDistance === null || d < minDistance) {
        minDistance = d;
      }
    }

    if (geom.type === 'MultiPolygon') {
      for (const poly of geom.coordinates) {
        const coords = poly[0];
        const line = { type: 'LineString', coordinates: coords } as const;

        const nearest = nearestPointOnLine(line, pt);
        const d = distance(pt, nearest, { units: 'meters' });

        if (minDistance === null || d < minDistance) {
          minDistance = d;
        }
      }
    }
  }

  return minDistance !== null ? minDistance : Infinity;
};

type PipelinePoint = {
  Latitude: number;
  Longitude: number;
  Name?: string;
};

/**
 * Check ship safety against pipeline
 * Return:
 *  0 = DANGER (< 500m)
 *  1 = WARNING (500–1750m)
 *  3 = SAFE (> 1750m)
 */
export const checkShipStatus = (
  lat: number,
  lon: number,
  navstatus: number,
): 0 | 1 | 3 => {
  const pipelineData = JSON.parse(
    fs.readFileSync('data/pipeline.json', 'utf8'),
  ) as { pipeline: PipelinePoint[] };

  const line: LineString = {
    type: 'LineString',
    coordinates: pipelineData.pipeline.map((p) => [p.Longitude, p.Latitude]),
  };

  const pt = point([lon, lat]);
  const nearest = nearestPointOnLine(line, pt);
  const d = distance(pt, nearest, { units: 'meters' });

  if (navstatus === 1) {
    if (d < 500) return 0;
    if (d < 1750) return 1;
  }
  return 3;
};
