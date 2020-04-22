import request from "../utils/request";

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
        return request.get(this.namespace, query);
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
     * @param ids 需要删除的Id数据
     */
    deleteBatch(ids = []) {
        return request.post(`${this.namespace}/batch_delete`, ids)
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
        return request.post(`${this.namespace}/tree/init`)
    }
}
