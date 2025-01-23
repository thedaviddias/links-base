import { create } from 'zustand'

interface CommandStore {
  isOpen: boolean
  setOpen: (open: boolean) => void
}

export const useCommandStore = create<CommandStore>(set => ({
  isOpen: false,
  setOpen: open => set({ isOpen: open })
}))
