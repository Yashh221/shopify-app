import { json } from "@remix-run/node";
import { getLikes } from "./api.like-comment";
import { cors } from "remix-utils/cors";

export const loader = async ({ request, params }: any) => {
  const url = new URL(request.url);
  const productId = url.searchParams.get("productId");
  const shopId = url.searchParams.get("shopId");
  const customerId = url.searchParams.get("customerId");
  if(!productId || !shopId || !customerId){
    return json({success: false})
  }
  const response = await getLikes(productId, shopId, customerId);
  return cors(request, response);
};
