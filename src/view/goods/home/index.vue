<template>
  <div class="height-100pc mx-3 goods-home">
    <v-row justify="center">
      <template v-for="(item, itemIndex) in indicators">
        <v-col :key="itemIndex" cols="12" md="3">
          <v-hover v-slot="{ hover }">
            <v-card
              class="item-card"
              :elevation="hover ? 12 : 2"
              :class="{ 'on-hover': hover }"
            >
              <v-row class="mx-3">
                <v-col md="6" align="center">
                  <v-icon :color="item.color" size="100">{{
                    item.icon
                  }}</v-icon>
                </v-col>
                <v-col md="6">
                  <v-row justify="center" class="text-h5">{{
                    item.title
                  }}</v-row>
                  <v-row justify="center" class="ml-n1 mt-5 text-h7">{{
                    item.text
                  }}</v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-hover>
        </v-col>
      </template>
    </v-row>

    <div>
      <v-card class="pt-4 my-2" v-if="chartLoaded">
        <v-row class="ml-3">
          近7天业务量
        </v-row>
        <line-chart
          width="98%"
          :chart-data="lineChartData"
          :indicators="lineChartIndicators"
          :dimension="dimension"
        ></line-chart>
      </v-card>
    </div>
  </div>
</template>

<script>
  import { getHomePanels, getWeekAnalysis } from "@/api/goods";
  import LineChart from "@/view/goods/home/LineChart";

  const lineChartData = {
    purchases: [100, 120, 161, 134, 105, 160, 165],
    sales: [120, 82, 91, 154, 162, 140, 145],
    expenses: [110, 70, 150, 50, 46, 80, 111],
    profits: [99, 55, 110, 67, 88, 44, 76],
  };
  const DEFUALT_PANELS = [
    { icon: "mdi-dolly", color: "blue", title: "商品", text: "4(件)" },
    {
      icon: "mdi-cart-arrow-up",
      color: "cyan",
      title: "总销售额",
      text: "1100.00（元）",
    },
    {
      icon: "mdi-cash-refund",
      color: "red",
      title: "支出",
      text: "568.20（元）",
    },
    {
      icon: "mdi-currency-cny",
      color: "amber",
      title: "利润",
      text: "-368.20（元）",
    },
  ];
  export default {
    name: "GoodsHome",
    components: {
      LineChart,
    },
    data: () => ({
      lineChartData,
      indicators: DEFUALT_PANELS,
      lineChartIndicators: ["采购额", "销售额", "支出", "利润"],
      dimension: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
      chartLoaded: false,
    }),
    mounted() {
      getHomePanels()
        .then((homePanels) => {
          this.indicators = homePanels;
        })
        .catch((err) => {
          console.warn(err);
        });

      getWeekAnalysis()
        .then((result) => {
          this.lineChartIndicators = result.indicators;
          this.dimension = result.dimension;
          this.lineChartData = {
            purchases: result.data[0],
            sales: result.data[1],
            expenses: result.data[2],
            profits: result.data[3],
          };
          this.$nextTick(() => {
            this.chartLoaded = true;
          });
        })
        .catch((err) => {
          this.chartLoaded = true;
          console.warn(err);
        });
    },
  };
</script>

<style>
  .item-card {
    transition: opacity 0.4s ease-in-out;
  }

  .item-card:not(.on-hover) {
    opacity: 0.6;
  }

  .line-chart {
    background: #fff;
  }
</style>
