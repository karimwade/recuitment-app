import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { ApplicationService } from '../../../shared/services/application.service';

@Component({
  selector: 'app-apply',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatInputModule],
  template: `
    <div class="container">
      <mat-card class="apply-card">
        <mat-card-header>
          <mat-card-title>Submit Application</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <form [formGroup]="applicationForm" (ngSubmit)="onSubmit()">
            <mat-form-field class="form-field">
              <mat-label>Application Type</mat-label>
              <mat-select formControlName="type" required>
                <mat-option value="NEW">New Application</mat-option>
                <mat-option value="RENEWAL">Renewal (Returning Tutor)</mat-option>
              </mat-select>
            </mat-form-field>
            
            <div class="file-upload">
              <h4>Required Documents:</h4>
              
              <div class="file-field">
                <label>CV (PDF, max 10MB):</label>
                <input type="file" (change)="onFileSelect($event, 'cv')" accept=".pdf" required>
              </div>
              
              <div class="file-field">
                <label>Degree Certificate (PDF, max 10MB):</label>
                <input type="file" (change)="onFileSelect($event, 'degree')" accept=".pdf" required>
              </div>
              
              <div class="file-field">
                <label>Cover Letter (PDF, max 10MB):</label>
                <input type="file" (change)="onFileSelect($event, 'coverLetter')" accept=".pdf" required>
              </div>
            </div>
            
            <div class="text-center mt-20">
              <button mat-raised-button color="primary" type="submit" 
                      [disabled]="applicationForm.invalid || !allFilesSelected()">
                Submit Application
              </button>
              <button mat-button type="button" (click)="router.navigate(['/announcements'])" class="ml-10">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .apply-card { width: 100%; }
    .file-upload { margin: 20px 0; }
    .file-field { margin: 16px 0; }
    .file-field label { display: block; margin-bottom: 8px; font-weight: 500; }
    .file-field input[type="file"] { width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    .ml-10 { margin-left: 10px; }
  `]
})
export class ApplyComponent implements OnInit {
  applicationForm: FormGroup;
  announcementId!: number;
  selectedFiles: { [key: string]: File } = {};

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    public router: Router,
    private applicationService: ApplicationService
  ) {
    this.applicationForm = this.fb.group({
      type: ['NEW', Validators.required]
    });
  }

  ngOnInit() {
    this.announcementId = Number(this.route.snapshot.paramMap.get('id'));
  }

  onFileSelect(event: any, fileType: string) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      if (file.type !== 'application/pdf') {
        alert('Only PDF files are allowed');
        return;
      }
      this.selectedFiles[fileType] = file;
    }
  }

  allFilesSelected(): boolean {
    return !!(this.selectedFiles['cv'] && this.selectedFiles['degree'] && this.selectedFiles['coverLetter']);
  }

  onSubmit() {
    if (this.applicationForm.valid && this.allFilesSelected()) {
      const formData = new FormData();
      formData.append('announcementId', this.announcementId.toString());
      formData.append('type', this.applicationForm.get('type')?.value);
      formData.append('cv', this.selectedFiles['cv']);
      formData.append('degree', this.selectedFiles['degree']);
      formData.append('coverLetter', this.selectedFiles['coverLetter']);

      this.applicationService.submitApplication(formData).subscribe({
        next: (response) => {
          alert('Application submitted successfully!');
          this.router.navigate(['/candidate/applications']);
        },
        error: (error) => {
          console.error('Error submitting application', error);
          alert('Error submitting application. Please try again.');
        }
      });
    }
  }
}