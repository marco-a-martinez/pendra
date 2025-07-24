import './globals.css'

export const metadata = {
  title: 'Pendra App v0.1.1 - Simple Todo App',
  description: 'Pendra App v0.1.1 - A clean, simple todo application with drag-and-drop reordering',
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
