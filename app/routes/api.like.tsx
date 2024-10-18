import { cors } from "remix-utils/cors";
import { addLike } from "./api.like-comment";

export const action = async ({ request }: { request: Request }) => {
  if (request.method === "POST") {
    const response =  await addLike(request);
    return cors(request, response);
  }
};
