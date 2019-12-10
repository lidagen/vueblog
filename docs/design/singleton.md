## 设计模式之单利模式——Singleton

### 定义
确保一个类只有一个实例，并提供一个全局访问方法

### 单例模式创建方法
+ 私有化构造器
+ 提供一个静态方法获取实例

### 单例模式实现

#### 经典的单例模式

````java
public class SimpleSingleton {
    /**
     * 静态成员变量
     */
    private static SimpleSingleton singleton;

    /**
     * 私有化构造器
     */
    private SimpleSingleton() {
    }
    /**
    静态方法获取实例
    */
    public static SimpleSingleton getInstance() {
        if (null == singleton) {
            singleton = new SimpleSingleton();
        }
        return singleton;
    }
}
````

+ 此模式是**延迟**实例化对象，在需要获取对象的时候，调用`getInstance()`方法来实例化。是通常称为的懒汉式，但此方法还不是最优解。想象一下，在多线程环境中，线程A和线程B同时进入`getInstance()`发现singleton为空，这时候有可能创建多个singleton导致JVM中存在不止一个对象。

+ 这时候我们自然想到了`synchronized`关键字来解决多线程并发导致的问题。

#### 线程安全的单例模式
````java
public class SimpleSingleton {
    /**
     * 静态成员变量
     */
    private static SimpleSingleton singleton;

    /**
     * 私有化构造器
     */
    private SimpleSingleton() {
    }
    /**
    加了synchronized关键字的静态方法获取实例
    */
    public static synchronized SimpleSingleton getInstance() {
        if (null == singleton) {
            singleton = new SimpleSingleton();
        }
        return singleton;
    }
}
````

+ 再想想这种方式的缺点是什么？其实只有第一次实例化对象的时候需要同步，之后的每次调用此方法，synchronized都是个累赘。同步一个方法可能造成程序执行效率下降100倍，如果`getInstance()`会频繁调用，那这个方式值得重新考虑。

+ 我们考虑**急切**创建实例，而不是**延迟**实例化的做法，即通常所称的饿汉式单例方法。

#### 饿汉式创建单例
````java
public class SimpleSingleton {
    /**
     * jvm加载初始化此实例
     */
    private static SimpleSingleton singleton = new SimpleSingleton();

    /**
     * 私有化构造器
     */
    private SimpleSingleton() {
    }

    public static synchronized SimpleSingleton getInstance() {
        return singleton;
    }
}
````

+ 利用这种方法，可以在JVM加载时，立刻创建此实例，这就保证了在任何线程在获取singleton静态变量前，一定先创建此实例。

+ 这种方式也有它的缺点，就是不管是否使用该实例，都会初始化，如果此实例开销过大，不必要的创建此实例会造成资源的浪费。

#### **双重检查加锁**创建单例
+ 在进行双重检查加锁前，先来个错误的示例:

````java
/**错误示例
public class SimpleSingleton {
  
    private static SimpleSingleton singleton;

    private SimpleSingleton() {
    }

    public static synchronized SimpleSingleton getInstance() {
        if (null == singleton){
            synchronized (SimpleSingleton.class){
                if (null == singleton){
                    singleton = new SimpleSingleton();//error
                }
            }
        }
        return singleton;
    }
}**/
````
::: warning
错误事例的隐患：
上面代码error部分，实际上可以分解为3步：
1.分配内存空间
2.初始化对象
3.将对象指向刚分配的内存空间

但是有些编译器为了性能问题，可能将第二步和第三步重排序，结果变成了：
1.分配内存空间
2.将对象指向刚分配的内存空间
3.初始化对象

考虑指令重排的情况下，两个线程会发生如下调用：
TIME | Thread A |  Thread B | 
- | :-: | :-: | :-: | -:
T1 | 检查到`singleton`为空 |  | 
T2 | 获取锁 |  | 
T3 | 再次检查到`singleton`为空 |  | 
T4 | 为`singleton`分配内存空间 |  | 
T5 | 将`singleton`指向内存空间 |  | 
T6 |  | 检查到`singleton`不为空 | 
T7 |  | 访问`singleton`（此时对象还未完成初始化） | 
T8 | 初始化`singleton` |  | 

+ 在这种情况下，T7时刻线程B对singleton的访问，访问的是一个初始化未完成的对象。
+ 使用了volatile关键字后，重排序被禁止，所有的写（write）操作都将发生在读（read）操作之前。
:::


**正确的双重检查加锁：**
````java
public class SimpleSingleton {
    /**
     * volatile 修饰变量
     */
    private volatile static SimpleSingleton singleton;

    /**
     * 私有化构造器
     */
    private SimpleSingleton() {
    }

    public static synchronized SimpleSingleton getInstance() {
        if (null == singleton){//1
            synchronized (SimpleSingleton.class){
                if (null == singleton){//2.
                    singleton = new SimpleSingleton();
                }
            }
        }
        return singleton;
    }
}
````
+ 双重检查锁（double checked locking）运行的逻辑：线程A和线程B同时进入了步骤1，这时候线程A获取了锁，创建了对象。线程B等待之后获取锁，进入步骤2,发现实例已不为null,返回。

+ volatile 关键字确保singleton被初始化成SimpleSingleton实例时，多个线程正确的处理singleton变量。（保持内存可见性和防止指令重排序）

### 单例模式和静态类的对比
 单例模式和静态类都能确保JVM中只存在一个对象，那他们的区别是什么。
 + 首先单例模式会提供给你一个全局唯一的对象，静态类只是提供给你很多静态方法，这些方法不用创建对象，通过类就可以直接调用
 + 如果是一个非常重的对象，单例模式可以懒加载，静态类就无法做到
