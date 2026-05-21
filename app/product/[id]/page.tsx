import { notFound } from "next/navigation";
import { getProduct } from "@/lib/products";
import ProductDetail from "@/components/ProductDetail";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = getProduct(Number(id));

  if (!product) notFound();

  return <ProductDetail product={product} />;
}
