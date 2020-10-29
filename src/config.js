export const API_BASE_PATH =
  process.env.NODE_ENV === "production" || process.env.NODE_ENV === "test"
    ? process.env.BASE_URL
    : "/devProxy";

/**
 * 系统配置
 * @type {{systemTile: string}}
 */
export const SYSTEM_CONFIG = {
  appBarColor:'#fff',
  menuColor:"#2a68c9",
  menuTextColor:"#fff",
  // systemTitle: "广大家具",

  // 标题在主要工具拦
  toolbarTitle:false,
  systemImageSrc:require("./assets/text.png"),
  // systemImageSrc: "",

  /**
   * 允许不需要权限访问的路由
   */
  permitUrls: ["/login"],
};
