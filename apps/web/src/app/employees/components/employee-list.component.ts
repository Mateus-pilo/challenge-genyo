import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import moment from 'moment';
import { Employee } from '../employee.model';

@Component({
  selector: 'app-employee-list',
  imports: [CommonModule],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css',
})
export class EmployeeListComponent {
  @Input() employees: Employee[] = [];
  @Input() currentPage = 1;
  @Input() total = 0;
  @Input() pageSize = 10;
  @Input() loading = false;

  @Output() create = new EventEmitter<void>();
  @Output() edit = new EventEmitter<Employee>();
  @Output() remove = new EventEmitter<Employee>();
  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  protected get totalPages(): number {
    return Math.ceil(this.total / this.pageSize);
  }

  protected get firstVisibleEmployee(): number {
    return this.total === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  protected get lastVisibleEmployee(): number {
    return Math.min(this.currentPage * this.pageSize, this.total);
  }

  protected getWorkDuration(employee: Employee): string {
    if (!employee.dismissalDate) {
      return '—';
    }

    const admission = moment.utc(employee.admissionDate, 'YYYY-MM-DD', true);
    const dismissal = moment.utc(employee.dismissalDate, 'YYYY-MM-DD', true);
    if (!admission.isValid() || !dismissal.isValid() || dismissal.isBefore(admission, 'day')) {
      return '—';
    }

    const days = dismissal.diff(admission, 'days') + 1;
    return `${days} ${days === 1 ? 'dia' : 'dias'}`;
  }

  protected previousPage(): void {
    this.pageChange.emit(Math.max(1, this.currentPage - 1));
  }

  protected nextPage(): void {
    this.pageChange.emit(Math.min(this.totalPages, this.currentPage + 1));
  }

  protected changePageSize(event: Event): void {
    const input = event.target as HTMLInputElement;
    const parsedLimit = Number(input.value);
    const limit = Number.isInteger(parsedLimit)
      ? Math.min(100, Math.max(1, parsedLimit))
      : this.pageSize;

    input.value = String(limit);
    if (limit !== this.pageSize) {
      this.pageSizeChange.emit(limit);
    }
  }
}
