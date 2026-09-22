"use server";

import { getDb } from "@/db";
import { comments, posts } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPost(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !author || !content) {
    throw new Error("제목, 작성자, 내용을 모두 입력해주세요.");
  }

  const [created] = await getDb()
    .insert(posts)
    .values({ title, author, content })
    .returning({ id: posts.id });

  revalidatePath("/");
  redirect(`/posts/${created.id}`);
}

export async function updatePost(postId: number, formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const author = String(formData.get("author") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !author || !content) {
    throw new Error("제목, 작성자, 내용을 모두 입력해주세요.");
  }

  await getDb()
    .update(posts)
    .set({ title, author, content })
    .where(eq(posts.id, postId));

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: number) {
  await getDb().delete(posts).where(eq(posts.id, postId));
  revalidatePath("/");
  redirect("/");
}

export async function incrementViews(postId: number) {
  await getDb()
    .update(posts)
    .set({ views: sql`${posts.views} + 1` })
    .where(eq(posts.id, postId));
}

export async function addComment(postId: number, formData: FormData) {
  const author = String(formData.get("author") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!author || !content) {
    throw new Error("작성자와 내용을 입력해주세요.");
  }

  await getDb().insert(comments).values({ postId, author, content });
  revalidatePath(`/posts/${postId}`);
}

export async function deleteComment(postId: number, commentId: number) {
  await getDb()
    .delete(comments)
    .where(and(eq(comments.id, commentId), eq(comments.postId, postId)));
  revalidatePath(`/posts/${postId}`);
}

export async function listPosts() {
  return getDb().select().from(posts).orderBy(desc(posts.createdAt));
}

export async function getPost(postId: number) {
  const [post] = await getDb().select().from(posts).where(eq(posts.id, postId));
  return post;
}

export async function listComments(postId: number) {
  return getDb()
    .select()
    .from(comments)
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));
}
