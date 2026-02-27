import './globals.css'
import { AuthProvider } from './context/AuthContext'
import Header from './components/ui/Header/Header'
import Footer from './components/ui/Footer/Footer'

export const metadata = {
  title: 'پرندیکس - پلتفرم خدمات شهری',
  description: 'پلتفرم پرندیکس برای اتصال مشتریان به متخصصان خدمات در شهر پرند',
  keywords: 'پرند، خدمات، متخصص، ساختمان، تعمیر، نظافت، زیبایی، آموزش',
  authors: [{ name: 'پرندیکس' }],
  creator: 'پرندیکس',
  publisher: 'پرندیکس',
  robots: 'index, follow',
  openGraph: {
    title: 'پرندیکس - پلتفرم خدمات شهری',
    description: 'پلتفرم پرندیکس برای اتصال مشتریان به متخصصان خدمات در شهر پرند',
    url: 'https://parandx.com',
    siteName: 'پرندیکس',
    locale: 'fa_IR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'پرندیکس - پلتفرم خدمات شهری',
    description: 'پلتفرم پرندیکس برای اتصال مشتریان به متخصصان خدمات در شهر پرند',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#3B82F6'
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl">
      <head>
        <meta charSet="utf-8" />
        <meta name="enamad" content="70429060" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-iransans bg-white overflow-x-hidden">
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
            <Header />
            <main className="flex-grow w-full overflow-x-hidden pb-20 md:pb-0">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}
