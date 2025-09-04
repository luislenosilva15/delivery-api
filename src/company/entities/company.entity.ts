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

export class Company {
  id: number;
  name: string;
  email: string;
  logoUrl: string;
  legalName: string;
  document: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
  isOpen?: boolean;
  menuId?: number;
  isAlwaysOpening?: boolean;
  openingHours?: {
    dayOfWeek: number;
    startTime: string | null;
    endTime: string | null;
    closed: boolean;
  }[];
  companyPayment?: {
    id: number;
    method: PaymentMethod;
    cardBrand: PaymentCardBrand;
    voucherBrand: PaymentVoucherBrand;
    documentInTicket?: boolean;
    requiredDocument?: boolean;
  };
}
