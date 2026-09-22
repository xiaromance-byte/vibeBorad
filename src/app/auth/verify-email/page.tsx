"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function VerifyEmailForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);
    const { data, error } = await authClient.emailOtp.verifyEmail({
      email,
      otp: code,
    });
    setLoading(false);
    if (error) {
      setError(error.message ?? "인증에 실패했습니다. 코드를 다시 확인해주세요.");
      return;
    }
    if (data && "token" in data && data.token) {
      window.location.href = "/";
    } else {
      setMessage("이메일 인증이 완료되었습니다. 로그인해주세요.");
    }
  }

  async function handleResend() {
    setError(null);
    setMessage(null);
    setResending(true);
    const { error } = await authClient.sendVerificationEmail({ email });
    setResending(false);
    if (error) {
      setError(error.message ?? "재전송에 실패했습니다.");
      return;
    }
    setMessage("인증 코드를 다시 보냈습니다. 메일함을 확인해주세요.");
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center gap-6 px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">이메일 인증</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleVerify} className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{email}</span>{" "}
              주소로 전송된 인증 코드를 입력해주세요. (15분간 유효)
            </p>
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">인증 코드</Label>
              <Input
                id="code"
                inputMode="numeric"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
                placeholder="123456"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
            {message && <p className="text-sm text-muted-foreground">{message}</p>}
            <Button type="submit" disabled={loading || !email}>
              {loading ? "확인 중..." : "인증하기"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={resending || !email}
              onClick={handleResend}
            >
              {resending ? "재전송 중..." : "코드 재전송"}
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              <Link href="/auth/sign-in" className="font-medium text-foreground underline">
                로그인으로 돌아가기
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailForm />
    </Suspense>
  );
}
