import type { FormInstance } from 'antd';
import { message } from 'antd';
import axios from 'axios';
import type { ApiFieldError, ProblemDetails } from '@/core/types/api';
import { tCommon } from '@/shared/i18n/helpers';

interface HandleApiErrorOptions {
  form?: FormInstance;
}

const normalizeFieldErrors = (
  problemErrors?: Record<string, string[]>,
  arrayErrors?: ApiFieldError[]
): { name: string; errors: string[] }[] => {
  if (problemErrors) {
    return Object.entries(problemErrors).map(([field, errors]) => ({ name: field, errors }));
  }

  if (arrayErrors) {
    return arrayErrors.map((error) => ({ name: error.field, errors: [error.message] }));
  }

  return [];
};

export const handleApiError = (error: unknown, options?: HandleApiErrorOptions): void => {
  if (!axios.isAxiosError(error)) {
    message.error(tCommon('errors.unknown', { defaultValue: 'Unexpected error' }));
    return;
  }

  const data = error.response?.data as ProblemDetails | { errors?: ApiFieldError[] } | undefined;
  const title = (data as ProblemDetails | undefined)?.title ?? tCommon('errors.unknown', { defaultValue: 'Unexpected error' });
  const detail = (data as ProblemDetails | undefined)?.detail;

  const fieldErrors = normalizeFieldErrors((data as ProblemDetails | undefined)?.errors, (data as { errors?: ApiFieldError[] } | undefined)?.errors);

  if (options?.form && fieldErrors.length > 0) {
    options.form.setFields(fieldErrors.map((fieldError) => ({ name: fieldError.name, errors: fieldError.errors })));
  }

  const displayMessage = detail ?? title;

  if (displayMessage) {
    message.error(displayMessage);
  }
};
