export interface ApiError {
  response?: {
    data?: ProblemDetails;
    status: number;
  };
}

export interface ProblemDetails {
  title: string;
  status: number;
  detail?: string;
  type?: string;
  traceId?: string;
  extensions?: {
    errors?: BackendError[];
    [key: string]: unknown;
  };
}

export interface BackendError {
  code: string;
  description: string;
  type: number;
  field?: string;
}

