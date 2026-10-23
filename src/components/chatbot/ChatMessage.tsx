
interface Props {
  from: 'bot' | 'user';
  text: string;
  color: string;
}

export function ChatMessage({ from, text, color }: Props) {
  if (from === 'user') {
    return (
      <div className="flex justify-end">
        <p
          className="max-w-[80%] whitespace-pre-wrap break-words rounded-2xl rounded-br-sm px-4 py-2 text-sm text-white"
          style={{ backgroundColor: color }}
        >
          {text}
        </p>
      </div>
    );
  }

  return (
    <div className="flex">
      <p className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-2 text-sm text-slate-800">
        {text}
      </p>
    </div>
  );
}