import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getCurrentUser, getPost, updatePost } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const postId = Number(id);
  if (!Number.isInteger(postId)) notFound();

  const post = await getPost(postId);
  if (!post) notFound();

  const user = await getCurrentUser();
  if (!user) redirect("/auth/sign-in");
  if (post.authorId !== user.id) redirect(`/posts/${post.id}`);

  const updatePostWithId = updatePost.bind(null, post.id);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">글 수정</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">글 수정</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={updatePostWithId} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" name="title" defaultValue={post.title} required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                name="content"
                defaultValue={post.content}
                required
                rows={12}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button asChild variant="outline" type="button">
                <Link href={`/posts/${post.id}`}>취소</Link>
              </Button>
              <Button type="submit">저장</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
