## JDK8 函数式编程

### lambda表达式
+ lambda表达式即匿名函数，它是一段没有函数名的函数体，可以作为参数直接传递给相关调用者.
+ Lambda 表达式通常使用 (argument) -> (body) 语法书写：
````java
//有参数,且有返回值
(int a, int b) -> {  return a + b; }
//无参无返回值
() -> System.out.println("Hello World");
//有参无返回值
(String s) -> { System.out.println(s); }
// 无参有返回值
() -> { return 3.1415 };
````

+ 使用,例：
````java
// 定义一个函数式接口
@FunctionalInterface
public interface MyMap{
    int getKV(int k, int v);
}

// 调用
public static void main(String[] args) {
    MyMap myMap = (int a,int b)-> a + b;
    int kv = myMap.getKV(5, 6);
    System.out.println(kv);
}
````

+ Lambda 表达式的结构:
  - 一个 Lambda 表达式可以有零个或多个参数。
  - 参数的类型既可以明确声明，也可以根据上下文来推断。例如：(int a)与(a)效果相同。
  - 所有参数需包含在圆括号内，参数之间用逗号相隔。例如：(a, b) 或 (int a, int b) 或 (String a, int b, float c)
  - 空圆括号代表参数集为空。例如：() -> 42
  - 当只有一个参数，且其类型可推导时，圆括号（）可省略。例如：a -> return a*a
  - Lambda 表达式的主体可包含零条或多条语句。
  - 如果 Lambda 表达式的主体只有一条语句，花括号{}可省略。匿名函数的返回类型与该主体表达式一致。
  - 如果 Lambda 表达式的主体包含一条以上语句，则表达式必须包含在花括号{}中（形成代码块）。匿名函数的返回类型与代码块的返回类型一致，若没有返回则为空。

+ 方法引用：是Java 8中提出的用来简化lambda表达式的一种手段。它通过类名和方法名来定位到一个静态方法或者实例方法。 方法引用在Java 8中的使用非常灵活。总的来说，可以分为以下几种：  
  - 静态方法引用：`ClassName::methodName`
  ````java
  List<Integer> ints = Arrays.asList(1, 2, 3);
  ints.sort(Integer::compare);
  ````
  - 实例上的实例方法引用：` instanceReference::methodName` 方法引用使用”::”定义，”::”的前半部分表示类名或者实例名，后半部分表示方法名称。如果是构造函数，则使用new表示。
  ````java
  words.forEach(System.out::println);

  words.stream().map(word -> word.length()); // lambda
  words.stream().map(String::length); // method reference

  // lambda
  words.stream().map(word -> {
      return new StringBuilder(word);
  });
  // constructor reference
  words.stream().map(StringBuilder::new);
  ````
  
### 函数式接口
::: tip
函数式接口：它指的是有且只有一个未实现的方法的接口，一般通过`@FunctionalInterface`这个注解来表明某个接口是一个函数式接口。函数式接口是Java支持函数式编程的基础。
:::

+ `Consumer<T>` 
```` java
- T：入参类型；没有出参
- 调用方法：void accept(T t);
- 定义函数示例：Consumer<String> consumer= p -> System.out.println(p);
- 调用函数示例：consumer.accept("a b c");
````
  
+ `Function<T, R> ` 
````java
- T: 入参类型;R:出参类型
- 调用方法：R apply(T t); 
- 定义函数示例：Function<Integer, Integer> func = p -> p * 10; 
- 调用函数示例：func.apply(10); 
````

+ `Predicate<T>` 
````java
- T：入参类型；出参类型是Boolean
- 调用方法：boolean test(T t);
- 定义函数示例：Predicate<Integer> predicate = p -> p % 2 == 0;  
- 调用函数示例：predicate.test(100);
````

+ `Supplier<T>` 
````java
- T：出参类型；没有入参
- 调用方法：T get();
- 定义函数示例：Supplier<Integer> supplier= () -> 100;  
- 调用函数示例：supplier.get();
````

### 函数式编程接口的使用

### `Stream `
:::tip
Stream可以对多个元素进行一系列的操作，也可以支持对某些操作进行并发处理。
:::
  - `Stream`对象的创建:
