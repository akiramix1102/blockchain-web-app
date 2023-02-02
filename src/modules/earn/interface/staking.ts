export interface IStakingTransaction {
  id: number
  transactionCode: string
  transactionType: string
  refTransactionCode?: null
  transactionDate: number
  userId: number
  minQuantity?: null
  userName: string
  userAddress?: null
  currency: string
  currencyName?: null
  network: string
  planId: number
  planName: string
  aprPercent: number
  durationType: string
  unstakeDay?: null
  durations: number
  interestType: string
  amount: number
  usdExchangeRate: number
  endStakeDate: number
  status: string
  createdAt: number
  updatedAt?: null
}
