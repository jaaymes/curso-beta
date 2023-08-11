import { useDropzone } from 'react-dropzone';

import { CloseOutlined } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, StackProps, Typography } from '@mui/material';
import { alpha, styled } from '@mui/material/styles';

import { UploadIllustration } from '../../assets/illustrations';
import RejectionFiles from './errors/RejectionFiles';
import MultiFilePreview from './preview/MultiFilePreview';
import { UploadProps } from './types';

const StyledDropZone = styled('div')(({ theme }) => ({
  outline: 'none',
  cursor: 'pointer',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(5, 1),
  borderRadius: theme.shape.borderRadius,
  transition: theme.transitions.create('padding'),
  backgroundColor: theme.palette.background.default,
  border: `1px dashed ${alpha(theme.palette.grey[500], 0.32)}`,
  '&:hover': {
    opacity: 0.72,
  },
}));

export default function Upload({
  disabled,
  multiple = false,
  error,
  helperText,
  file,
  onDelete,
  files,
  thumbnail,
  onRemove,
  onRemoveAll,
  sx,
  ...other
}: UploadProps) {
  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    multiple,
    disabled,
    ...other,
  });

  const hasFile = !!file && !multiple;

  const hasFiles = files && multiple && files.length > 0;

  const isError = isDragReject || !!error;

  return (
    <Box sx={{ width: 1, position: 'relative', ...sx }}>
      <StyledDropZone
        {...getRootProps()}
        sx={{
          ...(isDragActive && {
            opacity: 0.72,
          }),
          ...(isError && {
            color: 'error.main',
            bgcolor: 'error.lighter',
            borderColor: 'error.light',
          }),
          ...(disabled && {
            opacity: 0.48,
            pointerEvents: 'none',
          }),
          ...(hasFile && {
            padding: '12% 0',
          }),
        }}
      >
        <input {...getInputProps()} />

        <Placeholder
          sx={{
            ...(hasFile && {
              opacity: 0,
            }),
          }}
        />

      </StyledDropZone>

      <RejectionFiles fileRejections={fileRejections} />

      {hasFile && onDelete && (
        <IconButton
          size="small"
          onClick={onDelete}
          sx={{
            top: 16,
            right: 16,
            zIndex: 9,
            position: 'absolute',
            color: (theme) => alpha(theme.palette.common.white, 0.8),
            bgcolor: 'transparent',
          }}
        >
          <CloseOutlined sx={{ width: 18 }} />
        </IconButton>
      )}

      {hasFiles && (
        <Box py={2}>
          <Box sx={{ my: 3 }}>
            <MultiFilePreview files={files} thumbnail={thumbnail} onRemove={onRemove} />
          </Box>

          <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
            {onRemoveAll && (
              <Button color="inherit" variant="outlined" size="small" onClick={onRemoveAll}>
                Remover todos
              </Button>
            )}
          </Stack>
        </Box>
      )}

      {helperText && helperText}
    </Box>
  );
}

function Placeholder({ sx, ...other }: StackProps) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        width: 1,
        textAlign: {
          xs: 'center',
          md: 'left',
        },
        ...sx,
      }}
      {...other}
    >
      <UploadIllustration sx={{ width: 220 }} />

      <Box sx={{ p: 3 }}>
        <Typography gutterBottom variant="h5">
          Clique ou  arraste e solte
        </Typography>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {/* Drop files here or click */}
          Solte os arquivos aqui ou
          <Typography
            variant="body2"
            component="span"
            sx={{
              mx: 0.5,
              color: 'primary.main',
              textDecoration: 'underline',
            }}
          >
            clique
          </Typography>
          para fazer o upload
        </Typography>
      </Box>
    </Stack>
  );
}
