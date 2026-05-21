import WordmarkRed from '@/assets/WordmarkRed.png';

export default function Footer() {
  return (
    <footer className="mt-12 w-full bg-amber-500 text-white">
      <div className="mx-auto max-w-7xl px-6 py-8">

        {/* Main layout */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">

          {/* Left: Brand */}
          <div className="max-w-sm">
            <img src={WordmarkRed} alt="iQueue" className="h-8 w-auto" />

            <p className="mt-2 text-lg font-bold text-red-500 leading-relaxed">
              Know the Queue Before You Go
            </p>
          </div>

          {/* Right: Resources (HORIZONTAL) */}
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/90 md:justify-end">

            {['Privacy Policy', 'Terms', 'Help Center', 'FAQ'].map((item) => (
              <a
                key={item}
                href="#"
                className="hover:text-white transition whitespace-nowrap"
              >
                {item}
              </a>
            ))}

          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-8 border-t border-white/20 pt-4 text-center text-xs text-white/80">
          © 2026 iQueue. All rights reserved.
        </div>

      </div>
    </footer>
  );
}