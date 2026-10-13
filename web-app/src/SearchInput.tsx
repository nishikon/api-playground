type SearchInputProps = {
    value: string;
    onChange: (text: string) => void;
  };
  
  export function SearchInput({
    value,
    onChange,
  }: SearchInputProps) {
    return (
      <input
        type="text"
        placeholder="記事タイトルを検索..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  }