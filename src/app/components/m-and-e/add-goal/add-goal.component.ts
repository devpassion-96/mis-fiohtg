import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

import { Router } from '@angular/router';
import { GoalService } from 'src/app/services/mis/goal.service';

@Component({
  selector: 'app-add-goal',
  templateUrl: './add-goal.component.html',
  styleUrls: ['./add-goal.component.css']
})
export class AddGoalComponent {
  addGoalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private goalService: GoalService,
    private router: Router
  ) {
    this.addGoalForm = this.fb.group({
      level: ['', Validators.required],
      objectives: this.fb.array([])
    });

    // Initialize with one objective
    this.addObjective();
  }

  get objectives() {
    return this.addGoalForm.get('objectives') as FormArray;
  }

  addObjective(): void {
    const objectiveFormGroup = this.fb.group({
      description: ['', Validators.required],
      isLocked: [false],
      indicators: this.fb.array([])
    });
    this.objectives.push(objectiveFormGroup);

    // Initialize with one indicator for the new objective
    this.addIndicator(this.objectives.length - 1);
  }

  getIndicators(objectiveIndex: number): FormArray {
    return this.objectives.at(objectiveIndex).get('indicators') as FormArray;
  }

  addIndicator(objectiveIndex: number): void {
    const indicatorFormGroup = this.fb.group({
      description: ['', Validators.required],
      baselineValue: ['', Validators.required],
      isBaselineLocked: [false],
      meansOfVerification: ['', Validators.required],
      targetPeriods: this.fb.array([])
    });
    this.getIndicators(objectiveIndex).push(indicatorFormGroup);

    // Initialize with one target period for the new indicator
    this.addTargetPeriod(objectiveIndex, this.getIndicators(objectiveIndex).length - 1);
  }

  getTargetPeriods(objectiveIndex: number, indicatorIndex: number): FormArray {
    return this.getIndicators(objectiveIndex).at(indicatorIndex).get('targetPeriods') as FormArray;
  }

  addTargetPeriod(objectiveIndex: number, indicatorIndex: number): void {
    const targetPeriodFormGroup = this.fb.group({
      periodType: ['', Validators.required],
      periodValue: ['', Validators.required],
      targets: this.fb.group({
        female: [0, Validators.required],
        male: [0, Validators.required],
        total: [0, Validators.required]
      }),
      achieved: this.fb.group({
        female: [0, Validators.required],
        male: [0, Validators.required],
        total: [0, Validators.required]
      }),
      status: ['Not Attained']
    });
    this.getTargetPeriods(objectiveIndex, indicatorIndex).push(targetPeriodFormGroup);
  }

  onSubmit(): void {
    if (this.addGoalForm.valid) {
      this.goalService.createGoal(this.addGoalForm.value).subscribe(
        (response) => {
          console.log('Goal created successfully!', response);
          this.router.navigate(['/goal-list']); // Navigate to the goals list after successful creation
        },
        (error) => {
          console.error('Error creating goal!', error);
        }
      );
    }
  }
}
