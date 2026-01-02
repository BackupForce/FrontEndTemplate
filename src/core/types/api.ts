export interface ProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export interface ApiFieldError {
  field: string;
  message: string;
}

export interface PagedResponse<TItem> {
  data: TItem[];
  total: number;
}
