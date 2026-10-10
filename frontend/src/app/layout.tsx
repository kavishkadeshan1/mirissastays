import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "MirissaStays",
  description: "Places to stay along Sri Lanka's south coast.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
