import axios from 'axios';
import { z } from 'zod';

const ApiErrorSchema = z.object({
  message: z.string().min(1),
});

export const extractApiErrorMessage = (
  error: unknown,
  fallback: string,
): string => {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const parsedError = ApiErrorSchema.safeParse(error.response?.data);
  if (parsedError.success) {
    return parsedError.data.message;
  }

  return error.message || fallback;
};
