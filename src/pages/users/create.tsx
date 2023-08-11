import { useEffect, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"

import { useRouter } from "next/router"

import { handleEditData } from "@/hooks/useSetValue"
import { IUser } from "@/interfaces/users"
import { getCardType, normalizeCEP, normalizeCardExpire, normalizeCardNumber, normalizePhone } from "@/utils/normalize"
import { useLazyQuery } from "@apollo/client"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography
} from "@mui/material"
import { EyeOffOutline, EyeOutline } from "mdi-material-ui"
import { z } from "zod"

import { GET_USER } from "../api/graphql/queries"

const CreateUser = () => {
  const { query: { id }, back } = useRouter()

  const [user, { data, loading, error }] = useLazyQuery(GET_USER)
  const [showPassword, setShowPassword] = useState(false)


  const handleClickShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const Schema = z
    .object({
      username: z
        .string({
          required_error: 'Nome de usuário é obrigatório'
        }),
      password: z
        .string({
          required_error: 'Senha é obrigatória'
        })
    })

  const methods = useForm<IUser>({
    resolver: zodResolver(Schema),
  })

  const { handleSubmit, control, setValue } = methods

  const handleBlurPostalCode = async (e: React.FocusEvent<HTMLInputElement>) => {
    const { value } = e.target
    if (value.length === 9) {
      const cep = value.replace('-', '')
      const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
      const data = await response.json()
      if (data.erro) {
        toast.error('CEP não encontrado')
      } else {
        setValue('address.address', data.logradouro)
        setValue('address.city', data.localidade)
        setValue('address.state', data.uf)
      }
    }
  }

  useEffect(() => {
    if (id) {
      user({ variables: { id: Number(id) } })
    }
  }, [id, user])

  useEffect(() => {
    if (data?.user) {
      console.log("🚀 ~ file: create.tsx:61 ~ useEffect ~ data?.user", data?.user)
      handleEditData(data.user, setValue)
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
  return (
    <Card>
      <CardHeader title={id ? 'Editar Usuário' : 'Criar Usuário'} titleTypographyProps={{ variant: 'h6' }} />
      <Divider sx={{ margin: 0 }} />
      <form onSubmit={e => e.preventDefault()}>
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                1. Foto
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Controller
                control={control}
                name="image"
                render={({ field }) => (
                  <Avatar
                    src={field.value || ''}
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
                  />
                )}
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
                name="firstName"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Primeiro Nome'
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
                name="lastName"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Útimo Nome'
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
                name="maidenName"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Nome de Solteiro (a)'
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
                name="username"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Nome de Usuário'
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
                name="password"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <FormControl
                    error={!!error}
                    fullWidth
                    variant='outlined'
                  >
                    <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                    <OutlinedInput
                      {...field}
                      id="outlined-adornment-password"
                      type={showPassword ? 'text' : 'password'}
                      ref={ref}
                      autoComplete="new-password"
                      value={field.value || ''}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                          >
                            {showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Senha"
                    />
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="gender"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-select-label'>Gênero</InputLabel>
                    <Select
                      {...field}
                      ref={ref}
                      fullWidth
                      error={Boolean(error)}
                      value={field.value || ''}
                      label='Gênero'
                      defaultValue=''
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                    >
                      <MenuItem value='male'>Masculino</MenuItem>
                      <MenuItem value='female'>Feminino</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="height"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Altura'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="weight"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Peso'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="hair.color"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Cor do Cabelo'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="hair.type"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Tipo do Cabelo'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="eyeColor"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Cor dos Olhos'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="bloodGroup"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-select-label'>Tipo Sanguíneo</InputLabel>
                    <Select
                      {...field}
                      ref={ref}
                      fullWidth
                      error={Boolean(error)}
                      value={field.value || ''}
                      label='Tipo Sanguíneo'
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                    >
                      <MenuItem value="A+">A+</MenuItem>
                      <MenuItem value="A−">A-</MenuItem>
                      <MenuItem value="B+">B+</MenuItem>
                      <MenuItem value="B-">B-</MenuItem>
                      <MenuItem value="AB+">AB+</MenuItem>
                      <MenuItem value="AB-">AB-</MenuItem>
                      <MenuItem value="O+">O+</MenuItem>
                      <MenuItem value="O-">O-</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                3. Contato
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="address.postalCode"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='CEP'
                    onBlur={handleBlurPostalCode}
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={normalizeCEP(field.value) || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="address.address"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Endereço'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="address.city"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Cidade'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="address.state"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    disabled
                    label='Estado'
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
                name="phone"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Telefone'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={normalizePhone(field.value) || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="email"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Email'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>



            <Grid item xs={12}>
              <Divider sx={{ marginBottom: 0 }} />
            </Grid>
            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                3. Banco
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="bank.cardNumber"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Número do Cartão'
                    error={Boolean(error)}
                    onBlur={e => {
                      const value = e.target.value
                      const cardType = getCardType(value)
                      setValue('bank.cardType', cardType)
                    }}
                    helperText={error?.message}
                    value={normalizeCardNumber(field.value) || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="bank.cardExpire"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Data de Expiração'
                    type="string"
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={normalizeCardExpire(field.value) || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <Controller
                control={control}
                name="bank.cardType"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    disabled
                    label='Tipo do Cartão'
                    type="string"
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
                name="bank.currency"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <FormControl fullWidth>
                    <InputLabel id='form-layouts-separator-select-label'>Moeda</InputLabel>
                    <Select
                      {...field}
                      ref={ref}
                      fullWidth
                      error={Boolean(error)}
                      value={field.value || ''}
                      label='Moeda'
                      defaultValue=''
                      id='form-layouts-separator-select'
                      labelId='form-layouts-separator-select-label'
                    >
                      <MenuItem value="Peso">Peso</MenuItem>
                      <MenuItem value="Real">Real</MenuItem>
                      <MenuItem value="Dolar">Dolar</MenuItem>
                      <MenuItem value="Euro">Euro</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="bank.iban"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='IBAN'
                    type="string"
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                4. Empresa
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="company.name"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Nome da Empresa'
                    type="string"
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
                name="company.department"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    multiline
                    fullWidth
                    label='Departamento'
                    type="string"
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
                name="company.title"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    multiline
                    fullWidth
                    label='Título'
                    type="string"
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                4. Endereço da Empresa
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="company.address.postalCode"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    multiline
                    fullWidth
                    label='CEP'
                    type="string"
                    error={Boolean(error)}
                    helperText={error?.message}
                    onBlur={async (e: React.FocusEvent<HTMLInputElement>) => {
                      const value = e.target.value
                      if (value.length === 9) {
                        const cep = value.replace('-', '')
                        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`)
                        const data = await response.json()
                        if (data.erro) {
                          toast.error('CEP não encontrado')
                        } else {
                          setValue('company.address.address', data.logradouro)
                          setValue('company.address.city', data.localidade)
                          setValue('company.address.state', data.uf)
                        }
                      }
                    }}
                    value={normalizeCEP(field.value) || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="company.address.address"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Endereço'
                    type="string"
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="company.address.city"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='Cidade'
                    type="string"
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={2}>
              <Controller
                control={control}
                name="company.address.state"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    disabled
                    label='Estado'
                    type="string"
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Typography variant='body2' sx={{ fontWeight: 600 }}>
                4. Outras Informações
              </Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <Controller
                control={control}
                name="domain"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    multiline
                    fullWidth
                    label='Domínio'
                    type="string"
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
                name="ein"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    multiline
                    fullWidth
                    label='EIN'
                    type="string"
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
                name="ip"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='IP'
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
                name="macAddress"
                render={({ field: { ref, ...field }, fieldState: { error } }) => (
                  <TextField
                    {...field}
                    ref={ref}
                    fullWidth
                    label='MAC Address'
                    error={Boolean(error)}
                    helperText={error?.message}
                    value={field.value || ''}
                  />
                )}
              />
            </Grid>
          </Grid>
        </CardContent>
        <Divider sx={{ margin: 0 }} />
        <CardActions>
          <Button size='large' type='submit' sx={{ mr: 2 }} variant='contained'>
            {id ? 'Atualizar' : 'Criar'}
          </Button>
          <Button size='large' color='secondary' variant='outlined' onClick={back}>
            Voltar
          </Button>
        </CardActions>
      </form>
    </Card>
  )
}

export default CreateUser