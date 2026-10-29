import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {
  ConfirmationDialogComponent,
  ConfirmationMode,
} from './employees/components/confirmation-dialog.component';
import { EmployeeFormComponent } from './employees/components/employee-form.component';
import { EmployeeListComponent } from './employees/components/employee-list.component';
import { EmployeeApiService } from './employees/employee-api.service';
import { Employee, EmployeeSaveRequest } from './employees/employee.model';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    ConfirmationDialogComponent,
    EmployeeFormComponent,
    EmployeeListComponent,
  ],
  templateUrl: './employees-page.component.html',
  styleUrl: './employees-page.component.css',
})
export class App implements OnInit {
  protected employees: Employee[] = [];
  protected totalEmployees = 0;
  protected currentPage = 1;
  protected pageSize = 10;
  protected activeCount = 0;
  protected loading = true;
  protected saving = false;
  protected formVisible = false;
  protected editingId: string | null = null;
  protected editingEmployee: Employee | null = null;
  protected confirmationMode: ConfirmationMode = null;
  protected pendingDelete: Employee | null = null;
  protected pendingSave: EmployeeSaveRequest | null = null;
  protected errorMessage = '';
  protected successMessage = '';

  constructor(private readonly employeeApi: EmployeeApiService) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  protected openCreate(): void {
    this.editingId = null;
    this.editingEmployee = null;
    this.formVisible = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  protected openEdit(employee: Employee): void {
    this.editingId = employee.id;
    this.editingEmployee = employee;
    this.formVisible = true;
    this.errorMessage = '';
    this.successMessage = '';
  }

  protected closeForm(): void {
    this.formVisible = false;
    this.editingId = null;
    this.editingEmployee = null;
    this.errorMessage = '';
  }

  protected requestSave(request: EmployeeSaveRequest): void {
    this.errorMessage = '';
    this.pendingSave = request;
    this.confirmationMode = 'save';
  }

  protected confirmSave(): void {
    if (!this.pendingSave) {
      return;
    }

    const request = this.editingId
      ? this.employeeApi.update(this.editingId, this.pendingSave.input)
      : this.employeeApi.create(this.pendingSave.input);

    this.saving = true;
    request.subscribe({
      next: () => {
        this.saving = false;
        this.confirmationMode = null;
        this.pendingSave = null;
        this.formVisible = false;
        this.successMessage = this.editingId
          ? 'Alterações salvas com sucesso.'
          : 'Funcionário cadastrado com sucesso.';
        this.editingId = null;
        this.loadEmployees();
      },
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        this.confirmationMode = null;
        this.pendingSave = null;
        this.errorMessage = this.getErrorMessage(error);
      },
    });
  }

  protected requestDelete(employee: Employee): void {
    this.pendingDelete = employee;
    this.confirmationMode = 'delete';
    this.errorMessage = '';
  }

  protected confirmDelete(): void {
    if (!this.pendingDelete) {
      return;
    }

    const employee = this.pendingDelete;
    this.saving = true;
    this.employeeApi.delete(employee.id).subscribe({
      next: () => {
        this.saving = false;
        this.confirmationMode = null;
        this.pendingDelete = null;
        this.successMessage = `${employee.name} foi excluído.`;
        this.loadEmployees();
      },
      error: (error: HttpErrorResponse) => {
        this.saving = false;
        this.confirmationMode = null;
        this.pendingDelete = null;
        this.errorMessage = this.getErrorMessage(error);
      },
    });
  }

  protected cancelConfirmation(): void {
    this.confirmationMode = null;
    this.pendingDelete = null;
    this.pendingSave = null;
  }

  protected changePage(page: number): void {
    this.loadEmployees(page);
  }

  protected changePageSize(pageSize: number): void {
    this.pageSize = pageSize;
    this.loadEmployees(1);
  }

  private loadEmployees(page = this.currentPage): void {
    this.loading = true;
    this.employeeApi.list(page, this.pageSize).subscribe({
      next: (result) => {
        this.employees = result.items;
        this.totalEmployees = result.total;
        this.currentPage = result.page;
        this.activeCount = result.activeCount;
        this.loading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.loading = false;
        this.errorMessage = this.getErrorMessage(error);
      },
    });
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    const message = error.error?.message;
    return Array.isArray(message)
      ? message.join(' ')
      : typeof message === 'string'
        ? message
        : 'Não foi possível concluir a operação. Tente novamente.';
  }
}
