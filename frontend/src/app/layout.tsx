import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'Nexus AI – Autonomous Personal Operating System',
  description: 'An autonomous multi-agent AI OS that creates your Digital Twin and coordinates expert AI advisors to help you achieve goals, build startups, and accelerate your career.',
  keywords: ['AI', 'multi-agent', 'digital twin', 'career planning', 'LangGraph', 'autonomous AI'],
  authors: [{ name: 'Nexus AI Team' }],
  openGraph: {
    title: 'Nexus AI – Your AI Operating System',
    description: 'Not a chatbot. A board of expert AI advisors working for you.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased" style={{ backgroundColor: '#020816' }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
