import type { NannyBrand } from '~/lib/nanny/brand';

interface NannyAvatarProps {
  brand?: Pick<NannyBrand, 'avatar' | 'name'>;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'idle' | 'thinking' | 'service' | 'listening';
  className?: string;
}

const SIZE_MAP = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-20 h-20',
  xl: 'w-32 h-32',
};

const STATUS_RING: Record<string, string> = {
  idle: '',
  thinking: 'ring-2 ring-amber-400 ring-offset-2 animate-pulse',
  service: 'ring-2 ring-emerald-500 ring-offset-2',
  listening: 'ring-4 ring-red-400 ring-offset-2 animate-pulse',
};

export function NannyAvatar({ brand, size = 'md', status = 'idle', className = '' }: NannyAvatarProps) {
  const avatarSrc = brand?.avatar ?? '/chef.svg';
  const altText = `${brand?.name ?? 'Nanny'} avatar`;

  return (
    <div
      className={`${SIZE_MAP[size]} ${STATUS_RING[status]} flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1A3A1A] ${className}`}
    >
      <img src={avatarSrc} alt={altText} className="size-full object-contain p-1" loading="lazy" />
    </div>
  );
}
