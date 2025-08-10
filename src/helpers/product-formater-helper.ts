import { Product } from 'src/product/entities/product.entity';

export const productFormaterHelper = (product: Product) => {
  const baseUrl =
    'https://qorqohjcceinufpyspag.supabase.co/storage/v1/object/public/product/';

  return {
    ...product,
    imageUrl: product.image ? `${baseUrl}${product.image}` : null,
  };
};
