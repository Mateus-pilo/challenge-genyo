import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Employee, EmployeeSaveRequest } from '../employee.model';

export type ConfirmationMode = 'save' | 'delete' | null;

@Component({
  selector: 'app-confirmation-dialog',
  imports: [CommonModule],
  templateUrl: './confirmation-dialog.component.html',
  styleUrl: './confirmation-dialog.component.css',
})
export class ConfirmationDialogComponent {
  @Input() mode: ConfirmationMode | null = null;
  @Input() request: EmployeeSaveRequest | null = null;
  @Input() employee: Employee | null = null;
  @Input() editing = false;
  @Input() saving = false;

  @Output() dismissed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
}
