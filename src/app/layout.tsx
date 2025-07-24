import './globals.css'

export const metadata = {
  title: 'Pendra App v0.1.7 - Simple Todo App',
  description: 'Pendra App v0.1.7 - A clean, simple todo application with drag-and-drop reordering, due dates, sections, checklists, and inline editing',
  manifest: '/manifest.json',
  themeColor: '#3b82f6',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Pendra',
  },
  icons: {
    icon: '/icons/icon-192x192.png',
    apple: '/icons/icon-192x192.png',
  },
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="application-name" content="Pendra" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Pendra" />
        <meta name="description" content="A clean, simple todo application with drag-and-drop reordering, due dates, sections, checklists, and inline editing" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/icons/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#3b82f6" />
        
        <link rel="apple-touch-icon" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/icons/icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/icon-192x192.png" />
        <link rel="apple-touch-icon" sizes="167x167" href="/icons/icon-192x192.png" />
        
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/icon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/icon-72x72.png" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="mask-icon" href="/icons/icon.svg" color="#3b82f6" />
        <link rel="shortcut icon" href="/icons/icon-96x96.png" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
