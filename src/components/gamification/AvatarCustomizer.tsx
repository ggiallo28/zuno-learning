
type Palette = "blue" | "green" | "purple" | "orange";
export function AvatarCustomizer({
  value, onChange,
}: { value: { emoji: string; color: Palette }; onChange: (v:{emoji:string;color:Palette})=>void }) {
  const emojis = ["🦊","🐘","🦙","🐙","🐿️","🐺","🦉","🐯"];
  const colors: Palette[] = ["blue","green","purple","orange"];
  return (
    <div className="grid gap-3 rounded-lg border bg-white p-3">
      <div className="text-sm font-medium">Avatar</div>
      <div className="flex flex-wrap gap-2">
        {emojis.map(e=>(
          <button key={e} className={"text-xl rounded-md border px-3 py-2 " + (value.emoji===e?"border-blue-500 bg-blue-50":"bg-white")}
            onClick={()=>onChange({...value, emoji:e})}>{e}</button>
        ))}
      </div>
      <div className="text-sm font-medium mt-1">Colore</div>
      <div className="flex gap-2">
        {colors.map(c=>(
          <button key={c}
            className={"h-8 w-8 rounded-full border " + (value.color===c?"ring-2 ring-offset-2 ring-blue-500":"")}
            style={{ backgroundColor: `var(--${c}-200, #bfdbfe)` }}
            onClick={()=>onChange({...value, color:c})}
            aria-label={`Colore ${c}`}
          />
        ))}
      </div>
    </div>
  );
}
