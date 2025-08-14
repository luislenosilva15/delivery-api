export type ProductAvailabilityBy = 'DELIVERY' | 'LOCAL' | 'BOTH';

export class CreateProductDto {
  name: string;
  description?: string;
  price: string;
  image?: string;
  code?: string;
  menuGroupId: number;
  isAdultOnly?: string;
  productAvailabilityBy: ProductAvailabilityBy;
  productHours?: string;
  alwaysAvailable: string;
}
