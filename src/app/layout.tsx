import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: "--font-heading" });

export const metadata = {
  title: "Traktir KelasWFA",
  description: "Dukung KelasWFA untuk terus berkarya di dunia kerja remote.",
  icons: {
    icon: [
      { url: 'https://r2.kelaswfa.my.id/img/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: 'https://r2.kelaswfa.my.id/img/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: 'https://r2.kelaswfa.my.id/img/favicon.ico' },
    ],
    apple: [
      { url: 'https://r2.kelaswfa.my.id/img/apple-touch-icon.png' },
    ],
    other: [
      { rel: 'android-chrome-192x192', url: 'https://r2.kelaswfa.my.id/img/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: 'https://r2.kelaswfa.my.id/img/android-chrome-512x512.png' },
    ]
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className={`${inter.variable} ${plusJakartaSans.variable} font-sans antialiased text-on-surface bg-surface selection:bg-secondary-container`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
