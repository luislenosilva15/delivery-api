import {
  AvailabilityStatus,
  OrderStatus,
  PaymentMethods,
  PaymentCardBrand,
  PaymentDebitCardBrand,
  PaymentVoucherBrand,
} from '@prisma/client';

export class Order {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  menuId: number;
  status: OrderStatus;

  clientId: number;
  companyId: number;

  totalPrice: number;

  paymentMethod: PaymentMethods;
  paymentCardBrand: PaymentCardBrand;
  paymentDebitCardBrand: PaymentDebitCardBrand;
  paymentVoucherBrand: PaymentVoucherBrand;

  deliveryMethod: AvailabilityStatus;

  items?: OrderItem[];
  client?: Client;
}

export class OrderItem {
  id: number;
  orderId: number;
  productId: number;

  quantity: number;
  price: number;

  // relations
  order?: Order;
  product?: Product;
}

export class Client {
  id: number;
  companyId: number;
  name: string;
  email?: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;

  orders?: Order[];
}

export class Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
}
