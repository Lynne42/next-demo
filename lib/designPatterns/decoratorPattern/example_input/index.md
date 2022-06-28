使用装饰器模式， 将输入流内的所有小写转换为大写

string_base.ts： 抽象基础类
string_decorator.ts: 装饰器抽象类， 继承string_base.ts抽象类
toUpperCase_decorator： 将输入字符串转换为大写的一个装饰器， 继承string_decorator.ts装饰器基础类
input_instance_base： 待装饰的组件， 继承string_base.ts抽象类

input_instance： 具体应用，内部完成组件初始化以及装饰器初始化

