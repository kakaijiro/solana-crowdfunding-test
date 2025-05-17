# Solana Crowdfunding dApp Frontend

This is the frontend for a crowdfunding decentralized application (dApp) built on the Solana blockchain. It allows users to connect their Phantom wallet, create campaigns, donate SOL, and withdraw funds from campaigns.

## Features

- Connect to Phantom wallet
- Create new crowdfunding campaigns
- View all campaigns and their balances
- Donate SOL to campaigns
- Withdraw SOL from campaigns

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Phantom Wallet](https://phantom.app/) browser extension

### Installation

1. Install dependencies:

   ```sh
   cd frontend
   npm install
   # or
   yarn install
   ```

2. Start the development server:

   ```sh
   npm start
   # or
   yarn start
   ```

   The app will be available at [http://localhost:3000](http://localhost:3000).

## Usage

- Click **Connect to Phantom Wallet** to connect your wallet.
- Click **Create a new campaign** to create a campaign.
- Click **Get a list of campaigns** to fetch and display all campaigns.
- Use the **Donate** and **Withdraw** buttons to interact with campaigns.

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js           # Main React component with Solana and Anchor logic
│   ├── App.css          # Styles for the app
│   ├── idl.json         # Anchor program interface definition (IDL)
│   └── index.js         # React entry point
├── package.json
└── README.md
```

## Configuration

- The dApp connects to Solana **devnet** by default.
- Update the program ID and network in [`src/App.js`](src/App.js) if needed.

## Build

To create a production build:

```sh
npm run build
# or
yarn build
```

## License

MIT

---

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
