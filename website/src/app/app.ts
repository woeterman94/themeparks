import { Component, inject } from '@angular/core';
import { NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { ThemeParkWaitTimesService } from './theme-park-wait-times.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, NgFor, RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly waitTimesService = inject(ThemeParkWaitTimesService);
  private readonly router = inject(Router);

  protected readonly parks = this.waitTimesService.getThemeParks();
  protected selectedParkSlug = this.parks[0]?.slug ?? '';

  constructor() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        const url = (event as NavigationEnd).urlAfterRedirects;
        const slug = url.split('/').at(-1);
        if (slug) {
          this.selectedParkSlug = slug;
        }
      });
  }

  onParkSelected(slug: string): void {
    this.selectedParkSlug = slug;
    this.router.navigate(['/parks', slug]);
  }
}