````java
//a: 创建空的Stream对象
Stream stream = Stream.empty();
//b: 通过集合类中的stream或者parallelStream方法创建
List<String> list = Arrays.asList("a", "b", "c", "d");
Stream listStream = list.stream();                   //获取串行的Stream对象
Stream parallelListStream = list.parallelStream();   //获取并行的Stream对象  
//c:通过Stream中的of方法创建
Stream s = Stream.of("test");
Stream s1 = Stream.of("a", "b", "c", "d");
//d:通过Stream中的iterate方法创建
public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f);  
public static<T> Stream<T> iterate(T seed, Predicate<? super T> hasNext, UnaryOperator<T> next)
````
  - `Stream`对象的使用
  Stream对象提供多个非常有用的方法，这些方法可以分成两类： 
    - 中间操作：将原始的Stream转换成另外一个Stream；如filter返回的是过滤后的Stream。 
    - 终端操作：产生的是一个结果或者其它的复合操作；如count或者forEach操作。

**所有中间操作**
方法 | 说明   
- | :-: | :-: | :-: | -:
sequential | 返回一个相等的串行的Stream对象，如果原Stream对象已经是串行就可能会返回原对象 
parallel | 返回一个相等的并行的Stream对象，如果原Stream对象已经是并行的就会返回原对象
unordered | 返回一个不关心顺序的Stream对象，如果原对象已经是这类型的对象就会返回原对象 
onClose | 返回一个相等的Steam对象，同时新的Stream对象在执行Close方法时会调用传入的Runnable对象 
close | 关闭Stream对象 
filter | 元素过滤：对Stream对象按指定的Predicate进行过滤，返回的Stream对象中仅包含未被过滤的元素 
map | 元素一对一转换：使用传入的Function对象对Stream中的所有元素进行处理，返回的Stream对象中的元素为原元素处理后的结果 
mapToInt | 元素一对一转换：将原Stream中的使用传入的IntFunction加工后返回一个IntStream对象 
flatMap | 元素一对多转换：对原Stream中的所有元素进行操作，每个元素会有一个或者多个结果，然后将返回的所有元素组合成一个统一的Stream并返回 
distinct | 去重：返回一个去重后的Stream对象 
sorted | 排序：返回排序后的Stream对象 
peek | 使用传入的Consumer对象对所有元素进行消费后，返回一个新的包含所有原来元素的Stream对象 
limit | 获取有限个元素组成新的Stream对象返回 
skip | 抛弃前指定个元素后使用剩下的元素组成新的Stream返回 


**所有终端操作**
方法 | 说明   
- | :-: | :-: | :-: | -:
iterator | 返回Stream中所有对象的迭代器
spliterator | 返回对所有对象进行的spliterator对象
forEach | 对所有元素进行迭代处理，无返回值
forEachOrdered | 按Stream的Encounter所决定的序列进行迭代处理，无返回值
toArray | 返回所有元素的数组
reduce | 使用一个初始化的值，与Stream中的元素一一做传入的二合运算后返回最终的值。每与一个元素做运算后的结果，再与下一个元素做运算。它不保证会按序列执行整个过程。
collect | 根据传入参数做相关汇聚计算
min | 返回所有元素中最小值的Optional对象；如果Stream中无任何元素，那么返回的Optional对象为Empty
max | 与Min相反
count | 所有元素个数
anyMatch | 只要其中有一个元素满足传入的Predicate时返回True，否则返回False
allMatch | 所有元素均满足传入的Predicate时返回True，否则False
noneMatch | 所有元素均不满足传入的Predicate时返回True，否则False
findFirst | 返回第一个元素的Optioanl对象；如果无元素返回的是空的Optional； 如果Stream是无序的，那么任何元素都可能被返回
findAny | 返回任意一个元素的Optional对象，如果无元素返回的是空的Optioanl。
isParallel | 判断是否当前Stream对象是并行的

