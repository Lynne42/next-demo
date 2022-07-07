# example1：

创建菜单-打印菜单

有多中不同的种类的菜单， 比如店1拥有a菜单，店2拥有b菜单，每个菜单保存结构不一定相同，比如有的保存在数组中，需要使用数组循环的方法打印菜单， 有的保存在集合中，需要使用集合的方式打印菜单，每添加一种菜单都需要使用菜单的方式增加打印方式

现在合并店1，店2等，或许后面还会增加新的店面(新的餐单)， 如何制作新的菜单？

比如新建一个类，这个类中拥有新的菜单类，对每个类打印菜单都需要定义一个这个类中菜单的循环打印方式，但是每增加一个菜单， 这个类中都需要定义针对该菜单的打印方式。
违反了 封装原则/封闭开放等原则。

所以需要自己处理访问方式，对外提供一个统一的接口

使用迭代器模式：
```
interface Iterator {
    hasNext(): void;   // 判断是否还有可访问的元素
    next(): any;       // 返回可访问的元素
}
```

比如自定义一个map集合的迭代器：
```
class IteratorMap implements Iterator {

    public arr: Map<number, any>;
    public index: number = 0;

    constructor(arr: Map<number, any>) {
        this.arr = arr;
        
    }

    hasNext(): boolean {
        if(this.index >= this.arr.size) {
            return false
        }
        return true
    }

    next(): any {
        const item = this.arr.get(this.index);
        this.index += 1;
        return item;
    }
}
```

