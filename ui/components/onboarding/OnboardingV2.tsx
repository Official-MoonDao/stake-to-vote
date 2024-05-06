import { usePrivy, useWallets } from '@privy-io/react-auth'
import { useAddress } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useContext, useState } from 'react'
import PrivyWalletContext from '../../lib/privy/privy-wallet-context'
import { CreateCitizen } from './CreateCitizen'
import { CreateEntity } from './CreateEntity'

type TierProps = {
  label: string
  description: string
  points: any[]
  price: number
  onClick: () => void
}

function Tier({ label, description, points, price, onClick }: TierProps) {
  const address = useAddress()
  const { user, login, logout } = usePrivy()

  return (
    <div
      className="w-full transition-all duration-150 text-black cursor-pointer dark:text-white lg:p-8 flex flex-col border-[2px] hover:border-orange-500 hover:border-moon-orange border-opacity-100 bg-[white] dark:bg-[#0A0E22] p-3"
      onClick={() => {
        if (!address && user) logout()
        if (!address) login()
        else onClick()
      }}
    >
      <div className="w-full h-full flex flex-col lg:flex-row justify-center items-center lg:space-x-10">
        <div className="flex justify-center items-center">
          <Image
            src={
              label === 'Register an entity'
                ? '/onboarding-icons/entity.png'
                : '/onboarding-icons/citizen.png'
            }
            width={506}
            height={506}
            alt=""
          />
        </div>

        <div className="flex flex-col justify-between w-full items-start">
          <div className="flex flex-col space-y-5">
            <p className="mt-4 md:mt-0 md:p-2 text-sm text-moon-orange bg-red-600 bg-opacity-10">
              {description}
            </p>
            <h1 className={'font-GoodTimes text-3xl'}>{label}</h1>
            <div className="flex flex-col bg-[#FFFFFF08] px-4 w-full">
              <div className="flex flex-col xl:flex-row justify-between py-4 items-center">
                <div className="flex flex-row items-center md:space-x-2 space-x-1">
                  <p className="text-lg md:text-2xl">{price} ETH</p>
                  <p className="text-sm">/Year</p>
                </div>
                <p className="text-green-500 text-sm md:text-lg">
                  &#10003; 12 Months Pass
                </p>
              </div>
              <p className=" border-[1px] w-full h-[1px] border-white"></p>
              <div
                tabIndex={0}
                className="collapse collapse-arrow -mx-4"
                onClick={(e) => e.stopPropagation()}
              >
                <input type="checkbox" defaultChecked readOnly />
                <div className="collapse-title">Benefits</div>
                <div className="collapse-content">
                  {points.map((p, i) => (
                    <div
                      key={`${label}-tier-point-${i}`}
                      className="flex flex-row bg-opacity-3 py-2 rounded-sm space-x-2"
                    >
                      <p className="h-6 w-6 flex justify-center items-center rounded-full bg-[#FFFFFF1A] bg-opacity-10 px-2 ">
                        ✓
                      </p>
                      <p>{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function OnboardingV2({ selectedChain }: any) {
  const address = useAddress()
  const { selectedWallet } = useContext(PrivyWalletContext)
  const { wallets } = useWallets()
  const [selectedTier, setSelectedTier] = useState<'entity' | 'citizen'>()

  if (selectedTier === 'citizen') {
    return (
      <CreateCitizen
        address={address}
        selectedChain={selectedChain}
        selectedWallet={selectedWallet}
        wallets={wallets}
        setSelectedTier={setSelectedTier}
      />
    )
  }

  if (selectedTier === 'entity') {
    return (
      <CreateEntity
        address={address}
        selectedChain={selectedChain}
        selectedWallet={selectedWallet}
        wallets={wallets}
        setSelectedTier={setSelectedTier}
      />
    )
  }

  return (
    <div className="space-y-10 mt-3 px-5 lg:px-7 xl:px-10 py-12 lg:py-14 font-RobotoMono w-screen sm:w-[400px] lg:mt-10 lg:w-full lg:max-w-[1256px] text-slate-950 dark:text-white">
      <div className="flex flex-col space-y-7">
        <div className="flex flex-col  space-y-7">
          <Tier
            price={0.1}
            label="Become a citizen"
            description="Join the internet's space program today!"
            points={[
              'Become a member of MoonDAO and design your Citizen NFT.',
              'Access the biggest network of startups, nations, and individuals working to create a long-term presence on the lunar surface.',
              'Help govern the fate of the first off-world settlement.',
            ]}
            onClick={() => setSelectedTier('citizen')}
          />
          <Tier
            price={0.5}
            label="Register an entity"
            description="Bring your entity onchain today!"
            points={[
              'Access the frontier of onchain tooling to manage your organization and interface with any other onchain contracts.',
              'Recruit from our community and network with other cutting-edge organizations.',
              ,
              'Apply for funding from the MoonDAO community, list your products and services on the MoonDAO Marketplace, and compete on MoonDAO DePrizes.',
            ]}
            onClick={() => setSelectedTier('entity')}
          />
        </div>
      </div>
    </div>
  )
}