import { getAllComments } from "./api.like-comment";
import { cors } from "remix-utils/cors";

export const loader = async ({ request, params }: any) => {
  const response = await getAllComments();
  return cors(request, response);
};
