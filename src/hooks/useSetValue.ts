import { FieldValues, UseFormSetValue } from "react-hook-form"

export const handleEditData = <T extends FieldValues>(editData: T, setValue: UseFormSetValue<T>) => {
  if (editData !== undefined) {
    Object.entries(editData).forEach(([name, value]: any) => {
      setValue(name, value)
    })
    return true
  }
}
