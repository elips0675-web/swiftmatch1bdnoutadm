
import type {Metadata, Viewport} from 'next';
import './globals.css';
import { FirebaseClientProvider } from '@/firebase';
import { Toaster } from '@/components/ui/toaster';
import { LanguageProvider } from '@/context/language-context';
import { Poppins, Quicksand } from 'next/font/google';
import { AppContainer } from '@/components/layout/app-container';
import { FeatureFlagsProvider } from '@/context/feature-flags-context';
import { CookieConsent } from '@/components/shared/cookie-consent';
import { PwaInstallBanner } from '@/components/shared/pwa-install-banner';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { PwaRegistry } from '@/components/shared/pwa-registry';
import { ClientOnly } from '@/components/shared/client-only';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['800']
});

const quicksand = Quicksand({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-quicksand',
  weight: ['500', '600', '700']
});

export const viewport: Viewport = {
  themeColor: '#fe3c72',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'SwiftMatch - Найти свою идеальную пару',
  description: 'Современный опыт знакомств с искусственным интеллектом. Найди свою любовь в SwiftMatch.',
  keywords: 'знакомства, ИИ, мэтчи, любовь, общение, dating, AI',
  authors: [{ name: 'SwiftMatch Team' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'SwiftMatch',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://picsum.photos" />
        <link rel="dns-prefetch" href="https://picsum.photos" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className={`${quicksand.variable} ${poppins.variable} font-body antialiased selection:bg-primary/20`}>
        <LanguageProvider>
          <FirebaseClientProvider>
            <FeatureFlagsProvider>
              <FirebaseErrorListener />
              <PwaRegistry />
              <AppContainer>
                {children}
                <ClientOnly>
                  <CookieConsent />
                  <PwaInstallBanner />
                  <Toaster />
                </ClientOnly>
              </AppContainer>
            </FeatureFlagsProvider>
          </FirebaseClientProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
