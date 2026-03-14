export default function Logo({ className = '', size = 'default', dark = false }: { className?: string; size?: 'small' | 'default' | 'large'; dark?: boolean }) {
    const iconSizes = { small: 32, default: 40, large: 52 };
    const iconSize = iconSizes[size];
    const titleSize = size === 'large' ? '1.6rem' : size === 'small' ? '1.1rem' : '1.35rem';
    const subSize = size === 'large' ? '0.62rem' : size === 'small' ? '0.44rem' : '0.52rem';
    const gap = size === 'small' ? 7 : size === 'large' ? 12 : 9;
    const lineHeight = size === 'small' ? 1 : 1.5;

    const primaryColor = dark ? '#f87171' : '#dc2626';
    const secondaryColor = dark ? '#ef4444' : '#b91c1c';

    return (
        <div className={`flex items-center ${className}`} style={{ gap }}>
            {/* Gear/Cog Icon */}
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                <defs>
                    <linearGradient id={`logoBg_${size}_${dark ? 'd' : 'l'}`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop stopColor={primaryColor} />
                        <stop offset="1" stopColor={secondaryColor} />
                    </linearGradient>
                </defs>
                <circle cx="24" cy="24" r="23" fill={`url(#logoBg_${size}_${dark ? 'd' : 'l'})`} />
                {/* Gear ring */}
                <circle cx="24" cy="24" r="12" stroke="white" strokeWidth="3" fill="none" opacity="0.92" />
                {/* 8 gear teeth */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                    <rect
                        key={deg}
                        x="22"
                        y="8"
                        width="4"
                        height="6"
                        rx="1"
                        fill="white"
                        opacity="0.92"
                        transform={`rotate(${deg} 24 24)`}
                    />
                ))}
                {/* Inner hub */}
                <circle cx="24" cy="24" r="5.5" fill="white" opacity="0.95" />
                {/* Center dot */}
                <circle cx="24" cy="24" r="2.5" fill={primaryColor} />
            </svg>

            {/* Text */}
            <div className="flex flex-col" style={{ lineHeight: 1 }}>
                <span
                    className={`font-extrabold tracking-[-0.02em] ${dark ? 'text-white' : 'text-zinc-900'}`}
                    style={{ fontSize: titleSize, lineHeight: 1.1 }}
                >
                    Beneera
                </span>
                {/* Tagline: decorative lines stretch to fill full "Beneera" text width */}
                <div
                    className="flex items-center w-full"
                    style={{ marginTop: size === 'small' ? 1 : 2 }}
                >
                    <span
                        className="flex-1 rounded-full"
                        style={{ height: lineHeight, backgroundColor: primaryColor, minWidth: 4 }}
                    />
                    <span
                        className={`font-bold uppercase ${dark ? 'text-red-400' : 'text-red-600'}`}
                        style={{ fontSize: subSize, letterSpacing: '0.16em', lineHeight: 1, padding: '0 4px', whiteSpace: 'nowrap' }}
                    >
                        AUTO PARTS
                    </span>
                    <span
                        className="flex-1 rounded-full"
                        style={{ height: lineHeight, backgroundColor: primaryColor, minWidth: 4 }}
                    />
                </div>
            </div>
        </div>
    );
}
