import request, { download } from "../utils/request";
import { API_BASE_PATH } from "../config";

const ScriptHandler = {
  execute(scriptStr, options) {
    // eslint-disable-next-line no-new-func
    return Function('"use strict";return (' + scriptStr + ")")()(options);
  },
  executeEl(callObject, logicStr) {
    return Function(
      '"use strict";return (function(){ return ' + logicStr + "})"
    )().call(callObject);
  },
};
/**
 * 普通的CRUD逻辑
 */
export class CrudService {
  constructor(namespace) {
    this.namespace = namespace;
  }

  /**
   * 列表查询
   * @param query 查询参数
   */
  list(query = {}) {
    return request.get(this.namespace, { params: query });
  }

  /**
   * 保存
   * @param data 新增数据
   */
  save(data) {
    return request.post(this.namespace, data);
  }

  /**
   * 获取对象的实体
   * @param id 实体ID
   */
  getEntity(id) {
    return request.get(`${this.namespace}/${id}`);
  }

  /**
   * 删除数据
   * @param id
   */
  delete(id) {
    return request.delete(`${this.namespace}/${id}`);
  }

  /**
   * 批量删除
   * @param keys 需要删除的Id数据
   */
  batch_delete(keys = []) {
    return request.post(`${this.namespace}/batch_delete`, keys);
  }

  /**
   * 更新
   * @param data 更新的数据
   */
  update(data) {
    return request.put(this.namespace, data);
  }
}

/**
 * 树形CRUD逻辑
 */
export class TreeService extends CrudService {
  constructor(namespace) {
    super(namespace);
  }

  /**
   * 加载树
   * @param query 查询条件
   */
  load(query) {
    return request.get(`${this.namespace}/tree`, { params: query });
  }

  /**
   * 根据父ID加载子类
   * @param key 父ID
   */
  loadChildren(key) {
    return request.get(`${this.namespace}/tree/${key}`);
  }

  /**
   * 节点移动
   * @param currentId  当前节点ID
   * @param moveToId 移动到某一节点的ID
   */
  move(currentId, moveToId) {
    return request.put(`${this.namespace}/tree/move`, { currentId, moveToId });
  }

  /**
   * 重新初始化树，重新预排序
   */
  init() {
    return request.post(`${API_BASE_PATH}/${this.namespace}/tree/init`);
  }
}

export default (namespace) => {
  return new CrudService(namespace);
};

/**
 * 默认的CRUD通用数据
 */
const DEFAULT_COMMON_DATA = {
  //用于定义选择的对象的键
  itemKey: "",
  //当前选择或编辑的对象
  currentItem: {},
  //Crud服务类
  crudService: {},
  //事项执行开关，用于处理Dialog
  actionSwitch: {
    add: false,
    edit: false,
    delete: false,
    batchDelete: false,
  },
  activeAction: "",
  //所选对象的ID
  selected: [],
  //查询参数
  queryParam: {},
  //顶部控件，如名称输入查询，列表选择等
  widgets: [],
  //顶部按钮
  buttons: [],
  //行内操作，对象操作
  actions: [],
  loadMethod: "load",
  dialogView: {
    width: 800,
    fullscreen: false,
    editFields: [],
  },
  //消息提示
  snackbar: {
    switch: false,
    text: "",
  },
};

/**
 * CRUD混入
 */
export const mixins = {
  props: {
    //命名空间，与后台RESTFULTCRUD对应，如用户则是/rest/users
    namespace: String,
    excludeActions: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return JSON.parse(JSON.stringify(DEFAULT_COMMON_DATA));
  },
  methods: {
    doAction(action, item, operator) {
      if (operator.script) {
        this.currentItem = item;

        if (action.startsWith("function")) {
          ScriptHandler.execute(action, this);
        } else {
          ScriptHandler.executeEl(this, action);
        }
      }
      if (!(this.excludeActions.indexOf(action) > -1)) {
        const actionMethod = this[action] || this["defaultAction"];
        actionMethod(action, item);
      }

      this.$emit("action", action, item);
    },
    defaultAction(action) {
      this.actionSwitch[action] = true;
    },
    resetActionSwitch() {
      Object.keys(this.actionSwitch).forEach(
        (key) => (this.actionSwitch[key] = false)
      );
    },
    add(action) {
      this.currentItem = {};
      this.defaultAction(action);
    },
    reload() {
      this[this.loadMethod]();
      this.resetActionSwitch();
    },
    edit_(item) {
      this.crudService
        .save(item)
        .then(() => {
          this.$toasted.show("操作成功", {
            position: "top-center",
            type: "success",
            icon: "check-bold",
          });
          this.reload();
        })
        .catch((err) => {
          this.$toasted.show(err.message, {
            position: "top-center",
            type: "error",
            icon: "alert-circle",
          });
          console.warn(err);
        });
    },
    edit(action, item) {
      if (!item[this.itemKey]) {
        return;
      }
      this.currentItem = JSON.parse(JSON.stringify(item));
      this.defaultAction(action);
    },
    delete(action, item) {
      this.currentItem = JSON.parse(JSON.stringify(item));
      this.defaultAction(action);
    },
    delete_(item) {
      this.crudService
        .delete(item[this.itemKey])
        .then(() => {
          this.$toasted.show("操作成功", {
            position: "top-center",
            type: "success",
            icon: "check-bold",
          });
          this.reload();
        })
        .catch((err) => {
          this.$toasted.show(err.message, {
            position: "top-center",
            type: "error",
            icon: "alert-circle",
          });
          console.warn(err);
        });
    },
    batchDelete(action) {
      if (!this.selected || this.selected.length === 0) {
        // this.showTips("请勾选需要删除的数据项");
        this.$toasted.show("请勾选需要删除的数据项", {
          position: "top-center",
          type: "info",
          icon: "alert-circle",
        });
      } else {
        this.defaultAction(action);
      }
    },
    batchDelete_(items) {
      let ids = items;
      if (typeof items[0] === "object") {
        ids = items.map((item) => item[this.itemKey]);
      }

      this.crudService
        .batch_delete(ids)
        .then(() => {
          this.reload();
        })
        .catch((err) => {
          console.warn(err);
        });
    },
    import() {},
    export() {
      download(`${this.namespace}/export`);
    },
    showTips(text) {
      this.snackbar.text = text;
      this.snackbar.switch = true;
    },
  },
};
