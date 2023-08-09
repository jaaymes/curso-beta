import { ToastContainer } from 'react-toastify';

import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { Router } from 'next/router';

import themeConfig from '@/configs/themeConfig';
import { SettingsConsumer, SettingsProvider } from '@/context/settingsContext';
import { AuthProvider } from '@/hooks/useAuth';
import UserLayout from '@/layouts/admin';
import '@/styles/globals.css';
import ThemeComponent from '@/styles/theme/ThemeComponent';
import { createEmotionCache } from '@/utils/create-emotion-cache';
import { CacheProvider, EmotionCache } from '@emotion/react';
import NProgress from 'nprogress';
import 'react-toastify/dist/ReactToastify.css';

type ExtendedAppProps = AppProps & {
  Component: NextPage
  emotionCache: EmotionCache
}

const clientSideEmotionCache = createEmotionCache()

if (themeConfig.routingLoader) {
  Router.events.on('routeChangeStart', () => {
    NProgress.start()
  })
  Router.events.on('routeChangeError', () => {
    NProgress.done()
  })
  Router.events.on('routeChangeComplete', () => {
    NProgress.done()
  })
}

const MyApp = (props: ExtendedAppProps) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  const getLayout = Component.getLayout ?? (page => <UserLayout>{page}</UserLayout>)
  return (
    <CacheProvider value={emotionCache}>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <AuthProvider>
        <SettingsProvider>
          <SettingsConsumer>
            {({ settings }) => {
              return <ThemeComponent settings={settings}>{getLayout(<Component {...pageProps} />)}</ThemeComponent>
            }}
          </SettingsConsumer>
        </SettingsProvider>
      </AuthProvider>

    </CacheProvider>
  )
};

export default MyApp;
