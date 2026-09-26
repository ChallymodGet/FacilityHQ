import { ChevronDown } from "lucide-react";
import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/cn";

interface FieldProps {
  label: ReactNode;
  required?: boolean;
  htmlFor?: string;
  children: ReactNode;
  className?: string;
  hint?: ReactNode;
}

export function Field({ label, required, htmlFor, children, className, hint }: FieldProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={htmlFor} className="text-p-sm font-medium text-heading leading-5">
        {label}
        {required ? <span className="text-error-700"> *</span> : null}
      </label>
      {children}
      {hint ? <p className="text-p-xs text-caption">{hint}</p> : null}
    </div>
  );
}

const control =
  "h-12 w-full rounded-sm border border-line bg-white px-4 text-p-sm text-heading placeholder:text-placeholder focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 disabled:bg-neutral-200 disabled:text-neutral-600";

export function TextInput({ className, ...rest }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={cn(control, className)} {...rest} />;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  placeholder?: string;
  options: readonly string[];
}

export function Select({ className, placeholder, options, value, ...rest }: SelectProps) {
  return (
    <div className="relative">
      <select
        className={cn(
          control,
          "appearance-none pr-10",
          !value && "text-placeholder",
          className,
        )}
        value={value}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options.map((o) => (
          <option key={o} value={o} className="text-heading">
            {o}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-heading"
        aria-hidden
      />
    </div>
  );
}

export function Textarea({ className, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full min-h-24 rounded-sm border border-line bg-white px-3 py-3 text-p-sm text-heading placeholder:text-placeholder focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 resize-y",
        className,
      )}
      {...rest}
    />
  );
}
