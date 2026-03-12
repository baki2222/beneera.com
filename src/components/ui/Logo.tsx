export default function Logo({ className = '', size = 'default', dark = false }: { className?: string; size?: 'small' | 'default' | 'large'; dark?: boolean }) {
    const iconSizes = { small: 28, default: 36, large: 44 };
    const iconSize = iconSizes[size];
    const titleSize = size === 'large' ? '1.35rem' : size === 'small' ? '0.95rem' : '1.15rem';
    const subSize = size === 'large' ? '0.55rem' : size === 'small' ? '0.45rem' : '0.5rem';
    const gap = size === 'small' ? 'gap-2' : 'gap-3';

    return (
        <div className={`flex items-center ${gap} ${className}`}>
            {/* Premium Paw Icon */}
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                <defs>
                    <linearGradient id={`pawBg_${size}`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#f59e0b" />
                        <stop offset="0.5" stopColor="#f97316" />
                        <stop offset="1" stopColor="#ea580c" />
                    </linearGradient>
                    <linearGradient id={`pawShine_${size}`} x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0.35" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <filter id={`pawShadow_${size}`} x="-2" y="-1" width="52" height="52">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#ea580c" floodOpacity="0.3" />
                    </filter>
                </defs>
                {/* Background circle */}
                <circle cx="24" cy="24" r="23" fill={`url(#pawBg_${size})`} filter={`url(#pawShadow_${size})`} />
                {/* Glossy highlight */}
                <ellipse cx="20" cy="16" rx="16" ry="14" fill={`url(#pawShine_${size})`} />
                {/* Paw - main pad */}
                <path d="M24 35c-5.5 0-10-3.5-10-8s4.5-8 10-8 10 3.5 10 8-4.5 8-10 8z" fill="white" fillOpacity="0.95" />
                {/* Paw - toe 1 (left) */}
                <ellipse cx="13" cy="16.5" rx="3.5" ry="4.5" fill="white" fillOpacity="0.95" transform="rotate(-12 13 16.5)" />
                {/* Paw - toe 2 */}
                <ellipse cx="20" cy="13" rx="3" ry="4.2" fill="white" fillOpacity="0.95" transform="rotate(-3 20 13)" />
                {/* Paw - toe 3 */}
                <ellipse cx="28" cy="13" rx="3" ry="4.2" fill="white" fillOpacity="0.95" transform="rotate(3 28 13)" />
                {/* Paw - toe 4 (right) */}
                <ellipse cx="35" cy="16.5" rx="3.5" ry="4.5" fill="white" fillOpacity="0.95" transform="rotate(12 35 16.5)" />
                {/* Ring border */}
                <circle cx="24" cy="24" r="22" stroke="white" strokeWidth="1" strokeOpacity="0.2" fill="none" />
            </svg>

            {/* Premium Typography */}
            <div className="flex flex-col justify-center">
                <span
                    className={`font-extrabold tracking-[-0.02em] leading-none ${dark ? 'text-white' : 'text-zinc-900'}`}
                    style={{ fontSize: titleSize }}
                >
                    Beneera
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                    <span
                        className="block bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                        style={{ width: size === 'small' ? 10 : 14, height: 1.5 }}
                    />
                    <span
                        className={`font-semibold uppercase leading-none ${dark ? 'text-amber-400' : 'text-amber-600'}`}
                        style={{ fontSize: subSize, letterSpacing: '0.18em' }}
                    >
                        Pet Store
                    </span>
                    <span
                        className="block bg-gradient-to-r from-orange-500 to-amber-500 rounded-full"
                        style={{ width: size === 'small' ? 10 : 14, height: 1.5 }}
                    />
                </div>
            </div>
        </div>
    );
}
