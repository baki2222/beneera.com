import Image from 'next/image';

export default function Logo({ className = '', size = 'default', dark = false }: { className?: string; size?: 'small' | 'default' | 'large'; dark?: boolean }) {
    const heights = { small: 28, default: 36, large: 48 };
    const widths = { small: 120, default: 154, large: 206 };
    const h = heights[size];
    const w = widths[size];

    return (
        <div className={className}>
            <Image
                src={dark ? '/images/beneera-logo-dark.png' : '/images/beneera-logo.png'}
                alt="Beneera Auto Parts"
                width={w}
                height={h}
                priority
                className="object-contain"
                style={{ height: h, width: 'auto' }}
            />
        </div>
    );
}
