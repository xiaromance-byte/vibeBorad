"use server";

import { getDb } from "@/db";
import { comments, posts } from "@/db/schema";
import { auth } from "@/lib/auth/server";
import { and, desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireUser() {
  const { data: session } = await auth.getSession();
  if (!session?.user) {
    redirect("/auth/sign-in");
  }
  return session.user;
}

export async function createPost(formData: FormData) {
  const user = await requireUser();

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) {
    throw new Error("제목과 내용을 모두 입력해주세요.");
  }

  const [created] = await getDb()
    .insert(posts)
    .values({
      title,
      content,
      authorId: user.id,
      author: user.name || user.email,
    })
    .returning({ id: posts.id });

  revalidatePath("/");
  redirect(`/posts/${created.id}`);
}

export async function updatePost(postId: number, formData: FormData) {
  const user = await requireUser();

  const existing = await getPost(postId);
  if (!existing || existing.authorId !== user.id) {
    throw new Error("이 글을 수정할 권한이 없습니다.");
  }

  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();

  if (!title || !content) {
    throw new Error("제목과 내용을 모두 입력해주세요.");
  }

  await getDb().update(posts).set({ title, content }).where(eq(posts.id, postId));

  revalidatePath("/");
  revalidatePath(`/posts/${postId}`);
  redirect(`/posts/${postId}`);
}

export async function deletePost(postId: number) {
  const user = await requireUser();

  const existing = await getPost(postId);
  if (!existing || existing.authorId !== user.id) {
    throw new Error("이 글을 삭제할 권한이 없습니다.");
  }

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
  const user = await requireUser();

  const content = String(formData.get("content") ?? "").trim();
  if (!content) {
    throw new Error("댓글 내용을 입력해주세요.");
  }

  await getDb()
    .insert(comments)
    .values({ postId, content, authorId: user.id, author: user.name || user.email });
  revalidatePath(`/posts/${postId}`);
}

export async function deleteComment(postId: number, commentId: number) {
  const user = await requireUser();

  const [existing] = await getDb()
    .select()
    .from(comments)
    .where(eq(comments.id, commentId));

  if (!existing || existing.authorId !== user.id) {
    throw new Error("이 댓글을 삭제할 권한이 없습니다.");
  }

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

export async function getCurrentUser() {
  const { data: session } = await auth.getSession();
  return session?.user ?? null;
}
