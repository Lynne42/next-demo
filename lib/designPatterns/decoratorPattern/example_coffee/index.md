使用装饰器模式， 完整一个咖啡的制作， 包括基础咖啡以及添加的额外佐料

咖啡类型： 浓缩咖啡， 经典咖啡，...
佐料： 摩卡，豆奶， 奶油，...


实现：
将佐料作为装饰器， 给需要的咖啡类型上调价响应的佐料装饰器


base/beverage.ts: coffee抽象基础类
base/condiment.ts: 装饰器基础类， 继承base/beverage.ts抽象类
base/mocha_decorator.ts: 摩卡装饰器，继承装饰器基础类
base/soy_decorator.ts: 豆奶装饰器， 继承装饰器基础类
base/whip_decorator.ts: 奶油装饰器， 继承装饰器基础类

espresso_instance_base.ts: 浓缩咖啡， 继承coffee基础类
house_instance_base: ts: 经典咖啡， 继承coffee基础类

espresso_instance： 浓缩咖啡实例
house_instance： 经典咖啡实例

