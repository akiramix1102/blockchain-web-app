<template>
  <div class="trade">
    <div class="content">
      <div class="trade-lynk">
        <div class="text-regular text-xs jc-space-between be-flex label">
          <span class="text-available">Available: <span class="available-number">0.25746 USDT</span></span>
          <span class="btn-deposit cursor">Deposit</span>
        </div>
        <base-input :textPrefix="'Price'" :textSuffix="'USDT'" v-model="priceBuy"></base-input>
        <base-input :textPrefix="'Amount'" :textSuffix="'LYNK'" v-model="amountBuy"></base-input>
        <div class="jc-space-between mb-16 tab-amount">
          <div
            class="text-base cursor amount-item"
            v-for="amount in selectAmount"
            :key="amount"
            :class="amount === selectedBuyAmount ? 'active' : null"
            @click="handleSelectBuyAmount(amount)"
          >
            <div class="amount-item__cover">
              <span class="text-regular text-base1">{{ amount }}%</span>
            </div>
          </div>
        </div>
        <base-input :textPrefix="'Total'" :textSuffix="'USDT'" v-model="totalBuy"></base-input>
        <div class="btn-confirm">
          <button class="btn-confirm__text text-base text-regular cursor btn-login" v-if="!isLogin">
            <router-link :to="{ path: '/login' }" class="text-decoration-none"><span class="text-login">Log In</span></router-link>
            <span style="color: #999999"> or</span>
            <router-link :to="{ path: '/signup' }" class="text-decoration-none"><span class="text-login"> Register Now</span></router-link>
          </button>
          <button class="text-confirm text-base text-bold btn-buy cursor" v-else @click="handleBuy">Buy LYNK</button>
        </div>
      </div>
      <div class="trade-lynk">
        <div class="text-regular text-xs jc-space-between be-flex label">
          <span class="text-available">Available: <span class="available-number">0.25746 USDT</span></span>
          <span class="btn-deposit cursor">Deposit</span>
        </div>
        <base-input :textPrefix="'Price'" :textSuffix="'USDT'" v-model="priceSell"></base-input>
        <base-input :textPrefix="'Amount'" :textSuffix="'LYNK'" v-model="amountSell"></base-input>
        <div class="jc-space-between mb-16 tab-amount">
          <div
            class="text-base cursor amount-item"
            v-for="amount in selectAmount"
            :key="amount"
            :class="amount === selectedSellAmount ? 'active' : null"
            @click="handleSelectSellAmount(amount)"
          >
            <div class="amount-item__cover">
              <span class="text-regular text-base1">{{ amount }}%</span>
            </div>
          </div>
        </div>
        <base-input :textPrefix="'Total'" :textSuffix="'USDT'" v-model="totalSell"></base-input>
        <div class="btn-confirm">
          <button class="btn-confirm__text text-base text-regular cursor btn-login" v-if="!isLogin">
            <router-link :to="{ path: '/login' }" class="text-decoration-none"><span class="text-login">Log In</span></router-link>
            <span style="color: #999999"> or</span>
            <router-link :to="{ path: '/signup' }" class="text-decoration-none"><span class="text-login"> Register Now</span></router-link>
          </button>
          <button class="text-confirm text-base text-bold btn-sell cursor" v-else>Sell LYNK</button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { Vue, Component } from 'vue-property-decorator'
  import BaseInput from '@/components/base/input/BaseInput.vue'
  import { namespace } from 'vuex-class'
  import TradeRepository from '@/services/repositories/trade'
  import getRepository from '@/services'
  const bcExchange = namespace('bcExchange')

  const apiExchange: TradeRepository = getRepository('trade')

  @Component({ components: { BaseInput } })
  export default class TradeLimit extends Vue {
    @bcExchange.Getter('isLogin') isLogin!: boolean
    select = ''
    selectAmount: number[] = [25, 50, 75, 100]
    selectedBuyAmount: any = 0
    selectedSellAmount: any = 0

    totalBuy = ''
    priceBuy = ''
    amountBuy = ''
    totalSell = ''
    priceSell = ''
    amountSell = ''

    form = {
      feePercent: 0,
      discountPercent: 0
    }

    handleSelectBuyAmount(amount: number): void {
      this.selectedBuyAmount = amount
    }
    handleSelectSellAmount(amount: number): void {
      this.selectedSellAmount = amount
    }

    handleSelectInput(value: any): void {
      console.log('>>> / file: Trade.vue / line 143 / value', value)
      //
    }

    async handleBuy(): Promise<void> {
      const params = {
        baseCurrency: 'USDT',
        quoteCurrency: 'LYNK',
        type: 'LIMIT',
        quantity: this.amountBuy,
        price: this.priceBuy,
        amount: this.totalBuy,
        feePercent: 0,
        discountPercent: 0
      }

      const result = await apiExchange.addNewCommand(params)
      console.log('>>> / file: TradeLimit.vue / line 126 / result', result)
    }
  }
</script>
<style lang="scss" scoped>
  .trade {
    .content {
      display: flex;
      flex-direction: row;
      height: 340px;
      width: 100%;

      .trade-lynk {
        padding: 32px 12px 24px 16px;

        width: 50%;
        .label {
          margin-bottom: 4px;
          .text-available {
            color: var(--color-text-secondary);
            .available-number {
              color: var(--color-text-primary);
            }
          }
          .btn-deposit {
            color: var(--color-light-blue);
          }
        }
        .price-market {
          ::v-deep.read-only {
            .el-input__suffix {
              .el-input__suffix-inner {
                color: var(--color-text-secondary) !important;
              }
            }
          }
        }
        .tab-amount {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr;
          gap: 8px;
          .amount-item {
            padding: 4px 0;
            flex: 1;
            color: var(--color-text-secondary);
            text-align: center;
            background-color: var(--color-background-element);
            border-radius: 4px;
            &:last-child {
              margin-right: 0;
            }
          }

          .active {
            background-image: var(--color-active-primary);
            padding: 1px;
            border-radius: 6px;
            color: var(--color-text-primary);
            .amount-item__cover {
              width: 100%;
              height: 100%;
              background-color: var(--color-background-element);
              border-radius: inherit;
              display: flex;
              align-items: center;
              justify-content: center;
            }
          }
        }

        .btn-confirm {
          .text-confirm {
            height: 40px;
            width: 100%;
            border-radius: 6px;
            border: 0;
            color: var(--color-text-primary);
          }
          .btn-confirm__text {
            height: 40px;
            width: 100%;
            border-radius: 6px;
            border: 0;

            .text-login {
              background: var(--color-active-primary);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
            }
          }
          .btn-buy {
            background: var(--color-buy-primary);
            &:hover {
              opacity: 0.9;
            }
          }
          .btn-login {
            background: #21242a;
          }
          .btn-sell {
            background: var(--color-sell-primary);
            &:hover {
              opacity: 0.9;
            }
          }
        }
      }
      .trade-lynk {
        &:last-child {
          padding: 32px 16px 24px 12px;
        }
      }
    }
  }
</style>
