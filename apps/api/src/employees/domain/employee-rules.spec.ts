import { ClosingFrequency } from './employee';
import {
  calculateDailyWorkMinutes,
  calculateDaysWorked,
} from './employee-calculations';
import { normalizeAndValidateEmployee } from './employee-rules';

const validEmployee = {
  name: 'Ana Silva',
  admissionDate: '2024-01-01',
  dismissalDate: '2024-01-03',
  workStartTime: '09:00',
  workEndTime: '17:30',
  closingFrequency: ClosingFrequency.Monthly,
};

describe('employee rules', () => {
  it('rejects names containing numbers', () => {
    expect(() =>
      normalizeAndValidateEmployee({ ...validEmployee, name: 'Ana 2' }),
    ).toThrow('O nome não pode conter números.');
  });

  it('rejects a dismissal date before admission', () => {
    expect(() =>
      normalizeAndValidateEmployee({
        ...validEmployee,
        dismissalDate: '2023-12-31',
      }),
    ).toThrow('A demissão não pode ser anterior à admissão.');
  });

  it('counts both admission and dismissal dates', () => {
    expect(calculateDaysWorked('2024-01-01', '2024-01-03')).toBe(3);
  });

  it('does not calculate days while dismissal is empty', () => {
    expect(calculateDaysWorked('2024-01-01', null)).toBeNull();
  });

  it('calculates the daily duration in minutes', () => {
    expect(calculateDailyWorkMinutes('09:00', '17:30')).toBe(510);
  });
});
