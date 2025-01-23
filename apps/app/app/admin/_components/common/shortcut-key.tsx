type ShortcutKeyProps = {
  number: number
  includeOption?: boolean
}

export function ShortcutKey({
  number,
  includeOption = false
}: ShortcutKeyProps) {
  const isMac = navigator.userAgent.toLowerCase().includes('mac')

  return (
    <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
      <span className="text-xs">{isMac ? '⌘' : 'Ctrl'}</span>
      {includeOption && <span className="text-xs">{isMac ? '⌥' : 'Alt'}</span>}
      {number}
    </kbd>
  )
}
