## 设计模式之模板模式——Template

### 定义
在一个方法中定义了一个算法的骨架，而将一些步骤延迟到子类中，模板方法使得子类可以在不改变算法结构的情况下，重新定义算法中某些结构。

### 适用场景
多个类有相同的方法，并且逻辑基本相同,可以选择抽离通用方法，子类只需要实现自己的特殊逻辑。

### 组件
+ `AbstractClass`:实现一个模板方法，定义了算法的骨架，具体子类将重定义抽象方法以实现一个算法的步骤

+ `ConcreteClass`:实现父类中的抽象方法。

### 优点
+ 封装不变部分，扩展可变部分

+ 提取公共部分代码，便于维护

+ 行为由父类控制，子类实现

### 缺点
+ 每一个不同的实现都需要一个子类实现，导致类的个数增加，使得系统更加庞大

### 构造场景

+ 假设有个饮吧，提供咖啡和茶两种含咖啡因的饮品，假设两种饮品制作步骤分别如下：
  - 咖啡：
    + 煮沸水
    + 用水冲泡咖啡
    + 把咖啡倒进杯子
    + 加糖和牛奶
  
  - 茶：
    - 煮沸水
    - 用水冲泡茶袋
    - 把茶倒进杯子
    - 加柠檬片

+ 从上面两个饮品的制作步骤可以看出，它们有类似的地方（1，3），有不同的地方（2，4）,可以考虑使用模板方法封装相同的步骤，子类实现不同的步骤。

+ 两个品类的第四步，根据客人的口味可以选择加或者不加，我们考虑造一个钩子，即子类可以自行选择是否实现。

+ 一个抽象的咖啡因父类:

````java
public abstract class AbstractCaffeine {
     /**
       * 功能描述: <br>
       *<制作方法>
       * 我们可以把方法设置为final,以免被子类重写
       */
    final void prepareRecipe(){
        boilWater();
        brew();
        pourInCup();
        addCondiments();
    }

    /**
     * 煮沸水
     */
    private void boilWater(){
        System.out.println("水开了！");
    }
    
    /**冲泡饮品*/
    protected abstract void brew();

    /**
     * 倒入杯子
     */
    private void pourInCup(){
        System.out.println("饮品倒入杯子中了！");
    }

    /**加一些调料（钩子，子类自行选择是否添加佐料）**/
    protected void addCondiments(){}
}
````

+ 两个子类，继承实现抽象方法：
  - 咖啡

````java
public class Coffee extends AbstractCaffeine {

    /**冲泡饮品*/
    @Override
    protected void brew() {
        System.out.println("用水冲泡咖啡");
    }

    /**加佐料**/
    @Override
    protected void addCondiments() {
        System.out.println("加入糖和牛奶");
    }
}
````
  - 茶

````java
public class Tea extends AbstractCaffeine {
    
    /**冲泡饮品**/
    @Override
    protected void brew() {
        System.out.println("用水冲泡茶袋！");
    }
}
````  

+ 例子中咖啡我们实现了钩子，加入糖和牛奶，茶叶我们选择什么都不加。

#### 运行结果
````java
public class TemplateDemo {

    public static void main(String[] args) {
        AbstractCaffeine coffee = new Coffee();
        coffee.prepareRecipe();
        System.out.println("---------------------------");
        AbstractCaffeine tea = new Tea();
        tea.prepareRecipe();
    }
}
````

````
水开了！
用水冲泡咖啡
饮品倒入杯子中了！
加入糖和牛奶
---------------------------
水开了！
用水冲泡茶袋！
饮品倒入杯子中了！
````


