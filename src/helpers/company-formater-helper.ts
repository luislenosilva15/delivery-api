import { Company, OpeningHour } from '@prisma/client';
import isOpenNow from './company-is-open-now.helper';

export type CompanyWithRelations = Company & { openingHours?: OpeningHour[] };
export type FormattedCompany = CompanyWithRelations & {
  isOpen: boolean;
  logoUrl: string;
  menuId?: number | null;
};

export const companyFormaterHelper = (
  company: CompanyWithRelations,
): FormattedCompany => {
  const isOpen = isOpenNow(company);

  const baseUrl =
    'https://qorqohjcceinufpyspag.supabase.co/storage/v1/object/public/company/';

  return {
    ...company,
    logoUrl: `${baseUrl}${company.logoUrl}`,
    isOpen,
  };
};
