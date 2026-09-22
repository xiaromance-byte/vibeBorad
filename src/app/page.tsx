import Link from "next/link";
import { listPosts } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

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

export default async function Home() {
  const posts = await listPosts();

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">게시판</h1>
          <p className="text-sm text-muted-foreground">
            총 {posts.length}개의 글이 있습니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/write">글쓰기</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
              <p className="text-muted-foreground">
                아직 작성된 글이 없습니다.
              </p>
              <Button asChild variant="outline" size="sm">
                <Link href="/write">첫 글 작성하기</Link>
              </Button>
            </div>
          ) : (
            <ul>
              {posts.map((post, i) => (
                <li key={post.id}>
                  <Link
                    href={`/posts/${post.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/50"
                  >
                    <div className="flex min-w-0 flex-col gap-1">
                      <span className="truncate font-medium">
                        {post.title}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {post.author} · {formatDate(post.createdAt)} · 조회{" "}
                        {post.views}
                      </span>
                    </div>
                  </Link>
                  {i < posts.length - 1 && <Separator />}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
