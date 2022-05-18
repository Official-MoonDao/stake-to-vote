import { useEffect } from 'react'
import { useState } from 'react'
import networkToId from './networkToId'
import { useNetwork } from './use-wagmi'

export default function usePreferredNetwork() {
  // @ts-expect-error ts-migrate(2554) FIXME: Expected 1 arguments, but got 0.
  const { activeChain } = useNetwork()
  const preferredNetwork = process.env.NEXT_PUBLIC_CHAIN

  const [isPreferredNetwork, setIsPreferredNetwork] = useState(false)

  useEffect(() => {
    if (activeChain?.id && activeChain?.id == networkToId(preferredNetwork)) {
      setIsPreferredNetwork(true)
    } else {
      setIsPreferredNetwork(false)
    }
  }, [activeChain?.id])

  return { isPreferredNetwork, preferredNetwork }
}
