export class CreateProductDto {
  name: string;
  description?: string;
  price: string;
  image?: string;
  code?: string;
  menuGroupId: number;
  isAdultOnly?: string;
  productHours?: string;
  alwaysAvailable: string;
}
