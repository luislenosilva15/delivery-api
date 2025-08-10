import { Company } from 'src/company/entities/company.entity';

export const companyFormaterHelper = (company: Company) => {
  const baseUrl =
    'https://qorqohjcceinufpyspag.supabase.co/storage/v1/object/public/company/';

  return {
    ...company,
    logoUrl: `${baseUrl}${company.logoUrl}`,
  };
};
