import { twMerge } from "tailwind-merge";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  children,
  className,
  ...props
}) => {
  return (
    <button
      type="button"
      className={twMerge(
        "px-4 py-2 text-sm font-medium disabled:bg-blue-400 disabled:hover:bg-blue-400 disabled:cursor-not-allowed bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-md hover:shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
