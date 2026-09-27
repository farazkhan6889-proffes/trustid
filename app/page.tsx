import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050816] text-white">
      {/* Navbar */}
      <nav className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-600 text-xl font-bold">
              T
            </div>

            <span className="text-xl font-bold tracking-tight">
              Trust<span className="text-cyan-400">ID</span>
            </span>
          </Link>

 <div className="hidden items-center gap-6 text-sm text-gray-300 md:flex">
  <a href="#how-it-works" className="transition hover:text-white">
    How It Works
  </a>

  <a href="#features" className="transition hover:text-white">
    Features
  </a>

  <a href="#why-trustid" className="transition hover:text-white">
    Why TrustID
  </a>

  <Link
    href="/issuer"
    className="rounded-lg bg-violet-500/10 px-4 py-2 text-violet-300 transition hover:bg-violet-500/20"
  >
    Issuer
  </Link>

  <Link
    href="/verify"
    className="rounded-lg bg-cyan-400/10 px-4 py-2 text-cyan-300 transition hover:bg-cyan-400/20"
  >
    Verify
  </Link>
</div>

          <Link
  href="/wallet"
  className="rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-medium text-cyan-300 transition hover:bg-cyan-400/20"
>
  Connect Wallet
</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[140px]" />

        <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 py-24 lg:grid-cols-2 lg:py-32">
          {/* Hero text */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-sm text-cyan-300">
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              Decentralized Identity
            </div>

            <h1 className="max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-7xl">
              Your Identity.
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-500 bg-clip-text text-transparent">
                Your Control.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-lg leading-8 text-gray-400">
              Prove who you are without revealing more information than
              necessary. TrustID gives you control over your digital identity
              through decentralized, verifiable credentials.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/wallet"
                className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-7 py-3.5 text-center font-semibold transition hover:scale-[1.02]"
              >
                Open Identity Wallet
              </Link>

              <Link
                href="/verify"
                className="rounded-xl border border-white/10 bg-white/5 px-7 py-3.5 text-center font-semibold text-gray-200 transition hover:bg-white/10"
              >
                Verify a Credential
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-500">
              <span>✓ Privacy First</span>
              <span>✓ Blockchain Verified</span>
              <span>✓ User Owned</span>
            </div>
          </div>

          {/* Identity Card */}
          <div className="relative mx-auto w-full max-w-md">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-r from-cyan-500/20 to-violet-600/20 blur-2xl" />

            <div className="relative rounded-[2rem] border border-white/10 bg-[#0b1024]/90 p-6 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">TrustID Wallet</p>
                  <p className="mt-1 font-semibold">Digital Identity</p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-400">
                  ✓
                </div>
              </div>

              <div className="mt-8 rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 to-violet-500/10 p-5">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-600 text-xl font-bold">
                    F
                  </div>

                  <div>
                    <p className="font-semibold">Verified Identity</p>
                    <p className="text-sm text-gray-500">
                      Decentralized ID
                    </p>
                  </div>
                </div>

                <div className="mt-6 h-px bg-white/10" />

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    Verification status
                  </span>

                  <span className="rounded-full bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-400">
                    ● Verified
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <Credential
                  icon="🎓"
                  title="Verified Student"
                  issuer="University Credential"
                />

                <Credential
                  icon="🏆"
                  title="Professional Certificate"
                  issuer="Verified Credential"
                />

                <Credential
                  icon="✓"
                  title="Identity Verified"
                  issuer="TrustID Network"
                />
              </div>

            <Link
  href="/wallet"
  className="mt-6 block w-full rounded-xl bg-white/5 py-3 text-center text-sm font-medium text-gray-300 transition hover:bg-white/10"
>
  View All Credentials →
</Link>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
              Simple & Secure
            </p>

            <h2 className="mt-4 text-4xl font-bold">
              How TrustID works
            </h2>

            <p className="mt-5 text-gray-400">
              A simple identity flow designed around ownership, privacy and
              verifiable trust.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-4">
            <Step number="01" title="Issue" text="A trusted organization issues a verifiable credential." />
            <Step number="02" title="Own" text="The credential belongs to the user, not a centralized platform." />
            <Step number="03" title="Prove" text="The user chooses what information to prove." />
            <Step number="04" title="Verify" text="A verifier checks the credential and its status." />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-white/5 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <Feature
              icon="◈"
              title="Privacy First"
              text="Share only the information required for verification."
            />

            <Feature
              icon="⛓"
              title="Blockchain Verified"
              text="Credential status and trust can be verified transparently."
            />

            <Feature
              icon="◎"
              title="User Owned"
              text="Your credentials belong to you and can move with you."
            />

            <Feature
              icon="⚡"
              title="Instant Verification"
              text="Verify credentials in seconds instead of relying on manual checks."
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="why-trustid" className="py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-gradient-to-br from-cyan-400/10 via-blue-500/5 to-violet-500/10 p-10 text-center md:p-16">
            <div className="absolute left-1/2 top-0 h-40 w-80 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

            <div className="relative">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                The Future of Digital Identity
              </p>

              <h2 className="mt-5 text-4xl font-bold md:text-5xl">
                Less Data. More Trust.
              </h2>

              <p className="mx-auto mt-5 max-w-2xl text-gray-400">
                Build a digital identity that you control, verify and share
                securely.
              </p>

              <Link
                href="/wallet"
                className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-black transition hover:bg-gray-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 px-6 text-sm text-gray-500 md:flex-row">
          <p>© 2026 TrustID. Built for 3rd Web Hack.</p>
          <p>Decentralized identity. Privacy by design.</p>
        </div>
      </footer>
    </main>
  );
}

function Credential({
  icon,
  title,
  issuer,
}: {
  icon: string;
  title: string;
  issuer: string;
}) {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.03] p-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5">
        {icon}
      </div>

      <div className="flex-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-gray-500">{issuer}</p>
      </div>

      <span className="text-emerald-400">✓</span>
    </div>
  );
}

function Step({
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
      <p className="text-sm font-semibold text-cyan-400">{number}</p>

      <h3 className="mt-5 text-xl font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-gray-500">{text}</p>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/10 text-xl text-cyan-400">
        {icon}
      </div>

      <h3 className="mt-6 text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-6 text-gray-500">{text}</p>
    </div>
  );
}