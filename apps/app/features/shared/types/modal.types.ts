export type BaseModalProps<T> = {
  /** Modal mode - add or edit */
  mode?: 'add' | 'edit'
  /** Controls modal visibility */
  open?: boolean
  /** Callback when modal open state changes */
  onOpenChange?: (open: boolean) => void
  /** Submit handler for the form */
  onSubmit: (data: T) => Promise<boolean> | void
  /** Initial form values */
  initialValues?: Partial<T>
  /** Optional trigger element */
  trigger?: React.ReactNode
}
