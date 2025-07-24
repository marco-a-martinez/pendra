import './globals.css'

export const metadata = {
  title: 'Pendra App v0.1.2 - Simple Todo App',
  description: 'Pendra App v0.1.2 - A clean, simple todo application with drag-and-drop reordering and due dates',
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
