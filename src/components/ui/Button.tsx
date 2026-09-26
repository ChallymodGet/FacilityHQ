import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "outline" | "outline-primary" | "ghost";
type Size = "sm" | "md" | "lg";

const VARIANT: Record<Variant, string> = {
  primary:
    "bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 disabled:bg-neutral-400 disabled:text-neutral-600 border border-transparent",
  outline:
    "bg-white text-heading border border-neutral-900 hover:bg-neutral-300 active:bg-neutral-400 disabled:text-neutral-500 disabled:border-neutral-400",
  "outline-primary":
    "bg-white text-primary-500 border border-primary-500 hover:bg-primary-100 active:bg-primary-200 disabled:text-neutral-500 disabled:border-neutral-400",
  ghost:
    "bg-transparent text-body hover:bg-neutral-300 active:bg-neutral-400 border border-transparent",
};

const SIZE: Record<Size, string> = {
  sm: "h-9 px-3 text-p-sm gap-2 rounded-sm",
  md: "h-10 px-4 text-p-sm gap-2 rounded-sm",
  lg: "h-12 sm:h-14 px-6 text-p gap-3 rounded-sm",
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
}

type ButtonProps = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "children">;

const base =
  "inline-flex items-center justify-center font-medium whitespace-nowrap select-none transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 disabled:cursor-not-allowed";

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  leadingIcon,
  trailingIcon,
  fullWidth,
  type = "button",
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(base, VARIANT[variant], SIZE[size], fullWidth && "w-full", className)}
      {...rest}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </button>
  );
}

interface ButtonLinkProps extends BaseProps {
  href: string;
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  leadingIcon,
  trailingIcon,
  fullWidth,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(base, VARIANT[variant], SIZE[size], fullWidth && "w-full", className)}
    >
      {leadingIcon}
      <span>{children}</span>
      {trailingIcon}
    </Link>
  );
}
