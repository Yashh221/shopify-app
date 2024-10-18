import { getComments } from "./api.like-comment";
import { cors } from "remix-utils/cors";

export const loader = async ({ request, params }: any) => {
  const response = await getComments(params.productId, params.shopId);
  return cors(request, response);
};
