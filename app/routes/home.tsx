import { useLoaderData } from "react-router";

import Landing from "~/components/Landing";
import { ApiError, getProducts, getStackBlends } from "~/lib/api";
import type { Route } from "./+types/home";

export async function loader({ request }: Route.LoaderArgs) {
  const [productsResult, stackBlendsResult] = await Promise.allSettled([
    getProducts(request),
    getStackBlends(request, true),
  ]);

  let featuredProducts: Awaited<ReturnType<typeof getProducts>>["products"] = [];
  let stackBlends: Awaited<ReturnType<typeof getStackBlends>>["stack_blends"] =
    [];
  let productsError: string | null = null;
  let stackBlendsError: string | null = null;

  if (productsResult.status === "fulfilled") {
    featuredProducts = productsResult.value.products.slice(0, 4);
  } else {
    const err = productsResult.reason;
    productsError =
      err instanceof ApiError ? err.message : "Could not load products";
  }

  if (stackBlendsResult.status === "fulfilled") {
    stackBlends = stackBlendsResult.value.stack_blends;
  } else {
    const err = stackBlendsResult.reason;
    stackBlendsError =
      err instanceof ApiError ? err.message : "Could not load stacks & blends";
  }

  return {
    featuredProducts,
    stackBlends,
    productsError,
    stackBlendsError,
  };
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
  const { featuredProducts, stackBlends, productsError, stackBlendsError } =
    useLoaderData<typeof loader>();
  return (
    <Landing
      featuredProducts={featuredProducts}
      stackBlends={stackBlends}
      productsError={productsError}
      stackBlendsError={stackBlendsError}
    />
  );
}
