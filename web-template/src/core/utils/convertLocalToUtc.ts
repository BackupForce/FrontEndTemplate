// src/utils/convertLocalToUtc.ts
export function convertLocalToUtc<T>(input: T): T {
  if (Array.isArray(input)) {
    return input.map(convertLocalToUtc) as T;
  }

  if (input instanceof Date) {
    return input.toISOString() as unknown as T;
  }

  if (typeof input === "object" && input !== null) {
    const output: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(input)) {
      output[key] = convertLocalToUtc(value);
    }
    return output as T;
  }

  return input;
}
