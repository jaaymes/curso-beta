import { Controller, useFormContext } from 'react-hook-form';

import { FormHelperText } from '@mui/material';

import { Upload, UploadProps } from '../upload';


interface Props extends Omit<UploadProps, 'file'> {
  name: string;
  multiple?: boolean;
}

export function RHFUpload({ name, multiple, ...other }: Props) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        const isErrorWithSingle = !!error && !field.value;

        const isErrorWithMultiple = !!error && !field.value?.length;

        return multiple ? (
          <Upload
            multiple
            accept={{ 'image/*': [] }}
            files={field.value}
            error={isErrorWithMultiple}
            helperText={
              isErrorWithMultiple && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error?.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            accept={{ 'image/*': [] }}
            file={field.value}
            error={isErrorWithSingle}
            helperText={
              isErrorWithSingle && (
                <FormHelperText error sx={{ px: 2 }}>
                  {error?.message}
                </FormHelperText>
              )
            }
            {...other}
          />
        );
      }}
    />
  );
}
