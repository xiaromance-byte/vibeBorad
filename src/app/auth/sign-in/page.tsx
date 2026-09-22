"use client";

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [needsVerification, setNeedsVerification] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setNeedsVerification(false);
    setLoading(true);
    const { error } = await authClient.signIn.email({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message ?? "로그인에 실패했습니다.");
      if (error.message?.toLowerCase().includes("verif")) {
        setNeedsVerification(true);
      }
      return;
    }
    // Hard navigation: a client-side push can reuse a Router Cache entry
    // prefetched for "/" before login (from the Nav link on this page),
    // which would bounce straight back to the sign-in redirect.
    window.location.href = "/";
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">로그인</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {needsVerification && (
              <p className="text-sm text-muted-foreground">
                <Link
                  href={`/auth/verify-email?email=${encodeURIComponent(email)}`}
                  className="font-medium text-foreground underline"
                >
                  이메일 인증하러 가기
                </Link>
              </p>
            )}
            <Button type="submit" disabled={loading}>
              {loading ? "로그인 중..." : "로그인"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              계정이 없으신가요?{" "}
              <Link href="/auth/sign-up" className="font-medium text-foreground underline">
                회원가입
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
