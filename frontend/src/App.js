import { useEffect, useState } from "react";
import { Connection, clusterApiUrl, PublicKey } from "@solana/web3.js";
import { Program, AnchorProvider, web3, utils, BN } from "@coral-xyz/anchor";

import "./App.css";
import idl from "./idl.json";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const programId = new PublicKey(idl.address);
const network = clusterApiUrl("devnet");
const opts = {
  preflightCommitment: "processed",
};
const { SystemProgram } = web3;

function App() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [campaigns, setCampaigns] = useState([]);

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");
          const res = await solana.connect({
            onlyIfTrusted: true,
          });
          console.log("Connected with public key: ", res.publicKey.toString());
          setWalletAddress(res.publicKey.toString());
        } else {
          alert("Solana wallet not found");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
    const res = await solana.connect();
    console.log("Connected with public key: ", res.publicKey.toString());
    setWalletAddress(res.publicKey.toString());
  };

  const getCampaigns = async () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = getProvider();
    const program = new Program(idl, provider);

    const accounts = await connection.getProgramAccounts(programId);
    const campaigns = await Promise.all(
      accounts.map(async (account) => {
        const campaign = await program.account.campaign.fetch(account.pubkey);
        return {
          ...campaign,
          pubkey: account.pubkey,
        };
      })
    );
    setCampaigns(campaigns);
  };

  const createCampaign = async () => {
    try {
      const provider = getProvider();
      // const program = new Program(idl, programId, provider); // eariler than v0.30.0
      const program = new Program(idl, provider);
      const [campaign] = await PublicKey.findProgramAddress(
        [
          utils.bytes.utf8.encode("CAMPAIGN_DEMO"),
          provider.wallet.publicKey.toBuffer(),
          // anchor.web3.Keypair.generate().publicKey.toBuffer(), // random seed
        ],
        program.programId
      );
      await program.rpc.create("campaign name", "campaign description", {
        accounts: {
          campaign,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
      console.log("Created a new campaign with address: ", campaign.toString());
    } catch (error) {
      console.log(error);
    }
  };

  const donate = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, provider);
      await program.rpc.donate(new BN(0.25 * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [],
      });
      console.log("Donated 0.25 sol to: ", publicKey.toString());
      getCampaigns();
    } catch (error) {
      console.log("Error while donating:", error);
    }
  };

  const withdraw = async (publicKey) => {
    try {
      const provider = getProvider();
      const program = new Program(idl, provider);
      await program.rpc.withdraw(new BN(0.25 * web3.LAMPORTS_PER_SOL), {
        accounts: {
          campaign: publicKey,
          user: provider.wallet.publicKey,
        },
        signers: [],
      });
      console.log("Withdraw 0.25 sol from: ", publicKey.toString());
      getCampaigns();
    } catch (error) {
      console.log("Error while withdrawing: ", error);
    }
  };

  // rendering components
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet}>Connect to Phantom Wallet</button>
  );
  const renderConnectedContainer = () => (
    <>
      <button onClick={createCampaign}>Create a new campaign</button>
      <button onClick={getCampaigns}>Get a list of campaigns</button>
      {campaigns.map((campaign) => (
        <div key={campaign.pubkey.toString()}>
          <p>Campaign ID: {campaign.pubkey.toString()}</p>
          <p>
            {`Balance: ${(
              campaign.amountDonated / web3.LAMPORTS_PER_SOL
            ).toString()}`}
          </p>
          <p>Campaign Name: {campaign.name}</p>
          <p>Campaign Description: {campaign.description}</p>
          <button onClick={() => donate(campaign.pubkey)}>
            Donate 0.25 sol to this campaign Now!
          </button>
          <button onClick={() => withdraw(campaign.pubkey)}>
            Withdraw 0.25 sol from this campaign.
          </button>
        </div>
      ))}
    </>
  );

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      <h4>test</h4>
      {!walletAddress && renderNotConnectedContainer()}
      {walletAddress && renderConnectedContainer()}
    </div>
  );
}

export default App;
