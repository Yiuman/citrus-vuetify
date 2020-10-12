<template>
  <v-card class="height-100pc">
    <crud-table
      namespace="/rest/purchases"
      :exclude-actions="['edit']"
      :show-expand="true"
      @action="actionEvent"
      ref="$crud$"
    >
      <template v-slot:add-dialog>
        <simple-form-navigation
          v-model="addDialog"
          width="800"
          :successAction="saveEntity"
          @callback="reload"
        >
          <v-card elevation="0">
            <v-card-subtitle>基础信息</v-card-subtitle>
            <v-card-text>
              <v-row class="my-n6">
                <v-col md="6">
                  <v-text-field
                    label="进货单号"
                    clearable
                    v-model="purchaseModel.purchaseNo"
                  />
                </v-col>
                <v-col md="6">
                  <!-- <v-text-field
                    label="进货日期"
                    clearable
                    v-model="purchaseModel.purchaseDate"
                  /> -->
                  <date-picker label="进货日期" v-model="purchaseModel.purchaseDate"></date-picker>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider class="mx-4" />

            <v-card-subtitle color="primary">商品信息</v-card-subtitle>
            <v-card-text>
              <v-fab-transition>
                <v-btn
                  color="primary"
                  dark
                  absolute
                  right
                  fab
                  x-small
                  @click="addGoods"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-fab-transition>
              <v-data-table
                disable-pagination
                hide-default-footer
                :headers="goodsHeaders"
                :items="purchaseModel.purchaseGoods"
              >
                <template v-slot:item.index="{ item }">
                  {{ purchaseModel.purchaseGoods.indexOf(item) + 1 }}
                </template>
                <template v-slot:item.goodsName="props">
                  <v-edit-dialog :return-value.sync="props.item.goodsName">
                    {{ props.item.goodsName }}
                    <template v-slot:input>
                      <v-autocomplete
                        hide-no-data
                        v-model="selectedGoods"
                        label="商品"
                        clearable
                        item-text="productName"
                        :items="goodsItems"
                        :loading="searchLoading"
                        return-object
                        @keydown.enter="confirmSelectGoods(props.item)"
                      >
                      </v-autocomplete>
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:item.price="props">
                  <v-edit-dialog :return-value.sync="props.item.price">
                    {{ props.item.price }}
                    <template v-slot:input>
                      <v-text-field
                        label="单价"
                        type="number"
                        v-model="props.item.price"
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:item.amount="props">
                  <v-edit-dialog :return-value.sync="props.item.amount">
                    {{ props.item.amount }}
                    <template v-slot:input>
                      <v-text-field
                        label="数量"
                        type="number"
                        v-model="props.item.amount"
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:item.total="{ item }">
                  {{ item.price * item.amount }}
                </template>
                <template v-slot:item.data-item-reduce="{ item }">
                  <v-btn
                    v-if="purchaseModel.purchaseGoods.length > 1"
                    width="0"
                    height="0"
                    tile
                    fab
                    @click="reduceGoods(item)"
                  >
                    <v-icon color="error" small>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </simple-form-navigation>
      </template>

      <template v-slot:data-expanded-item="{ headers, item }">
        <div>{{ headers.length }} {{ item }}</div>
      </template>
    </crud-table>
  </v-card>
</template>

<script>
  import CrudTable from "@/components/CrudTable";
  import SimpleFormNavigation from "@/components/SimpleFormNavigation";
  import request from "../../utils/request";
  const DEFAULT_GOODS = {
    goodsId: "-",
    goodsName: "-",
    goodsNo: "-",
    price: 0,
    amount: 0,
  };
  export default {
    components: { CrudTable, SimpleFormNavigation },
    data: () => ({
      addDialog: false,
      purchaseModel: {
        purchaseNo: "",
        purchaseDate: null,
        purchaseGoods: [
          {
            goodsId: "-",
            goodsName: "-",
            goodsNo: "-",
            price: 0,
            amount: 0,
          },
        ],
      },
      goodsHeaders: [
        {
          text: "序号",
          align: "start",
          sortable: false,
          value: "index",
          width: "100",
        },
        {
          text: "商品名",
          align: "start",
          sortable: false,
          value: "goodsName",
        },
        { text: "货号", value: "goodsNo", sortable: false },
        { text: "单价", value: "price", sortable: false },
        { text: "数量", value: "amount", sortable: false },
        { text: "合计", value: "total", sortable: false },
        { text: "", value: "data-item-reduce", sortable: false, width: "1" },
      ],
      goodsItems: [],
      searchLoading: false,
      selectedGoods: {},
    }),
    watch: {},
    mounted() {
      request
        .get("/rest/products/selections")
        .then((result) => {
          this.goodsItems = [...result];
          console.warn(this.goodsItems);
        })
        .catch((err) => {
          console.warn(err);
        });
    },
    methods: {
      actionEvent(action, item) {
        switch (action) {
          case "add":
            this.addDialog = true;
            console.warn(item);
            break;
          case "edit":
            this.addDialog = true;
            console.warn(item);
            break;
          default:
            break;
        }
      },
      saveEntity() {},
      reload() {
        this.$refs.$crud$.reload;
      },
      confirmSelectGoods(item) {
        item.goodsId = this.selectedGoods.productId;
        item.goodsName = this.selectedGoods.productName;
        item.goodsNo = this.selectedGoods.productNo;
        item.price = this.selectedGoods.buyPrice;
        this.$nextTick(() => {
          this.selectedGoods = null;
        });
      },
      addGoods() {
        this.purchaseModel.purchaseGoods.push(
          JSON.parse(JSON.stringify(DEFAULT_GOODS))
        );
      },
      reduceGoods(item) {
        const editedIndex = this.purchaseModel.purchaseGoods.indexOf(item);
        this.purchaseModel.purchaseGoods.splice(editedIndex, 1);
        console.warn(item);
      },
    },
  };
</script>

<style></style>
