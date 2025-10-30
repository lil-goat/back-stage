import axios from "axios"
import {ElMessage} from 'element-plus'
import config from "@/config"
const service = axios.create({
  baseURL:config.baseApi
});
const NETWORD_ERROR = "网络错误。。。"

// 添加请求拦截器（请求之前）
service.interceptors.request.use(function (config) {
    // 在发送请求之前做些什么
    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });

// 添加响应拦截器（请求之后）
service.interceptors.response.use((res) => {
    const {code,data,msg} = res.data
    if(code === 200){
      return data
    }else{
      ElMessage.error(msg || NETWORD_ERROR)
      return Promise.reject(msg || NETWORD_ERROR)
    }
  }
);

function request(options){
  options.methond = options.methond || 'get'
  //关于get请求参数调整
  if(options.method.toLowerCase() === 'get') {
    options.params = options.data
  }
  //设定mock开关
  let ismock = config.mock
  if(typeof options.mock !== "undefined"){
    // api中的mock可以覆盖总mock开关
    ismock = options.mock
  }

  // 针对环境做一个处理
  if(config.env === 'prod'){
    // 不能用mock
    service.defaults.baseURL = config.baseApi
  } else {
    service.defaults.baseURL = ismock ? config.mockApi : config.baseApi
  }

  return service(options)
}

export default request;