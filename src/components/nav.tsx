"use client";

import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";

export function Nav() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold tracking-tight">
          게시판
        </Link>

        <div className="flex items-center gap-3">
          {isPending ? null : session?.user ? (
            <>
              <span className="text-sm text-muted-foreground">
                {session.user.name || session.user.email}님
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await authClient.signOut();
                  window.location.href = "/auth/sign-in";
                }}
              >
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/sign-in">로그인</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/auth/sign-up">회원가입</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
