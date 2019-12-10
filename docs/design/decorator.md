## 设计模式之装饰者模式——Decorator

### 定义
在不改变原有对象的基础之上，将功能附加对象之上。提供了比继承更有弹性的替代方案（扩展原有对象功能）。

### 适用场景
+ 拓展一个类的功能
+ 给一个对象动态添加或者撤销功能

### 组件
+ 装饰者（Decorator）：继承(实现)需要装饰的抽象类（接口）。在抽象类构造方法中注入需要被装饰的抽象类（接口）。

### 优点
+ 比继承灵活，不改变原有对象的同时给另一个对象扩展功能（继承是静态的，在编译期就确定好的，而使用装饰者模式，是可以在运行时决定的）。
+ 通过使用不同的装饰者类以及这些类的排列组合，可以实现不同的效果。
+ 符合开闭原则

### 缺点
+ 会出现更多的类，更多的代码，增加程序的复杂性。
+ 动态装饰时，多层装饰时会更加复杂（装饰者模式会增加对象的数量，当数量增加到一定级别，会大大增加代码调试的难度）。

### 构造场景
假设我们有一个煎饼摊，有杂粮（4元）和小麦面粉（3元）两种基础的煎饼，在此基础上可以选择加鸡蛋（1元）、香肠（2元）、里脊（4元）。
假设我们用继承方式来实现。

#### 普通继承

+ 创建也给杂粮煎饼类
````java
public class ZaLiangCake {

    protected String getDesc() {
        return "杂粮煎饼";
    }

    protected int cost() {
        return 4;
    }
}
````

+ 需要加一个鸡蛋，让加鸡蛋的煎饼继承杂粮果子类
````java
public class ZaLiangCakeWithEgg extends ZaLiangCake {
    @Override
    protected String getDesc() {
        return super.getDesc() + ",加一个鸡蛋";
    }

    @Override
    protected int cost() {
        return super.cost() + 1;
    }
}
````

+ 在鸡蛋煎饼果子基础上再加一个烤肠
````java
public class ZaLiangCakeWithEggSausage extends ZaLiangCakeWithEgg {
    @Override
    protected String getDesc() {
        return super.getDesc()+",加一个香肠";
    }

    @Override
    protected int cost() {
        return super.cost()+2;
    }
}
````

+ 测试方法
````java
public static void main(String[] args) {
    ZaLiangCake cake = new ZaLiangCake();
    System.out.println(cake.getDesc() + ",cost:"+cake.cost());
    ZaLiangCake eggCake = new ZaLiangCakeWithEgg();
    System.out.println(eggCake.getDesc() + ",cost:"+eggCake.cost());
    ZaLiangCake eggSausage = new ZaLiangCakeWithEggSausage();
    System.out.println(eggSausage.getDesc() + ",cost:"+eggSausage.cost());
}

/** 输出
杂粮煎饼,cost:4
杂粮煎饼,加一个鸡蛋,cost:5
杂粮煎饼,加一个鸡蛋,加一个香肠,cost:7
*/
````

这样做有什么问题？假设我们要加2个鸡蛋呢，我们还需要写一个两个鸡蛋的类，如果两个鸡蛋再加里脊呢。随着种类的各种搭配，会导致类爆炸。这时候用装饰者模式来实现一下。

#### 装饰者模式

+ 定义一个煎饼果子抽象类
````java
public abstract class AbstractCake {
    private String desc = "UnKnown Cake";

    /**
     * <描述>
     */
    protected String getDesc() {
        return desc;
    }

    /**
     * <价格>
     */
    protected abstract int cost();
}
````

+ 煎饼的两种实现，杂粮的和普通的
````java
public class ZaLiangCake extends AbstractCake {
    @Override
    protected String getDesc() {
        return "杂粮煎饼";
    }

    @Override
    protected int cost() {
        return 4;
    }
}
````

````java
public class MianFenCake extends AbstractCake {
    @Override
    protected String getDesc() {
        return "普通煎饼";
    }

