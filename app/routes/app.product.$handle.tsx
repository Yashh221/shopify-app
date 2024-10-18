import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { authenticate } from "app/shopify.server";
import { Page, Card, Text } from "@shopify/polaris";
import React from "react";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
  const { handle } = params;
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
    query {
      productByHandle(handle: "${handle}") {
        id
        handle
        title
        productType
        description
        vendor
        priceRangeV2 {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }`,
  );
  
  const data = await response.json();
  console.log(data.data.productByHandle)

  if (!data.data.productByHandle) {
    throw new Response("Product Not Found", { status: 404 });
  }

  return json(data.data.productByHandle);
};

const ProductPage = () => {
  const product = useLoaderData(); // Product data from the loader

  return (
    <Page title={product?.title}>
      <Card>
        <Text as="p">
           {product?.description}
        </Text>
      </Card>
    </Page>
  );
};

export default ProductPage;
