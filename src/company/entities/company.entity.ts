export type Availability = ('DELIVERY' | 'LOCAL')[];
export type PaymentMethod = (
  | 'CREDIT_CARD'
  | 'DEBIT_CARD'
  | 'PIX'
  | 'CASH'
  | 'VOUCHER'
)[];
export type PaymentCardBrand = (
  | 'VISA'
  | 'MASTERCARD'
  | 'AMEX'
  | 'ELO'
  | 'HIPERCARD'
  | 'OTHER'
)[];

export type PaymentDebitCardBrand = (
  | 'VISA'
  | 'MASTERCARD'
  | 'AMEX'
  | 'ELO'
  | 'HIPERCARD'
  | 'OTHER'
)[];
export type PaymentVoucherBrand = (
  | 'ALELO'
  | 'SODEXO'
  | 'VR'
  | 'OTHER'
  | 'BEN'
  | 'VEROCHEQUE'
)[];
