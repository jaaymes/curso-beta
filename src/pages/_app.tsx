
import { NextPage } from 'next';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import { Router } from 'next/router';

import themeConfig from '@/configs/themeConfig';
import { SettingsConsumer, SettingsProvider } from '@/context/settingsContext';
import { AuthProvider } from '@/hooks/useAuth';
import { PaginationProvider } from '@/hooks/usePagination';
import UserLayout from '@/layouts/admin';
import client from '@/lib/client';
import '@/styles/globals.css';
import ThemeComponent from '@/styles/theme/ThemeComponent';
import { createEmotionCache } from '@/utils/create-emotion-cache';
import { ApolloProvider } from '@apollo/client';
import { CacheProvider, EmotionCache } from '@emotion/react';
import NProgress from 'nprogress';
import 'react-perfect-scrollbar/dist/css/styles.css';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type ExtendedAppProps = AppProps & {
  Component: NextPageWithLayout
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
    <ApolloProvider client={client}>
      <CacheProvider value={emotionCache}>
        <Head>
          <title>{`${themeConfig.templateName}`}</title>
          <meta
            name='description'
            content={`${themeConfig.templateName}`}
          />
          <meta name='viewport' content='initial-scale=1, width=device-width' />
        </Head>

        <AuthProvider>
          <PaginationProvider>
            <SettingsProvider>
              <SettingsConsumer>
                {({ settings }) => {
                  return <ThemeComponent settings={settings}> {getLayout(<Component {...pageProps} />)}</ThemeComponent>
                }}
              </SettingsConsumer>
            </SettingsProvider>
          </PaginationProvider>
        </AuthProvider>
      </CacheProvider>
    </ApolloProvider>
  )
};

export default MyApp;