    @Override
    protected int cost() {
        return 3;
    }
}
````

+ 定义一个装饰父类。（装饰者拥有被装饰者的对象，一般当构造参数传入）
````java
public abstract class AbstractDecorator extends AbstractCake {
    private AbstractCake abstractCake;

    public AbstractDecorator(AbstractCake abstractCake) {
        this.abstractCake = abstractCake;
    }

    @Override
    protected String getDesc() {
        return this.abstractCake.getDesc();
    }

    @Override
    protected int cost() {
        return this.abstractCake.cost();
    }
}
````

+ 分别增加鸡蛋、烤肠、里脊装饰类
````java
public class EggDecorator extends AbstractDecorator {

    public EggDecorator(AbstractCake abstractCake) {
        super(abstractCake);
    }

    @Override
    protected String getDesc() {
        return super.getDesc() + ",加一个鸡蛋";
    }

    @Override
    protected int cost() {
        return super.cost() + 1;
    }
}
````

````java
public class SauageDecorator extends AbstractDecorator {
    public SauageDecorator(AbstractCake abstractCake) {
        super(abstractCake);
    }

    @Override
    protected String getDesc() {
        return super.getDesc() + ",加一根香肠";
    }

    @Override
    protected int cost() {
        return super.cost() + 2;
    }
}
````

````java
public class BaconDecorator extends AbstractDecorator {
    public BaconDecorator(AbstractCake abstractCake) {
        super(abstractCake);
    }

    @Override
    protected String getDesc() {
        return super.getDesc() + ", 加里脊肉";
    }

    @Override
    protected int cost() {
        return super.cost() + 4;
    }
}
````

+ 测试方法
````java
public static void main(String[] args) {
    AbstractCake zaLiang = new ZaLiangCake();
    zaLiang = new EggDecorator(zaLiang);
    zaLiang = new EggDecorator(zaLiang);
    zaLiang = new SauageDecorator(zaLiang);
    System.out.println(zaLiang.getDesc() + ",cost:" + zaLiang.cost());

    AbstractCake mianFenCake = new MianFenCake();
    mianFenCake = new EggDecorator(mianFenCake);
    mianFenCake = new SauageDecorator(mianFenCake);
    mianFenCake = new BaconDecorator(mianFenCake);

    System.out.println(mianFenCake.getDesc() + ",cost:" + mianFenCake.cost());
}

/**
杂粮煎饼,加一个鸡蛋,加一个鸡蛋,加一根香肠,cost:8
普通煎饼,加一个鸡蛋,加一根香肠, 加里脊肉,cost:11
*/
````

这种设计模式伸缩性就很强，不管你怎么搭配，在定义好的类直接可以随意组合。
此例子简单理解例子是，只有一个被装饰的实现类 ZaliangCake,装饰者可以对其自由组合。

### 装饰者模式在java IO体系中的运用
java 的IO体系很好地应用了装饰者模式，下边我们可以先看一下Java IO流体系。 

<img :src="$withBase('/desgin/1.jpg')" alt="dock">

+ 从图中看出，InputStream就是装饰者模式的超类，`ByteArrayInputStream`，`FileInputStream`相当于被装饰者。这些类都提供了最基本的字节读取的功能。
+ 而和这些类同一级别的类`FilterInputStream`即是装饰者（Decorator），`BufferedInputStream`，`DataInputStream`，`PushbackInputStream`这些类继承`FilterInputStream`，是具体的装饰类。

根据装饰者模式，我们可以总结这些流的用法:
````java
public class DesignMain {
    public static void main(String[] args) throws Exception{
        File file = new File("text.txt");
        InputStream is = new FileInputStream(file);
        BufferedInputStream bufferedInputStream = new BufferedInputStream(is);
    }
}
````
从使用的角度来看装饰者模式，可以看出它的一个缺点：装饰者模式的实现对于使用者是透明的，当使用者不熟悉你的实现的时，就很难理解。 同理你可以学习一下另外一个结构outputStream 。





