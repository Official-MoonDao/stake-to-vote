import { useSession, signIn, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { discordOauthUrl, getUserDiscordData } from '../lib/discord'
import { checkUserData, submitRaffleForm } from '../lib/google-sheets'
import { useAccount } from '../lib/use-wagmi'
import { useVMOONEYBalance } from '../lib/ve-token'
import MainCard from '../components/MainCard'

export default function Raffle({ userDiscordData }: any) {
  const { data: account } = useAccount()
  const { data: twitter } = useSession()
  const [state, setState] = useState(0)
  const { data: vMooneyBalance, isLoading: vMooneyBalanceLoading } =
    useVMOONEYBalance('0x679d87D8640e66778c3419D164998E720D7495f6')
  function Cancle(stage: any) {
    return (
      <button
        className="text-[coral] hover:scale-[1.05] ease-in duration-150"
        onClick={async () => {
          stage === 1 ? setState(0) : await signOut()
        }}
      >
        Cancel ✖
      </button>
    )
  }

  useEffect(() => {
    if (twitter?.user && account?.address && vMooneyBalance?.formatted > 0) {
      userDiscordData.username && userDiscordData.email
        ? setState(3)
        : setState(2)
    } else setState(0)
  }, [twitter, account, vMooneyBalance, userDiscordData])

  return (
    <MainCard>
      <div className="flex flex-col animate-fadeIn justify-center items-center">
        {state === 0 && (
          <>
            <h2>Zero G Charter Raffle</h2>
            <button
              className="text-[orange] text-[2vw] hover:scale-[1.1] ease-in-ease-out duration-300 hover:glow-orange-300"
              onClick={async () => {
                account?.address && vMooneyBalance?.formatted > 0 && setState(1)
              }}
            >
              Enter Raffle
            </button>
            {account?.address && vMooneyBalance?.formatted > 0 && (
              <p className="text-[lightgreen] ease-in duration-300">
                Wallet is connected & has vMooney!
              </p>
            )}
            {!account?.address && vMooneyBalance?.formatted > 0 ? (
              <p className="text-[orangered] ease-in duration-300">
                Please connect a wallet that has vMooney
              </p>
            ) : vMooneyBalance?.formatted <= 0 ? (
              <p className="text-[orangered] ease-in duration-300">
                This wallet doesn't have any vMooney, please lock some Mooney or
                try another wallet
              </p>
            ) : (
              ''
            )}
          </>
        )}
        {state === 1 && (
          <>
            <h2>Step 1: Verify your Twitter display name</h2>
            <button
              className="text-[cyan] text-[2vw] hover:scale-[1.1] ease-in-ease-out duration-300"
              onClick={async () => {
                await signIn()
              }}
            >
              Verify Twitter
            </button>
            <Cancle stage={1} />
          </>
        )}
        {state === 2 && (
          <>
            <h2>Step 2: Verify your Discord username and email </h2>
            <button className="text-[purple] text-[2vw] hover:scale-[1.1] ease-in-ease-out duration-300">
              <Link href={discordOauthUrl.preview}>Verify Discord</Link>
            </button>
            <Cancle stage={2} />
          </>
        )}
        {state === 3 && (
          <>
            <h2>Step 3: Review and submit form</h2>
            <form className="flex flex-col justify-center items-center">
              <label>
                Twitter Display Name:
                <input
                  className="flex flex-col text-black"
                  type="text"
                  readOnly
                  value={twitter?.user?.name || ''}
                />
              </label>
              <label>
                Discord Username:
                <input
                  className="flex flex-col text-black"
                  type="text"
                  readOnly
                  value={userDiscordData.username}
                />
              </label>
              <label>
                Wallet Address:
                <input
                  className="flex flex-col text-black"
                  type="text"
                  readOnly
                  value={account?.address}
                />
              </label>
              <label>
                Discord Email:
                <input
                  className="flex flex-col text-black"
                  type="text"
                  readOnly
                  value={userDiscordData.email}
                />
              </label>
              <button
                className="m-6 text-[lightgreen]"
                onClick={async (e) => {
                  e.preventDefault()
                  const userData = {
                    twitterName: twitter?.user?.name,
                    discordName: userDiscordData.username,
                    walletAddress: account.address,
                    email: userDiscordData.email,
                  }
                  //check if wallet, twitter, discord or email has already been used
                  if (await checkUserData(userData)) {
                    console.log('user has already entered the raffle')
                    setState(5)
                    return setTimeout(() => {
                      signOut()
                    }, 5000)
                  }

                  await submitRaffleForm(userData).then(() => {
                    setState(4)
                    setTimeout(async () => await signOut(), 5000)
                  })
                }}
              >
                Submit ✔
              </button>
            </form>
            <Cancle stage={2} />
          </>
        )}
        {state === 4 && (
          <>
            <h2 className="text-[lightgreen]">
              Thanks for entering the raffle!
            </h2>
          </>
        )}
        {state === 5 && (
          <>
            <h2 className="text-[orangered]">
              You've already entered the raffle, you may only enter one time
            </h2>
          </>
        )}
      </div>
    </MainCard>
  )
}

export async function getServerSideProps(context: any) {
  const code = context?.query?.code
  let userDiscordData = {}
  if (code) userDiscordData = (await getUserDiscordData(code)) || {}
  console.log('code:' + code, 'data:' + userDiscordData)
  return {
    props: {
      userDiscordData,
    },
  }
}
