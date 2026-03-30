import type { Metadata } from "next";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "EthosMap — Law, ethics & human flourishing",
  description:
    "Interactive knowledge graph mapping legal and ethical reasoning from first principles to enacted law.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen font-sans antialiased">
        <a
          href="#main-content"
          className="absolute left-[-9999px] z-[100] rounded-md border border-[var(--border)] bg-[var(--surface)] px-4 py-2 text-sm font-medium text-slate-900 shadow-lg transition focus:left-4 focus:top-4 focus:z-[100] focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] dark:text-slate-50"
        >
          Skip to content
        </a>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
