import Link from "next/link";
import { notFound } from "next/navigation";
import {
  addComment,
  deleteComment,
  getPost,
  incrementViews,
  listComments,
} from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DeletePostButton } from "@/components/delete-post-button";

export const dynamic = "force-dynamic";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const post = await getPost(postId);
  if (!post) notFound();

  await incrementViews(postId);
  const comments = await listComments(postId);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <Button asChild variant="ghost" size="sm" className="w-fit -ml-2">
        <Link href="/">← 목록으로</Link>
      </Button>

      <Card>
        <CardHeader className="gap-2">
          <h1 className="text-xl font-bold tracking-tight">{post.title}</h1>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              {post.author} · {formatDate(post.createdAt)} · 조회{" "}
              {post.views + 1}
            </span>
            <div className="flex gap-2">
              <Button asChild variant="outline" size="sm">
                <Link href={`/posts/${post.id}/edit`}>수정</Link>
              </Button>
              <DeletePostButton postId={post.id} />
            </div>
          </div>
        </CardHeader>
        <Separator />
        <CardContent className="whitespace-pre-wrap pt-6 text-sm leading-relaxed">
          {post.content}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h2 className="text-base font-semibold">
            댓글 {comments.length}개
          </h2>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <form
            action={addComment.bind(null, post.id)}
            className="flex flex-col gap-3"
          >
            <div className="flex gap-2">
              <Input name="author" placeholder="이름" className="max-w-40" required />
            </div>
            <Textarea name="content" placeholder="댓글을 입력하세요" rows={3} required />
            <Button type="submit" size="sm" className="w-fit self-end">
              댓글 등록
            </Button>
          </form>

          {comments.length > 0 && <Separator />}

          <ul className="flex flex-col gap-4">
            {comments.map((comment) => (
              <li key={comment.id} className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{comment.author}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(comment.createdAt)}
                    </span>
                    <form action={deleteComment.bind(null, post.id, comment.id)}>
                      <button
                        type="submit"
                        className="text-xs text-muted-foreground hover:text-destructive"
                      >
                        삭제
                      </button>
                    </form>
                  </div>
                </div>
                <p className="whitespace-pre-wrap text-sm">{comment.content}</p>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
