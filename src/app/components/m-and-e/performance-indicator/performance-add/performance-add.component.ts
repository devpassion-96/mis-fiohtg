import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project-management/project.model';
import { PerformanceIndicatorService } from 'src/app/services/mis/performanceIndicator';
import { ProjectService } from 'src/app/services/project-management/project.service';

@Component({
  selector: 'app-performance-add',
  templateUrl: './performance-add.component.html',
  styleUrls: ['./performance-add.component.css']
})
export class PerformanceAddComponent implements OnInit {
  performanceForm: FormGroup;
  isEditMode: boolean = false;
  performanceId: string | null = null;

  cumulativeTargetMale: number = 0;
  cumulativeVarianceFemale: number = 0;
  cumulativeAchievedFemale = 0;
  cumulativeAchievedMale = 0;
  cumulativeTargetFemale = 0;
  cumulativeVarianceMale=0;
  cumulativeAchieved: number = 0;
  cumulativeTarget: number = 0;
  cumulativeVariance: number = 0;

  projects: Project[] = [];

  constructor(
    private fb: FormBuilder,
    private service: PerformanceIndicatorService,
    private router: Router,
    private projectService: ProjectService,
    private route: ActivatedRoute
  ) {
    this.performanceForm = this.fb.group({
      projectName: ['', Validators.required],
      verifiableIndicators: this.fb.array([this.initVerifiableIndicators()])
    });
  }

  ngOnInit(): void {
    // Check if there’s an ID in the route (i.e., if it's edit mode)
    this.performanceId = this.route.snapshot.paramMap.get('id');
    this.isEditMode = !!this.performanceId;

    // Fetch existing data if in edit mode
    if (this.isEditMode && this.performanceId) {
      this.service.getById(this.performanceId).subscribe((data) => {
        this.populateForm(data);
      });
    }

    this.projectService.getAllProjectRecords().subscribe(data => {
      this.projects = data;
    });

    // ValueChanges logic for cumulative calculations
    this.performanceForm.get('verifiableIndicators').valueChanges.subscribe(val => {
      this.calculateCumulativeValues();
    });
  }

  initVerifiableIndicators(): FormGroup {
    return this.fb.group({
      level: ['', Validators.required],
      interventionLogic: ['', Validators.required],
      indicator: ['', Validators.required],
      baseline: ['', Validators.required],
      meansOfVerification: ['', Validators.required],
      targetData: this.fb.array([this.initTargetData()])
    });
  }

  initTargetData(): FormGroup {
    const targetDataGroup = this.fb.group({
      period: ['', Validators.required],
      targetFemale: [0, Validators.required],
      targetMale: [0, Validators.required],
      achievedFemale: [0, Validators.required],
      achievedMale: [0, Validators.required],
      varianceFemale: [0],
      varianceMale: [0]
    });

    targetDataGroup.get('targetFemale').valueChanges.subscribe(() => {
      this.updateVariance(targetDataGroup);
    });
    targetDataGroup.get('targetMale').valueChanges.subscribe(() => {
      this.updateVariance(targetDataGroup);
    });
    targetDataGroup.get('achievedFemale').valueChanges.subscribe(() => {
      this.updateVariance(targetDataGroup);
    });
    targetDataGroup.get('achievedMale').valueChanges.subscribe(() => {
      this.updateVariance(targetDataGroup);
    });

    return targetDataGroup;
  }

  updateVariance(targetDataGroup: FormGroup): void {
    const targetFemale = targetDataGroup.get('targetFemale').value || 0;
    const achievedFemale = targetDataGroup.get('achievedFemale').value || 0;
    const targetMale = targetDataGroup.get('targetMale').value || 0;
    const achievedMale = targetDataGroup.get('achievedMale').value || 0;

    targetDataGroup.patchValue({
      varianceFemale: achievedFemale - targetFemale,
      varianceMale: achievedMale - targetMale
    }, { emitEvent: false });
  }

  calculateCumulativeValues() {
    this.cumulativeAchievedFemale = 0;
    this.cumulativeAchievedMale = 0;
    this.cumulativeTargetFemale = 0;
    this.cumulativeTargetMale = 0;

    const verifiableIndicators = this.performanceForm.value.verifiableIndicators;
    verifiableIndicators.forEach(vi => {
      vi.targetData.forEach(td => {
        this.cumulativeAchievedFemale += td.achievedFemale || 0;
        this.cumulativeAchievedMale += td.achievedMale || 0;
        this.cumulativeTargetFemale += td.targetFemale || 0;
        this.cumulativeTargetMale += td.targetMale || 0;
      });
    });

    this.cumulativeVarianceFemale = this.cumulativeTargetFemale - this.cumulativeAchievedFemale;
    this.cumulativeVarianceMale = this.cumulativeTargetMale - this.cumulativeAchievedMale;
    this.cumulativeAchieved = this.cumulativeAchievedFemale + this.cumulativeAchievedMale;
    this.cumulativeTarget = this.cumulativeTargetFemale + this.cumulativeTargetMale;
    this.cumulativeVariance = this.cumulativeAchieved - this.cumulativeTarget;
  }

