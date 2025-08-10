import { ProductAvailabilityBy } from '../dto/create-product.dto';

export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  menuGroupId: number;
  isAdultOnly: boolean;
  productAvailabilityBy: ProductAvailabilityBy;
  disabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}
