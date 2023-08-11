import { useCallback, useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import { useRouter } from "next/router"

import { RHFUpload } from "@/components/hook-form"
import FormProvider from "@/components/hook-form/FormProvider"
import { handleEditData } from "@/hooks/useSetValue"
import { IProducts } from "@/interfaces/products"
import api from "@/services/api"
import { fCurrency } from "@/utils/formatNumber"
import { useLazyQuery } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from "@mui/material"
import { z } from "zod"


import { GET_PRODUCT } from "../api/graphql/queries"

const CreateProducts = () => {
  const { query: { id }, back } = useRouter()

  const [product, { data, loading, error }] = useLazyQuery(GET_PRODUCT)
  const [categories, setCategories] = useState([])

  const Schema = z
    .object({
      title: z.string({
        required_error: 'Título é obrigatório',
      }),
      description: z.string({
        required_error: 'Descrição é obrigatório',
      }),
      price: z.number({
        required_error: 'Preço é obrigatório',
      }),
      discountPercentage: z.number({
        required_error: 'Desconto é obrigatório',
      }),
      rating: z.number({
        required_error: 'Avaliação é obrigatório',
      }),
      stock: z.number({
        required_error: 'Estoque é obrigatório',
      }),
      brand: z.string({
        required_error: 'Marca é obrigatório',
      }),
      category: z.string({
        required_error: 'Categoria é obrigatório',
      }),
      thumbnail: z.string({
        required_error: 'Thumbnail é obrigatório',
      }),
      images: z.array(z.any({
        required_error: 'Imagem é obrigatório',
      }))
    })

  const methods = useForm<IProducts>({
    resolver: zodResolver(Schema),
  })

  const { handleSubmit, control, setValue, formState: { isSubmitting, errors: errorForm }, watch } = methods

  const watchAllFields = watch()

  const handleOnSubmit = async (data: IProducts) => {
    try {
      if (id) {
        await api.put(`/products/${id}`, data).then(() => {
          toast.success('Produto atualizado com sucesso')
          back()
        })
        return
      }
      await api.post('/products/add', data).then(() => {
        toast.success('Produto criado com sucesso')
        back()
      })

    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  const handleDrop = useCallback(
    (acceptedFiles: File[]) => {
      const files = watchAllFields.images || [];

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );

      setValue('images', [...files, ...newFiles]);
      setValue('thumbnail', newFiles[0].preview);
    },
    [setValue, watchAllFields.images]
  );

  const handleRemoveFile = (inputFile: File | string) => {
    const filtered = watchAllFields.images && watchAllFields.images?.filter((file) => file !== inputFile);
    setValue('images', filtered);
  };

  const handleRemoveAllFiles = () => {
    setValue('images', []);
  };

  const handleGetAllCategories = async () => {
    try {
      const { data } = await api.get('/products/categories')
      setCategories(data)
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }

  useEffect(() => {
    if (id) {
      product({ variables: { id: Number(id) } })
    }
  }, [id, product])

  useEffect(() => {
    handleGetAllCategories()
  }, [])

  useEffect(() => {
    if (data?.product) {
      handleEditData(data.product, setValue)
    }
  }, [data, setValue])

  useEffect(() => {
    if (error) {
      toast.error(error.message)
      setTimeout(() => {
        back()
      }, 2000)
    }
  }, [back, error])

  useEffect(() => {
    const errors = Object.values(errorForm)
    errors.map((error: any) => toast.error(error.message))
  }, [errorForm])

  useEffect(() => {
  }, [watchAllFields])

  if (loading) {
    <Box display="flex" width="100%" alignItems="center" justifyContent="center">
      <CircularProgress color="primary" size={60} />
    </Box>
  }
  return (
    <Card>
      <CardHeader title={id ? 'Editar Produto' : 'Criar Produto'} titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <CardContent>
        <FormProvider methods={methods} onSubmit={handleSubmit(handleOnSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Foto
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  margin: '0 auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 1
                }}
                src={watchAllFields?.images?.length > 0 ? watchAllFields?.images[0].preview || watchAllFields?.images[0] : '/images/sem-foto.png'}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                2. Detalhe
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="title"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Título'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>


            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="category"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-select-label'>Categoria</InputLabel>
                    <Select
                      {...field}
                      ref={ref}
                      fullWidth
                      error={Boolean(error)}
                      value={field.value || ''}
                      label='Categoria'
                      defaultValue=''
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="brand"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Marca'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>


            <Grid item xs={12} md={3}>
              <Controller
                control={control}
                name="price"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <FormControl
                    error={!!error}
                    fullWidth
                    variant='outlined'
                  >
                    <InputLabel htmlFor="outlined-adornment-password">Preço</InputLabel>
                    <OutlinedInput
                      {...field}
                      id="outlined-adornment-password"
                      ref={ref}
                      autoComplete="new-password"
                      value={fCurrency(String(field.value)) || ''}
                      onChange={(e) => {
                        field.onChange(parseInt((e.target.value.replaceAll('$', ''))))
                      }}
                      label="Preço"
                    />
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                control={control}
                name="discountPercentage"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Desconto'
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value))
                    }}
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                control={control}
                name="rating"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Avaliação'
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value))
                    }}
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                control={control}
                name="stock"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Estoque'
                    onChange={(e) => {
                      field.onChange(parseInt(e.target.value))
                    }}
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                control={control}
                name="description"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    multiline
                    rows={4}
                    label='Descrição'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <RHFUpload
                maxFiles={8}
                multiple
                thumbnail
                name="images"
                onDrop={handleDrop}
                onRemove={handleRemoveFile}
                onRemoveAll={handleRemoveAllFiles}
              />
            </Grid>
          </Grid>

          <Divider sx={{ margin: 0 }} />
          <CardActions>
            <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained' disabled={isSubmitting}>
              {id ? 'Atualizar' : 'Criar'}
            </Button>
            <Button size='large' color='secondary' variant='outlined' onClick={back}>
              Voltar
            </Button>
          </CardActions>
        </FormProvider>
      </CardContent>
    </Card>
  )
}

export default CreateProducts