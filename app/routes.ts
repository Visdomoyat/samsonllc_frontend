import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("shop", "routes/shop.tsx"),
  route("stacks-blends/:id", "routes/stacks-blends.$id.tsx"),
  route("contact", "routes/contact.tsx"),
  route("checkout", "routes/checkout.tsx"),
  route("checkout/success", "routes/checkout.success.tsx"),
  route("checkout/cancel", "routes/checkout.cancel.tsx"),
] satisfies RouteConfig;
