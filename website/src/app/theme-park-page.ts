import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EMPTY, switchMap, timer } from 'rxjs';
import { ThemeParkConfig } from './theme-park-config';
import { RideWaitTime, ThemeParkWaitTimesService } from './theme-park-wait-times.service';

type SortField = 'name' | 'waitTime';

@Component({
  selector: 'app-theme-park-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './theme-park-page.html',
  styleUrl: './theme-park-page.scss'
})
export class ThemeParkPage implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly waitTimeService = inject(ThemeParkWaitTimesService);
  private readonly destroyRef = inject(DestroyRef);

  readonly park = signal<ThemeParkConfig | null>(null);
  readonly rides = signal<RideWaitTime[]>([]);
  readonly searchTerm = signal('');
  readonly sortField = signal<SortField>('waitTime');
  readonly sortDirection = signal<'asc' | 'desc'>('asc');
  readonly loading = signal(false);
  readonly errorMessage = signal('');
  readonly lastRefreshedAt = signal<Date | null>(null);

  readonly filteredRides = computed(() => {
    const normalizedTerm = this.searchTerm().trim().toLowerCase();
    const field = this.sortField();
    const direction = this.sortDirection();
    const directionModifier = direction === 'asc' ? 1 : -1;

    return [...this.rides()]
      .filter((ride) => (normalizedTerm ? ride.name.toLowerCase().includes(normalizedTerm) : true))
      .sort((left, right) => {
        if (field === 'name') {
          return left.name.localeCompare(right.name) * directionModifier;
        }

        const leftWait = left.waitTime ?? Number.POSITIVE_INFINITY;
        const rightWait = right.waitTime ?? Number.POSITIVE_INFINITY;
        return (leftWait - rightWait) * directionModifier;
      });
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const slug = params.get('parkSlug');
          if (!slug) {
            this.errorMessage.set('No theme park selected.');
            return EMPTY;
          }

          const park = this.waitTimeService.getThemeParkBySlug(slug);
          if (!park) {
            this.errorMessage.set('Theme park not found.');
            this.park.set(null);
            this.rides.set([]);
            return EMPTY;
          }

          this.park.set(park);
          this.errorMessage.set('');
          this.loading.set(true);

          return timer(0, 5 * 60 * 1000).pipe(switchMap(() => this.waitTimeService.getWaitTimesForPark(park)));
        }),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe({
        next: (rides) => {
          this.rides.set(rides);
          this.lastRefreshedAt.set(new Date());
          this.loading.set(false);
          this.errorMessage.set('');
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Unable to load wait times for this park. Please try again shortly.');
        }
      });

  }

  updateSortField(field: SortField): void {
    this.sortField.set(field);
  }

  onSortFieldChange(value: string): void {
    this.sortField.set(value === 'name' ? 'name' : 'waitTime');
  }

  toggleSortDirection(): void {
    this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
  }

  onSearchTermChange(value: string): void {
    this.searchTerm.set(value);
  }

  refreshNow(park: ThemeParkConfig): void {
    this.loading.set(true);
    this.waitTimeService
      .getWaitTimesForPark(park)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (rides) => {
          this.rides.set(rides);
          this.lastRefreshedAt.set(new Date());
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
          this.errorMessage.set('Unable to refresh wait times right now.');
        }
      });
  }

  trackByRide(_index: number, ride: RideWaitTime): string {
    return ride.id;
  }
}
