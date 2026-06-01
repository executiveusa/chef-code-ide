import type { NannyBrand } from '~/lib/nanny/brand';
import { DEFAULT_BRAND } from '~/lib/nanny/brand';

interface NannyTopNavProps {
  brand?: NannyBrand;
  back?: { href: string; label: string };
  title?: string;
  actions?: React.ReactNode;
}

export function NannyTopNav({ brand = DEFAULT_BRAND, back, title, actions }: NannyTopNavProps) {
  return (
    <nav
      className="sticky top-0 z-20 border-b border-[#2D5016]/10 bg-[#FAFAF7]/95 backdrop-blur-sm"
      aria-label="Nanny navigation"
    >
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-3">
        {back ? (
          <a
            href={back.href}
            className="text-sm font-medium text-[#2D5016]/70 transition-colors hover:text-[#2D5016] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CB342]"
          >
            ← {back.label}
          </a>
        ) : (
          <a
            href="/nanny"
            className="flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#7CB342]"
            aria-label={`${brand.name} home`}
          >
            <img src={brand.avatar} alt={brand.name} className="size-6" />
            <span className="text-sm font-semibold text-[#2D5016]">{brand.name}</span>
          </a>
        )}

        {title && <span className="text-sm font-medium text-[#1A1A18]/60">{title}</span>}

        <div className="ml-auto flex items-center gap-2">
          {actions}
          <a
            href="/nanny/pricing"
            className="hidden text-xs font-medium text-[#1A1A18]/50 transition-colors hover:text-[#2D5016] sm:block"
          >
            Pricing
          </a>
        </div>
      </div>
    </nav>
  );
}
