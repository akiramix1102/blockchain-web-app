import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export default class TradeRepository extends BaseRepository {
  constructor() {
    super('/exchange/api/v1')
  }

  async getOderSearch(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`https://exchange:6600/exchange/api/v1/order/search`, data)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
  async cancelOrder(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`https://exchange:6600/exchange/api/v1/order/cancel`, data)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }

  async addNewCommand(data: Record<string, any>): Promise<any> {
    try {
      const rs = await request.post(`${this.prefix}/order/buy`, data)
      return Promise.resolve(rs.data.data)
    } catch (error) {
      console.log(error)
      return Promise.reject(error)
    }
  }
}
