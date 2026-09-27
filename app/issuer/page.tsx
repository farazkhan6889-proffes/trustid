"use client";

import { useState } from "react";
import { keccak256, stringToHex, type Address } from "viem";
import { getWalletClient } from "@/lib/web3";
import { TRUSTID_ABI, TRUSTID_CONTRACT_ADDRESS } from "@/lib/trustid";

export default function IssuerPage() {
  const [walletAddress, setWalletAddress] = useState<Address | "">("");
  const [connecting, setConnecting] = useState(false);

  const [recipient, setRecipient] = useState("");
  const [credentialType, setCredentialType] =
    useState("Verified Student");
  const [credentialName, setCredentialName] = useState("");
  const [expirationDate, setExpirationDate] = useState("");

const [issuing, setIssuing] = useState(false);
const [success, setSuccess] = useState("");
const [error, setError] = useState("");
const [lastCredentialId, setLastCredentialId] = useState("");

async function connectWallet() {
  try {
    setConnecting(true);
    setError("");

    const walletClient = getWalletClient();

    // Ask MetaMask to switch to Hardhat Local
    await walletClient.switchChain({
      id: 31337,
    });

    // Confirm the active chain
    const chainId = await walletClient.getChainId();

    if (chainId !== 31337) {
      throw new Error(
        `MetaMask is connected to Chain ID ${chainId}. Please switch to Hardhat Local (31337).`
      );
    }

    const [address] = await walletClient.requestAddresses();

    setWalletAddress(address);
  } catch (err) {
    console.error(err);

    if (err instanceof Error) {
      setError(err.message);
    } else {
      setError("Failed to connect wallet");
    }
  } finally {
    setConnecting(false);
  }
}

  async function issueCredential() {
    try {
      setError("");
      setSuccess("");

      if (!walletAddress) {
        setError("Please connect your issuer wallet first.");
        return;
      }

      if (!recipient) {
        setError("Please enter the recipient wallet address.");
        return;
      }

      if (!/^0x[a-fA-F0-9]{40}$/.test(recipient)) {
        setError("Please enter a valid Ethereum wallet address.");
        return;
      }

      if (!credentialName.trim()) {
        setError("Please enter a credential name.");
        return;
      }

      setIssuing(true);

      const walletClient = getWalletClient();

      /*
       * We keep sensitive information off-chain.
       * Only hashes are stored on the blockchain.
       */

      const timestamp = Date.now().toString();

      const credentialId = keccak256(
        stringToHex(
          `${recipient}-${credentialType}-${credentialName}-${timestamp}`
        )
      );

      const credentialHash = keccak256(
        stringToHex(
          `${credentialType}-${credentialName}-${recipient}`
        )
      );

      const expiresAt = expirationDate
        ? BigInt(
            Math.floor(
              new Date(`${expirationDate}T23:59:59`).getTime() / 1000
            )
          )
        : BigInt(0);

      const hash = await walletClient.writeContract({
        address: TRUSTID_CONTRACT_ADDRESS,
        abi: TRUSTID_ABI,
        functionName: "issueCredential",
        args: [
          credentialId,
          credentialHash,
          recipient as Address,
          expiresAt,
        ],
        account: walletAddress,
      });

     setLastCredentialId(credentialId);

setSuccess(
  `Credential transaction submitted successfully. Transaction: ${hash.slice(
    0,
    10
  )}...`
);

      setRecipient("");
      setCredentialName("");
      setExpirationDate("");
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to issue credential.");
      }
    } finally {
      setIssuing(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-xl font-bold">
            Trust<span className="text-cyan-400">ID</span>
          </a>

          <div className="flex items-center gap-4">
            {walletAddress ? (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-400">
                ● {walletAddress.slice(0, 6)}...
                {walletAddress.slice(-4)}
              </div>
            ) : (
              <button
                onClick={connectWallet}
                disabled={connecting}
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-5 py-2.5 text-sm font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {connecting ? "Connecting..." : "Connect Wallet"}
              </button>
            )}

            <a
              href="/"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              ← Back Home
            </a>
          </div>
        </div>
      </nav>

      {/* Header */}
      <section className="mx-auto max-w-6xl px-6 py-14">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Issuer Portal
          </p>

          <h1 className="mt-3 text-4xl font-bold md:text-5xl">
            Issue Verifiable Credentials
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Create and issue trusted digital credentials to users through
            the TrustID decentralized identity network.
          </p>
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-6 rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

      {success && (
  <div className="mt-6 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4 text-sm text-emerald-400">
    <p>{success}</p>

    {lastCredentialId && (
      <div className="mt-4">
        <p className="text-xs text-gray-400">
          Credential ID — copy this into the Verify Portal:
        </p>

        <div className="mt-2 break-all rounded-lg bg-black/20 p-3 font-mono text-xs text-cyan-300">
          {lastCredentialId}
        </div>
      </div>
    )}
  </div>
)}

        {/* Dashboard */}
        <div className="mt-12 grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Issue Credential */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">
                  Create Credential
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Issue a new verifiable credential.
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                +
              </div>
            </div>

            <div className="mt-8 space-y-5">
              {/* Recipient */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Recipient Wallet Address
                </label>

                <input
                  type="text"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  placeholder="0x..."
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-gray-700 focus:border-cyan-400/40"
                />
              </div>

              {/* Credential Type */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Credential Type
                </label>

                <select
                  value={credentialType}
                  onChange={(e) => setCredentialType(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0b1024] px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-400/40"
                >
                  <option>Verified Student</option>
                  <option>Professional Certificate</option>
                  <option>Employment Credential</option>
                  <option>Identity Verification</option>
                </select>
              </div>

              {/* Credential Name */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Credential Name
                </label>

                <input
                  type="text"
                  value={credentialName}
                  onChange={(e) => setCredentialName(e.target.value)}
                  placeholder="e.g. Bachelor of Computer Science"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none transition placeholder:text-gray-700 focus:border-cyan-400/40"
                />
              </div>

              {/* Expiration */}
              <div>
                <label className="mb-2 block text-sm text-gray-400">
                  Expiration Date
                </label>

                <input
                  type="date"
                  value={expirationDate}
                  onChange={(e) => setExpirationDate(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-gray-300 outline-none focus:border-cyan-400/40"
                />
              </div>

              {/* Issue Button */}
              <button
                onClick={issueCredential}
                disabled={!walletAddress || issuing}
                className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-3.5 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {issuing ? "Issuing Credential..." : "Issue Credential"}
              </button>

              {!walletAddress && (
                <p className="text-center text-xs text-gray-600">
                  Connect your issuer wallet to issue credentials.
                </p>
              )}
            </div>
          </div>

          {/* Issuer Information */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm text-gray-500">
                Connected Issuer
              </p>

              <div className="mt-4 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 font-bold">
                  U
                </div>

                <div className="min-w-0">
                  <p className="font-semibold">
                    University Issuer
                  </p>

                  <p className="truncate text-xs text-gray-500">
                    {walletAddress
                      ? walletAddress
                      : "Wallet not connected"}
                  </p>
                </div>

                {walletAddress && (
                  <span className="ml-auto whitespace-nowrap rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400">
                    ● Connected
                  </span>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
              <p className="text-sm text-gray-500">
                Credentials Issued
              </p>

              <p className="mt-3 text-4xl font-bold">
                128
              </p>

              <p className="mt-2 text-sm text-emerald-400">
                ↑ 12% this month
              </p>
            </div>

            <div className="rounded-2xl border border-red-400/10 bg-red-400/[0.03] p-7">
              <p className="text-sm text-gray-500">
                Credential Management
              </p>

              <h3 className="mt-3 text-lg font-semibold">
                Need to revoke a credential?
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Revoke credentials that are no longer valid. The status
                will be recorded on the blockchain.
              </p>

            <button
  onClick={() => {
    window.location.href = "/issuer/manage";
  }}
  className="mt-5 rounded-xl border border-red-400/20 px-5 py-2.5 text-red-400 transition hover:bg-red-400/10"
>
  Manage Credentials
</button>
            </div>
          </div>
        </div>

        {/* Recent Credentials */}
        <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-7">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold">
                Recently Issued
              </h2>

              <p className="mt-1 text-sm text-gray-500">
                Recent credentials issued by this organization.
              </p>
            </div>

            <button className="text-sm text-cyan-400 hover:text-cyan-300">
              View All
            </button>
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-gray-500">
                  <th className="pb-4 font-medium">Credential</th>
                  <th className="pb-4 font-medium">Recipient</th>
                  <th className="pb-4 font-medium">Issued</th>
                  <th className="pb-4 text-right font-medium">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                <CredentialRow
                  credential="Verified Student"
                  recipient="0x71C...92A"
                  date="Sep 07, 2026"
                />

                <CredentialRow
                  credential="Professional Certificate"
                  recipient="0x43F...B21"
                  date="Sep 05, 2026"
                />

                <CredentialRow
                  credential="Employment Credential"
                  recipient="0x92A...7DF"
                  date="Sep 02, 2026"
                />
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}

function CredentialRow({
  credential,
  recipient,
  date,
}: {
  credential: string;
  recipient: string;
  date: string;
}) {
  return (
    <tr className="border-b border-white/5">
      <td className="py-5 font-medium">
        {credential}
      </td>

      <td className="py-5 font-mono text-gray-500">
        {recipient}
      </td>

      <td className="py-5 text-gray-500">
        {date}
      </td>

      <td className="py-5 text-right">
        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400">
          Valid
        </span>
      </td>
    </tr>
  );
}