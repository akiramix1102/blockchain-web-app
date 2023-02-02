<template>
  <div class="detail-property">
    <div class="detail-property__left">
      <div class="header">
        <h3 class="header-5 text-semibold mb-24 text-title">
          {{ $t('market-detail.des-title') }}
        </h3>
        <p class="body-base location">{{ data.product && data.product.address }}, {{ data.product && data.product.cityName }}</p>
        <div class="be-flex jc-space-between">
          <div class="be-flex info">
            <div class="info-item">
              <base-icon icon="icon-bed" size="24" class="lh-default" />
              <span>{{ data.product && data.product.numOfBedroom }}</span>
            </div>
            <div class="line"></div>
            <div class="info-item">
              <base-icon icon="icon-shower" size="24" class="lh-default" />
              <span>{{ data.product && data.product.numOfBathroom }}</span>
            </div>
            <div class="line"></div>
            <div class="info-item">
              <base-icon icon="icon-area" size="24" class="lh-default" />
              <span>{{ data.product && data.product.numOfSquare | convertAmountDecimal('AREA') }} m2</span>
            </div>
            <!-- <div class="line"></div>
            <div class="info-item">
              <base-icon icon="icon-dollar" size="24" class="lh-default" />
              <span>{{ data.product && data.product.tokenAmount | convertAmountDecimal('USD') }} LYNK</span>
            </div> -->
          </div>
          <div class="property-id">
            <p>
              {{ $t('market-detail.property_id') }}: <b>{{ data.product && data.product.propertyCode }}</b>
            </p>
          </div>
        </div>
      </div>
      <detail-infomation v-if="data && data.product" :project="data.product" :feature-list="data.featureList" :metaDataList="data.metaDataList" :id="1" />
      <detail-attachment v-if="data && data.attachmentList && data.attachmentList.length" :attachmentList="data.attachmentList" />
      <detail-floor v-if="data && data.floorPlanList && data.floorPlanList.length" :floorPlanList="data.floorPlanList" />
      <detail-video :mediaList="data.mediaList" />
      <detail-virtual :mediaList="data.mediaList" />
      <detail-map :project="data.product" />
      <detail-project-info :propertyProject="data.propertyProject" />
      <balance-payback :target="data.target && data.target.paybackBalances" />
    </div>
    <div class="detail-property__right">
      <detail-target :target="data.target" />
      <detail-analytic :target="data.target" />
      <detail-expense :target="data.target" />
      <monthly-expense :target="data.target && data.target.monthlyExpenses" />
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Prop, Vue } from 'vue-property-decorator'

  import DetailInfomation from '@/modules/marketplace/home/components/detail-project/DetailInfomation.vue'
  import DetailAttachment from '@/modules/marketplace/home/components/detail-project/DetailAttachment.vue'
  import DetailFloor from '@/modules/marketplace/home/components/detail-project/DetailFloor.vue'
  import DetailVideo from '@/modules/marketplace/home/components/detail-project/DetailVideo.vue'
  import DetailVirtual from '@/modules/marketplace/home/components/detail-project/DetailVirtual.vue'
  import DetailMap from '@/modules/marketplace/home/components/detail-project/DetailMap.vue'
  import DetailProjectInfo from '@/modules/marketplace/home/components/detail-project/DetailProjectInfo.vue'
  import DetailTarget from '@/modules/marketplace/home/components/detail-project/DetailTarget.vue'
  import DetailAnalytic from '@/modules/marketplace/home/components/detail-project/DetailAnalytic.vue'
  import DetailExpense from '@/modules/marketplace/home/components/detail-project/DetailExpense.vue'
  import MonthlyExpense from '@/modules/marketplace/home/components/detail-project/MonthlyExpense.vue'
  import BalancePayback from '@/modules/marketplace/home/components/detail-project/BalancePayback.vue'

  @Component({
    components: {
      DetailInfomation,
      DetailAttachment,
      DetailExpense,
      MonthlyExpense,
      DetailAnalytic,
      DetailFloor,
      DetailVideo,
      DetailVirtual,
      DetailMap,
      DetailProjectInfo,
      DetailTarget,
      BalancePayback
    }
  })
  export default class ListProperty extends Vue {
    @Prop({ required: false, type: Object, default: () => ({}) }) data!: Record<string, any>
  }
</script>

<style scoped lang="scss">
  ::v-deep.detail-property {
    display: flex;
    margin-top: 40px;
    justify-content: space-between;
    &__left {
      width: 692px;
      .header {
        .location {
          color: var(--bc-text-discript3);
          opacity: 0.7;
          margin-bottom: 16px;
        }

        .info {
          align-items: center;
          margin-bottom: 16px;

          .info-item {
            display: flex;
            align-items: center;

            span:last-child {
              font-size: 16px;
              line-height: 24px;
              padding-left: 8px;
            }
          }

          .line {
            margin: 0 8px;
            width: 1px;
            height: 18px;
            background: var(--bc-text-market-primary);
            opacity: 0.7;
          }
        }
        .property-id {
          font-weight: 500;
          font-size: 14px;
          line-height: 24px;
          color: #5b616e;

          b {
            font-weight: 600;
            font-size: 16px;
            line-height: 24px;
            text-align: right;
            color: #0e0b23;
          }
        }
      }
      .detail-infomation {
        .detail-des {
          .text-title {
            display: none;
          }
        }
        .wrap-collapse {
          .collapse {
            .el-collapse-item {
              &__wrap {
                .el-collapse-item__content {
                  .content-item {
                    width: 49.999%;
                  }
                }
              }
            }
          }
        }
      }
      .detail-attach {
        .collapse-detail {
          .el-collapse-item {
            &__wrap {
              .el-collapse-item__content {
                .project-attach {
                  width: 49.999% !important;
                }
              }
            }
          }
        }
      }

      .wrap-collapse {
        .collapse {
          .collapse-item {
            &__header {
              font-size: 20px;
              line-height: 20px;
            }
          }
        }
      }
    }

    &__right {
      width: 421px;

      .body-small {
        font-size: 15px;
      }
    }
  }
</style>
