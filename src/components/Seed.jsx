import React, { useState } from "react";
import { generateMnemonic, mnemonicToSeedSync } from "bip39";
import { HDNodeWallet, Mnemonic } from "ethers";
import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import { hmac } from "@noble/hashes/hmac";
import { sha512 } from "@noble/hashes/sha512";

const Seed = () => {
  const [mnemonic, setMnemonic] = useState("");
  const [wallets, setWallets] = useState([]);
  const [walletIndex, setWalletIndex] = useState({ Ethereum: 0, Solana: 0 });
  const [showPrivate, setShowPrivate] = useState({});

  const createSeed = () => {
    const newMnemonic = generateMnemonic();
    setMnemonic(newMnemonic);
    setWallets([]);
    setWalletIndex({ Ethereum: 0, Solana: 0 });
    setShowPrivate({});
  };

  const toggleVisibility = (id) => {
    setShowPrivate((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const deleteWallet = (id) => {
    setWallets((prev) => prev.filter((w) => w.id !== id));
  };

  const addEthereumWallet = () => {
  if (!mnemonic) return alert("Generate a mnemonic first.");

  try {
    const index = walletIndex.Ethereum;
    const path = `m/44'/60'/0'/0/${index}`;
    const hdNode = HDNodeWallet.fromPhrase(mnemonic, path);

    const walletObj = {
      id: Date.now(),
      network: "Ethereum",
      publicKey: hdNode.address,
      privateKey: hdNode.privateKey,
      index,
      path,
    };

    setWallets((prev) => [...prev, walletObj]);
    setWalletIndex((prev) => ({ ...prev, Ethereum: prev.Ethereum + 1 }));
  } catch (err) {
    console.error("Ethereum wallet generation error:", err);
    alert("Failed to create Ethereum wallet.");
  }
};


  const deriveSolanaKeypair = (mnemonic) => {
    const seed = mnemonicToSeedSync(mnemonic); 
    const derivedSeed = hmac(sha512, new TextEncoder().encode("ed25519 seed"), seed).slice(0, 32);
    return Keypair.fromSeed(derivedSeed);
  };

  const addSolanaWallet = () => {
    if (!mnemonic) return alert("Generate a mnemonic first.");

    try {
      const index = walletIndex.Solana;
      const path = `m/44'/501'/${index}'/0'`;
      const keypair = deriveSolanaKeypair(mnemonic);

      const walletObj = {
        id: Date.now(),
        network: "Solana",
        publicKey: keypair.publicKey.toBase58(),
        privateKey: bs58.encode(keypair.secretKey),
        index,
        path,
      };

      setWallets((prev) => [...prev, walletObj]);
      setWalletIndex((prev) => ({ ...prev, Solana: prev.Solana + 1 }));
    } catch (err) {
      console.error("Solana wallet generation error:", err);
      alert("Failed to create Solana wallet.");
    }
  };

  return (
    <div style={{ display: "flex", padding: "20px", gap: "40px" }}>
      <div style={{ flex: 1 }}>
        <h2> Recovery Phrase</h2>
        <button onClick={createSeed}>Create New Recovery Phrase</button>
        {mnemonic && (
          <>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "10px",
                marginTop: "20px",
              }}
            >
              {mnemonic.split(" ").map((word, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    backgroundColor: "#f0f0f0",
                    textAlign: "center",
                    fontFamily: "monospace",
                  }}
                >
                  {word}
                </div>
              ))}
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(mnemonic);
                alert("Mnemonic copied!");
              }}
              style={{ marginTop: "20px" }}
            >
             Copy to clipboard
            </button>
          </>
        )}
      </div>
      <div style={{ flex: 2 }}>
        <h2>Select Network</h2>
        <button onClick={addSolanaWallet} disabled={!mnemonic} style={{ marginRight: "10px" }}>
          ➕ Solana Wallet
        </button>
        <button onClick={addEthereumWallet} disabled={!mnemonic}>
          ➕ Ethereum Wallet
        </button>

        <div style={{ marginTop: "30px" }}>
          {wallets.length === 0 ? (
            <p>No wallets generated yet.</p>
          ) : (
            wallets.map((wallet) => (
              <div
                key={wallet.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "15px",
                  marginBottom: "15px",
                  background: "#f9f9f9",
                }}
              >
                <p><strong>Network:</strong> {wallet.network}</p>
                <p><strong>Public Key:</strong> {wallet.publicKey}</p>
                <p>
                  <strong>Private Key:</strong>{" "}
                  {showPrivate[wallet.id] ? wallet.privateKey : "************"}
                  <button
                    onClick={() => toggleVisibility(wallet.id)}
                    style={{ marginLeft: "10px" }}
                  >
                    {showPrivate[wallet.id] ? "Hide" : "Show"}
                  </button>
                </p>
                <button
                  onClick={() => deleteWallet(wallet.id)}
                  style={{
                    backgroundColor: "#ff4d4d",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    borderRadius: "4px",
                  }}
                >
                   Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Seed;
