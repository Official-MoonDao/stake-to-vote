import CompetitorABI from 'const/abis/Competitor.json'
import TeamABI from 'const/abis/Team.json'
import { DEPRIZE_ID, COMPETITOR_TABLE_ADDRESSES } from 'const/config'
import { TEAM_ADDRESSES } from 'const/config'
import { useState, useContext } from 'react'
import toast from 'react-hot-toast'
import {
  getContract,
  prepareContractCall,
  sendAndConfirmTransaction,
} from 'thirdweb'
import { useActiveAccount, useActiveWallet } from 'thirdweb/react'
import { useTeamWearer } from '@/lib/hats/useTeamWearer'
import toastStyle from '@/lib/marketplace/marketplace-utils/toastConfig'
import { getChainSlug } from '@/lib/thirdweb/chain'
import ChainContextV5 from '@/lib/thirdweb/chain-context-v5'
import client from '@/lib/thirdweb/client'
import Container from '@/components/layout/Container'
import ContentLayout from '@/components/layout/ContentLayout'
import Head from '@/components/layout/Head'
import { NoticeFooter } from '@/components/layout/NoticeFooter'
import { CompetitorPreview } from '@/components/nance/CompetitorPreview'
import { JoinDePrizeModal } from '@/components/nance/JoinDePrizeModal'
import StandardButton from '../layout/StandardButton'

export type Metadata = {}
export type Competitor = {
  id: string
  deprize: number
  teamId: number
  metadata: Metadata
}

export type DePrizeProps = {
  competitors: Competitor[]
  refreshRewards: () => void
}

export function DePrize({ competitors, refreshRewards }: DePrizeProps) {
  const account = useActiveAccount()

  const { selectedChain } = useContext(ChainContextV5)
  const chainSlug = getChainSlug(selectedChain)

  const [joinModalOpen, setJoinModalOpen] = useState(false)

  const wallet = useActiveWallet()
  const userAddress = wallet?.getAccount()?.address

  const competitorContract = getContract({
    client,
    chain: selectedChain,
    address: COMPETITOR_TABLE_ADDRESSES[chainSlug],
    abi: CompetitorABI as any,
  })

  const teamContract = getContract({
    client,
    chain: selectedChain,
    address: TEAM_ADDRESSES[chainSlug],
    abi: TeamABI as any,
  })

  const userTeams = useTeamWearer(teamContract, selectedChain, userAddress)

  const isCompetitor = userTeams.some((team: any) =>
    competitors.some(
      (competitor) => competitor.teamId.toString() === team.teamId
    )
  )
  const handleJoinWithTeam = async (teamId: string) => {
    try {
      if (!account) throw new Error('No account found')

      const transaction = prepareContractCall({
        contract: competitorContract,
        method: 'insertIntoTable',
        params: [DEPRIZE_ID, teamId, '{}'],
      })

      const receipt = await sendAndConfirmTransaction({
        transaction,
        account,
      })

      toast.success('Joined as a competitor!', {
        style: toastStyle,
      })
      setJoinModalOpen(false)
      setTimeout(() => {
        refreshRewards()
      }, 5000)
    } catch (error) {
      console.error('Error joining as a competitor:', error)
      toast.error('Error joining as a competitor. Please try again.', {
        style: toastStyle,
      })
    }
  }
  return (
    <section id="rewards-container" className="overflow-hidden">
      <Head
        title="DePrize"
        description="Distribute rewards to contributors based on their contributions."
      />
      <Container>
        <ContentLayout
          header={'DePrize'}
          description="Distribute rewards to contributors based on their contributions."
          headerSize="max(20px, 3vw)"
          preFooter={<NoticeFooter />}
          mainPadding
          mode="compact"
          popOverEffect={false}
          isProfile
        >
          {!isCompetitor && (
            <>
              <StandardButton
                onClick={() => setJoinModalOpen(true)}
                className="gradient-2 rounded-full"
              >
                Join
              </StandardButton>
              {joinModalOpen && (
                <JoinDePrizeModal
                  userTeams={userTeams}
                  setJoinModalOpen={setJoinModalOpen}
                  teamContract={teamContract}
                  handleJoinWithTeam={handleJoinWithTeam}
                />
              )}
            </>
          )}
          <div className="pb-32 w-full flex flex-col gap-4 py-2">
            <div className="flex justify-between items-center">
              <h3 className="title-text-colors text-2xl font-GoodTimes">
                Competitors
              </h3>
            </div>
            <div>
              {competitors &&
                competitors.length > 0 &&
                competitors.map((competitor, i: number) => (
                  <div
                    key={i}
                    className="flex items-center w-full py-1 text-[17px]"
                  >
                    <div className="flex-1 px-8">
                      <CompetitorPreview
                        teamId={competitor.teamId}
                        teamContract={teamContract}
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </ContentLayout>
      </Container>
    </section>
  )
}
