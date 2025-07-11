import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ApplicationService } from '../../../shared/services/application.service';
import { AcademicYear } from '../../../shared/models/application.model';

@Component({
  selector: 'app-academic-years',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatSlideToggleModule],
  template: `
    <div class="container">
      <h1>Manage Academic Years</h1>
      
      <mat-card class="create-card">
        <mat-card-header>
          <mat-card-title>Add New Academic Year</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="yearForm" (ngSubmit)="createYear()">
            <mat-form-field class="form-field">
              <mat-label>Academic Year (e.g., 2024-2025)</mat-label>
              <input matInput formControlName="year" required>
            </mat-form-field>
            
            <div class="form-actions">
              <button mat-raised-button color="primary" type="submit" [disabled]="yearForm.invalid">
                Add Academic Year
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
      
      <mat-card class="list-card">
        <mat-card-header>
          <mat-card-title>Existing Academic Years</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div *ngFor="let year of academicYears" class="year-item">
            <div class="year-header">
              <h3>{{year.year}}</h3>
              <mat-slide-toggle 
                [checked]="year.active"
                (change)="toggleYear(year.id)">
                {{year.active ? 'Active' : 'Inactive'}}
              </mat-slide-toggle>
            </div>
            
            <div class="year-details">
              <p><strong>Created:</strong> {{year.createdAt | date}}</p>
              <p><strong>Status:</strong> {{year.active ? 'Available for new announcements' : 'Not available'}}</p>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .create-card, .list-card { margin-bottom: 20px; }
    .form-field { width: 100%; margin-bottom: 16px; }
    .form-actions { text-align: center; margin-top: 16px; }
    .year-item { border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 16px; }
    .year-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
    .year-details p { margin: 4px 0; }
  `]
})
export class AcademicYearsComponent implements OnInit {
  yearForm: FormGroup;
  academicYears: AcademicYear[] = [];

  constructor(
    private fb: FormBuilder,
    private applicationService: ApplicationService
  ) {
    this.yearForm = this.fb.group({
      year: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadAcademicYears();
  }

  loadAcademicYears() {
    this.applicationService.getAcademicYears().subscribe({
      next: (data) => this.academicYears = data,
      error: (error) => console.error('Error loading academic years', error)
    });
  }

  createYear() {
    if (this.yearForm.valid) {
      this.applicationService.createAcademicYear(this.yearForm.get('year')?.value).subscribe({
        next: () => {
          alert('Academic year created successfully!');
          this.yearForm.reset();
          this.loadAcademicYears();
        },
        error: (error) => console.error('Error creating academic year', error)
      });
    }
  }

  toggleYear(id: number) {
    this.applicationService.toggleAcademicYear(id).subscribe({
      next: () => {
        this.loadAcademicYears();
      },
      error: (error) => console.error('Error toggling academic year', error)
    });
  }
}