- 常用的方法举例：
  - `filter`
  ````java
  //方法定义
  Stream<T> filter(Predicate<? super T> predicate);
  ````
  ````java
  //使用示例：
  Stream<String> s = Stream.of("test", "t1", "t2", "teeeee", "aaaa");
  //查找所有包含t的元素并进行打印
  s.filter(n -> n.contains("t")).forEach(System.out::println);
  ````
  - `map`
  ````java
  //方法定义
  <R> Stream<R> map(Function<? super T, ? extends R> mapper);
  ````
  ````java
  //使用示例：
  Stream<String> s = Stream.of("test", "t1", "t2", "teeeee", "aaaa");
  s.map(n -> n.concat(".txt")).forEach(System.out::println);
  ````
  - `flatMap`
  ````java
  //方法定义
  <R> Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> mapper);
  ````
  ````java
  //使用示例：
  Stream<String> s = Stream.of("test", "t1", "t2", "teeeee", "aaaa");
  s.flatMap(n -> Stream.of(n.split(""))).forEach(System.out::println);
  ````
 

### `Optional`
:::tip
用于简化Java中对空值的判断处理，以防止出现各种空指针异常。
Optional实际上是对一个变量进行封装，它包含有一个属性value，实际上就是这个变量的值。
:::

+ `Optional`对象创建:
````java
//empty用于创建一个空的Optional对象；其value属性为Null。
Optional o = Optional.empty();
//of根据传入的值构建一个Optional对象; 传入的值必须是非空值，
//否则如果传入的值为空值，则会抛出空指针异常。
Optional o = Optional.of("test");
//ofNullable根据传入值构建一个Optional对象,传入的值可以是空值，
//如果传入的值是空值，则与empty返回的结果是一样的
Optional o = Optional.ofNullable(null);
````
+ `Optional`方法

 方法名 | 说明   
 - | :-: | :-: | :-: | -:
 get | 获取Value的值，如果Value值是空值，则会抛出NoSuchElementException异常；因此返回的Value值无需再做空值判断，只要没有抛出异常，都会是非空值。
 isPresent | Value是否为空值的判断；
 ifPresent | 当Value不为空时，执行传入的Consumer；
 ifPresentOrElse | Value不为空时，执行传入的Consumer；否则执行传入的Runnable对象；
 filter	 | 当Value为空或者传入的Predicate对象调用test(value)返回False时，返回Empty对象；否则返回当前的Optional对象
 map | 一对一转换：当Value为空时返回Empty对象，否则返回传入的Function执行apply(value)后的结果组装的Optional对象；
 flatMap | 一对多转换：当Value为空时返回Empty对象，否则传入的Function执行apply(value)后返回的结果（其返回结果直接是Optional对象）
 or | 如果Value不为空，则返回当前的Optional对象；否则，返回传入的Supplier生成的Optional对象；
 stream | 如果Value为空，返回Stream对象的Empty值；否则返回Stream.of(value)的Stream对象；
 orElse | Value不为空则返回Value，否则返回传入的值；
 orElseGet | Value不为空则返回Value，否则返回传入的Supplier生成的值；
 orElseThrow | Value不为空则返回Value，否则抛出Supplier中生成的异常对象；

 + `Optional`使用场景
   - 判断结果不为空后使用
   ````java
   public class Demo {
    //获取字符串
    public static String getStr() {
        Random random = new Random();
        int i = random.nextInt(5);
        return i % 2 == 0 ? "not null" : null;
    }
    //打印string
    public static void sy(String n) {
        System.out.println(n);
    }
    //判断getStr()不为null，执行sy()方法
    public static void main(String[] args) {
        Optional o1 = Optional.ofNullable(getStr());
        o1.ifPresent(n -> sy((String) n));

     }
   }
   ````

   - 变量为空时提供默认值
    ````java
    public class Demo {

    public static String getStr() {
        Random random = new Random();
        int i = random.nextInt(5);
        return i % 2 == 0 ? "not null" : null;
    }

    //为空时默认值为'is null'
    public static void main(String[] args) {
        Optional o1 = Optional.ofNullable(getStr());
        System.out.println(o1.orElse("is null"));
      }
    }
    ````

   - 变量为空时抛出异常，否则使用
    ````java
    public class Demo {

    public static String getStr() {
        Random random = new Random();
        int i = random.nextInt(5);
        return i % 2 == 0 ? "not null" : null;
    }

    
    public static void main(String[] args) throws Throwable {
          Optional o1 = Optional.ofNullable(getStr());
          System.out.println(o1.orElseThrow(() -> new AppException("test")));
        }
    }
    ````
   
