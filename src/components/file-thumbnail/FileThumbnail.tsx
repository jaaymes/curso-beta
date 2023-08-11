import { Box, SxProps } from '@mui/material';
import { Theme } from '@mui/material/styles';

import { fileData, fileFormat, fileThumb } from './utils';


type FileIconProps = {
  file: File | string;
  tooltip?: boolean;
  imageView?: boolean;
  onDownload?: VoidFunction;
  sx?: SxProps<Theme>;
  imgSx?: SxProps<Theme>;
};

export default function FileThumbnail({
  file,
  imageView,
  sx,
  imgSx,
}: FileIconProps) {
  const { path = '', preview = '' } = fileData(file);

  const format = fileFormat(path || preview);

  return (
    <>
      {format === 'image' && imageView ? (
        <Box
          component="img"
          src={preview}
          sx={{
            width: 1,
            height: 1,
            flexShrink: 0,
            objectFit: 'cover',
            ...imgSx,
          }}
        />
      ) : (
        <Box
          component="img"
          src={fileThumb(format)}
          sx={{
            width: 32,
            height: 32,
            flexShrink: 0,
            ...sx,
          }}
        />
      )}
    </>
  );
}
