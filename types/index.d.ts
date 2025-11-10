export type UseActionState = {
  success: boolean;
  message: string;
  otpSent?: boolean;
  verificationId?: string;
  timestamp?: number;
  errors?: Record<string, string[]>;
  inputs?: Record<string, string>;
};

export type SearchParamsDashboard = {
  success: string;
  page: string;
  limit: string;
  keyword: string;
  status: string;
  category: string;
  startDate: string;
  endDate: string;
  month: string;
  year: string;
};
