import { format, parseISO, isValid } from 'date-fns';

export const formatDate = (dateString) => {
  const date = parseISO(dateString);
  return isValid(date) ? format(date, 'dd/MM/yyyy') : 'Présent';
};
