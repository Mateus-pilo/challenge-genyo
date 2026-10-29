import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { App } from './app';
import { EmployeeApiService } from './employees/employee-api.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        {
          provide: EmployeeApiService,
          useValue: { list: () => of([]) },
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('shows the empty directory state when there are no employees', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.empty-state h3')?.textContent).toContain(
      'Nenhum funcionário cadastrado',
    );
  });
});
