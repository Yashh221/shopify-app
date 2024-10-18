import { getAllLikes } from "./api.like-comment";
import { cors } from "remix-utils/cors";

export const loader = async ({ request, params }: any) => {
  const response = await getAllLikes();
  return cors(request, response);
};
