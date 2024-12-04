import { Component, OnInit } from '@angular/core';
import { Goal } from 'src/app/models/goal.model';
import { GoalService } from 'src/app/services/mis/goal.service';

@Component({
  selector: 'app-goals-list',
  templateUrl: './goals-list.component.html',
  styleUrls: ['./goals-list.component.css']
})
export class GoalsListComponent implements OnInit {
  goals: Goal[] = [];

  constructor(private goalService: GoalService) {}

  ngOnInit(): void {
    this.fetchGoals();
  }

  fetchGoals(): void {
    this.goalService.getAllGoals().subscribe(
      (data: Goal[]) => {
        this.goals = data;
      },
      (error) => {
        console.error('There was an error!', error);
      }
    );
  }
}
