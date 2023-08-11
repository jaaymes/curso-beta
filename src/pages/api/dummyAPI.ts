import { RESTDataSource } from '@apollo/datasource-rest'

export class DummyAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.NEXT_PUBLIC_API_URL
  }

  async getUsers({ limit, skip }: { limit: number, skip: number }) {
    return await this.get(`users?limit=${limit || 10}&skip=${skip || 0}`)
  }

  async getUser(id: number) {
    return await this.get(`users/${id}`)
  }

  async handleSearchUsersFilter({ key, value, limit }: { key: string, value: string, limit: number }) {
    return await this.get(`users/filter?key=${key}&value=${value}&limit=${limit || 10}`).then((res) => res.users)
  }

  async handleSearch({ q }: { q: string }) {
    return await this.get(`users/search?q=${q}`).then((res) => res.users)
  }

  async getProducts({ limit, skip }: { limit: number, skip: number }) {
    return await this.get(`products?limit=${limit || 10}&skip=${skip || 0}`)
  }

  async getProduct(id: number) {
    return await this.get(`products/${id}`)
  }

  async handleSearchProductsFilter({ key, value, limit }: { key: string, value: string, limit: number }) {
    return await this.get(`products/filter?key=${key}&value=${value}&limit=${limit || 10}`).then((res) => res.products)
  }

  async handleSearchProducts({ q }: { q: string }) {
    return await this.get(`products/search?q=${q}`).then((res) => res.products)
  }
}