export interface MidtransResult {
  transaction_id: string;
  order_id: string;
  gross_amount: string;
  payment_type: string;
  transaction_time: string;
  transaction_status: string;
  fraud_status?: string;
  va_numbers?: Array<{ bank: string; va_number: string }>;
  pdf_url?: string;
  finish_redirect_url?: string;
}

export interface MidtransSnap {
  pay: (
    token: string,
    options?: {
      onSuccess?: (result: MidtransResult) => void;
      onPending?: (result: MidtransResult) => void;
      onError?: (result: MidtransResult) => void;
      onClose?: () => void;
    }
  ) => void;
}

declare global {
  interface Window {
    snap: MidtransSnap;
  }
}
