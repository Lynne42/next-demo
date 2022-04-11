/**
 * 前缀
 * 请求拦截器
 * 响应拦截器
 * 双token登录态失效，接口请求重试
 * 取消请求(需要额外的库 yet-another-abortcontroller-polyfill)
 */

import { extend } from 'umi-request';
import requestConfig from '../../config/request.rc';
import { refreshTokenApi } from '@/api/login';
import logoutFn from './logout';

type responseConfig = {
  status: string;
  msg?: string;
  message?: string;
  data?: { [x: string]: any } | any;
  [indexName: string]: any;
};
export interface ApiResponse<T> {
  status: string;
  message: string;
  data?: T;
}
type OptionsType = {
  [indexName: string]: any;
};

const { devPrefix = '', prodPrefix = '', ...restConfig } = requestConfig;
const prefix = process.env.NODE_ENV === 'development' ? devPrefix : prodPrefix;

const extendConfig: Record<string, any> = {
  ...restConfig,
};

const request = extend({
  ...extendConfig,
  // timeout: 5000,
});

const headers = {
  // 'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
};

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
  await refreshTokenApi();

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
  logoutFn();
  window.location.href = '/login';
};

const checkStatus = async (response: any, options: OptionsType) => {
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
              request(options.url, {
                ...options,
                isRetry: true,
              }),
            );
          });
        });
      }
      return redirectLoginHandler();
    }
    default:
  }
};

/**
 * Resquest Handler
 */
const requestHandler = (url: string, options: OptionsType) => {
  let tranUrl = url;
  const reg = /^\/@(\w+)\//;
  tranUrl = tranUrl.match(reg)
    ? tranUrl.replace(reg, '/$1/')
    : `${prefix}${tranUrl}`;

  return {
    url: tranUrl,
    options: {
      ...options,
      headers: {
        ...headers,
        ...(options.headers || {}),
      },
      interceptors: true,
    },
  };
};

/**
 * Response Handler
 */
const responseHandler = async (response: any, options: OptionsType) => {
  const requestParams =
    options.method.toLowerCase === 'get' ? options.params : options.data;
  try {
    const { status } = response;
    if (status === 200) {
      const res: responseConfig = await response.clone().json();
      if (res?.status !== 'ok') {
        // message.error(res?.message);
      }
      isRefreshingToken = false;
      return {
        ...res,
        requestParams,
      };
    }
    if (status === 403) {
      if (!options.isRetry) {
        return checkStatus(response, options);
      }
      // 如果重试的接口还报403， 则直接重定向到登录页面
      return redirectLoginHandler();
    }

    const res: responseConfig = await response.clone().json();
    return {
      status: 'error',
      httpStatus: status,
      message: res.message || '请求错误',
      requestParams,
    };
  } catch (error) {
    return {
      status: 'error',
      httpStatus: response.status,
      message: '请求错误',
      requestParams,
    };
  }
};

request.interceptors.request.use(requestHandler);
request.interceptors.response.use(responseHandler);

export default request;
