import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, Announcement, AcademicYear } from '../models/application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
  private apiUrl = 'http://localhost:8080/api';

  constructor(private http: HttpClient) {}

  getActiveAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements/active`);
  }

  getAllAnnouncements(): Observable<Announcement[]> {
    return this.http.get<Announcement[]>(`${this.apiUrl}/announcements`);
  }

  createAnnouncement(data: any): Observable<Announcement> {
    return this.http.post<Announcement>(`${this.apiUrl}/announcements`, data);
  }

  toggleAnnouncement(id: number): Observable<Announcement> {
    return this.http.put<Announcement>(`${this.apiUrl}/announcements/${id}/toggle`, {});
  }

  getAcademicYears(): Observable<AcademicYear[]> {
    return this.http.get<AcademicYear[]>(`${this.apiUrl}/academic-years`);
  }

  getActiveAcademicYears(): Observable<AcademicYear[]> {
    return this.http.get<AcademicYear[]>(`${this.apiUrl}/academic-years/active`);
  }

  createAcademicYear(year: string): Observable<AcademicYear> {
    return this.http.post<AcademicYear>(`${this.apiUrl}/academic-years`, { year });
  }

  toggleAcademicYear(id: number): Observable<AcademicYear> {
    return this.http.put<AcademicYear>(`${this.apiUrl}/academic-years/${id}/toggle`, {});
  }

  submitApplication(formData: FormData): Observable<Application> {
    return this.http.post<Application>(`${this.apiUrl}/applications/submit`, formData);
  }

  getMyApplications(): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}/applications/my`);
  }

  searchApplications(filters: any): Observable<any> {
    let params = new HttpParams();
    if (filters.name) params = params.set('name', filters.name);
    if (filters.email) params = params.set('email', filters.email);
    if (filters.year) params = params.set('year', filters.year);
    params = params.set('page', filters.page || 0);
    params = params.set('size', filters.size || 10);

    return this.http.get<any>(`${this.apiUrl}/applications/search`, { params });
  }

  updateApplicationStatus(id: number, status: string, reason?: string): Observable<Application> {
    let params = new HttpParams().set('status', status);
    if (reason) params = params.set('reason', reason);
    
    return this.http.put<Application>(`${this.apiUrl}/applications/${id}/status`, {}, { params });
  }
}