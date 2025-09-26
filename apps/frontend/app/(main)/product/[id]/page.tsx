import { ProductDetails } from '@/modules/product/pages/ProductDetails';

interface ProductPageProps {
  params: {
    id: string;
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetails id={params.id} />;
}
