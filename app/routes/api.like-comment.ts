import { json } from "@remix-run/node";
import prisma from "../db.server";

export const addLike = async (request: Request) => {
  const { productId, customerId, shopId , shopName} = await request.json();

  const existingLike = await prisma.like.findFirst({
    where: { productId, customerId, shopId },
  });

  if (existingLike) {
    await prisma.like.delete({
      where: {
        id: existingLike.id,
      },
    });
    return json({ success: true, isLiked: false });
  }

  const like = await prisma.like.create({
    data: {
      productId,
      customerId,
      shopId,
      shopName
    },
  });

  return json({ success: true, like, isLiked: true });
};

export const addComment = async (request: Request) => {
  const { productId, customerId, shopId, comment, shopName } = await request.json();

  const newComment = await prisma.comment.create({
    data: {
      productId,
      customerId,
      shopId,
      comment,
      shopName,
      status: "Pending",
    },
  });

  return json({ success: true, newComment });
};

export const getLikes = async (
  productId: string,
  shopId: string,
  customerId: string,
) => {
  const likeCount = await prisma.like.count({
    where: { productId, shopId },
  });

  const isLikedByCustomer = await prisma.like.count({
    where: { productId, shopId, customerId },
  });
  let isLiked = false;
  if (isLikedByCustomer) {
    isLiked = true;
  }

  return json({ success: true, likeCount, isLiked });
};
export const getAllLikes = async () => {
  const likeCount = await prisma.like.count();

  const likesData = await prisma.like.findMany();

  return json({ success: true, likeCount, likesData });
};

export const getAllComments = async () => {
  const commentCount = await prisma.comment.count();
  const commentData = await prisma.comment.findMany();
  return json({ success: true, commentCount, commentData });
};
export const getComments = async (productId: string, shopId: string) => {
  const comments = await prisma.comment.findMany({
    where: { productId, shopId },
  });

  return json({ success: true, comments });
};

export const updateComment = async (request: any) => {
  const {commentId, intent} = await request.json();
  console.log(commentId, intent)
  const updatedComment = await prisma.comment.update({
    where: {
      id: Number(commentId),
    },
    data: { status: intent },
  });
  return json({ success: true, updatedComment });
};
