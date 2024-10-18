import { cors } from "remix-utils/cors";
import { addComment } from "./api.like-comment";

export const action = async ({ request }: { request: Request }) => {
  if (request.method === "POST") {
    const response =  await addComment(request);
    return cors(request, response);
  }
};
