export const API_BASE_PATH = (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test')
    ? process.env.BASE_URL : '/devProxy';

/**
 * 系统配置
 * @type {{systemTile: string}}
 */
export const SYSTEM_CONFIG = {

    systemTile: 'Citrus',

    /**
     * 允许不需要权限访问的路由
     */
    permitUrls:['/login']
};
