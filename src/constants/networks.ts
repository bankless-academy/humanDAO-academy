import { INFURA_ID } from './index'

export default Object.freeze({
  mainnet: {
    name: 'mainnet',
    image: '/images/ethereum-logo-blue.png',
    chainId: 1,
    rpcUrl: `https://mainnet.infura.io/v3/${INFURA_ID}`,
    blockExplorer: 'https://etherscan.io/',
  },
  kovan: {
    name: 'kovan',
    image: '/images/ethereum-logo-black.png',
    chainId: 42,
    rpcUrl: `https://kovan.infura.io/v3/${INFURA_ID}`,
    faucet: 'https://gitter.im/kovan-testnet/faucet',
    blockExplorer: 'https://kovan.etherscan.io/',
  },
  matic: {
    name: 'matic',
    image: '/images/polygon-matic-logo.png',
    networkName: 'Matic(Polygon) Mainnet',
    currencySymbol: 'MATIC',
    chainId: 137,
    rpcUrl: 'https://rpc-mainnet.matic.network',
    faucet: 'https://faucet.matic.network/',
    blockExplorer: 'https://polygonscan.com',
  },
  mumbai: {
    name: 'mumbai',
    image: '/images/polygon-matic-logo.png',
    networkName: 'Matic(Polygon) Testnet Mumbai',
    currencySymbol: 'tMATIC',
    chainId: 80001,
    rpcUrl: 'https://rpc-mumbai.matic.today',
    faucet: 'https://faucet.matic.network/',
    blockExplorer: 'https://mumbai.polygonscan.com/',
  },
})
