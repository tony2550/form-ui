import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { FormData, FormValidationError } from '@/types/form'

interface FormStore {
  // State
  formData: FormData
  isDirty: boolean
  lastSaved: Date | null
  errors: FormValidationError[]
  isSaving: boolean

  // Actions
  updateField: (name: string, value: string | boolean | number | null) => void
  setFormData: (data: FormData) => void
  setErrors: (errors: FormValidationError[]) => void
  clearErrors: () => void
  setSaving: (saving: boolean) => void
  setLastSaved: (date: Date) => void
  reset: () => void
}

export const useFormStore = create<FormStore>()(
  persist(
    (set) => ({
      // Initial state
      formData: {},
      isDirty: false,
      lastSaved: null,
      errors: [],
      isSaving: false,

      // Update single field
      updateField: (name, value) =>
        set((state) => ({
          formData: { ...state.formData, [name]: value },
          isDirty: true,
          errors: state.errors.filter((e) => e.field !== name), // Clear field error
        })),

      // Set entire form data
      setFormData: (data) =>
        set({
          formData: data,
          isDirty: false,
        }),

      // Set validation errors
      setErrors: (errors) =>
        set({
          errors,
        }),

      // Clear all errors
      clearErrors: () =>
        set({
          errors: [],
        }),

      // Set saving state
      setSaving: (saving) =>
        set({
          isSaving: saving,
        }),

      // Set last saved time
      setLastSaved: (date) =>
        set({
          lastSaved: date,
          isDirty: false,
        }),

      // Reset form
      reset: () =>
        set({
          formData: {},
          isDirty: false,
          lastSaved: null,
          errors: [],
          isSaving: false,
        }),
    }),
    {
      name: 'form-storage',
      partialize: (state) => ({
        formData: state.formData,
        lastSaved: state.lastSaved,
      }),
    }
  )
)
