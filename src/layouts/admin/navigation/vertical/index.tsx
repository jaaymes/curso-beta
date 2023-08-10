import { CartVariant } from 'mdi-material-ui'
import AccountPlusOutline from 'mdi-material-ui/AccountPlusOutline'
import HomeOutline from 'mdi-material-ui/HomeOutline'
import { VerticalNavItemsType } from '../../types'

const navigation = (): VerticalNavItemsType => {
  return [
    {
      title: 'Inicio',
      icon: HomeOutline,
      path: '/dashboard'
    },
    {
      sectionTitle: 'Listas'
    },
    {
      title: 'Usuários',
      icon: AccountPlusOutline,
      path: '/users',
    },
    {
      sectionTitle: 'Cadastro'
    },
    {
      title: 'Produtos',
      icon: CartVariant,
      path: '/products'
    },
  ]
}

export default navigation
