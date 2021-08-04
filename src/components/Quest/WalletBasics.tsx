import React, { useState } from 'react'
import { VStack, Button } from '@chakra-ui/react'
import { useWalletWeb3React } from 'hooks'
import Web3 from 'web3'
import * as ethUtil from 'ethereumjs-util'
import { convertUtf8ToHex } from '@walletconnect/utils'

// TODO: move to utils
function hashPersonalMessage(msg: string): string {
  const buffer = Buffer.from(msg)
  const result = ethUtil.hashPersonalMessage(buffer)
  const hash = ethUtil.bufferToHex(result)
  return hash
}
function recoverPublicKey(sig: string, hash: string): string {
  const sigParams = ethUtil.fromRpcSig(sig)
  const hashBuffer = Buffer.from(hash.replace('0x', ''), 'hex')
  const result = ethUtil.ecrecover(
    hashBuffer,
    sigParams.v,
    sigParams.r,
    sigParams.s
  )
  const signer = ethUtil.bufferToHex(ethUtil.publicToAddress(result))
  return signer
}
function recoverPersonalSignature(sig: string, msg: string): string {
  const hash = hashPersonalMessage(msg)
  const signer = recoverPublicKey(sig, hash)
  return signer
}

const WalletBasics = (): React.ReactElement => {
  const [isSignatureVerified, setIsSignatureVerified] = useState(false)
  const walletWeb3ReactContext = useWalletWeb3React()
  const walletAddress = walletWeb3ReactContext.account

  const testSignPersonalMessage = async () => {
    // TODO: move verification to the backend and store signature in DB

    const provider = window.web3 ? window.web3.currentProvider : window.ethereum
    const web3: any = new Web3(provider)

    if (!web3 || !walletAddress) {
      console.error('login problem')
      return
    }

    const address = walletAddress

    // test message
    const message = 'Hello word!'

    // encode message (hex)
    const hexMsg = convertUtf8ToHex(message)

    try {
      // send message
      const result = await web3.eth.personal.sign(hexMsg, address)

      // verify signature
      const signer = recoverPersonalSignature(result, message)
      const verified = signer.toLowerCase() === address.toLowerCase()
      setIsSignatureVerified(verified)

      // format displayed result
      const formattedResult = {
        action: 'PERSONAL_SIGN',
        address,
        signer,
        verified,
        result,
      }
      // eslint-disable-next-line no-console
      console.log(formattedResult)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <VStack flex="auto">
      {walletAddress ? (
        <>
          <p>
            STEP 1:{' '}
            <Button
              colorScheme={isSignatureVerified ? 'green' : 'red'}
              onClick={testSignPersonalMessage}
            >
              {isSignatureVerified
                ? 'Message verified'
                : 'sign a message with your wallet'}
            </Button>
          </p>
          <p>STEP 2: Post the signature on twitter</p>
          <p>STEP 3: Copy the twitter link here to verify your account</p>
        </>
      ) : (
        <h2>⚠️ Connect your wallet first!</h2>
      )}
    </VStack>
  )
}

export default WalletBasics
