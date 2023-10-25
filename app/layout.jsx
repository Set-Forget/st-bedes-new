import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from './components/navbar-module/navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'St. Bedes',
  description: 'Set & forget',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
      {children}
      </body>
    </html>
  )
}
