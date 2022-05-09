/**
 * 取消请求
 * 避免重复请求
 * 请求拦截器
 * 响应拦截器
 * 双token登录态失效，错误重试
 * 上传进度(onUploadProgress)， 下载进度(onDownloadProgress)
 */
import axios from "axios";
const CancelToken = axios.CancelToken;

// 设置超时时间
axios.defaults.timeout = 5000;
axios.defaults.withCredentials = true;
axios.defaults.headers.post["Content-Type"] = "application/json; charset=utf-8";
axios.defaults.headers.common["X-Requested-With"] = "XMLHttpRequest";

/**  双token登录的问题处理 start */
let isRefreshingToken = false;
let subscribersRequestList: Function[] = [];
const addSubscriberRequestList = (listener: any) =>
  subscribersRequestList.push(listener);

/**
 * @description: 执行缓存请求队列
 * @param {*}
 * @return {*}
 */
const notifySubscriber = () => {
  subscribersRequestList.forEach((callback) => callback());
  subscribersRequestList.length = 0;
};

/**
 * @description: 刷新token
 * @param {*}
 * @return {*}
 */
const refreshToken = async () => {
  isRefreshingToken = true;
  // await refreshTokenApi();

  notifySubscriber();
  isRefreshingToken = false;
};

/**
 * @description: 重定向到login
 * @param {*}
 * @return {*}
 */
const redirectLoginHandler = () => {
  subscribersRequestList = [];
  // logoutFn();
  window.location.href = "/login";
};
const checkStatus = async (response: any, config: any) => {
  const { status } = response;
  switch (status) {
    case 403: {
      if (!isRefreshingToken) {
        isRefreshingToken = true;
        // 刷新token
        refreshToken();
        return new Promise((resolve) => {
          addSubscriberRequestList(() => {
            resolve(
                axios(config.url, {
                ...config,
                isRetry: true,
              })
            );
          });
        });
      }
      return redirectLoginHandler();
    }
    default:
  }
};
/**  双token登录的问题处理 end */

// 存储请求
type Pending = {
  [key: string]: any;
};
const pending: Pending = {};

// 根据请求信息(url, 参数等)，记录请求的唯一性，用于避免同一时间的多个相同的请求
const getRequestIdentify = (config: any) => {
  let url = config.url;

  let data = null;
  if (config.method === "get") {
    data = config.params;
  } else {
    data = config.data;
  }
  return encodeURIComponent(url + JSON.stringify(data || ""));
};

// 取消重复请求， key: 请求标识；isRequest 完成请求后也需要执行删除记录，所以添加此参数避免执行无用操作
const removePending = (key: string, isRequest = false) => {
  if (pending[key] && isRequest) {
    pending[key]("取消重复请求");
  }
  delete pending[key];
};

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 判断是否是重复请求
    let requestUniqueId = getRequestIdentify(config);
    removePending(requestUniqueId, true);

    config.cancelToken = new CancelToken((cancel) => {
      pending[requestUniqueId] = cancel;
    });
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    // 请求完成后，从pending队列中移除
    let requestData = getRequestIdentify(response.config);
    removePending(requestData);
    console.log(response);
    const { status, data, config } = response;
    /**
     * `config` is the config that was provided to `axios` for the request
     * 如果需要返回请求的参数信息等，可以通过config查看
     */
    if (status === 200) {
      // 可以选择在这里只返回数据体，不包含code等，但是如果想要自己控制错误的提示信息，或者有轮询等操作，最好在业务中去处理 code非0的情况
      return data;
    }
    /*** 双token登录失败后刷新token处理 start */
    if (status === 403) {
      if (!config.isRetry) {
        return checkStatus(response, config);
      }
      // 如果重试的接口还报403， 则直接重定向到登录页面
      return redirectLoginHandler();
    }
    /*** 双token登录失败后刷新token处理 end */

    return Promise.reject(data);
  },
  (err) => {
    return Promise.reject({
      code: 1,
      err,
    });
  }
);
