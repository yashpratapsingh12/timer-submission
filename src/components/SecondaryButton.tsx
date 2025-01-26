import { twMerge } from "tailwind-merge";

interface SecondaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={twMerge(
        "px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
