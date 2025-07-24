import './globals.css'

export const metadata = {
  title: 'Pendra - Simple Todo App',
  description: 'A clean, simple todo application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        {children}
      </body>
    </html>
  )
}
