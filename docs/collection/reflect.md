## java 反射

### 概述

+ java反射使得我们可以在程序运行时动态加载一个类，动态获取类的基本信息和定义的方法,构造函数,域等。还可以动态创建类的实例，执行类实例的方法，获取类实例的域值。反射使java这种静态语言有了动态的特性。

+ 反射是通过反编译将`.class`文件转换成`.java`,从而操纵类的属性方法。

+ java反射是围绕Class类展开的，jvm将字节码文件加载到方法区内存中并返回一个Class对象。

### 变量

### 构造器

### 方法


####  Class.forName("") 与  ClassLoader.getSystemClassLoader().loadClass("")

+ Class.forName加载类是将类进了初始化(相当于调用无参构造函数,会调用static静态代码来初始化配置)

+ ClassLoader的loadClass并没有对类进行初始化，只是把类加载到了虚拟机中

### 总结