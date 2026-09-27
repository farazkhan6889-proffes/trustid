"use client";

import { useState } from "react";
import type { Address } from "viem";
import { getWalletClient } from "@/lib/web3";
import { TRUSTID_ABI, TRUSTID_CONTRACT_ADDRESS } from "@/lib/trustid";

export default function ManageCredentialsPage() {
  const [credentialId, setCredentialId] = useState("");
  const [revoking, setRevoking] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function revokeCredential() {
    try {
      setError("");
      setSuccess("");

      const id = credentialId.trim();

      if (!id) {
        setError("Please enter a credential ID.");
        return;
      }

      if (!/^0x[a-fA-F0-9]{64}$/.test(id)) {
        setError("Please enter a valid 0x... credential ID.");
        return;
      }

      setRevoking(true);

      const walletClient = getWalletClient();

      await walletClient.switchChain({
        id: 31337,
      });

      const [address] = await walletClient.requestAddresses();

      const hash = await walletClient.writeContract({
        address: TRUSTID_CONTRACT_ADDRESS,
        abi: TRUSTID_ABI,
        functionName: "revokeCredential",
        args: [id as `0x${string}`],
        account: address as Address,
      });

      setSuccess(
        `Credential revoked successfully. Transaction: ${hash.slice(
          0,
          10
        )}...`
      );

      setCredentialId("");
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to revoke credential.");
      }
    } finally {
      setRevoking(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-5">
          <a href="/" className="text-xl font-bold">
            Trust<span className="text-cyan-400">ID</span>
          </a>

          <a
            href="/issuer"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            ← Back to Issuer
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-3xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">
            Credential Management
          </p>

          <h1 className="mt-4 text-4xl font-bold">
            Manage Credentials
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-gray-400">
            Revoke a credential that is no longer valid. The revocation
            status will be permanently recorded on the blockchain.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-8">
          <h2 className="text-xl font-semibold">
            Revoke Credential
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Enter the blockchain credential ID you want to revoke.
          </p>

          <label className="mt-8 mb-2 block text-sm text-gray-400">
            Credential ID
          </label>

          <input
            value={credentialId}
            onChange={(e) => {
              setCredentialId(e.target.value);
              setError("");
              setSuccess("");
            }}
            type="text"
            placeholder="0x..."
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 font-mono text-sm outline-none transition placeholder:text-gray-700 focus:border-red-400/50"
          />

          <button
            onClick={revokeCredential}
            disabled={revoking}
            className="mt-5 w-full rounded-xl bg-gradient-to-r from-red-500 to-orange-500 py-4 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {revoking ? "Revoking on Blockchain..." : "Revoke Credential"}
          </button>

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="mt-5 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-400">
              {success}
            </div>
          )}
        </div>

        <div className="mt-8 rounded-2xl border border-yellow-400/10 bg-yellow-400/[0.04] p-6">
          <p className="text-sm leading-6 text-gray-400">
            Revocation changes the credential status on-chain. Once
            revoked, verification will return the credential as invalid.
          </p>
        </div>
      </section>
    </main>
  );
}