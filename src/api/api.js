//统一管理整个项目api

import request from "./request"

// 请求首页左侧表格数据

export default {
  getTableData() {
    return request({
      url: "home/getTableData",
      method: "get",
      mock: true
    })
  },

  getCountData() {
    return request({
      url: "home/getCountData",
      method: "get",
      mock: true
    })
  },

  getChartData() {
    return request({
      url: "home/getChartData",
      method: "get",
      mock: true
    })
  },

  getUserData(data) {
    return request({
      url: "home/getUserData",
      method: "get",
      mock: true,
      data
    })
  },

  deleteUser(params) {
    return request({
      url: '/user/deleteUser',
      method: 'get',
      data: params
    })
  },

  createUser(data) {
    return request({
      url: '/user/createUser',
      method: 'post',
      data
    })
  },

  updateUser(data) {
    return request({
      url: '/user/updateUser',
      method: 'post',
      data
    })
  }
}