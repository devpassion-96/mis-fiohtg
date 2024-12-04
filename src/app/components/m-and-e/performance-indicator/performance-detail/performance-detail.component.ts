import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PerformanceIndicator, VerifiableIndicator, TargetData } from 'src/app/models/m-and-e/performance-indicator.model';
import { PerformanceIndicatorService } from 'src/app/services/mis/performanceIndicator';

@Component({
  selector: 'app-performance-detail',
  templateUrl: './performance-detail.component.html',
  styleUrls: ['./performance-detail.component.css']
})
export class PerformanceDetailComponent implements OnInit {
  indicator: PerformanceIndicator | undefined;

  cumulativeAchieved: number = 0;
  cumulativeTarget: number = 0;
  cumulativeVariance: number = 0;
  status: 'Attained' | 'Not Attained' = 'Not Attained';

  constructor(
    private route: ActivatedRoute,
    private performanceIndicatorService: PerformanceIndicatorService
  ) { }

  ngOnInit(): void {
    this.getIndicator();
  }

  getIndicator(): void {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.performanceIndicatorService.getById(id).subscribe(indicator => {
      this.indicator = indicator;
      this.calculateCumulativeValues(indicator.verifiableIndicators);
    });
  }

  calculateCumulativeValues(verifiableIndicators: VerifiableIndicator[]): void {
    let cumulativeAchievedFemale = 0;
    let cumulativeAchievedMale = 0;
    let cumulativeTargetFemale = 0;
    let cumulativeTargetMale = 0;

    verifiableIndicators.forEach(vi => {
      vi.targetData.forEach(td => {
        cumulativeAchievedFemale += td.achievedFemale || 0;
        cumulativeAchievedMale += td.achievedMale || 0;
        cumulativeTargetFemale += td.targetFemale || 0;
        cumulativeTargetMale += td.targetMale || 0;
      });
    });

    this.cumulativeAchieved = cumulativeAchievedFemale + cumulativeAchievedMale;
    this.cumulativeTarget = cumulativeTargetFemale + cumulativeTargetMale;
    this.cumulativeVariance = this.cumulativeAchieved - this.cumulativeTarget;

    // Set status based on cumulative achieved vs target
  this.status = this.cumulativeAchieved >= this.cumulativeTarget ? 'Attained' : 'Not Attained';

  }

  printPage(): void {
    window.print();
  }
}
