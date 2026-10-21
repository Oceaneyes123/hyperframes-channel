import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "HyperFrames Studio · V3",
  description: "Local production studio foundation. Generation is not enabled.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
