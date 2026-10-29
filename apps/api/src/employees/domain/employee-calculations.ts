import moment = require('moment');

export function calculateDaysWorked(
  admissionDate: string,
  dismissalDate: string | null,
): number | null {
  if (!dismissalDate) {
    return null;
  }

  return (
    moment
      .utc(dismissalDate, 'YYYY-MM-DD')
      .diff(moment.utc(admissionDate, 'YYYY-MM-DD'), 'days') + 1
  );
}

export function calculateDailyWorkMinutes(
  startTime: string,
  endTime: string,
): number {
  const start = moment(startTime, 'HH:mm');
  const end = moment(endTime, 'HH:mm');
  return end.diff(start, 'minutes');
}