  get verifiableIndicators(): FormArray {
    return this.performanceForm.get('verifiableIndicators') as FormArray;
  }

  addVerifiableIndicator(): void {
    this.verifiableIndicators.push(this.initVerifiableIndicators());
  }

  removeVerifiableIndicator(index: number): void {
    this.verifiableIndicators.removeAt(index);
  }

  targetData(index: number): FormArray {
    return this.verifiableIndicators.at(index).get('targetData') as FormArray;
  }

  addTargetData(verifiableIndicatorIndex: number): void {
    this.targetData(verifiableIndicatorIndex).push(this.initTargetData());
  }

    // Duplicate entire form structure
    duplicateForm(): void {
      const duplicate = JSON.parse(JSON.stringify(this.performanceForm.value));
  
      // Clear current indicators and re-populate them from the duplicated data
      const indicatorsArray = this.performanceForm.get('verifiableIndicators') as FormArray;
      indicatorsArray.clear();
  
      duplicate.verifiableIndicators.forEach((indicator: any) => {
        const indicatorFormGroup = this.initVerifiableIndicators();
        indicatorFormGroup.patchValue(indicator);
  
        const targetDataArray = indicatorFormGroup.get('targetData') as FormArray;
        targetDataArray.clear();
        indicator.targetData.forEach((target: any) => {
          const targetDataFormGroup = this.initTargetData();
          targetDataFormGroup.patchValue(target);
          targetDataArray.push(targetDataFormGroup);
        });
  
        indicatorsArray.push(indicatorFormGroup);
      });
  
      // Reset project name to prompt for a new selection if desired
      this.performanceForm.patchValue({
        projectName: '',
      });

       // Set up for creating a new record instead of updating
        this.performanceId = null;
        this.isEditMode = false;
    }
  onSubmit(): void {
    if (this.performanceForm.valid) {
      const payload = this.includeVariancesInPayload(this.performanceForm.value);

      if (this.isEditMode && this.performanceId) {
        this.service.update(this.performanceId, payload).subscribe({
          next: () => this.router.navigate(['/performance-list']),
          error: (err) => console.error('Error updating form:', err)
        });
      } else {
        this.service.create(payload).subscribe({
          next: () => this.router.navigate(['/performance-list']),
          error: (err) => console.error('Error submitting form:', err)
        });
      }
    } else {
      console.error('Form is invalid', this.performanceForm.errors);
      this.logInvalidControls(this.performanceForm);
    }
  }

  includeVariancesInPayload(formValue: any): any {
    const payload = JSON.parse(JSON.stringify(formValue));
    payload.verifiableIndicators.forEach(vi => {
      vi.targetData.forEach(td => {
        td.varianceFemale = td.achievedFemale - td.targetFemale;
        td.varianceMale = td.achievedMale - td.targetMale;
      });
    });
    return payload;
  }

  // populateForm(data: any) {
  //   this.performanceForm.patchValue({
  //     projectName: data.projectName,
  //     verifiableIndicators: data.verifiableIndicators.map(vi => ({
  //       level: vi.level,
  //       interventionLogic: vi.interventionLogic,
  //       indicator: vi.indicator,
  //       baseline: vi.baseline,
  //       meansOfVerification: vi.meansOfVerification,
  //       targetData: vi.targetData.map(td => ({
  //         period: td.period,
  //         targetFemale: td.targetFemale,
  //         targetMale: td.targetMale,
  //         achievedFemale: td.achievedFemale,
  //         achievedMale: td.achievedMale,
  //         varianceFemale: td.achievedFemale - td.targetFemale,
  //         varianceMale: td.achievedMale - td.targetMale
  //       }))
  //     }))
  //   });
  // }

  populateForm(data: any) {
    this.performanceForm.patchValue({
      projectName: data.projectName,
    });
  
    // Clear existing FormArray controls before loading data
    const indicatorsArray = this.performanceForm.get('verifiableIndicators') as FormArray;
    indicatorsArray.clear();
  
    data.verifiableIndicators.forEach((indicator) => {
      const indicatorFormGroup = this.initVerifiableIndicators();
      indicatorFormGroup.patchValue(indicator);
  
      // Populate targetData array for each indicator
      const targetDataArray = indicatorFormGroup.get('targetData') as FormArray;
      targetDataArray.clear();
      indicator.targetData.forEach((target) => {
        const targetDataFormGroup = this.initTargetData();
        targetDataFormGroup.patchValue(target);
        targetDataArray.push(targetDataFormGroup);
      });
  
      indicatorsArray.push(indicatorFormGroup);
    });
  }
  

  logInvalidControls(group: FormGroup | FormArray) {
    Object.keys(group.controls).forEach((key) => {
      const control = group.get(key);
      if (control instanceof FormGroup || control instanceof FormArray) {
        this.logInvalidControls(control);
      } else if (!control.valid) {
        console.log('Invalid Control:', key, 'Error:', control.errors);
      }
    });
  }
}
