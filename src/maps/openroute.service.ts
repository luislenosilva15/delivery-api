import { Injectable } from '@nestjs/common';

type ORSGeocodeFeature = {
  geometry?: { coordinates?: [number, number] };
};

type ORSRouteResponse = {
  features?: Array<{
    properties?: {
      summary?: { distance?: number; duration?: number };
    };
  }>;
};

@Injectable()
export class OpenRouteServiceClient {
  private readonly apiKey = process.env.OPENROUTESERVICE_API_KEY;
  private readonly baseUrl = 'https://api.openrouteservice.org';

  private ensureFetch(): typeof fetch {
    if (typeof fetch === 'undefined') {
      throw new Error('Global fetch is not available in this runtime.');
    }
    return fetch;
  }

  private get headers() {
    if (!this.apiKey) {
      throw new Error('Missing OPENROUTESERVICE_API_KEY in environment');
    }
    return { Authorization: this.apiKey };
  }

  async geocode(text: string): Promise<{ lat: number; lon: number } | null> {
    const f = this.ensureFetch();
    const url = new URL(this.baseUrl + '/geocode/search');
    url.searchParams.set('text', text);
    url.searchParams.set('size', '1');

    const res = await f(url.toString(), { headers: this.headers });
    if (!res.ok) {
      throw new Error(
        `OpenRouteService geocode failed: ${res.status} ${res.statusText}`,
      );
    }
    const data = (await res.json()) as { features?: ORSGeocodeFeature[] };
    const coords = data.features?.[0]?.geometry?.coordinates;
    if (!coords || coords.length < 2) return null;
    const [lon, lat] = coords;
    return { lat, lon };
  }

  async routeDistance(
    profile: 'driving-car' | 'foot-walking' | 'cycling-regular' = 'driving-car',
    start: { lat: number; lon: number },
    end: { lat: number; lon: number },
  ): Promise<{ distanceMeters: number; durationSeconds: number }> {
    const f = this.ensureFetch();
    const url = new URL(this.baseUrl + `/v2/directions/${profile}`);
    url.searchParams.set('start', `${start.lon},${start.lat}`);
    url.searchParams.set('end', `${end.lon},${end.lat}`);

    const res = await f(url.toString(), { headers: this.headers });
    if (!res.ok) {
      throw new Error(
        `OpenRouteService route failed: ${res.status} ${res.statusText}`,
      );
    }
    const data = (await res.json()) as ORSRouteResponse;
    const summary = data.features?.[0]?.properties?.summary;
    const distanceMeters = summary?.distance ?? 0;
    const durationSeconds = summary?.duration ?? 0;
    return { distanceMeters, durationSeconds };
  }
}
