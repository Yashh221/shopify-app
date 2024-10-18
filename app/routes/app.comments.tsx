import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Page, Card, DataTable, Button } from "@shopify/polaris";
import { authenticate } from "app/shopify.server";
import React, { useState } from "react";

// Fetch comments
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await fetch(
    `https://mutual-splendid-quagga.ngrok-free.app/api/admin/comments`,
    {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    },
  );

  const commentsData = await response.json();
  return json(commentsData);
};

const LikesTable = () => {
  const commentsData = useLoaderData<unknown[]>();
  const [disabledButtons, setDisabledButtons] = useState<{
    [key: string]: boolean;
  }>({});

  if (!commentsData) {
    return null;
  }

  const handleApprove = async (commentId: number) => {
    setDisabledButtons((prev) => ({ ...prev, [commentId]: true }));
    await fetch(
      `https://mutual-splendid-quagga.ngrok-free.app/api/admin/comments/actions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:  JSON.stringify({commentId, intent: 'Approved'}) ,
      },
    );
  };

  const handleReject = async (commentId: number) => {
    setDisabledButtons((prev) => ({ ...prev, [commentId]: true }));

    // Make API call to reject comment
    await fetch(
      `https://mutual-splendid-quagga.ngrok-free.app/api/admin/comments/actions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body:  JSON.stringify({commentId, intent: 'Rejected'}) ,
      },
    );
  };

  const rows = commentsData?.commentData?.map((comment: any) => {
    console.log(comment, "comment");
    const isDisabled =
      comment?.status === "Approved" || comment?.status === "Reject";

    return [
      comment?.productId,
      comment?.customerId,
      comment?.shopId,
      comment?.comment,
      <div key={comment?.id} style={{ display: "flex", gap: 6 }}>
        <Button
          onClick={() => handleApprove(comment?.id)}
          disabled={isDisabled || disabledButtons[comment?.id]}
        >
          Approve
        </Button>
        <Button
          onClick={() => handleReject(comment?.id)}
          disabled={isDisabled || disabledButtons[comment?.id]}
        >
          Reject
        </Button>
      </div>,
    ];
  });

  return (
    <>
      <Page title="Product Comments">
        <Card>
          <DataTable
            columnContentTypes={["text", "text", "text", "text", "text"]}
            headings={[
              "Product ID",
              "Customer ID",
              "Shop ID",
              "Comment",
              "Actions",
            ]}
            rows={rows}
          />
        </Card>
      </Page>
    </>
  );
};

export default LikesTable;
