import Image from 'next/image';

export default function Logo({ className = '', size = 'default', dark = false }: { className?: string; size?: 'small' | 'default' | 'large'; dark?: boolean }) {
    const heights = { small: 30, default: 38, large: 50 };
    const widths = { small: 130, default: 164, large: 216 };
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
