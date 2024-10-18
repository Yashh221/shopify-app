import { updateComment } from "./api.like-comment";
import { cors } from "remix-utils/cors";

export const action = async ({ request, params }: any) => {
  if (request.method === "POST") {
    const response = await updateComment(request);
    return cors(request, response);
  }
};
