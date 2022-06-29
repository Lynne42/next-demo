抽象工厂模式： 

抽象工厂的任务是定义一个负责创建一组产品的接口， 这个接口内的每个方法都负责创建一个具体的产品

# demo 文件

*store.ts: 生产pizza的工厂 pizzaStore，负责生产产品的所有过程

包括功能：
- 收集原料(通过原料工厂生成)
- 制作

```
pizzaStore.ts: 一个抽象的产品制作类
store_*/NYpizzaStore.ts: 一个具体的NY产品制作类，继承pizzaStore.ts
```

*Factory.ts: 生产原料的工厂 pizzaFactory，负责产品所需要的所有信息
```
pizzaFactory.ts: 一个抽象的工厂原料接口
store_*/NYpizzaFactory.ts: 一个实际的NY原料工厂，实现了抽象工厂
```

*Pizza.ts: 具体的pizza
```
store_*/: 具体的不同种类的产品， 包含产品原料工厂类，产品创建流程类，具体的产品类，以及具体使用类
pizza.ts: 一个抽象的产品，包含产品的所有信息
```

# 流程
选择一个pizza联盟店(pizzaStore) -> 该pizza联盟店 使用自己对应的原料加工厂 生产需要的原料(pizzaFactory) -> 制作出pizza

