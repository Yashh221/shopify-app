import { json } from "@remix-run/node";
import { getComments } from "./api.like-comment";
import { cors } from "remix-utils/cors";

export const loader = async ({ request, params }: any) => {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  const shopId = url.searchParams.get("shopId");
  if (!productId || !shopId) {
    return json({ success: false });
  }
  const response = await getComments(productId, shopId);
  return cors(request, response);
};
