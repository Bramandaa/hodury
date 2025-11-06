export type UseActionState = {
  success: boolean;
  message: string;
  otpSent?: boolean;
  verificationId?: string;
  timestamp?: number;
  errors?: Record<string, string[]>;
  inputs?: Record<string, string>;
};
