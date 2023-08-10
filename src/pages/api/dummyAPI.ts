import { RESTDataSource } from '@apollo/datasource-rest'

export class DummyAPI extends RESTDataSource {
  constructor() {
    super()
    this.baseURL = process.env.NEXT_PUBLIC_API_URL
  }

  async getUsers() {
    return await this.get('users').then((res) => res.users)
  }

  async handleSearchUsers({ key, value, limit }: { key: string, value: string, limit: number }) {
    return await this.get(`users/filter?key=${key}&value=${value}&limit=${limit || 10}`).then((res) => res.users)
  }
}