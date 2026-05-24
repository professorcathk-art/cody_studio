import { LoginForm } from "@/components/login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="mb-10 text-center">
        <p className="mb-2 text-xs font-medium uppercase tracking-[0.3em] text-muted">
          Cody Studio
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">帽子設計圖</h1>
        <p className="mt-2 text-sm text-muted">請輸入您的通關密碼</p>
      </div>
      <LoginForm />
    </div>
  );
}
