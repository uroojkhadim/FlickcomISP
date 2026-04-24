import logoImage from '@/assets/logo.png';
import { cn } from '@/utils/helpers';

interface LogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showText?: boolean;
  variant?: 'default' | 'compact';
}

const sizeClasses = {
  xs: 'h-6 w-6',
  sm: 'h-8 w-8',
  md: 'h-10 w-10',
  lg: 'h-12 w-12',
  xl: 'h-16 w-16',
  '2xl': 'h-24 w-24',
};

export default function Logo({
  className,
  size = 'md',
  showText = false,
  variant = 'default',
}: LogoProps) {
  const logoElement = (
    <img
      src={logoImage}
      alt="FlickCom ISP Logo"
      className={cn(
        sizeClasses[size],
        'object-contain flex-shrink-0',
        'transition-transform duration-300 hover:scale-105'
      )}
      style={{ 
        imageRendering: 'crisp-edges',
        filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.05))'
      }}
    />
  );

  if (variant === 'compact') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        {logoElement}
        {showText && (
          <div className="flex flex-col justify-center">
            <span className="text-base font-bold text-slate-900 leading-none tracking-tight">
              FlickCom
            </span>
            <span className="text-[10px] uppercase font-semibold text-slate-500 leading-none tracking-wider mt-1">
              Internet Services
            </span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('flex flex-col items-center text-center gap-4', className)}>
      {logoElement}
      {showText && (
        <div className="space-y-1">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
            FlickCom
          </h2>
          <p className="text-sm font-medium text-slate-500 uppercase tracking-[0.15em]">
            Internet Services
          </p>
        </div>
      )}
    </div>
  );
}
