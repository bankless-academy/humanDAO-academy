import type { AppProps } from 'next/app'
import dynamic from 'next/dynamic'
import Layout from '../layout'
import ThemeProvider from '../theme/index'
import { Web3ReactProvider } from '@web3-react/core'
import { ethers } from 'ethers'

function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider) // this will vary according to whether you use e.g. ethers or web3.js
}

const Web3ReactProviderDefault = dynamic(
  () => import('../providers/Web3ReactProviderDefaultSSR'),
  { ssr: false }
)

const App = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <ThemeProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <Web3ReactProviderDefault getLibrary={getLibrary}>
          <Layout pageMeta={pageProps.pageMeta}>
            <Component {...pageProps} />
          </Layout>
        </Web3ReactProviderDefault>
      </Web3ReactProvider>
    </ThemeProvider>
  )
}

export default App
