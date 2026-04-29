import '../styles/globals.css'
import { CartProvider } from '../context/CartContext'
import { FavoritesProvider } from '../context/FavoritesContext'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Run auth check on initial load
    authCheck(router.asPath);

    // Set authorized to false to hide page content while changing routes
    const hideContent = () => setAuthorized(false);
    router.events.on('routeChangeStart', hideContent);
    router.events.on('routeChangeComplete', authCheck);

    return () => {
      router.events.off('routeChangeStart', hideContent);
      router.events.off('routeChangeComplete', authCheck);
    };

    function authCheck(url) {
      // Public paths that don't require authentication
      const publicPaths = ['/login', '/register', '/forgot-password'];
      const path = url.split('?')[0];
      const token = localStorage.getItem('token');

      if (!token && !publicPaths.includes(path)) {
        setAuthorized(false);
        router.push({
          pathname: '/login',
          query: { returnUrl: router.asPath }
        });
      } else {
        setAuthorized(true);
      }
    }
  }, [router]);

  // Prevent hydration errors by waiting for auth check
  if (!authorized) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <FavoritesProvider>
      <CartProvider>
        <Head>
          <title>FoodHub | Seu Delivery Completo</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="description" content="FoodHub - A melhor plataforma de delivery com a maior variedade de comidas." />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        </Head>
        <div className="min-h-screen">
          <Component {...pageProps} />
        </div>
      </CartProvider>
    </FavoritesProvider>
  )
}

