import { getLikes } from "./api.like-comment";
import { cors } from "remix-utils/cors";

export const loader = async ({ request, params }: any) => {
  const response = await getLikes(params.productId, params.shopId, params.customerId);
  return cors(request, response);
};
