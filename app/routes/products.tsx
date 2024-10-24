import { json } from "@remix-run/node";
import prisma from "app/db.server";
export const getProducts = async (productId: string) => {
  console.log(productId)
  const products = await prisma.product.findUnique({where: {shopifyId: productId}});
  if(products){
    return json({ success: true, products });
  }
  return json({success: false})
};
