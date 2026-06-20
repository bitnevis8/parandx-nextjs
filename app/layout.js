import './globals.css'
import { AuthProvider } from './context/AuthContext'
import { CityProvider } from './context/CityContext'
import { ThemeProvider } from './context/ThemeContext'
import Header from './components/ui/Header/Header'
import MainNavBar from './components/ui/Header/MainNavBar'
import Footer from './components/ui/Footer/Footer'
import CityPickerModal from './components/ui/CityPickerModal'
import NightSkyStars from './components/ui/NightSkyStars'

const themeInitScript = `(function(){try{var t=localStorage.getItem('parandx-theme');if(t==='dark')document.documentElement.classList.add('dark');}catch(e){}})();`

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
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="font-iransans bg-white text-slate-900 overflow-x-hidden dark:bg-[#020617] dark:text-slate-100" suppressHydrationWarning>
        <ThemeProvider>
          <NightSkyStars />
          <AuthProvider>
            <CityProvider>
              <div className="relative z-10 flex min-h-screen flex-col overflow-x-hidden bg-white dark:bg-transparent">
                <Header />
                <main className="flex-grow w-full overflow-x-hidden pb-[calc(3.75rem+env(safe-area-inset-bottom,0px))] dark:bg-transparent md:pb-0">
                  {children}
                </main>
                <Footer />
                <CityPickerModal />
              </div>
              <MainNavBar />
            </CityProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
