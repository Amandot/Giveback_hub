import { ReactNode } from 'react'

interface TypographyProps {
  children: ReactNode
  className?: string
  align?: 'left' | 'center' | 'right' | 'justify'
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span'
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold'
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'destructive'
}

export default function Typography({
  children,
  className = '',
  align = 'left',
  variant = 'p',
  weight = 'normal',
  size = 'base',
  color = 'primary'
}: TypographyProps) {
  const alignmentClasses = {
    left: 'text-left-justify',
    center: 'text-center-justify',
    right: 'text-right-justify',
    justify: 'text-justify'
  }

  const weightClasses = {
    light: 'font-light',
    normal: 'font-normal',
    medium: 'font-medium',
    semibold: 'font-semibold',
    bold: 'font-bold'
  }

  const sizeClasses = {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
    '4xl': 'text-4xl',
    '5xl': 'text-5xl',
    '6xl': 'text-6xl'
  }

  const colorClasses = {
    primary: 'text-foreground',
    secondary: 'text-secondary-foreground',
    muted: 'text-muted-foreground',
    accent: 'text-accent-foreground',
    destructive: 'text-destructive-foreground'
  }

  const baseClasses = `
    ${alignmentClasses[align]}
    ${weightClasses[weight]}
    ${sizeClasses[size]}
    ${colorClasses[color]}
    text-readable text-pretty
    ${className}
  `.trim()

  const Component = variant

  return (
    <Component className={baseClasses}>
      {children}
    </Component>
  )
}

// Convenience components
export function Heading1({ children, className = '', ...props }: Omit<TypographyProps, 'variant' | 'size' | 'weight'>) {
  return (
    <Typography variant="h1" size="6xl" weight="bold" className={className} {...props}>
      {children}
    </Typography>
  )
}

export function Heading2({ children, className = '', ...props }: Omit<TypographyProps, 'variant' | 'size' | 'weight'>) {
  return (
    <Typography variant="h2" size="4xl" weight="bold" className={className} {...props}>
      {children}
    </Typography>
  )
}

export function Heading3({ children, className = '', ...props }: Omit<TypographyProps, 'variant' | 'size' | 'weight'>) {
  return (
    <Typography variant="h3" size="2xl" weight="semibold" className={className} {...props}>
      {children}
    </Typography>
  )
}

export function Paragraph({ children, className = '', ...props }: Omit<TypographyProps, 'variant' | 'size'>) {
  return (
    <Typography variant="p" size="base" className={className} {...props}>
      {children}
    </Typography>
  )
}

export function Small({ children, className = '', ...props }: Omit<TypographyProps, 'variant' | 'size'>) {
  return (
    <Typography variant="span" size="sm" color="muted" className={className} {...props}>
      {children}
    </Typography>
  )
}
