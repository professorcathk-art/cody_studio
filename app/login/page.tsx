import { LoginForm } from "@/components/login-form";
import { StoreLogo } from "@/components/store-brand";

export default function LoginPage() {
  return (
    <div className="safe-bottom relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-store-bg px-4 py-8">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 1px 1px, #e8e4de 1px, transparent 0)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="pointer-events-none absolute -right-20 top-20 h-64 w-64 rounded-full bg-store-warm/20 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-20 h-64 w-64 rounded-full bg-store-accent/5 blur-3xl" />

      <div className="relative mb-8 w-full max-w-sm text-center sm:mb-10">
        <div className="mx-auto mb-5 flex justify-center">
          <StoreLogo className="h-14 w-14 shadow-lg" />
        </div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.35em] text-store-muted">
          Cody Studio
        </p>
        <h1 className="text-2xl font-semibold tracking-tight text-store-foreground sm:text-3xl">
          Cap Store
        </h1>
        <p className="mt-2 text-sm text-store-muted">請輸入組織通關密碼進入精品店</p>
      </div>
      <div className="relative w-full max-w-sm rounded-2xl bg-white/90 p-6 shadow-xl ring-1 ring-store-border backdrop-blur-sm sm:p-8">
        <LoginForm />
      </div>
    </div>
  );
}
