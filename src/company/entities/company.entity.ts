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
  openingHours?: {
    dayOfWeek: number;
    startTime: string | null;
    endTime: string | null;
    closed: boolean;
  }[];
}
