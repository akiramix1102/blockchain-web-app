<template>
  <div class="footer">
    <div class="footer-content">
      <div class="group-trade">
        <div class="btn-buy" @click="buyToken">Buy</div>
        <div class="btn-sell">Sell</div>
      </div>
      <div class="footer-last">
        <span class="d-ib mr-24 cursor text-hyperlink" @click="handleClickTerm">{{ $t('footer.terms') }}</span>
        <span>{{ urlSystem['system.token.company.address'] }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue, Mixins } from 'vue-property-decorator'
  import { namespace } from 'vuex-class'
  import TradeDrawer from '@/modules/exchanges/components/base/TradeDrawer.vue'
  import BaseDrawer from '@/components/base/drawer/BaseDrawer.vue'
  import DrawerMixin from '@/mixins/drawer'
  const beBase = namespace('beBase')
  @Component({ components: { TradeDrawer } })
  export default class GroupButtonFooter extends Mixins(DrawerMixin) {
    visible = false
    @beBase.State('urlSystem') urlSystem!: Record<string, any>

    handleClickTerm(): void {
      window.open(`${this.urlSystem['system.token.terms']}`)
    }
    buyToken() {
      this.visible = true
    }
  }
</script>

<style scoped lang="scss">
  .group-trade {
    background-color: var(--color-background);
    height: 72px;
    display: flex;
    justify-content: space-between;
    padding: 16px 20px;
    > div {
      &:first-child {
        margin-right: 12px;
      }
      flex: 1;
      text-align: center;
      border-radius: 4px;
      font-size: 16px;
      line-height: 40px;
      font-weight: 600;
      color: var(--color-text-primary);
    }
    .btn-buy {
      background-color: var(--color-buy-primary);
    }
    .btn-sell {
      background-color: var(--color-sell-primary);
    }
  }
  .footer-last {
    background-color: var(--color-background-element);
    display: flex;
    padding: 8px;
    height: 32px;
    justify-content: space-between;
    > span {
      white-space: nowrap;
      font-size: 12px;
      line-height: 16px;
    }
    &:first-child {
      color: var(--color-light-blue);
    }
    &:last-child {
      color: var(--color-text-secondary);
    }
  }
</style>
