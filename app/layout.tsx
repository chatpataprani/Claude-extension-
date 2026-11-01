import type { Metadata, Viewport } from 'next';
import './globals.css';
export const metadata: Metadata = { title: 'CloudStream Web', description: 'An experimental browser-based CloudStream client.' };
export const viewport: Viewport = { themeColor: '#101114', width: 'device-width', initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
