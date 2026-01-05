import NextErrorComponent from 'next/error'
import type { NextPageContext } from 'next'

type ErrorProps = {
  statusCode?: number
}

export default function Error({ statusCode }: ErrorProps) {
  return <NextErrorComponent statusCode={statusCode ?? 500} />
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404
  return { statusCode }
}
