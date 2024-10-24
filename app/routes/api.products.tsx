import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getProducts } from "./products";
import { cors } from "remix-utils/cors";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const shopifyId = url.searchParams.get("shopifyId");
  if (!shopifyId) {
    return json({ success: false, message: "No shopifyId provided" });
  }
  const response = await getProducts(shopifyId);
  return response;
};
