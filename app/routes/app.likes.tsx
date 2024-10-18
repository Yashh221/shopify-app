import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
import React from "react";


export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = await fetch(`https://mutual-splendid-quagga.ngrok-free.app/api/admin/likes`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  const likesData = await response.json();
  return json(likesData);
};

const LikesTable = () => {
  const likesData = useLoaderData<unknown[]>();
  
  if (!likesData) {
    return null;
  }
  console.log(likesData)

  const rows = likesData?.likesData?.map((like: any) => [
    like?.productId,
    like?.customerId,
    like?.shopId,
    like?.shopName
  ]);
  console.log("rows",rows);


  return (
    <>
      <Page title="Product Likes">
        <Card>
          <DataTable
            columnContentTypes={["text", "text", "text", "text"
            ]}
            headings={["Product ID", "Customer ID", "Shop ID","Shop Name"]}
            rows={rows}
          />
        </Card>
      </Page>
    </>
  );
};

export default LikesTable;
