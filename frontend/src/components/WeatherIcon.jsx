import React from 'react';
import {
  Sun,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudRain,
  CloudDrizzle,
  CloudLightning,
  CloudFog,
  CloudSnow,
  Snowflake,
  Wind,
  Droplets,
} from 'lucide-react';

export default function WeatherIcon({ icon, className = 'w-8 h-8', condition = '' }) {
  const iconProps = { className };

  switch (icon) {
    case 'Sun':
      return <Sun {...iconProps} className={`${className} text-amber-400 drop-shadow-[0_0_12px_rgba(251,191,36,0.5)] animate-spin-slow`} />;
    case 'Moon':
      return <Moon {...iconProps} className={`${className} text-indigo-300 drop-shadow-[0_0_10px_rgba(165,180,252,0.4)]`} />;
    case 'CloudSun':
      return <CloudSun {...iconProps} className={`${className} text-sky-300 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]`} />;
    case 'CloudMoon':
      return <CloudMoon {...iconProps} className={`${className} text-indigo-300 drop-shadow-[0_0_8px_rgba(129,140,248,0.4)]`} />;
    case 'Cloud':
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
    case 'CloudFog':
      return <CloudFog {...iconProps} className={`${className} text-slate-400`} />;
    case 'CloudDrizzle':
      return <CloudDrizzle {...iconProps} className={`${className} text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]`} />;
    case 'CloudRain':
      return <CloudRain {...iconProps} className={`${className} text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.4)]`} />;
    case 'CloudSnow':
      return <CloudSnow {...iconProps} className={`${className} text-sky-200 drop-shadow-[0_0_8px_rgba(186,230,253,0.5)]`} />;
    case 'Snowflake':
      return <Snowflake {...iconProps} className={`${className} text-sky-200 drop-shadow-[0_0_8px_rgba(186,230,253,0.5)]`} />;
    case 'CloudLightning':
      return <CloudLightning {...iconProps} className={`${className} text-purple-400 drop-shadow-[0_0_12px_rgba(192,132,252,0.6)]`} />;
    case 'Wind':
      return <Wind {...iconProps} className={`${className} text-teal-300`} />;
    default:
      return <Cloud {...iconProps} className={`${className} text-slate-300`} />;
  }
}
