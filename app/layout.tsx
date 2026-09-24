import type { ReactElement, ReactNode } from "react";
import "./globals.css";

export const metadata = { title: "isResponsiveZero" };

export default function RootLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;700&family=JetBrains+Mono&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
