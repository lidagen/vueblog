## Class 源码解析 JDK8

### 概述
+ `Class`类实现了`Serializable` `GenericDeclaration` `Type` `AnnotatedElement` 接口。
  - `GenericDeclaration` 是接口继承了AnnotatedElement接口，是所有“可以声明（定义）范型变量”的实体（如Class，Constructor，Method）的公共接口。也就是说只有实现了这个接口的才能在对应“实体”上声明“范型变量”。

  - `Type`是Java语言中所有类型的父接口。它并不是我们平常工作中经常使用的 int、String、List、Map等数据类型，而是从Java语言角度来说，对基本类型、引用类型向上的抽象；

  - `AnnotatedElement` 表示目前正在此 VM 中运行的程序的一个已注释元素。该接口允许反射性地读取注释。由此接口中的方法返回的所有注释都是不可变并且可序列化的。调用者可以修改已赋值数组枚举成员的访问器返回的数组；这不会对其他调用者返回的数组产生任何影响。

+ java反射是围绕Class类展开的，jvm将字节码文件加载到方法区内存中并返回一个Class对象。

+ java反射使得我们可以在程序运行时动态加载一个类，动态获取类的基本信息和定义的方法,构造函数,域等。还可以动态创建类的实例，执行类实例的方法，获取类实例的域值。反射使java这种静态语言有了动态的特性。

+ 反射是通过反编译将`.class`文件转换成`.java`,从而操纵类的属性方法。

### 变量
````java
//构造器缓存
private volatile transient Constructor<T> cachedConstructor;
//实例缓存
private volatile transient Class<?>       newInstanceCallerCache;

private transient String name;

private final ClassLoader classLoader;

````

### 构造器
+ Class类构造器私有的，不允许手动创建
````java
private Class(ClassLoader loader) {
    // Initialize final field for classLoader.  The initialization value of non-null
    // prevents future JIT optimizations from assuming this final field is null.
    classLoader = loader;
}
````

### 方法

+ Class类中方法主要有三类：生成实例、获取类信息、类型转换。
  - `生成实例` 一类方法主要有两个：forName方法和newInstance方法。
  - `获取类信息` 一类方法非常多，作用包括获取类的构造方法，已经声明的字段、方法，获取类或者方法的注解，获取类的包名、父类，以及判断类是否是数组、是否是枚举、是否是接口。
  - `类型转换` 该类方法主要有两个： asSubclass方法和 cast

#### 生成实例
+ 此方法主要是根据给定的类名，JVM将类加载、链接、初始化;生成类的实例。
+ 初始化信息和生成实例一般包含两个方法 `forName` 和 `newInstance`:
  - `forName`有两种声明
  ````java
  public static Class<?> forName(String className)
                throws ClassNotFoundException {
        Class<?> caller = Reflection.getCallerClass();
        return forName0(className, true, ClassLoader.getClassLoader(caller), caller);
    }
  ````
  ````java
  public static Class<?> forName(String name, boolean initialize,
                                   ClassLoader loader)
        throws ClassNotFoundException
    {
        Class<?> caller = null;
        SecurityManager sm = System.getSecurityManager();
        if (sm != null) {
            // Reflective call to get caller class is only needed if a security manager
            // is present.  Avoid the overhead of making this call otherwise.
            caller = Reflection.getCallerClass();
            if (sun.misc.VM.isSystemDomainLoader(loader)) {
                ClassLoader ccl = ClassLoader.getClassLoader(caller);
                if (!sun.misc.VM.isSystemDomainLoader(ccl)) {
                    sm.checkPermission(
                        SecurityConstants.GET_CLASSLOADER_PERMISSION);
                }
            }
        }
        return forName0(name, initialize, loader, caller);
    }
  ````
  - 最终两个`forName`方法,都调用了`forName0`方法,这是一个本地方法。
  - 在`forName`方法实现中，出现了两个类，一个是`SecurityManager`，另一个是`ClassLoader`
    - 其中`SecurityManager`是jvm提供的在应用层进行安全检查的机制，应用程序可以根据策略文件被赋予一定的权限，例如是否可以读写文件，是否可以读写网络端口，是否可以读写内存，是否可以获取类加载器……。在进行特殊操作时，需要进行安全检查，从而给程序的运行安全提供一定保障。
    - 而`ClassLoader`则涉及到另一个大的话题：类加载，我们程序运行中使用的类都需要由类加载器来完成加载，并执行一定的初始化，随后才可以被我们使用。

