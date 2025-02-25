import { UserMeta } from '@app/models'
import { WebSocketContext } from '@app/providers/websocket'
import { API_USERS_ME, ROUTE_LOGIN } from '@app/routes'
import { configuredFetcher } from '@app/utils'
import clsx from 'clsx'
import useTranslation from 'next-translate/useTranslation'
import { useRouter } from 'next/dist/client/router'
import Head from 'next/head'
import React, { useContext, useEffect } from 'react'
import useSWR from 'swr'
import Footer from './main/footer'
import { Sidebar } from './main/sidebar'
import Topbar from './main/top-bar'

const sidebarWidth = 'w-[17rem]'
const mainWidth = 'w-[calc(100vw-17rem)]' // ViewWidth - sidebar

interface PageHeadProps {
  title: string
}

const PageHead = (props: PageHeadProps) => {
  const { title } = props

  const { t } = useTranslation('head')

  return (
    <Head>
      <title>{t('title', { page: title })}</title>
    </Head>
  )
}

export interface LayoutProps {
  title: string
  // TODO(@m8vago): check after eslint update if this is still necessary
  // eslint-disable-next-line react/no-unused-prop-types
  topBarContent?: React.ReactNode
  children: React.ReactNode
}

export const Layout = (props: LayoutProps) => {
  const { title, children, topBarContent } = props

  const webSocketContext = useContext(WebSocketContext)
  const { data: meta, error } = useSWR<UserMeta>(
    API_USERS_ME,
    configuredFetcher({
      method: 'POST',
    }),
  )

  useEffect(() => {
    if (meta) {
      webSocketContext.client?.reset()
    }
  }, [meta, webSocketContext.client])

  const router = useRouter()

  useEffect(() => {
    if (error) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      router.replace(ROUTE_LOGIN)
    }
  }, [error, router])

  return (
    <>
      <PageHead title={title} />

      <main className="flex flex-row h-full bg-dark w-full">
        <Sidebar className={clsx('flex flex-col bg-medium h-screen sticky top-0', sidebarWidth)} />

        <div className={clsx('flex flex-col px-7 pt-4', mainWidth)}>
          <Topbar className="flex flex-row mb-4" meta={meta}>
            {topBarContent}
          </Topbar>

          <div className="flex flex-col h-full">{children}</div>

          <Footer className="mt-auto" />
        </div>
      </main>
    </>
  )
}

export const SingleFormLayout = (props: LayoutProps) => {
  const { title, children } = props

  return (
    <>
      <PageHead title={title} />

      <main className="flex flex-col w-screen h-screen bg-dark">
        <div className="flex flex-col h-full justify-center items-center">{children}</div>

        <Footer className="mx-7" />
      </main>
    </>
  )
}
