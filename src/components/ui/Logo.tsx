import Image from 'next/image';

export default function Logo({ className = '', size = 'default', dark = false }: { className?: string; size?: 'small' | 'default' | 'large'; dark?: boolean }) {
    const heights = { small: 36, default: 48, large: 64 };
    const widths = { small: 155, default: 206, large: 276 };
    const h = heights[size];
    const w = widths[size];

    return (
        <div className={className}>
            <Image
                src="/images/beneera-logo.png"
                alt="Beneera Auto Parts"
                width={w}
                height={h}
                priority
                className="object-contain"
                style={{
                    height: h,
                    width: 'auto',
                    ...(dark ? { filter: 'brightness(0) invert(1)' } : {}),
                }}
            />
        </div>
    );
}
