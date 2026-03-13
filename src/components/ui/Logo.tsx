export default function Logo({ className = '', size = 'default', dark = false }: { className?: string; size?: 'small' | 'default' | 'large'; dark?: boolean }) {
    const iconSizes = { small: 30, default: 38, large: 48 };
    const iconSize = iconSizes[size];
    const titleSize = size === 'large' ? '1.4rem' : size === 'small' ? '1rem' : '1.2rem';
    const subSize = size === 'large' ? '0.55rem' : size === 'small' ? '0.42rem' : '0.48rem';
    const gap = size === 'small' ? 'gap-2' : 'gap-2.5';

    return (
        <div className={`flex items-center ${gap} ${className}`}>
            {/* Automotive Gear/Cog Icon — clean, professional design */}
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 64 64"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                <defs>
                    <linearGradient id={`logoBg_${size}`} x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#ef4444" />
                        <stop offset="1" stopColor="#b91c1c" />
                    </linearGradient>
                </defs>
                {/* Circle background */}
                <circle cx="32" cy="32" r="31" fill={`url(#logoBg_${size})`} />
                {/* Gear/cog shape — 8 teeth, clean geometry */}
                <path
                    d="M32 12a1.5 1.5 0 0 1 1.5 1.5v2.85a14.5 14.5 0 0 1 5.13 2.12l2.01-2.01a1.5 1.5 0 0 1 2.12 2.12l-2.01 2.01a14.5 14.5 0 0 1 2.12 5.13H45.7a1.5 1.5 0 0 1 0 3h-2.83a14.5 14.5 0 0 1-2.12 5.13l2.01 2.01a1.5 1.5 0 0 1-2.12 2.12l-2.01-2.01a14.5 14.5 0 0 1-5.13 2.12v2.85a1.5 1.5 0 0 1-3 0v-2.85a14.5 14.5 0 0 1-5.13-2.12l-2.01 2.01a1.5 1.5 0 0 1-2.12-2.12l2.01-2.01a14.5 14.5 0 0 1-2.12-5.13H18.3a1.5 1.5 0 0 1 0-3h2.83a14.5 14.5 0 0 1 2.12-5.13l-2.01-2.01a1.5 1.5 0 0 1 2.12-2.12l2.01 2.01a14.5 14.5 0 0 1 5.13-2.12V13.5A1.5 1.5 0 0 1 32 12z"
                    fill="white"
                    fillOpacity="0.95"
                />
                {/* Outer ring of gear */}
                <circle cx="32" cy="32" r="12" stroke="white" strokeWidth="3.5" fill="none" strokeOpacity="0.95" />
                {/* Inner hub */}
                <circle cx="32" cy="32" r="6.5" fill="white" fillOpacity="0.95" />
                {/* Center hole */}
                <circle cx="32" cy="32" r="3" fill={`url(#logoBg_${size})`} />
                {/* Subtle highlight */}
                <ellipse cx="26" cy="22" rx="14" ry="11" fill="white" fillOpacity="0.08" />
            </svg>

            {/* Typography */}
            <div className="flex flex-col justify-center leading-none">
                <span
                    className={`font-extrabold tracking-[-0.03em] ${dark ? 'text-white' : 'text-zinc-900'}`}
                    style={{ fontSize: titleSize, lineHeight: 1.1 }}
                >
                    Beneera
                </span>
                <div className="flex items-center gap-1 mt-0.5">
                    <span
                        className="block rounded-full"
                        style={{
                            width: size === 'small' ? 8 : 12,
                            height: 1.5,
                            background: dark
                                ? 'linear-gradient(90deg, #f87171, #ef4444)'
                                : 'linear-gradient(90deg, #dc2626, #b91c1c)',
                        }}
                    />
                    <span
                        className={`font-bold uppercase ${dark ? 'text-red-400' : 'text-red-600'}`}
                        style={{ fontSize: subSize, letterSpacing: '0.2em', lineHeight: 1 }}
                    >
                        Auto Parts
                    </span>
                    <span
                        className="block rounded-full"
                        style={{
                            width: size === 'small' ? 8 : 12,
                            height: 1.5,
                            background: dark
                                ? 'linear-gradient(90deg, #ef4444, #f87171)'
                                : 'linear-gradient(90deg, #b91c1c, #dc2626)',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
