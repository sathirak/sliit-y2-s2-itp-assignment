import { CategoryPage } from '@/modules/category/pages/CategoryPage';

interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default function Page({ params }: CategoryPageProps) {
  return <CategoryPage slug={params.slug} />;
}
