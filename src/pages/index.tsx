import { ChangeEvent, ReactNode, useCallback, useState } from "react"

import { useRouter } from "next/router"

import { BlurImage } from "@/components/BlurImage"
import FooterIllustrations from "@/components/FooterIllustration"
import themeConfig from "@/configs/themeConfig"
import { useAuth } from "@/hooks/useAuth"
import BlankLayout from "@/layouts/auth/BlankLayout"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Box,
  Button,
  CardContent,
  CardProps,
  FormControl,
  FormControlLabelProps,
  IconButton,
  InputAdornment,
  InputLabel,
  Card as MuiCard,
  FormControlLabel as MuiFormControlLabel,
  OutlinedInput,
  TextField,
  Typography
} from "@mui/material"
import { styled } from '@mui/material/styles'
import { EyeOffOutline, EyeOutline } from "mdi-material-ui"
import { GetServerSideProps } from "next"
import { parseCookies } from "nookies"
import { Controller, useForm } from "react-hook-form"
import toast from 'react-hot-toast'
import { z } from "zod"

interface State {
  password: string
  showPassword: boolean
}

const Card = styled(MuiCard)<CardProps>(({ theme }) => ({
  [theme.breakpoints.up('sm')]: { width: '28rem' }
}))

const LinkStyled = styled('a')(({ theme }) => ({
  fontSize: '0.875rem',
  textDecoration: 'none',
  color: theme.palette.primary.main
}))

const FormControlLabel = styled(MuiFormControlLabel)<FormControlLabelProps>(({ theme }) => ({
  '& .MuiFormControlLabel-label': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary
  }
}))

interface IFormValues {
  username: string
  password: string
}

const Home = () => {
  const { signIn } = useAuth()
  const [values, setValues] = useState<State>({
    password: '',
    showPassword: false
  })

  const router = useRouter()

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

  const methods = useForm<IFormValues>({
    resolver: zodResolver(Schema),
  })

  const { handleSubmit } = methods

  const handleChange = (prop: keyof State) => (event: ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value })
  }

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword })
  }

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
  }

  const handleOnLogin = useCallback(async (data: IFormValues) => {
    try {
      await signIn({
        username: data.username,
        password: data.password
      })
      router.push('/dashboard')
    } catch (error: any) {
      toast.error(error.response.data.message)
    }
  }, [])

  return (
    <Box className='content-center'>
      <Card sx={{ zIndex: 1 }}>
        <CardContent sx={{ padding: theme => `${theme.spacing(12, 9, 7)} !important` }}>
          <Box sx={{ mb: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BlurImage
              src='/images/Logo_Thumb.png'
              name='Logo'
              height={40}
              width={40}
            />
            <Typography
              variant='h6'
              sx={{
                ml: 3,
                lineHeight: 1,
                fontWeight: 600,
                textTransform: 'uppercase',
                fontSize: '1.5rem !important'
              }}
            >
              {themeConfig.templateName}
            </Typography>
          </Box>
          <Box sx={{ mb: 6, display: 'flex', justifyContent: 'center' }}>
            <Typography variant='h5' sx={{ fontWeight: 600, marginBottom: 1.5 }}>
              Seja bem vindo
            </Typography>
          </Box>
          <Box component="form" autoComplete='off' onSubmit={handleSubmit(handleOnLogin)} sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            gap: 4,
            p: 1
          }}>

            <Controller
              name="username"
              control={methods.control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => {
                return (
                  <TextField
                    ref={ref}
                    error={!!error}
                    helperText={error?.message}
                    {...field}
                    value={field.value || ''}
                    autoFocus
                    fullWidth
                    label='Nome de Usuário'
                    autoComplete="new-password"
                  />
                )
              }}
            />

            <Controller
              name="password"
              control={methods.control}
              render={({ field: { ref, ...field }, fieldState: { error } }) => {
                return (
                  <FormControl
                    error={!!error}
                    fullWidth
                    variant='outlined'
                  >
                    <InputLabel htmlFor="outlined-adornment-password">Senha</InputLabel>
                    <OutlinedInput
                      {...field}
                      id="outlined-adornment-password"
                      type={values.showPassword ? 'text' : 'password'}
                      ref={ref}
                      autoComplete="new-password"
                      value={field.value || ''}
                      endAdornment={
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {values.showPassword ? <EyeOutline /> : <EyeOffOutline />}
                          </IconButton>
                        </InputAdornment>
                      }
                      label="Senha"
                    />
                  </FormControl>
                )
              }}
            />

            <Button
              disabled={methods.formState.isSubmitting}
              fullWidth
              size='large'
              variant='contained'
              type="submit"
              sx={{ marginBottom: 7 }}
            >
              Entrar
            </Button>
          </Box>
        </CardContent>
      </Card>
      <FooterIllustrations />
    </Box>
  )
}

Home.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

export default Home


export const getServerSideProps: GetServerSideProps = async context => {
  const { 'token': token } = parseCookies(context)
  if (token) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false
      }
    }
  }
  return {
    props: {}
  }
}