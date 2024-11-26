import { NFT, ThirdwebNftMedia } from '@thirdweb-dev/react'
import { useEffect, useState } from 'react'

type TeamPreviewProps = {
  teamId: any
  teamContract?: any
}

export function TeamPreview({ teamId, teamContract }: TeamPreviewProps) {
  const [teamNFT, setTeamNFT] = useState<NFT>()

  useEffect(() => {
    async function getTeamNFT() {
      const nft = await teamContract.erc721.get(teamId)
      setTeamNFT(nft)
    }

    if (teamContract?.erc721?.get && teamId) {
      getTeamNFT()
    }
  }, [teamId, teamContract])

  return (
    <div className="flex items-center gap-5">
      {teamNFT && (
        <div className="rounded-[2.5vmax] rounded-tl-[10px] overflow-hidden">
          <ThirdwebNftMedia
            metadata={teamNFT.metadata}
            width="100px"
            height="100px"
          />
        </div>
      )}
    </div>
  )
}
