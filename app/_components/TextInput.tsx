type Props = {
  label: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function TextInput({ label, ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-bold text-gray-700">{label}</label>
      <input
        {...props} // ← registerの中身がここに展開される
        type="text"
        className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  );
}
