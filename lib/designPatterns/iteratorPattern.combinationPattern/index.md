# 组合模式：
使用树形结构创建对象结构，数据结构是树结构，拥有node节点和leaf叶子节点，该模式使node节点与叶子节点继承相同的抽象类，拥有相同的属性和方法，只是leaf节点不使用某些属性和方法
```
component.ts： 组件抽象类，node节点类 和 leaf节点类 都需要继承该抽象类
menu.node.ts:  node节点类(多个组合的菜单类)
menuItem.node.ts: leaf节点类(单个菜单类)

iterator.composite.ts: 组合迭代器(用来遍历整个树形组合)

```

# 组合迭代器：遍历树形的组合模式数据

- 抽象类需要一个抽象的方法createIterator，创建自己的迭代器
- leaf节点也需要实现方法createIterator，只是创建的是一个空的迭代器，hasNext()始终返回false, next()始终返回null
- node组合节点，也需要实现方法createIterator，根据自身子数据的存储方式，创建对应的迭代器，比如创建一个数组迭代器
- 创建组合迭代器 ，初始化输入是顶级节点的迭代器对象
