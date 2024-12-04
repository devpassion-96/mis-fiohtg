import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { PerformanceIndicator } from 'src/app/models/m-and-e/performance-indicator.model';
import { PerformanceIndicatorService } from 'src/app/services/mis/performanceIndicator';
import { ProjectService } from 'src/app/services/project-management/project.service';

@Component({
  selector: 'app-performance-list',
  templateUrl: './performance-list.component.html',
  styleUrls: ['./performance-list.component.css']
})
export class PerformanceListComponent implements OnInit {
  performanceIndicators: PerformanceIndicator[] = [];

  constructor(
    private performanceIndicatorService: PerformanceIndicatorService,
    private projectService: ProjectService
  ) {}

  ngOnInit() {
    this.loadPerformanceIndicators();
  }

  loadPerformanceIndicators(): void {
    forkJoin({
      performanceIndicators: this.performanceIndicatorService.getAll(),
      projects: this.projectService.getAllProjectRecords()
    }).pipe(
      map(({ performanceIndicators, projects }) => {
        return performanceIndicators.map(indicator => ({
          ...indicator,
          projectName: projects.find(p => p._id === indicator.projectName)?.name || 'Unknown'
        }));
      })
    ).subscribe({
      next: (mappedIndicators) => {
        console.log('Mapped Performance Indicators:', mappedIndicators);
        this.performanceIndicators = mappedIndicators;
      },
      error: (error) => {
        console.error('Error loading performance indicators', error);
      }
    });
  }

  deleteIndicator(id: string): void {
    if (confirm('Are you sure you want to delete this indicator?')) {
      this.performanceIndicatorService.delete(id).subscribe(() => {
        this.performanceIndicators = this.performanceIndicators.filter(pi => pi._id !== id);
      }, error => console.error('Error deleting the indicator', error));
    }
  }
}
