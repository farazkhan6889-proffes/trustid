"use client";

import { useEffect, useState } from "react";
import { publicClient } from "@/lib/web3";
import { TRUSTID_ABI, TRUSTID_CONTRACT_ADDRESS } from "@/lib/trustid";

type VerificationResult = {
  valid: boolean;
  holder: string;
  issuer: string;
  issuedAt: bigint;
  expiresAt: bigint;
  revoked: boolean;
};

export default function VerifyPage() {
  const [credentialId, setCredentialId] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
    useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const credential = params.get("credential");

    if (credential) {
      setCredentialId(credential);
    }
  }, []);

  async function handleVerify() {
    try {
      setError("");
      setResult(null);

      const id = credentialId.trim();

      if (!id) {
        setError("Please enter a credential ID.");
        return;
      }

      if (!/^0x[a-fA-F0-9]{64}$/.test(id)) {
        setError(
          "Invalid credential ID. Please enter the 0x... blockchain credential ID."
        );
        return;
      }

      setLoading(true);

const data = (await publicClient.readContract({
  address: TRUSTID_CONTRACT_ADDRESS,
  abi: TRUSTID_ABI,
  functionName: "verifyCredential",
  args: [id as `0x${string}`],
})) as readonly [
  boolean,
  `0x${string}`,
  `0x${string}`,
  bigint,
  bigint,
  boolean
];

const valid = data[0];
const holder = data[1];
const issuer = data[2];
const issuedAt = data[3];
const expiresAt = data[4];
const revoked = data[5];

      setResult({
        valid,
        holder,
        issuer,
        issuedAt,
        expiresAt,
        revoked,
      });
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to verify credential.");
      }
    } finally {
      setLoading(false);
    }
  }

  function formatDate(timestamp: bigint) {
    if (timestamp === BigInt(0)) {
      return "No expiration";
    }

    return new Date(Number(timestamp) * 1000).toLocaleString();
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="/" className="text-xl font-bold">
            Trust<span className="text-cyan-400">ID</span>
          </a>

          <a
            href="/"
            className="text-sm text-gray-400 transition hover:text-white"
          >
            ← Back Home
          </a>
        </div>
      </nav>

      <section className="mx-auto max-w-5xl px-6 py-16">
        {/* Header */}
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Verification Portal
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-5xl">
            Verify a Credential
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-gray-400">
            Verify the authenticity and current status of a TrustID
            credential directly against the blockchain.
          </p>
        </div>

        {/* Verification Card */}
        <div className="mx-auto mt-12 max-w-2xl rounded-3xl border border-white/10 bg-white/[0.03] p-8 shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-400">
              🔎
            </div>

            <div>
              <h2 className="font-semibold">
                Credential Verification
              </h2>

              <p className="text-sm text-gray-500">
                Enter the blockchain credential ID provided by the holder.
              </p>
            </div>
          </div>

          <div className="mt-8">
            <label className="mb-2 block text-sm text-gray-400">
              Credential ID
            </label>

            <input
              value={credentialId}
              onChange={(e) => {
                setCredentialId(e.target.value);
                setResult(null);
                setError("");
              }}
              type="text"
              placeholder="0x..."
              className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-4 font-mono text-sm outline-none transition placeholder:text-gray-700 focus:border-cyan-400/50"
            />

            <button
              onClick={handleVerify}
              disabled={loading}
              className="mt-5 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 py-4 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Checking Blockchain..." : "Verify Credential"}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Result */}
        {result && (
          <div
            className={`mx-auto mt-8 max-w-2xl rounded-3xl border p-8 ${
              result.valid
                ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                : "border-red-400/20 bg-red-400/[0.04]"
            }`}
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full text-2xl ${
                  result.valid
                    ? "bg-emerald-400/10 text-emerald-400"
                    : "bg-red-400/10 text-red-400"
                }`}
              >
                {result.valid ? "✓" : "✕"}
              </div>

              <div>
                <p
                  className={`text-sm font-semibold uppercase tracking-wider ${
                    result.valid
                      ? "text-emerald-400"
                      : "text-red-400"
                  }`}
                >
                  {result.valid
                    ? "Credential Verified"
                    : "Credential Invalid"}
                </p>

                <h2 className="mt-1 text-2xl font-bold">
                  {result.valid
                    ? "Credential is Valid"
                    : "Credential is Not Valid"}
                </h2>
              </div>
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <Info
                label="Credential ID"
                value={credentialId}
              />

              <Info
                label="Status"
                value={
                  result.revoked
                    ? "Revoked"
                    : result.valid
                    ? "Active"
                    : "Expired"
                }
              />

              <Info
                label="Holder"
                value={result.holder}
              />

              <Info
                label="Issuer"
                value={result.issuer}
              />

              <Info
                label="Issued"
                value={formatDate(result.issuedAt)}
              />

              <Info
                label="Expiration"
                value={formatDate(result.expiresAt)}
              />

              <Info
                label="Blockchain"
                value="TrustID Smart Contract"
              />

              <Info
                label="On-chain Status"
                value={result.valid ? "Valid" : "Invalid"}
              />
            </div>

            <div
              className={`mt-6 rounded-xl p-4 ${
                result.valid
                  ? "border border-emerald-400/10 bg-emerald-400/5"
                  : "border border-red-400/10 bg-red-400/5"
              }`}
            >
              <p className="text-xs leading-5 text-gray-400">
                This result was retrieved directly from the TrustID
                smart contract. No unnecessary personal information
                was requested during verification.
              </p>
            </div>
          </div>
        )}

        {/* How verification works */}
        <div className="mt-20">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Verification Process
            </p>

            <h2 className="mt-3 text-2xl font-bold">
              Verify without oversharing
            </h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <Process
              number="01"
              title="Credential ID"
              text="The holder provides a unique blockchain credential identifier."
            />

            <Process
              number="02"
              title="Blockchain Check"
              text="TrustID checks the credential status, holder, issuer, expiration and revocation state."
            />

            <Process
              number="03"
              title="Trust Result"
              text="The verifier receives a real on-chain valid or invalid result."
            />
          </div>
        </div>
      </section>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-black/20 p-4">
      <p className="text-xs text-gray-500">
        {label}
      </p>

      <p className="mt-2 break-all text-sm font-medium text-gray-200">
        {value}
      </p>
    </div>
  );
}

function Process({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <p className="text-sm font-semibold text-cyan-400">
        {number}
      </p>

      <h3 className="mt-4 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-gray-500">
        {text}
      </p>
    </div>
  );
}