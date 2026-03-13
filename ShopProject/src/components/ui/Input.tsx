interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  containerClassName?: string;
}

export default function Input({
  icon,
  containerClassName = "",
  ...props
}: InputProps) {
  return (
    <div
      className={`flex items-center bg-[#F0F0F0] px-4 py-3 rounded-full group focus-within:ring-1 focus-within:ring-black/20 transition-all ${containerClassName}`}
    >
      {icon && (
        <span className="text-gray-400 group-focus-within:text-black">
          {icon}
        </span>
      )}
      <input
        {...props}
        className="bg-transparent outline-none ml-3 text-sm w-full placeholder:text-gray-500 text-black"
      />
    </div>
  );
}