+ `newInstance`:类加载完成后就需要实例化了，需要用到此方法。
````java
public T newInstance()
    throws InstantiationException, IllegalAccessException
{   // 进行安全检查
    if (System.getSecurityManager() != null) {
        checkMemberAccess(Member.PUBLIC, Reflection.getCallerClass(), false);
    }

  

  // 每次先检查是否有已经缓存过的构造器，如果没有，则重新获取
    if (cachedConstructor == null) {
        if (this == Class.class) {
            throw new IllegalAccessException(
                "Can not call newInstance() on the Class for java.lang.Class"
            );
        }
        try {
            Class<?>[] empty = {};
            // 获取该类已经声明的的无参构造方法
            final Constructor<T> c = getConstructor0(empty, Member.DECLARED);
           // 此处是为了使无参构造方法可以被访问，因为有时，构造方法被声明为private的
            java.security.AccessController.doPrivileged(
                new java.security.PrivilegedAction<Void>() {
                    public Void run() {
                            c.setAccessible(true);
                            return null;
                        }
                    });
             // 将获取的无参构造方法缓存        
            cachedConstructor = c;
        } catch (NoSuchMethodException e) {
            throw (InstantiationException)
                new InstantiationException(getName()).initCause(e);
        }
    }
    Constructor<T> tmpConstructor = cachedConstructor;
   // 获取构造方法的语言修饰符，诸如public,private,static,final等
    int modifiers = tmpConstructor.getModifiers();
     // 根据已经获取的语言修饰符判断是否具有访问权限，如果没有，则执行以下操作
    if (!Reflection.quickCheckMemberAccess(this, modifiers)) {
        Class<?> caller = Reflection.getCallerClass();
        if (newInstanceCallerCache != caller) {
            Reflection.ensureMemberAccess(caller, this, null, modifiers);
            newInstanceCallerCache = caller;
        }
    }
    // 整个方法的核心，使用类的构造方法来生成实例
    try {
        return tmpConstructor.newInstance((Object[])null);
    } catch (InvocationTargetException e) {
        Unsafe.getUnsafe().throwException(e.getTargetException());
        // Not reached
        return null;
    }
}
````  
  - newInstance的具体实现，本质上是获取的类的无参构造方法，然后执行无参构造方法来生成实例。 
  - 所以说反射必须依赖类的无参构造器。否则会抛出`InstantiationException`
   

#### 获取类信息

+ 这一类方法非常多，作用包括获取类的构造方法，已经声明的字段、方法，获取类或者方法的注解，获取类的包名、父类，以及判断类是否是数组、是否是枚举、是否是接口。
+ 获取类信息之前必须先生成实例，即调用`froName` `newInstance`方法。
+ 以获取方法举例：
````java
public class ReflectDemo {

    private String reflectString = "abc";
    //因为有 *有参构造器* 所有需要显示的定义一个无参构造器用于反射生成实例
    ReflectDemo() {
    }

    ReflectDemo(String reflectString) {
        this.reflectString = reflectString;
    }
    //1.私有方法
    private void priMethod(int a) {
        System.out.println("this is [private] method");
    }
    //2.公有方法
    public void pubMethod() {
        System.out.println("this is [public] method");
    }
    //3.有参方法
    public String getMath(int a, int b) {
        BigDecimal bigDecimalA = BigDecimal.valueOf(a);
        BigDecimal bigDecimalB = BigDecimal.valueOf(b);
        BigDecimal bigDecimal = bigDecimalA.divide(bigDecimalB, 2, RoundingMode.HALF_UP);
        return String.valueOf(bigDecimal);
    }
    //4.可变参数方法
    public String addString(String... args) {
        StringBuilder sb = new StringBuilder();
        for (String arg : args) {
            sb.append(arg).append("|");
        }
        return sb.substring(0, sb.length() - 1);
    }

}

````
````java
public class App {
    public static void main(String[] args) throws Exception {
        Class<?> reflectDemo = Class.forName("com.project.ReflectDemo");
        Object o1 = reflectDemo.newInstance();
        //获取所有方法
        Method[] methods = reflectDemo.getMethods();

        //1
        Method priMethod = reflectDemo.getDeclaredMethod("priMethod");
        //功能是启用或禁用安全检查
        priMethod.setAccessible(true);
        priMethod.invoke(o1);

        //2
        Method pubMethod = reflectDemo.getMethod("pubMethod");
        pubMethod.invoke(o1);

        //3
        //因为入参是int 基本数据类型，这里也写int.class
        Method pubMethod3 = reflectDemo.getMethod("getMath", int.class, int.class);
        String invoke = (String) pubMethod3.invoke(o1, 10, 3);
        System.out.println(invoke);

        //4
        //可变参数写法，可变参数本质是一个数组，外层需要包一个new Class[]{}, invoke时候包一个new Object[]{}
        //否则报错
        Method pubMethod4 = reflectDemo.getMethod("addString", new Class[]{String[].class});
        Object invoke1 = pubMethod4.invoke(o1,new Object[]{new String[]{"123", "345"}});
        System.out.println(invoke1.toString());

    }
}
````
+ 获取私有方法调用，需要调用`setAccessible(true);`方法，关闭安全检查，这时程序不会检查访问修饰符


#### 类型转换
+ 类型转换方法有两个 `asSubclass` `cast`
````java
/**
 * 将类转换为它的子类Class
 * @param clazz 父类的Class
 * @param <U> 父类
 * @return U的子类Class
 */
public <U> Class<? extends U> asSubclass(Class<U> clazz) {
    // 判断clazz是否是当前类，或者是当前类的父类
    if (clazz.isAssignableFrom(this))
        return (Class<? extends U>) this;
    else
        throw new ClassCastException(this.toString());
}

/**
 * 将给定的类转换为当前Class所代表的类
 * @param obj 需要转换的类
 * @return 当前Class所代表的类
 */
public T cast(Object obj) {
    // obj不为null，并且可以被转换为当前Class代表的类
    // isInstance为native方法，类似于instanceOf的作用
    if (obj != null && !isInstance(obj))
        throw new ClassCastException();
    return (T) obj;
}
````

### 总结

+ Class.forName("") 与  ClassLoader.getSystemClassLoader().loadClass("")
  -  Class.forName加载类是将类进了初始化(相当于调用无参构造函数,会调用static静态代码来初始化配置)
  -  ClassLoader的loadClass并没有对类进行初始化，只是把类加载到了虚拟机中

+ 反射作用是把.class文件反编译,生成实例，动态获取实例的属性方法等。

+ spring 依赖注入也是这种反射机制获取对象  