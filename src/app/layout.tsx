import Navbar from "@/components/Navbar";
import { AuthProvider } from "@/lib/context";
import type { Metadata } from "next";
import { Inter, Khand, Roboto_Mono } from "next/font/google";
import { Bounce, ToastContainer } from "react-toastify";
import "./globals.css";
import QueryClientContextProvider from "./QueryClientContextProvider";

export const metadata: Metadata = {
  title: 'Electron Next.js App',
  description: 'Electron app with Next.js',
}

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
});

const khand = Khand({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-khand',
});


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <script src="https://accounts.google.com/gsi/client" async defer></script>
      </head>
      <body
        className={`${inter.variable} ${robotoMono.variable} ${khand.variable} dark antialiased`}
      >
        <QueryClientContextProvider>
          <AuthProvider>
            <Navbar/>
            {children}
            <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
            />
          </AuthProvider>
        </QueryClientContextProvider>
      </body>
    </html>
  )
} 
