import Mock from "mockjs";
import homeApi from './mockData/home'

import userapi from './mockData/User'
Mock.mock(/api\/home\/getTableData/,"get",homeApi.getTableData)
Mock.mock(/api\/home\/getCountData/,"get",homeApi.getCountData)
Mock.mock(/api\/home\/getChartData/,"get",homeApi.getChartData)
Mock.mock(/api\/home\/getUserData/,"get",userapi.getUserList)
Mock.mock(/user\/deleteUser/, "get", userapi.deleteUser)
Mock.mock(/user\/createUser/, "post", userapi.createUser)
Mock.mock(/user\/updateUser/, "post", userapi.updateUser)