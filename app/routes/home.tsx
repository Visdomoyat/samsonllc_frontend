import { useLoaderData } from "react-router";

import Landing from "~/components/Landing";
import { ApiError, getProducts } from "~/lib/api";
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
  try {
    const { products } = await getProducts(request);
    return {
      featuredProducts: products.slice(0, 4),
      productsError: null,
    };
  } catch (error) {
    return {
      featuredProducts: [],
      productsError:
        error instanceof ApiError ? error.message : "Could not load products",
    };
  }
}

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Eliteforge Peptide" },
    {
      name: "description",
      content:
        "Research-grade peptides from Eliteforge — quality, transparency, and fast shipping.",
    },
  ];
}

export default function Home() {
  const { featuredProducts, productsError } = useLoaderData<typeof loader>();
  return (
    <Landing
      featuredProducts={featuredProducts}
      productsError={productsError}
    />
  );
}
