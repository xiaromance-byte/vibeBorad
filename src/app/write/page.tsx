import { createPost } from "@/app/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Link from "next/link";

export default function WritePage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-6 px-4 py-10">
      <h1 className="text-2xl font-bold tracking-tight">글쓰기</h1>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">새 글 작성</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createPost} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">제목</Label>
              <Input id="title" name="title" placeholder="제목을 입력하세요" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="author">작성자</Label>
              <Input id="author" name="author" placeholder="이름을 입력하세요" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="content">내용</Label>
              <Textarea
                id="content"
                name="content"
                placeholder="내용을 입력하세요"
                required
                rows={12}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button asChild variant="outline" type="button">
                <Link href="/">취소</Link>
              </Button>
              <Button type="submit">등록</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
