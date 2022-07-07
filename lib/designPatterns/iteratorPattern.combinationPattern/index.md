组合模式：
使用树形结构创建对象结构，数据结构是树结构，拥有node节点和leaf叶子节点，该模式使node节点与叶子节点继承相同的抽象类，拥有相同的属性和方法，只是leaf节点不使用某些属性和方法

component.ts： 组件抽象类，node节点类 和 leaf节点类 都需要继承该抽象类
menu.node.ts:  node节点类(多个组合的菜单类)
menuItem.node.ts: leaf节点类(单个菜单类)

