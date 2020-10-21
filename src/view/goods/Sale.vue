// 销售管理
<template>
  <v-card class="sale height-100pc">
    <crud-table
      namespace="/rest/sales"
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
            <v-card-subtitle>销售单信息</v-card-subtitle>
            <v-card-text>
              <v-row class="my-n6">
                <v-col md="6">
                  <v-text-field
                    label="销售单号"
                    clearable
                    v-model="saleModel.saleNo"
                  />
                </v-col>
                <v-col md="6">
                  <date-picker
                    label="销售日期"
                    v-model="saleModel.saleDate"
                  ></date-picker>
                </v-col>
              </v-row>
              <v-row>
                <v-col md="12">
                  <v-text-field
                    label="客户联系方式"
                    clearable
                    v-model="saleModel.contactInfo"
                  />
                </v-col>
              </v-row>
              <v-row class="my-n6">
                <v-col md="12">
                  <v-textarea
                    label="售货地址"
                    clearable
                    rows="1"
                    v-model="saleModel.address"
                  />
                </v-col>
              </v-row>
            </v-card-text>

            <v-divider class="mx-4" />

            <v-card-subtitle color="primary">
              <v-row>
                <v-col>商品信息</v-col>
                <v-col align="end" class="font-weight-black"
                  >总计：{{ saleTotal }}</v-col
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
                :items="saleModel.products"
              >
                <template v-slot:item.index="{ item }">
                  {{ saleModel.products.indexOf(item) + 1 }}
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
                        :max="props.item.inventory"
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
                    v-if="saleModel.products.length > 1"
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
                <th>单价</th>
                <th>数量</th>
                <th>总价</th>
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
  const DEFAULT_PRODUCT = {
    productId: "-",
    productName: "-",
    productNo: "-",
    price: 0,
    amount: 0,
  };
  const DEFAULT_SALE_MODEL = {
    saleId:null,
    saleNo: "",
    saleDate: null,
    products: [
      {
        productId: "-",
        productName: "-",
        inventory: 0,
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
      saleModel: JSON.parse(JSON.stringify(DEFAULT_SALE_MODEL)),
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
        { text: "当前库存", value: "inventory", sortable: false },
        { text: "单价", value: "price", sortable: false },
        { text: "销售数量", value: "amount", sortable: false },
        { text: "合计", value: "total", sortable: false },
        { text: "", value: "data-item-reduce", sortable: false, width: "1" },
      ],
      productItems: [],
      searchLoading: false,
      selectedProduct: {},
    }),
    computed: {
      saleTotal() {
        let total = 0;
        if (this.saleModel.products) {
          this.saleModel.products.forEach((item) => {
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
            this.saleModel = JSON.parse(JSON.stringify(DEFAULT_SALE_MODEL));
            break;
          case "edit":
            this.saleModel.saleId = item.saleId;
            this.saleModel.saleNo = item.saleNo;
            this.saleModel.saleDate = item.saleDate;
            this.saleModel.address = item.address;
            this.saleModel.contactInfo = item.contactInfo;
            this.saleModel.products = item.products;
            this.addDialog = true;
            break;
          default:
            break;
        }
      },
      saveEntity() {
        return new Promise((resolve) => {
          this.getService()
            .save(this.saleModel)
            .then(() => {
              this.$toasted.show("操作成功", {
                position: "top-center",
                type: "success",
                icon: "check-bold",
              });
              resolve();
            })
            .catch((err) => {
              this.$toasted.show(err.message, {
                position: "top-center",
                type: "error",
                icon: "alert-circle",
              });
              console.warn(err);
            });
        });
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
          item.inventory = this.selectedProduct.inventory;
        }

        this.$nextTick(() => {
          this.selectedProduct = null;
        });
      },
      addProduct() {
        this.saleModel.products.push(
          JSON.parse(JSON.stringify(DEFAULT_PRODUCT))
        );
      },
      reduceProduct(item) {
        const editedIndex = this.saleModel.products.indexOf(item);
        this.saleModel.products.splice(editedIndex, 1);
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
