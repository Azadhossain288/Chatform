//AnswerButtons.tsx
//Multiple choice ar Yes/No er button.
interface Props {
  options: string[];
  color: string;
  onSelect: (value: string) => void;
}

export function AnswerButtons({ options, color, onSelect }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onSelect(option)}
          className="rounded-full border-2 bg-white px-4 py-2 text-sm font-medium transition-colors hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
          style={{ borderColor: color, color }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = color)}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '')}
          onFocus={(e) => (e.currentTarget.style.backgroundColor = color)}
          onBlur={(e) => (e.currentTarget.style.backgroundColor = '')}
        >
          {option}
        </button>
      ))}
    </div>
  );
}