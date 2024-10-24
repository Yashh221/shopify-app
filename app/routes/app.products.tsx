// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { ActionFunction, LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Checkbox, Button } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
import React from "react";
import prisma from "app/db.server";
const fetchProductsFromShopify = async (request: any) => {
  const query = `
    query {
      products(first: 50) {
        edges {
          node {
            id
            title
            description
            images(first: 1) {
              edges {
                node {
                  src
                }
              }
            }
          }
        }
      }
    }
  `;

  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(query);
  const result = await response.json();
  return result.data.products.edges.map((product: any) => {
    const productId = product.node.id.split("/")[4];
    return {
      shopifyId: productId,
      title: product.node.title,
      description: product.node.description,
      imageUrl: product.node.images.edges[0]?.node.src || "",
    };
  });
};
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session } = await authenticate.admin(request);
  const productsData = await fetchProductsFromShopify(request);
  for (const product of productsData) {
    const findProduct = await prisma.product.findFirst({
      where: { shopifyId: product.shopifyId },
    });
    if (findProduct) {
      await prisma.product.update({
        where: {
          shopifyId: product.shopifyId,
        },
        data: {
          title: product.title,
          description: product.description,
          imageUrl: product.imageUrl,
          likesEnabled: product.likesEnabled,
          commentsEnabled: product.commentsEnabled,
          shopId: session.shop.trim().split(".")[0]
        },
      });
    } else {
      await prisma.product.create({
        data: {
          shopifyId: product.shopifyId,
          title: product.title,
          description: product.description,
          imageUrl: product.imageUrl,
          likesEnabled: true,
          commentsEnabled: true,
          shopId: session.shop.trim().split(".")[0]
        },
      });
    }
  }

  const productsToShow = await prisma.product.findMany();
  return json(productsToShow ?? []);
};
export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const updatedProducts = JSON.parse(formData.get("updatedProducts") as string);
  
    for (const product of updatedProducts) {
      await prisma.product.update({
        where: { shopifyId: product.shopifyId },
        data: {
          likesEnabled: product.likesEnabled,
          commentsEnabled: product.commentsEnabled,
        },
      });
    }
  
    return json({ success: true });
  };

  const LikesTable = () => {
    const productsData = useLoaderData<any[]>();
    const [updatedData, setUpdatedData] = React.useState(productsData);
    const formRef = React.useRef<HTMLFormElement>(null);
  
    if (!productsData) {
      return null;
    }
  
    const handleCheckboxChange = (
      productId: string,
      field: string,
      value: boolean,
    ) => {
      setUpdatedData((prevState) =>
        prevState.map((product) =>
          product.shopifyId === productId
            ? { ...product, [field]: value }
            : product,
        ),
      );
    };
  
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      if (formRef.current) {
        formRef.current.submit();
      }
    };
  
    const rows = updatedData.map((product) => [
      product?.shopifyId,
      product?.title,
      <Checkbox
        label=""
        key={`${product.shopifyId}-likes`}
        checked={product.likesEnabled}
        onChange={(value) =>
          handleCheckboxChange(product.shopifyId, "likesEnabled", value)
        }
      />,
      <Checkbox
        label=""
        key={`${product.shopifyId}-comments`}
        checked={product.commentsEnabled}
        onChange={(value) =>
          handleCheckboxChange(product.shopifyId, "commentsEnabled", value)
        }
      />,
    ]);
  
    return (
      <Page title="Products">
        <Card>
          <form method="post" ref={formRef} onSubmit={handleSubmit}>
            <input
              type="hidden"
              name="updatedProducts"
              value={JSON.stringify(updatedData)}
            />
            <DataTable
              columnContentTypes={["text", "text", "text", "text"]}
              headings={["Product ID", "Product Name", "Likes Enabled", "Comments Enabled"]}
              rows={rows}
            />
            <Button submit>Save Changes</Button>
          </form>
        </Card>
      </Page>
    );
  };
  
  export default LikesTable;
  