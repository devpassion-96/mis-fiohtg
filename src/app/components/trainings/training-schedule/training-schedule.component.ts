import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Training } from 'src/app/models/training.model';
import { TrainingService } from 'src/app/services/hrm/training.service';
@Component({
  selector: 'app-training-schedule',
  templateUrl: './training-schedule.component.html',
  styleUrls: ['./training-schedule.component.css']
})
export class TrainingScheduleComponent implements OnInit {
  trainings: Training[] = [];

  constructor(private trainingService: TrainingService, private router: Router) {}

  ngOnInit(): void {
    this.loadTrainings();
  }

  loadTrainings(): void {
    this.trainingService.getAllTrainings().subscribe(
      (data) => {
        this.trainings = data;
      },
      (error) => {
        // Handle errors here, e.g., logging and user feedback
      }
    );
  }


  editTraining(trainingId: string) {
    this.router.navigate(['/training-edit', trainingId]);
  }

  deleteTraining(id: string): void {
    if (confirm('Are you sure you want to delete this training event?')) {
      this.trainingService.deleteTraining(id).subscribe({
        next: () => {
          this.trainings = this.trainings.filter(training => training.id !== id);
          // Add success notification here if needed
        },
        error: (err) => console.error('Error deleting training:', err)
      });
    }
  }
}
