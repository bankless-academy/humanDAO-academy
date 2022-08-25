import React, { useEffect, useState } from 'react'
import { Container, Box, Text, Icon, Link } from '@chakra-ui/react'
import { GetStaticProps } from 'next'
import { PassportReader } from '@gitcoinco/passport-sdk-reader'
import { Passport, Stamp } from '@gitcoinco/passport-sdk-types'
import { X, CircleWavyCheck } from 'phosphor-react'

import { useActiveWeb3React } from 'hooks'
import { MetaData } from 'components/Head'
import { IS_WHITELABEL } from 'constants/index'
import GitcoinPassport from 'components/GitcoinPassport'

const pageMeta: MetaData = {
  title: 'Passport',
}

export const getStaticProps: GetStaticProps = async () => {
  return {
    props: { pageMeta },
  }
}

// TODO: move to config file
export const CERAMIC_PASSPORT = 'https://ceramic.passport-iam.gitcoin.co'

export const NUMBER_OF_STAMP_REQUIRED = 3

// Gitcoin
export const ALLOWED_ISSUER =
  'did:key:z6MkghvGHLobLEdj1bgRLhS4LPGJAvbMA1tn2zcRyqmYU5LC'

const reader = new PassportReader(CERAMIC_PASSPORT, '1')

export interface Stamps {
  [key: string]: Stamp
}

export const filterValidStamps = (stamps: Stamp[]): Stamp[] => {
  // const currentTimestamp = 1665401965000
  const currentTimestamp = Date.now()
  return stamps.filter(
    (stamp) =>
      stamp.credential.issuer === ALLOWED_ISSUER &&
      Date.parse(stamp.credential.expirationDate) > currentTimestamp
  )
}

export const getNumberOfValidStamps = (stamps: Stamps): number | null => {
  const array = Object.values(stamps)
  if (!array.length) {
    return null
  }
  return filterValidStamps(Object.values(stamps)).length
}

export const OkIcon = (
  <Icon as={CircleWavyCheck} color="green" display="inline" />
)
export const KoIcon = <Icon as={X} color="red" display="inline" />

const PassportPage = (): JSX.Element => {
  const [stamps, setStamps] = useState({})
  const { account } = useActiveWeb3React()

  useEffect(() => {
    async function getData() {
      const passport: Passport = await reader.getPassport(account)
      // console.log('passport', passport)
      const stamps = {}
      for (const stamp of passport.stamps) {
        stamps[stamp.provider] = stamp
      }
      // console.log('stamps', stamps)
      setStamps(stamps)
    }
    if (account) getData()
    else {
      setStamps({})
    }
  }, [account])

  const numberOfValidStamps = getNumberOfValidStamps(stamps)

  const explorerStatus = numberOfValidStamps
    ? numberOfValidStamps >= NUMBER_OF_STAMP_REQUIRED
    : null

  return (
    <Container maxW="container.xl">
      <Box py={12}>
        <Text fontSize="2xl">
          {'Explorer 👨‍🚀 status: '}
          {!account && '⚠️ Connect your wallet first'}
          {explorerStatus === true
            ? OkIcon
            : explorerStatus === false && (
                <>
                  {KoIcon}
                  <br />
                  {numberOfValidStamps < NUMBER_OF_STAMP_REQUIRED && (
                    <>
                      {`Go to `}
                      <Link href="https://passport.gitcoin.co/" target="_blank">
                        Gitcoin Passport
                      </Link>
                      {` and collect ${
                        NUMBER_OF_STAMP_REQUIRED - numberOfValidStamps
                      } more stamps`}
                    </>
                  )}
                </>
              )}
        </Text>
      </Box>
      {/* TODO: add refresh button */}
      {!IS_WHITELABEL && <GitcoinPassport stamps={stamps} />}
    </Container>
  )
}

export default PassportPage
