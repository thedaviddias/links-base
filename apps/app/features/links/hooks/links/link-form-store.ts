import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { DEFAULT_LINK_VALUES } from '@/features/links/constants/link-form'
import { type LinksApp } from '@/features/links/types/link.types'

interface LinkFormState {
  formData: Partial<LinksApp>
  mode: 'add' | 'edit'
  originalName: string | null
  setFormData: (data: Partial<LinksApp>) => void
  setMode: (mode: 'add' | 'edit') => void
  setOriginalName: (name: string | null) => void
  resetForm: () => void
  updateField: (field: string, value: any) => void
}

export const useLinkFormStore = create<LinkFormState>()(
  persist(
    set => ({
      formData: DEFAULT_LINK_VALUES,
      mode: 'add',
      originalName: null,
      setFormData: data => {
        set(() => ({
          formData: {
            ...DEFAULT_LINK_VALUES,
            ...data,
            environments: {
              production: data.environments?.production || '',
              staging: data.environments?.staging || '',
              integration: data.environments?.integration || ''
            },
            tags: data.tags || []
          }
        }))
      },
      setMode: mode => set({ mode }),
      setOriginalName: name => set({ originalName: name }),
      resetForm: () =>
        set({
          formData: DEFAULT_LINK_VALUES,
          mode: 'add',
          originalName: null
        }),
      updateField: (field: string, value: any) => {
        set(state => {
          const newState = { ...state.formData }

          // Handle nested fields like 'environments.staging'
          if (field.includes('.')) {
            const [parent, child] = field.split('.') as [keyof LinksApp, string]
            if (!newState[parent]) {
              newState[parent] =
                parent === 'environments'
                  ? { production: '', staging: '', integration: '' }
                  : parent === 'tags'
                    ? ([] as string[])
                    : ({} as any)
            }
            if (typeof newState[parent] === 'object') {
              ;(newState[parent] as Record<string, any>)[child] = value
            }
          } else {
            newState[field as keyof LinksApp] = value
          }

          return { formData: newState }
        })
      }
    }),
    {
      name: 'link-form-storage'
    }
  )
)
