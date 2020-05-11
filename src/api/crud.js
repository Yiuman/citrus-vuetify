import request, {download} from "../utils/request";
import {API_BASE_PATH} from "../config";

/**
 * 普通的CRUD逻辑
 */
export class CrudService {

    constructor(namespace) {
        this.namespace = namespace
    }

    /**
     * 列表查询
     * @param query 查询参数
     */
    list(query = {}) {
        return request.get(this.namespace, {params: query});
    }

    /**
     * 保存
     * @param data 新增数据
     */
    save(data) {
        return request.post(this.namespace, data)
    }

    /**
     * 删除数据
     * @param id
     */
    delete(id) {
        return request.delete(`${this.namespace}/${id}`)
    }

    /**
     * 批量删除
     * @param keys 需要删除的Id数据
     */
    batch_delete(keys = []) {
        return request.post(`${this.namespace}/batch_delete`, keys)
    }

    /**
     * 更新
     * @param data 更新的数据
     */
    update(data) {
        return request.put(this.namespace, data)
    }

}

/**
 * 树形CRUD逻辑
 */
export class TreeService extends CrudService {

    constructor(namespace) {
        super(namespace)
    }

    /**
     * 加载树
     * @param query 查询条件
     */
    load(query) {
        return request.get(`${this.namespace}/tree`, query)
    }

    /**
     * 根据父ID加载子类
     * @param key 父ID
     */
    loadChildren(key) {
        return request.get(`${this.namespace}/tree/${key}`)
    }

    /**
     * 节点移动
     * @param currentId  当前节点ID
     * @param moveToId 移动到某一节点的ID
     */
    move(currentId, moveToId) {
        return request.put(`${this.namespace}/tree/move`, {currentId, moveToId})
    }

    /**
     * 重新初始化树，重新预排序
     */
    init() {
        return request.post(`${API_BASE_PATH}/${this.namespace}/tree/init`)
    }
}

export default (namespace) => {
    return new CrudService(namespace)
};

/**
 * CRUD混入
 */
export const mixins = {
    data() {
        return {
            currentItem: {},
            crudService: {},
            actionSwitch: {
                add: false,
                edit: false,
                delete: false,
                batchDelete: false,
            },
        }
    },
    created() {
        this.crudService = new CrudService(this.namespace);
    },
    methods: {
        doAction(action, item) {
            const actionMethod = this[action] || this['defaultAction'];
            console.warn(actionMethod);
            actionMethod(action, item);
        },
        defaultAction(action) {
            this.actionSwitch[action] = true
        },
        add(action) {
            this.currentItem = {}
            this.defaultAction(action);
        },
        edit_(item) {
            this.crudService.save(item).then(() => {
                this.queryPage();
            }).catch((err) => {
                console.warn(err)
            });
        },
        edit(action, item) {
            this.currentItem = JSON.parse(JSON.stringify(item));
            this.defaultAction(action);
        },
        delete(action, item) {
            this.currentItem = JSON.parse(JSON.stringify(item));
            this.defaultAction(action);
        },
        delete_(item) {
            this.crudService.delete(item[this.itemKey]).then(() => {
                this.queryPage();
            }).catch((err) => {
                console.warn(err)
            })
        },
        batchDelete(action) {
            if (!this.selected || this.selected.length === 0) {
                this.showTips('请勾选需要删除的数据项');
            } else {
                this.defaultAction(action);
            }
        },
        batchDelete_(items) {
            const ids = items.map(item => item[this.itemKey]);
            this.crudService.batch_delete(ids).then(() => {
                this.queryPage();
            }).catch((err) => {
                console.warn(err)
            })
        },
        import() {

        },
        export() {
            download(`${this.namespace}/export`);
        },
        showTips(text) {
            this.snackbar.text = text;
            this.snackbar.switch = true;
        }
    }

};

