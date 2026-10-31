export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-4xl flex-col items-center justify-center py-32 px-8">
        {/* Hero */}
        <div className="flex flex-col items-center gap-6 text-center">
          {/* Logo icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-600 text-white text-4xl font-bold shadow-lg">
            📦
          </div>

          <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            DiskDabba
          </h1>

          <p className="max-w-lg text-xl leading-8 text-zinc-600 dark:text-zinc-400">
            Your free personal cloud storage.
            <br />
            Upload, organise, share and back up your files — anywhere, anytime.
          </p>

          <div className="flex flex-col gap-4 mt-8 sm:flex-row">
            <a
              href="/signup"
              className="flex h-12 items-center justify-center rounded-full bg-blue-600 px-8 text-white font-medium transition-colors hover:bg-blue-700"
            >
              Get Started — It&apos;s Free
            </a>
            <a
              href="/login"
              className="flex h-12 items-center justify-center rounded-full border border-zinc-300 px-8 font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Sign In
            </a>
          </div>
        </div>

        {/* Features grid */}
        <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 w-full">
          <FeatureCard
            icon="☁️"
            title="5 GB Free Storage"
            description="Store your photos, documents and videos in the cloud at no cost."
          />
          <FeatureCard
            icon="🔗"
            title="Easy Sharing"
            description="Share files with a link. Set passwords, expiry dates, or keep them public."
          />
          <FeatureCard
            icon="📱"
            title="Auto Backup"
            description="Our Android app automatically backs up your photos and videos."
          />
        </div>

        {/* Footer note */}
        <p className="mt-24 text-sm text-zinc-400 dark:text-zinc-600">
          Built with Supabase &amp; Cloudflare R2 — zero egress fees, fast
          everywhere.
        </p>
      </main>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 p-6 text-center transition-shadow hover:shadow-md dark:border-zinc-800">
      <span className="text-3xl">{icon}</span>
      <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">{description}</p>
    </div>
  );
}
