"use client";

import { useState } from "react";
import { getWalletClient } from "@/lib/web3";

export default function WalletPage() {
  const [address, setAddress] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState("");

  async function connectWallet() {
    try {
      setError("");
      setConnecting(true);

      const walletClient = getWalletClient();

      await walletClient.switchChain({
        id: 31337,
      });

      const [account] = await walletClient.requestAddresses();

      setAddress(account);
    } catch (err) {
      console.error(err);

      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to connect wallet.");
      }
    } finally {
      setConnecting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#050816] text-white">
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

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-400">
            Identity Wallet
          </p>

          <h1 className="mt-3 text-4xl font-bold">
            Your Digital Identity
          </h1>

          <p className="mt-4 max-w-2xl text-gray-400">
            Your wallet is the holder side of TrustID. Manage your
            verifiable credentials and control what information you share.
          </p>
        </div>

        {/* Wallet Status */}
        <div className="mb-10 rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Wallet Status
              </p>

              {address ? (
                <>
                  <p className="mt-2 font-semibold text-emerald-400">
                    ● Connected
                  </p>

                  <p className="mt-2 break-all font-mono text-sm text-gray-400">
                    {address}
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-2 font-semibold text-gray-300">
                    Not Connected
                  </p>

                  <p className="mt-2 text-sm text-gray-500">
                    Connect your Web3 wallet to access your identity.
                  </p>
                </>
              )}
            </div>

            <button
              onClick={connectWallet}
              disabled={connecting}
              className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 font-semibold transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {connecting
                ? "Connecting..."
                : address
                ? "Wallet Connected"
                : "Connect Wallet"}
            </button>
          </div>

          {error && (
            <div className="mt-5 rounded-xl border border-red-400/20 bg-red-400/10 p-4 text-sm text-red-400">
              {error}
            </div>
          )}
        </div>

        {/* Credentials */}
        <div>
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-gray-500">
              Your Credentials
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Verifiable Credentials
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <Credential
              title="Verified Student"
              issuer="University Credential"
              status="Valid"
              credentialId="0x2b8ec2315634f64c6d9fab9e42757cf5ec9db099d298b414b65b674646512523"
            />

            <Credential
              title="Professional Certificate"
              issuer="TrustID Issuer"
              status="Valid"
              credentialId=""
            />

            <Credential
              title="Identity Verification"
              issuer="TrustID Network"
              status="Valid"
              credentialId=""
            />
          </div>
        </div>

        {/* Explanation */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          <Info
            title="Own"
            text="Your credentials are associated with your wallet."
          />

          <Info
            title="Control"
            text="Choose when and where your credentials are shared."
          />

          <Info
            title="Verify"
            text="Anyone can verify credential status without unnecessary data."
          />
        </div>
      </section>
    </main>
  );
}

function Credential({
  title,
  issuer,
  status,
  credentialId,
}: {
  title: string;
  issuer: string;
  status: string;
  credentialId: string;
}) {
  function viewCredential() {
    if (credentialId) {
      window.location.href = `/verify?credential=${credentialId}`;
    } else {
      window.location.href = "/verify";
    }
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex items-center justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl">
          ✓
        </div>

        <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs text-emerald-400">
          ● {status}
        </span>
      </div>

      <h3 className="mt-6 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Issued by {issuer}
      </p>

      <button
        onClick={viewCredential}
        className="mt-6 w-full rounded-xl border border-white/10 py-3 text-sm text-gray-300 transition hover:bg-white/5"
      >
        View Credential
      </button>
    </div>
  );
}

function Info({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <h3 className="font-semibold text-cyan-400">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-6 text-gray-500">
        {text}
      </p>
    </div>
  );
}