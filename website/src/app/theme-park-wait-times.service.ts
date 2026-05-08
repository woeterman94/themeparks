import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { THEME_PARKS, ThemeParkConfig } from './theme-park-config';

export interface RideWaitTime {
  id: string;
  name: string;
  waitTime: number | null;
  status: string;
  lastUpdated: Date | null;
}

@Injectable({
  providedIn: 'root'
})
export class ThemeParkWaitTimesService {
  constructor(private readonly http: HttpClient) {}

  getThemeParks(): ThemeParkConfig[] {
    return THEME_PARKS;
  }

  getThemeParkBySlug(slug: string): ThemeParkConfig | undefined {
    return THEME_PARKS.find((park) => park.slug === slug);
  }

  getWaitTimesForPark(park: ThemeParkConfig): Observable<RideWaitTime[]> {
    return this.http.get<unknown>(park.api.endpoint).pipe(
      map((response) => this.resolvePath(response, park.api.responsePath)),
      map((rides) => (Array.isArray(rides) ? rides : [])),
      map((rides) =>
        rides
          .map((ride) => this.mapRide(park, ride))
          .filter((ride): ride is RideWaitTime => ride !== null)
      )
    );
  }

  private mapRide(park: ThemeParkConfig, payload: unknown): RideWaitTime | null {
    if (!payload || typeof payload !== 'object') {
      return null;
    }

    const rideId = this.resolvePath(payload, park.api.fields.id);
    const rideName = this.resolvePath(payload, park.api.fields.name);
    const rideStatus = this.resolvePath(payload, park.api.fields.status);
    const rideWaitTime = this.resolvePath(payload, park.api.fields.waitTime);
    const rideLastUpdated = this.resolvePath(payload, park.api.fields.lastUpdated);

    const statusKey = String(rideStatus ?? 'Unknown');

    return {
      id: String(rideId ?? rideName ?? ''),
      name: String(rideName ?? 'Unknown Ride'),
      waitTime: this.parseWaitTime(rideWaitTime),
      status: park.api.statusMap[statusKey] ?? statusKey,
      lastUpdated: this.parseDate(rideLastUpdated)
    };
  }

  private parseWaitTime(waitTime: unknown): number | null {
    if (waitTime === null || waitTime === undefined || waitTime === '') {
      return null;
    }

    const parsed = Number(waitTime);
    return Number.isFinite(parsed) ? parsed : null;
  }

  private parseDate(value: unknown): Date | null {
    if (!value) {
      return null;
    }

    const date = new Date(String(value));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  private resolvePath(value: unknown, path?: string): unknown {
    if (!path) {
      return value;
    }

    return path.split('.').reduce<unknown>((current, key) => {
      if (current && typeof current === 'object' && key in (current as Record<string, unknown>)) {
        return (current as Record<string, unknown>)[key];
      }
      return undefined;
    }, value);
  }
}
