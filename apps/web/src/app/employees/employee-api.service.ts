import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Employee, EmployeeInput, EmployeePage } from './employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeApiService {
  private readonly endpoint = '/employees';

  constructor(private readonly http: HttpClient) {}

  list(page = 1, limit = 10): Observable<EmployeePage> {
    return this.http.get<EmployeePage>(this.endpoint, {
      params: { page, limit },
    });
  }

  get(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.endpoint}/${id}`);
  }

  create(input: EmployeeInput): Observable<Employee> {
    return this.http.post<Employee>(this.endpoint, input);
  }

  update(id: string, input: EmployeeInput): Observable<Employee> {
    return this.http.put<Employee>(`${this.endpoint}/${id}`, input);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}
