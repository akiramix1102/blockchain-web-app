import request from '@/plugins/request'
import { BaseRepository } from '@/services/base'

export class EarnRepository extends BaseRepository {
  constructor() {
    super('main/api/v1')
  }

  async getAllStakingPack(params?: Record<string, any>): Promise<any> {
    try {
      const result = await request.get(`${this.prefix}/staking-plans/0`, { params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getStakingPackDetail(stakingId: number): Promise<any> {
    try {
      const result = await request.get(`${this.prefix}/staking-plans/${stakingId}`)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async getTransactionStaking(stakingPlanId: number, userId: number, params: Record<string, any>): Promise<any> {
    try {
      const result = await request.get(`${this.prefix}/staking-transactions/${stakingPlanId}/${userId}`, { params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
  async createNewStaking(data: Record<string, any>): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/staking-transactions/stake`, data)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  async unstake(data: Record<string, any>): Promise<any> {
    try {
      const result = await request.post(`${this.prefix}/staking-transactions/unstake`, data)
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }

  // ================================================================= distric params
  async getTypeDistricParams(params: Record<string, any>): Promise<any> {
    try {
      const result = await request.get(`${this.prefix}/district-params/type`, { params })
      return Promise.resolve(result.data.data)
    } catch (error) {
      return Promise.reject(error)
    }
  }
}
