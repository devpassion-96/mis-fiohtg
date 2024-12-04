import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PerformanceIndicatorService } from 'src/app/services/mis/performanceIndicator';

@Component({
  selector: 'app-performance-edit',
  templateUrl: './performance-edit.component.html',
  styleUrls: ['./performance-edit.component.css']
})
export class PerformanceEditComponent implements OnInit {
  editForm: FormGroup;
  id: string; // Placeholder for the ID of the performance indicator to be edited

  constructor(
    private fb: FormBuilder,
    private service: PerformanceIndicatorService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.editForm = this.fb.group({
      level: ['', Validators.required],
      interventionLogic: ['', Validators.required],
      verifiableIndicators: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.loadIndicatorDetails(this.id);
  }

  loadIndicatorDetails(id: string): void {
    this.service.getById(id).subscribe(indicator => {
      // this.editForm.patchValue({

      // });

      // Clear existing form array and populate with fetched data
      this.verifiableIndicators.clear();
      indicator.verifiableIndicators.forEach(vi => {
        this.verifiableIndicators.push(this.fb.group({

          level: [vi.level, Validators.required],
          interventionLogic:[vi.interventionLogic, Validators.required],
          indicator: [vi.indicator, Validators.required],
          baseline: [vi.baseline, Validators.required],
          meansOfVerification: [vi.meansOfVerification, Validators.required],
          targetData: this.setTargetData(vi.targetData) // Method to populate target data
        }));
      });
    });
  }

  setTargetData(targetDatas: any[]): FormArray {
    const targetDataArray = new FormArray([]);
    targetDatas.forEach(td => {
      let targetDataGroup = this.fb.group({
        period: [td.period, Validators.required],
        targetFemale: [td.targetFemale, Validators.required],
        targetMale: [td.targetMale, Validators.required],
        achievedFemale: [td.achievedFemale, Validators.required],
        achievedMale: [td.achievedMale, Validators.required],
        varianceFemale: [td.varianceFemale, {disabled: true}],
        varianceMale: [td.varianceMale, {disabled: true}]
      });

      this.attachVarianceListeners(targetDataGroup);
      targetDataArray.push(targetDataGroup);
    });
    return targetDataArray;
  }
  private attachVarianceListeners(targetDataGroup: FormGroup): void {
    // Subscribe to changes in target and achieved values to update variances
    const targetFemaleControl = targetDataGroup.get('targetFemale');
    const achievedFemaleControl = targetDataGroup.get('achievedFemale');
    const targetMaleControl = targetDataGroup.get('targetMale');
    const achievedMaleControl = targetDataGroup.get('achievedMale');

    if (targetFemaleControl && achievedFemaleControl && targetMaleControl && achievedMaleControl) {
      targetFemaleControl.valueChanges.subscribe(() => this.updateVariance(targetDataGroup));
      achievedFemaleControl.valueChanges.subscribe(() => this.updateVariance(targetDataGroup));
      targetMaleControl.valueChanges.subscribe(() => this.updateVariance(targetDataGroup));
      achievedMaleControl.valueChanges.subscribe(() => this.updateVariance(targetDataGroup));
    }
  }



  get verifiableIndicators(): FormArray {
    return this.editForm.get('verifiableIndicators') as FormArray;
  }

  addTargetData(verifiableIndicatorIndex: number): void {
    const targetData = this.targetData(verifiableIndicatorIndex);
    targetData.push(this.fb.group({
      period: ['', Validators.required],
      targetFemale: [0, Validators.required],
      targetMale: [0, Validators.required],
      achievedFemale: [0, Validators.required],
      achievedMale: [0, Validators.required],
      varianceFemale: [0],
      varianceMale: [0]
    }));
  }


  targetData(index: number): FormArray {
    return this.verifiableIndicators.at(index).get('targetData') as FormArray;
  }

  initTargetData(): FormGroup {
    const targetDataGroup = this.fb.group({
      period: ['', Validators.required],
      targetFemale: [0, Validators.required],
      targetMale: [0, Validators.required],
      achievedFemale: [0, Validators.required],
      achievedMale: [0, Validators.required],
      varianceFemale: [],
      varianceMale: []
     });

    // Set up listeners for changes to calculate variances
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

    const varianceFemale = achievedFemale - targetFemale;
    const varianceMale = achievedMale - targetMale;

    targetDataGroup.patchValue({
      varianceFemale: varianceFemale,
      varianceMale: varianceMale
    }, {emitEvent: false}); // Prevent infinite loop by not emitting further events
  }


initVerifiableIndicators(): FormGroup {
  return this.fb.group({
    indicator: ['', Validators.required],
    baseline: ['', Validators.required],
    meansOfVerification: ['', Validators.required],
    targetData: this.fb.array([this.initTargetData()]) // Assuming you have a similar method to initialize target data
  });
}


  addVerifiableIndicator(): void {
    const verifiableIndicatorGroup = this.initVerifiableIndicators();
    this.verifiableIndicators.push(verifiableIndicatorGroup);
  }


  onSubmit(): void {
    if (this.editForm.valid) {
      console.log(this.editForm); // Log the whole form group
      console.log('Form Valid:', this.editForm.valid);
      console.log('Form Value:', this.editForm.value);
      console.log('Form Errors:', this.editForm.errors);
      // Include variance calculations in the form payload for submission
      const formValueWithVariances = this.includeVariancesInPayload(this.editForm.value);
      this.service.update(this.id, formValueWithVariances).subscribe(() => {
        this.router.navigate(['/performance-list']);
      });
    }
  }

  includeVariancesInPayload(formValue: any): any {
    // Deep clone formValue to safely modify and include variance calculations
    const payload = JSON.parse(JSON.stringify(formValue));
    payload.verifiableIndicators.forEach(vi => {
      vi.targetData.forEach(td => {
     const targetFemale = td.targetFemale;
        const achievedFemale = td.achievedFemale;
        const targetMale = td.targetMale;
        const achievedMale = td.achievedMale;
        td.varianceFemale = achievedFemale - targetFemale;
        td.varianceMale = achievedMale - targetMale;
      });
    });
    return payload;
  }



}
