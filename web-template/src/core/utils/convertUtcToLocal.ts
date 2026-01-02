// src/utils/convertUtcToLocal.ts
export function isIsoDateString(value: unknown): value is string {
  return (
    typeof value === "string" &&
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?Z?$/.test(value)
  );
}

export function convertUtcToLocal<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(convertUtcToLocal) as T;
  }

  if (input instanceof Date) {
    return input;
  }

  if (typeof input === "object" && input !== null) {
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      if (isIsoDateString(value)) {
        output[key] = new Date(value);
      } else {
        output[key] = convertUtcToLocal(value);
      }
    }
    return output as T;
  }

  return input;
}
