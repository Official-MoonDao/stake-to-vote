import { XMarkIcon } from '@heroicons/react/24/outline'
import { usePrivy, useWallets } from '@privy-io/react-auth'
import { allChains, Chain } from '@thirdweb-dev/chains'
import { useAddress, useContract } from '@thirdweb-dev/react'
import Image from 'next/image'
import { useContext, useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import PrivyWalletContext from '../../lib/privy/privy-wallet-context'
import ChainContext from '../../lib/thirdweb/chain-context'
import { useHandleRead } from '../../lib/thirdweb/hooks'
import { useNativeBalance } from '../../lib/thirdweb/hooks/useNativeBalance'
import { useENS } from '../../lib/utils/hooks/useENS'
import { useImportToken } from '../../lib/utils/import-token'
import ERC20 from '../../const/abis/ERC20.json'
import { MOONEY_ADDRESSES } from '../../const/config'
import { CopyIcon } from '../assets'
import CitizenProfileLink from '../subscription/CitizenProfileLink'
import { LinkAccounts } from './LinkAccounts'

type PrivyConnectWalletProps = {
  citizenContract?: any
  type?: 'mobile' | 'desktop'
}

export function PrivyConnectWallet({
  citizenContract,
  type,
}: PrivyConnectWalletProps) {
  const { selectedWallet, setSelectedWallet } = useContext(PrivyWalletContext)
  const { selectedChain, setSelectedChain }: any = useContext(ChainContext)

  const [networkMistmatch, setNetworkMismatch] = useState(false)

  const address = useAddress()
  const { data: _ensData } = useENS(address)
  const ens = _ensData?.name
  const nativeBalance = useNativeBalance()
  const [walletChainId, setWalletChainId] = useState(1)
  const { login, logout, user, authenticated, connectWallet }: any = usePrivy()
  const { wallets } = useWallets()

  const [enabled, setEnabled] = useState(false)

  const { contract: mooneyContract } = useContract(
    MOONEY_ADDRESSES[selectedChain.slug],
    ERC20.abi
  )

  const { data: mooneyBalance } = useHandleRead(mooneyContract, 'balanceOf', [
    address,
  ])

  const importToken = useImportToken(selectedChain)

  function NetworkIcon() {
    return (
      <Image
        src={`/icons/networks/${selectedChain.slug}.svg`}
        width={30}
        height={30}
        alt="Network Icon"
      />
    )
  }

  useEffect(() => {
    if (wallets?.[0]) {
      setWalletChainId(+wallets?.[0]?.chainId.split(':')[1])
    }
  }, [wallets, selectedWallet])

  useEffect(() => {
    if (walletChainId !== selectedChain.chainId) setNetworkMismatch(true)
    else setNetworkMismatch(false)
  }, [walletChainId, selectedChain])

  //detect outside click
  function handleClickOutside({ target }: any) {
    if (
      target.closest('#privy-connect-wallet-dropdown') ||
      target.closest('#privy-connect-wallet') ||
      target.closest('#headlessui-dialog-panel')
    )
      return
    setEnabled(false)
  }
  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {user && wallets?.[0] ? (
        <div className="w-full">
          <div
            id="privy-connect-wallet"
            className={`cursor-pointer flex-wrap md:w-[175px] md:full relative flex flex-col items-right justify-center pl-5 pr-5 py-2 md:hover:pl-[25px] gradient-2 font-RobotoMono z-[10] rounded-[2vmax] rounded-tl-[10px] duration-300`}
            onClick={(e: any) => {
              setEnabled(!enabled)
            }}
          >
            {/*Address and Toggle open/close button*/}
            <div className="flex items-center w-full h-full justify-center">
              <p className="text-xs">
                {ens
                  ? ens
                  : address
                  ? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                  : ''}
              </p>
            </div>
            {/*Menu that opens up*/}
          </div>
          {enabled && (
            <div
              id="privy-connect-wallet-dropdown"
              className="w-[260px] lg:w-[270px] absolute left-0 text-sm font-RobotoMono rounded-tr-[20px] rounded-br-[2vmax] animate-fadeIn mt-2 p-4 flex flex-col gradient-14 text-white divide-y-2 divide-[#FFFFFF14] gap-2 z-[100]"
            >
              <div
                className={`w-full flex ${
                  type === 'mobile' ? 'justify-between' : 'justify-end'
                }`}
              >
                {type === 'mobile' && (
                  <div className="h-[10px]">
                    <CitizenProfileLink
                      selectedChain={selectedChain}
                      citizenContract={citizenContract}
                    />
                  </div>
                )}
                <XMarkIcon
                  className="w-6 h-6 text-black dark:text-white cursor-pointer"
                  onClick={() => setEnabled(false)}
                />
              </div>
              <div className="mt-2">
                <div className="mt-2 flex items-center">
                  <NetworkIcon />
                  <div className="ml-2 bg-dark-cool">
                    <p className="uppercase font-normal inline-block">
                      {
                        allChains.find(
                          (chain) => chain.chainId === selectedChain.chainId
                        )?.name
                      }
                    </p>
                    <p className="text-sm">{`${address?.slice(
                      0,
                      6
                    )}...${address?.slice(-4)}`}</p>
                  </div>
                  <button
                    className="ml-4"
                    onClick={() => {
                      navigator.clipboard.writeText(address || '')
                      toast.success('Address copied to clipboard')
                    }}
                  >
                    <CopyIcon />
                  </button>
                </div>
              </div>
              {networkMistmatch ? (
                <div>
                  <button
                    className="w-full mt-4 p-2 border text-black dark:text-white hover:scale-105 transition-all duration-150 dark:border-white dark:hover:bg-white dark:hover:text-moon-orange"
                    onClick={() => {
                      wallets[selectedWallet].switchChain(selectedChain.chainId)
                    }}
                  >
                    {`Switch to ${selectedChain.name}`}
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-2 py-2">
                  <div className=" w-full flex justify-left items-center gap-4">
                    <Image
                      src="/coins/MOONEY.png"
                      width={30}
                      height={30}
                      alt=""
                    />
                    <p>
                      {mooneyBalance
                        ? (mooneyBalance?.toString() / 10 ** 18).toFixed(2)
                        : '...'}
                    </p>
                  </div>

                  <div className=" w-full flex justify-left items-center gap-4">
                    <NetworkIcon />
                    <p>{nativeBalance}</p>
                  </div>
                </div>
              )}

              <button
                className="w-full p-1 rounded-[2vmax] text-white transition-all duration-150 p-5 py-2 md:hover:pl-[25px] gradient-2"
                onClick={async () => {
                  wallets[selectedWallet].fund()
                }}
              >
                <strong>Fund</strong>
              </button>

              <div className="pt-1">
                <p className="font-semibold">Wallets:</p>
                <div className="mt-1 flex flex-col justify-start gap-2">
                  {wallets?.map((wallet, i) => (
                    <div
                      key={`wallet-${i}`}
                      className="w-full flex gap-2 items-center text-[13px]"
                    >
                      {/*Button with tick */}
                      <button
                        onClick={() => setSelectedWallet(i)}
                        className="w-4 h-6 "
                      >
                        {selectedWallet === i ? '■' : '□'}
                      </button>
                      <p>
                        <span className="uppercase font-bold">
                          {wallet?.walletClientType.slice(0, 1).toUpperCase() +
                            wallet?.walletClientType.slice(1)}
                        </span>

                        <br></br>
                        {wallet?.address.slice(0, 6) +
                          '...' +
                          wallet?.address.slice(-4)}
                      </p>
                      {/*Wallet address and copy button*/}
                      {wallet.walletClientType != 'metamask' && (
                        <button
                          className="ml-12"
                          onClick={() => wallet.disconnect()}
                        >
                          X
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    className="w-full gradient-3 p-1 pr-2 pl-2 text-dark-cool"
                    onClick={async () => {
                      connectWallet()
                    }}
                  >
                    <strong>Connect</strong>
                  </button>
                </div>
              </div>
              <div className="pt-1">
                <LinkAccounts user={user} />
                <div className="flex justify-between">
                  {/* <button
                    className="w-2/5 mt-4 p-1 border text-white hover:scale-105 transition-all duration-150 border-white hover:bg-white hover:text-moon-orange"
                    onClick={importToken}
                  >
                    <strong>Import Token</strong>
                  </button> */}
                  <button
                    className="w-full mt-4 p-1 rounded-[2vmax] text-white transition-all duration-150 p-5 py-2 md:hover:pl-[25px] gradient-2"
                    onClick={async () => {
                      wallets.forEach((wallet) => wallet.disconnect())
                      logout()
                    }}
                  >
                    <strong>Log out</strong>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="w-full">
          <button
            onClick={async () => {
              if (user) {
                await logout()
                login()
              } else {
                login()
              }
            }}
            className="text-[12px] md:text-[18px] font-bold rounded-[40px] rounded-bl-[10px] p-5 py-2 md:hover:pl-[25px] gradient-2 transition-all duration-150"
          >
            <div className="flex">
              <Image
                src="/assets/icon-user.svg"
                alt="Sign in with your wallet"
                width="20"
                height="20"
              ></Image>
              <p className="pl-2">Sign In</p>
            </div>
          </button>
        </div>
      )}
    </>
  )
}
