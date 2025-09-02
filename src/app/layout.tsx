import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'CRM de Marketing e Gestão de Projetos',
  description: 'CRM completo para agências de marketing e gestão de projetos',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head />
      <body className="bg-gray-50 text-gray-900 font-sans">
        <div className="min-h-screen flex flex-col">
          <header className="bg-white shadow p-4 flex items-center justify-between">
            <h1 className="text-2xl font-bold">CRM Marketing & Gestão</h1>
          </header>
          <main className="flex-grow container mx-auto p-6">
            {children}
          </main>
          <footer className="bg-white shadow p-4 mt-auto text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} CRM Agência de Marketing
          </footer>
        </div>
      </body>
    </html>
  )
}