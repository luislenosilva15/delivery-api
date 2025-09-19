import { Company } from 'src/company/entities/company.entity';
import isOpenNow from './company-is-open-now.helper';

export const companyFormaterHelper = (company: Company) => {
  const isOpen = isOpenNow(company);

  const baseUrl =
    'https://qorqohjcceinufpyspag.supabase.co/storage/v1/object/public/company/';

  return {
    ...company,
    logoUrl: `${baseUrl}${company.logoUrl}`,
    isOpen,
  };
};
