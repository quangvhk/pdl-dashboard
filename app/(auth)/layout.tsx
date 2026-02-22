import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Sign In",
    template: "%s | Pandalang",
  },
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-muted/40 flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        {/* Pandalang branding */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-2xl text-primary-foreground select-none">
            🐼
          </div>
          <span className="text-xl font-semibold tracking-tight">
            Pandalang
          </span>
        </div>

        {children}
      </div>
    </div>
  );
}
