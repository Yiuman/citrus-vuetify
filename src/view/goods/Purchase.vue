// 采购管理
<template>
  <v-card class="purchase height-100pc">
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
            <v-card-subtitle>采购单信息</v-card-subtitle>
            <v-card-text>
              <v-row class="my-n6">
                <v-col md="6">
                  <v-text-field
                    label="进货单号"
                    placeholder="默认自动生成"
                    clearable
                    v-model="purchaseModel.purchaseNo"
                  />
                </v-col>
                <v-col md="6">
                  <date-picker
                    label="进货日期"
                    v-model="purchaseModel.purchaseDate"
                  ></date-picker>
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider class="mx-4" />

            <v-card-subtitle color="primary">
              <v-row>
                <v-col>商品信息</v-col>
                <v-col align="end" class="font-weight-black"
                  >总计：{{ purchaseTotal }}</v-col
                >
              </v-row>
            </v-card-subtitle>
            <v-card-text class="goods-table">
              <v-fab-transition>
                <v-btn
                  color="primary"
                  dark
                  absolute
                  right
                  fab
                  x-small
                  @click="addProduct"
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-fab-transition>
              <v-data-table
                disable-pagination
                hide-default-footer
                :headers="productHeaders"
                :items="purchaseModel.products"
              >
                <template v-slot:item.index="{ item }">
                  {{ purchaseModel.products.indexOf(item) + 1 }}
                </template>
                <template v-slot:item.productName="props">
                  <v-edit-dialog
                    large
                    save-text="确定"
                    cancel-text="取消"
                    @save="confirmSelectsProduct(props.item)"
                  >
                    <span class="font-editable">{{
                      props.item.productName
                    }}</span>
                    <template v-slot:input>
                      <v-autocomplete
                        hide-no-data
                        v-model="selectedProduct"
                        label="商品"
                        clearable
                        item-text="productName"
                        :items="productItems"
                        :loading="searchLoading"
                        return-object
                        @keydown.enter="confirmSelectsProduct(props.item)"
                      >
                      </v-autocomplete>
                    </template>
                  </v-edit-dialog>
                </template>
                <template v-slot:item.price="props">
                  <v-edit-dialog large save-text="确定" cancel-text="取消">
                    <span class="font-editable"> {{ props.item.price }}</span>
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
                  <v-edit-dialog large save-text="确定" cancel-text="取消">
                    <span class="font-editable">{{ props.item.amount }}</span>
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
                    v-if="purchaseModel.products.length > 1"
                    width="0"
                    height="0"
                    tile
                    fab
                    @click="reduceProduct(item)"
                  >
                    <v-icon color="error" small>mdi-close</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
          <v-divider class="mx-4" />
        </simple-form-navigation>
      </template>

      <template v-slot:data-expanded-item="{ item }">
        <v-simple-table>
          <template v-slot:default>
            <thead>
              <tr>
                <th>货名</th>
                <th>进货价</th>
                <th>数量</th>
                <th>进货总价</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in item.products" :key="product.productId">
                <td>{{ product.productName }}</td>
                <td>{{ product.price }}</td>
                <td>{{ product.amount }}</td>
                <td>{{ product.total }}</td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <!-- {{ item.products }} -->
      </template>
    </crud-table>
  </v-card>
</template>

<script>
  import CrudTable from "@/components/CrudTable";
  import SimpleFormNavigation from "@/components/SimpleFormNavigation";
  import request from "../../utils/request";
  import moment from "moment"; //导入文件
  const DEFAULT_PRODUCT = {
    productId: 0,
    productName: "-",
    productNo: "-",
    price: 0,
    amount: 0,
  };
  const DEFAULT_PURCHASE_MODEL = {
    purchaseId: null,
    purchaseNo: "",
    purchaseDate: null,
    products: [
      {
        productId: 0,
        productName: "-",
        productNo: "-",
        price: 0,
        amount: 0,
      },
    ],
  };
  export default {
    components: { CrudTable, SimpleFormNavigation },
    data: () => ({
      addDialog: false,
      purchaseModel: JSON.parse(JSON.stringify(DEFAULT_PURCHASE_MODEL)),
      productHeaders: [
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
          value: "productName",
        },
        { text: "货号", value: "productNo", sortable: false },
        { text: "单价", value: "price", sortable: false },
        { text: "数量", value: "amount", sortable: false },
        { text: "合计", value: "total", sortable: false },
        { text: "", value: "data-item-reduce", sortable: false, width: "1" },
      ],
      productItems: [],
      searchLoading: false,
      selectedProduct: {},
    }),
    computed: {
      purchaseTotal() {
        let total = 0;
        if (this.purchaseModel.products) {
          this.purchaseModel.products.forEach((item) => {
            total += Number(item.price * item.amount);
          });
        }

        return total;
      },
    },
    mounted() {
      request
        .get("/rest/products/selections")
        .then((result) => {
          this.productItems = [...result];
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
            this.purchaseModel = JSON.parse(
              JSON.stringify(DEFAULT_PURCHASE_MODEL)
            );
            this.purchaseModel.purchaseDate = moment(new Date()).format(
              "YYYY-MM-DD"
            );
            break;
          case "edit":
            this.purchaseModel.purchaseId = item.purchaseId;
            this.purchaseModel.purchaseNo = item.purchaseNo;
            this.purchaseModel.purchaseDate = item.purchaseDate;
            this.purchaseModel.products = item.products;
            this.addDialog = true;
            break;
          default:
            break;
        }
      },
      saveEntity() {
        return new Promise((resolve) => {
          if (this.beforeSave()) {
            this.getService()
              .save(this.purchaseModel)
              .then(() => {
                this.$toast.info("操作成功", {
                  position: "top-center",
                  type: "success",
                  icon: "check-bold",
                });
                resolve();
              })
              .catch((err) => {
                this.$toast.error(err.message, {
                  position: "top-center",
                  type: "error",
                  icon: "alert-circle",
                });
              });
          }
        });
      },
      beforeSave() {
        let validated = true;
        let productCheckIndex = [];
        this.purchaseModel.products.forEach((element, index) => {
          if (!element.productId || element.productId === 0) {
            validated = false;
            productCheckIndex.push(index + 1);
          }
        });

        if (!validated) {
          this.$toast.warning(
            `请完善第${productCheckIndex.join(",")}个商品信息`,
            {
              position: "top-center",
            }
          );
        }
        return validated;
      },
      reload() {
        this.$refs.$crud$.reload();
      },
      confirmSelectsProduct(item) {
        if (!this.selectedProduct) {
          item = JSON.parse(JSON.stringify(DEFAULT_PRODUCT));
        } else {
          item.productId = this.selectedProduct.productId;
          item.productName = this.selectedProduct.productName;
          item.productNo = this.selectedProduct.productNo;
          item.price = this.selectedProduct.buyPrice;
        }

        this.$nextTick(() => {
          this.selectedProduct = null;
        });
      },
      addProduct() {
        this.purchaseModel.products.push(
          JSON.parse(JSON.stringify(DEFAULT_PRODUCT))
        );
      },
      reduceProduct(item) {
        const editedIndex = this.purchaseModel.products.indexOf(item);
        this.purchaseModel.products.splice(editedIndex, 1);
      },
      getService() {
        return this.$refs["$crud$"].crudService;
      },
    },
  };
</script>

<style>
  .v-data-table__wrapper tbody tr:nth-child(2n + 1) {
    background: #f8f8f8 !important;
  }
  .font-editable {
    color: #80abfa;
    font-weight: bold;
  }
</style>
