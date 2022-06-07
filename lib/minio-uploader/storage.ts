/* eslint-disable class-methods-use-this */
/* eslint-disable no-useless-constructor */
interface Storage {
    [propName: string]: any;
  }
  
  class Store {
    private _store: Storage = {};
  
    constructor(store: Storage) {
      // 检测是否支持localstorage
  
      if (!store) {
        console.log('不支持localStorage');
        return;
      }
  
      this._store = store;
    }
  
    /**
     * @function 设置值
     * @param {string} _k 必须参数，属性
     * @param {any} _v 非必须参数，属性值
     */
    setItem(_k: string, _v: any) {
      if (!this._store) return;
      const kType = this.getType(_k);
      if (kType === 'string') {
        this._store.setItem(_k, this.filterValue(_v));
      } else {
        console.log('key只能为字符串！');
      }
    }
  
    /**
     * @function 获取值
     * @param {string} _k 必须参数，属性
     */
    getItem(_k: string) {
      if (!this._store) return;
      let res;
      const kType = this.getType(_k);
      if (kType === 'string') {
        res = this._store.getItem(_k);
      } else {
        console.log('key只能为字符串！');
      }
      return res;
    }
  
    /**
     * @function 获取已以XX为开头的 key
     * @param {string} _k 必须参数，属性
     */
    getKeys(_keys: string) {
      const result: string[] = [];
      const sessionKeys = Object.keys(this._store);
  
      for (let i = 0, l = sessionKeys.length - 1; i <= l; i++) {
        if (sessionKeys[i].startsWith(_keys)) {
          result.push(sessionKeys[i]);
        }
      }
      return result;
    }
  
    /**
     * @function 移除值
     * @param {string} _k 必须参数，属性
     */
    removeItem(_k: string) {
      if (!this._store) return;
      const kType = this.getType(_k);
      if (kType === 'string') {
        this._store.removeItem(_k);
      } else {
        console.log('key只能为字符串！');
      }
    }
  
    /**
     * @function 批量移除指定值
     * @param {array} _ks 必须参数，属性
     */
    batchRemoveItem(_ks: string[]) {
      if (!this._store) return;
      _ks.forEach((_k) => {
        const kType = this.getType(_k);
        if (kType === 'string') {
          this._store.removeItem(_k);
        } else {
          console.log('key只能为字符串！');
        }
      });
    }
  
    /**
     * @function 移除所有
     */
    clear() {
      if (!this._store) return;
      this._store.clear();
    }
  
    /**
     * @function 判断类型
     * @param {any} para 必须参数，判断的值
     */
    getType(para: any) {
      const type = typeof para;
      if (type === 'number' && isNaN(para)) return 'NaN';
      if (type !== 'object') return type;
      return Object.prototype.toString
        .call(para)
        .replace(/[\[\]]/g, '') // eslint-disable-line
        .split(' ')[1]
        .toLowerCase();
    }
  
    /**
     * @function 过滤值
     * @param {any} val 必须参数，过滤的值
     */
    filterValue(val: any) {
      const vType = this.getType(val);
      const nullVal = ['null', 'undefined', 'NaN'];
      const stringVal = ['boolen', 'number', 'string'];
      if (nullVal.indexOf(vType) >= 0) return '';
      if (stringVal.indexOf(vType) >= 0) return val;
      return JSON.stringify(val);
    }
  }
  
  class LocalStorage extends Store {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(store: Storage) {
      super(store);
    }
  
    WX_USER_ID = 'WX_USER_ID';
  }
  
  class SessionStorage extends Store {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(store: Storage) {
      super(store);
    }
  
    WX_SSO_TITLE = 'WX_SSO_TITLE';
  }
  
  class CookieStorage {
    setCookie(name: string, value: string, lostTime?: number, path?: string) {
      // 首先判断用户传入参数的个数，至少传入2个参数
      if (arguments.length === 2) {
        this._saveCookie(`${name}=${value}`);
      } else if (arguments.length === 3) {
        const ifLp = typeof arguments[2];
  
        if (ifLp === 'number') {
          const Cookietime = new Date();
  
          Cookietime.setDate(Cookietime.getDate() + lostTime!);
          this._saveCookie(`${name}=${value};expires=${Cookietime}`);
        } else {
          this._saveCookie(`${name}=${value};path=${arguments[2]}`);
        }
      } else {
        const Cookietime = new Date();
  
        Cookietime.setDate(Cookietime.getDate() + lostTime!);
        this._saveCookie(`${name}=${value};expires=${Cookietime};path=${path}`);
      }
    }
  
    getCookie(name: string) {
      const arr = document.cookie.match(new RegExp(`(^| )${name}=([^;]*)(;|$)`));
  
      if (arr != null) {
        return decodeURIComponent(arr[2]);
      }
      return null;
    }
  
    _saveCookie(cookie: string) {
      document.cookie = cookie;
    }
  
    removeCookie(name: string) {
      const exp = new Date();
      exp.setTime(exp.getTime() - 1);
  
      const cval = this.getCookie(name);
      if (cval != null) {
        this._saveCookie(`${name}=${cval};expires=${exp.toUTCString()}`);
      }
    }
  }
  
  const lStorage = new LocalStorage(window.localStorage || localStorage);
  const sStorage = new SessionStorage(window.sessionStorage || sessionStorage);
  
  const cookie = new CookieStorage();
  
  export { lStorage, sStorage, cookie };
  