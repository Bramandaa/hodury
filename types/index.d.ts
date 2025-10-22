export type UseActionState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  inputs?: Record<string, string>;
};
