# MoonDAO App 🌕🌕

[![](/ui/public/Original_Black.png)](https://app.moondao.com)

The MoonDAO App at https://app.moondao.com is where people can connect their Ethereum wallet and interact with the MoonDAO smart contracts.

> [![app](/ui/public/screenshot.png)](https://app.moondao.com)

## File Structure

The code in this repository is structured into two main parts:

```
.
├── contracts # The smart contracts
└── ui        # The user interface (UI) for interacting with the smart contracts
```

## Run the UI locally

See [ui/README.md](ui/README.md)

## Testing against the Sepolia Ethereum testnet

Add sepolia testnet variables to your local development environment:
```
cp .env.sepolia .env.local
```

Start the development server:
```
yarn dev
```

Once you go to http://localhost:3000, you will see the message "uses Sepolia as its preferred network":

> <img width="966" alt="network error" src="https://ipfs.io/ipfs/QmeX9d5vk3FhGvRd78UWNGq9UEQExWu7HF6FL3LfhytcL5/">

Solve this by switching to the _Sepolia Test Network_ in MetaMask:

> <img width="328" alt="set network" src="https://ipfs.io/ipfs/QmTR1fPPzr9hr4U8QYpyGxv43YUWVNPb3ANRk6wpbRf23V/">


## Run the smart contracts locally

Follow the instructions at [`contracts/README.md#local-setup`](https://github.com/nation3/app/blob/main/contracts/README.md#local-setup).

Update the `NEXT_PUBLIC_CHAIN` variable in `.env.local` to match your local Ethereum [node](https://github.com/nation3/app/blob/main/contracts/README.md#running-a-node).

Start the development server:
```
yarn dev
```
