import moment = require('moment');
import {
  ClosingFrequency,
  EmployeeInput,
  EmployeeValidationError,
} from './employee';

export function normalizeAndValidateEmployee(
  input: EmployeeInput,
): EmployeeInput {
  const employee = { ...input, name: input.name.trim() };
  const fields: Record<string, string> = {};

  if (!employee.name) {
    fields.name = 'Informe o nome do funcionário.';
  } else if (/\d/.test(employee.name)) {
    fields.name = 'O nome não pode conter números.';
  }

  const admissionDate = moment.utc(employee.admissionDate, 'YYYY-MM-DD', true);
  const dismissalDate = employee.dismissalDate
    ? moment.utc(employee.dismissalDate, 'YYYY-MM-DD', true)
    : null;

  if (!admissionDate.isValid()) {
    fields.admissionDate = 'Informe uma data de admissão válida.';
  }

  if (employee.dismissalDate && !dismissalDate?.isValid()) {
    fields.dismissalDate = 'Informe uma data de demissão válida.';
  } else if (
    admissionDate.isValid() &&
    dismissalDate?.isValid() &&
    dismissalDate.isBefore(admissionDate, 'day')
  ) {
    fields.dismissalDate = 'A demissão não pode ser anterior à admissão.';
  }

  const start = moment(employee.workStartTime, 'HH:mm', true);
  const end = moment(employee.workEndTime, 'HH:mm', true);

  if (!start.isValid()) {
    fields.workStartTime = 'Informe um horário inicial válido.';
  }

  if (!end.isValid()) {
    fields.workEndTime = 'Informe um horário final válido.';
  } else if (start.isValid() && end.isBefore(start)) {
    fields.workEndTime = 'O fim do expediente não pode ser anterior ao início.';
  }

  if (!Object.values(ClosingFrequency).includes(employee.closingFrequency)) {
    fields.closingFrequency = 'Selecione uma periodicidade válida.';
  }

  if (Object.keys(fields).length) {
    throw new EmployeeValidationError(fields);
  }

  return employee;
}
