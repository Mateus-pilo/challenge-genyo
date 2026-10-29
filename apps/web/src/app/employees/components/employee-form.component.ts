import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import moment from 'moment';
import { ClosingFrequency, Employee, EmployeeInput, EmployeeSaveRequest } from '../employee.model';

function dateOrderValidator(control: AbstractControl): ValidationErrors | null {
  const { admissionDate, dismissalDate } = control.value;
  if (!admissionDate || !dismissalDate) {
    return null;
  }

  const admission = moment(admissionDate, 'YYYY-MM-DD', true);
  const dismissal = moment(dismissalDate, 'YYYY-MM-DD', true);
  return admission.isValid() && dismissal.isValid() && dismissal.isBefore(admission, 'day')
    ? { dateOrder: true }
    : null;
}

function timeOrderValidator(control: AbstractControl): ValidationErrors | null {
  const { workStartTime, workEndTime } = control.value;
  if (!workStartTime || !workEndTime) {
    return null;
  }

  const start = moment(workStartTime, 'HH:mm', true);
  const end = moment(workEndTime, 'HH:mm', true);
  return start.isValid() && end.isValid() && end.isBefore(start) ? { timeOrder: true } : null;
}

@Component({
  selector: 'app-employee-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css',
})
export class EmployeeFormComponent {
  @Input() saving = false;
  @Input() set employee(value: Employee | null) {
    this.form.reset({
      name: value?.name ?? '',
      admissionDate: value?.admissionDate ?? '',
      dismissalDate: value?.dismissalDate ?? null,
      workStartTime: value?.workStartTime ?? '',
      workEndTime: value?.workEndTime ?? '',
      closingFrequency: value?.closingFrequency ?? '',
    });
  }

  @Output() cancelled = new EventEmitter<void>();
  @Output() saveRequested = new EventEmitter<EmployeeSaveRequest>();

  protected readonly frequencies = Object.values(ClosingFrequency);
  protected readonly form = new FormGroup(
    {
      name: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required, Validators.pattern(/\S/), Validators.pattern(/^[^\d]+$/)],
      }),
      admissionDate: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      dismissalDate: new FormControl<string | null>(null),
      workStartTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      workEndTime: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      closingFrequency: new FormControl<ClosingFrequency | ''>('', {
        nonNullable: true,
        validators: [Validators.required],
      }),
    },
    { validators: [dateOrderValidator, timeOrderValidator] },
  );

  @Input() set mode(value: 'create' | 'edit') {
    this.formTitle = value === 'edit' ? 'Editar funcionário' : 'Cadastrar funcionário';
    this.formKicker = value === 'edit' ? 'ATUALIZAÇÃO' : 'NOVO REGISTRO';
  }

  protected formTitle = 'Cadastrar funcionário';
  protected formKicker = 'NOVO REGISTRO';

  protected get daysWorkedPreview(): number | null {
    const { admissionDate, dismissalDate } = this.form.getRawValue();
    if (!dismissalDate) {
      return null;
    }

    const admission = moment.utc(admissionDate, 'YYYY-MM-DD', true);
    const dismissal = moment.utc(dismissalDate, 'YYYY-MM-DD', true);
    return admission.isValid() && dismissal.isValid() && !dismissal.isBefore(admission, 'day')
      ? dismissal.diff(admission, 'days') + 1
      : null;
  }

  protected get dailyHoursPreview(): string | null {
    const { workStartTime, workEndTime } = this.form.getRawValue();
    const start = moment(workStartTime, 'HH:mm', true);
    const end = moment(workEndTime, 'HH:mm', true);
    if (!start.isValid() || !end.isValid() || end.isBefore(start)) {
      return null;
    }

    const minutes = end.diff(start, 'minutes');
    return `${Math.floor(minutes / 60)}h ${minutes % 60}min`;
  }

  protected hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return Boolean(control?.touched && control.hasError(error));
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }

    const values = this.form.getRawValue();
    const input: EmployeeInput = {
      ...values,
      name: values.name.trim(),
      dismissalDate: values.dismissalDate || null,
      closingFrequency: values.closingFrequency as ClosingFrequency,
    };

    this.saveRequested.emit({ input, dailyHours: this.dailyHoursPreview });
  }
}
