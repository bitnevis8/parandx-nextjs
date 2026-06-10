import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { CityProvider } from './context/CityContext'
import Header from './components/ui/Header/Header'
import Footer from './components/ui/Footer/Footer'
import CityPickerModal from './components/ui/CityPickerModal'

export const metadata = {
  title: 'پرندیکس - پلتفرم خدمات شهری',
  description: 'پرندیکس — پیدا کردن متخصص خدمات در شهرتون؛ مستقیم، رایگان و بدون واسطه',
  keywords: 'خدمات شهری، متخصص، ساختمان، تعمیر، نظافت، زیبایی، آموزش',
  authors: [{ name: 'پرندیکس' }],
  creator: 'پرندیکس',
  publisher: 'پرندیکس',
  robots: 'index, follow',
  openGraph: {
    title: 'پرندیکس - پلتفرم خدمات شهری',
    description: 'پرندیکس — پیدا کردن متخصص خدمات در شهرتون؛ مستقیم، رایگان و بدون واسطه',
    url: 'https://parandx.com',
    siteName: 'پرندیکس',
    locale: 'fa_IR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'پرندیکس - پلتفرم خدمات شهری',
    description: 'پرندیکس — پیدا کردن متخصص خدمات در شهرتون؛ مستقیم، رایگان و بدون واسطه',
  }
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0d9488'
}

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className="rtl-enabled" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="enamad" content="70429060" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="font-iransans bg-white overflow-x-hidden" suppressHydrationWarning>
        <AuthProvider>
          <CityProvider>
            <div className="min-h-screen flex flex-col bg-white overflow-x-hidden">
              <Header />
              <main className="flex-grow w-full overflow-x-hidden pb-20 md:pb-0">
                {children}
              </main>
              <Footer />
              <CityPickerModal />
            </div>
          </CityProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
