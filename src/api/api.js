//统一管理整个项目api

import request from "./request"

// 请求首页左侧表格数据

export default {
  getTableData() {
    return request({
      url: "home/getTable",
      method: "get",
      mock: true
    })
  }
}