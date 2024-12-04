import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TrainingService } from 'src/app/services/hrm/training.service';

@Component({
  selector: 'app-training-add',
  templateUrl: './training-add.component.html',
  styleUrls: ['./training-add.component.css']
})
export class TrainingAddComponent {
  trainingForm: FormGroup;

  constructor(private fb: FormBuilder, private trainingService: TrainingService, private router: Router) {
    this.trainingForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      trainer: ['', Validators.required],
      location: ['']
    });
  }

  onSubmit(): void {
    if (this.trainingForm.valid) {
      this.trainingService.addTraining(this.trainingForm.value).subscribe({
        next: () => this.router.navigate(['/training-schedule']),
        error: (err) => console.error('Error adding training:', err)
      });
    }
  }
}
