export default function Logo({ className = '', size = 'default', dark = false }: { className?: string; size?: 'small' | 'default' | 'large'; dark?: boolean }) {
    const iconSizes = { small: 28, default: 36, large: 44 };
    const iconSize = iconSizes[size];
    const titleSize = size === 'large' ? '1.35rem' : size === 'small' ? '0.95rem' : '1.15rem';
    const subSize = size === 'large' ? '0.55rem' : size === 'small' ? '0.45rem' : '0.5rem';
    const gap = size === 'small' ? 'gap-2' : 'gap-3';

    return (
        <div className={`flex items-center ${gap} ${className}`}>
            {/* Automotive Gear Icon */}
            <svg
                width={iconSize}
                height={iconSize}
                viewBox="0 0 48 48"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="shrink-0"
            >
                <defs>
                    <linearGradient id={`gearBg_${size}`} x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#dc2626" />
                        <stop offset="0.5" stopColor="#b91c1c" />
                        <stop offset="1" stopColor="#991b1b" />
                    </linearGradient>
                    <linearGradient id={`gearShine_${size}`} x1="8" y1="4" x2="24" y2="28" gradientUnits="userSpaceOnUse">
                        <stop stopColor="white" stopOpacity="0.35" />
                        <stop offset="1" stopColor="white" stopOpacity="0" />
                    </linearGradient>
                    <filter id={`gearShadow_${size}`} x="-2" y="-1" width="52" height="52">
                        <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#991b1b" floodOpacity="0.3" />
                    </filter>
                </defs>
                {/* Background circle */}
                <circle cx="24" cy="24" r="23" fill={`url(#gearBg_${size})`} filter={`url(#gearShadow_${size})`} />
                {/* Glossy highlight */}
                <ellipse cx="20" cy="16" rx="16" ry="14" fill={`url(#gearShine_${size})`} />
                {/* Gear teeth */}
                <path d="M24 6l2 4h-4l2-4zM24 42l-2-4h4l-2 4zM6 24l4-2v4l-4-2zM42 24l-4 2v-4l4 2zM10.3 10.3l3.5 2-2 2-1.5-4zM37.7 37.7l-3.5-2 2-2 1.5 4zM37.7 10.3l-2 3.5-2-2 4-1.5zM10.3 37.7l2-3.5 2 2-4 1.5z" fill="white" fillOpacity="0.9" />
                {/* Outer gear ring */}
                <circle cx="24" cy="24" r="14" stroke="white" strokeWidth="2.5" fill="none" strokeOpacity="0.9" />
                {/* Inner circle */}
                <circle cx="24" cy="24" r="8" fill="white" fillOpacity="0.95" />
                {/* Center dot */}
                <circle cx="24" cy="24" r="3" fill={`url(#gearBg_${size})`} />
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
                        className="block bg-gradient-to-r from-red-600 to-red-700 rounded-full"
                        style={{ width: size === 'small' ? 10 : 14, height: 1.5 }}
                    />
                    <span
                        className={`font-semibold uppercase leading-none ${dark ? 'text-red-400' : 'text-red-600'}`}
                        style={{ fontSize: subSize, letterSpacing: '0.18em' }}
                    >
                        Auto Parts
                    </span>
                    <span
                        className="block bg-gradient-to-r from-red-700 to-red-600 rounded-full"
                        style={{ width: size === 'small' ? 10 : 14, height: 1.5 }}
                    />
                </div>
            </div>
        </div>
    );
}
