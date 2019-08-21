## String 源码分析 JDK8

### 概述
+ `String`实现了`Serializable`、 `Comparable`、 `CharSequence`接口。`Comparable`接口实现了compareTo(T 0)方法，用于比较对象大小，`CharSequence`接口对多种不同的对char访问的统一接口，包括length(), charAt(int index), subSequence(int start, int end)这几个API接口。

+ `String`类是被final修饰的，表明了其定义的对象是不可变的。

### 变量
````java
 //存储String内容
 private final char value[];
 //ash是String实例化的hashcode的一个缓存
 private int hash; // Default to 0
 //CASE_INSENSITIVE_ORDER，其根本就是持有一个静态内部类，用于忽略大小写得比较两个字符串。
 public static final Comparator<String> CASE_INSENSITIVE_ORDER
                                         = new CaseInsensitiveComparator();
````
+ `value[]`数组是存储String的内容的，所有String定义的对象，本质上保存在char类型的数组中。且final修饰的。

+ `hash` String重写了hashCode方法，用于String之间的比较，String类的hash采用多项式计算得来，可能存在不同String计算得来相同的hash。也就是说，String相等的必然hash相同，但hash相同的不一定String相等。


### 构造器
````java
//不含参数的构造函数，一般没什么用，因为value是不可变量
public String() {
    this.value = "".value;
}

//参数为String类型
public String(String original) {
    this.value = original.value;
    this.hash = original.hash;
}

//参数为char数组，使用java.utils包中的Arrays类复制
public String(char value[]) {
    this.value = Arrays.copyOf(value, value.length);
}

//参数为char数组和int，复制value[] 从offset 到 offset + count
public String(char value[], int offset, int count) {
    if (offset < 0) {
        throw new StringIndexOutOfBoundsException(offset);
    }
    if (count <= 0) {
        if (count < 0) {
            throw new StringIndexOutOfBoundsException(count);
        }
        if (offset <= value.length) {
            this.value = "".value;
            return;
        }
    }
    // Note: offset or count might be near -1>>>1.
    if (offset > value.length - count) {
        throw new StringIndexOutOfBoundsException(offset + count);
    }
    this.value = Arrays.copyOfRange(value, offset, offset+count);
}


public String(int[] codePoints, int offset, int count) {
    if (offset < 0) {
        throw new StringIndexOutOfBoundsException(offset);
    }
    if (count <= 0) {
        if (count < 0) {
            throw new StringIndexOutOfBoundsException(count);
        }
        if (offset <= codePoints.length) {
            this.value = "".value;
            return;
        }
    }
    // Note: offset or count might be near -1>>>1.
    if (offset > codePoints.length - count) {
        throw new StringIndexOutOfBoundsException(offset + count);
    }

    final int end = offset + count;

    // Pass 1: Compute precise size of char[]
    int n = count;
    for (int i = offset; i < end; i++) {
        int c = codePoints[i];
        if (Character.isBmpCodePoint(c))
            continue;
        else if (Character.isValidCodePoint(c))
            n++;
        else throw new IllegalArgumentException(Integer.toString(c));
    }

    // Pass 2: Allocate and fill in char[]
    final char[] v = new char[n];

    for (int i = offset, j = 0; i < end; i++, j++) {
        int c = codePoints[i];
        if (Character.isBmpCodePoint(c))
            v[j] = (char)c;
        else
            Character.toSurrogates(c, v, j++);
    }

    this.value = v;
}
````

### API
+ <font color=#A23400 >**equals**</font>
````java
/**
*`equals`比较分三部分，1.比较是否相等。2.比较长度。3.char数组一个一个比较
*/
public boolean equals(Object anObject) {
    if (this == anObject) {
        return true;
    }
    if (anObject instanceof String) {
        String anotherString = (String)anObject;
        int n = value.length;
        if (n == anotherString.value.length) {
            char v1[] = value;
            char v2[] = anotherString.value;
            int i = 0;
            while (n-- != 0) {
                if (v1[i] != v2[i])
                    return false;
                i++;
            }
            return true;
        }
    }
    return false;
}
````

+ <font color=#A23400 >**compareTo**</font>
````java
/**
*`compareTo`1.先获取两个字符串的长度，lim获取短的那个
* 2.循环获取字符串每一个char字符比较，不相等则用原字符串char - 比较的字符串char
* 3.在lim中,未比较出大小，则直接长度比较 原字符串len1 -len2
*/
public int compareTo(String anotherString) {
    int len1 = value.length;
    int len2 = anotherString.value.length;
    int lim = Math.min(len1, len2);
    char v1[] = value;
    char v2[] = anotherString.value;

    int k = 0;
    while (k < lim) {
        char c1 = v1[k];
        char c2 = v2[k];
        if (c1 != c2) {
            return c1 - c2;
        }
        k++;
    }
    return len1 - len2;
}
````
+ <font color=#A23400 >**hashCode**</font>
````java
/**
*`hashCode`方法，1.判断hash是否生成过值，有值直接返回，没值计算
* 2.String为空的话 hash不计算返回0
* 3.计算生成hash值
*/
public int hashCode() {
    int h = hash;
    if (h == 0 && value.length > 0) {
        char val[] = value;

        for (int i = 0; i < value.length; i++) {
            h = 31 * h + val[i];
        }
        hash = h;
    }
    return h;
}
````
+ <font color=#A23400 >**startsWith**</font>
````java
/**
*`startsWith`入参有两位，prefix是要比较的值，toffset 从数组下标哪个开始
* 1. 检查 toffset 位置是否正确,不在范围内false
* 2. 循环比较两个char数组的值，不符合返回false
*/
public boolean startsWith(String prefix, int toffset) {
    char ta[] = value;
    int to = toffset;
    char pa[] = prefix.value;
    int po = 0;
    int pc = prefix.value.length;
    // Note: toffset might be near -1>>>1.
    if ((toffset < 0) || (toffset > value.length - pc)) {
        return false;
    }
    while (--pc >= 0) {
        if (ta[to++] != pa[po++]) {
            return false;
        }
    }
    return true;
}
````
+ <font color=#A23400 >**concat**</font>
````java
/*
*`concat`是对字符串拼接的操作
* 1.判断要拼接的字符串长度是否为0，是的话不操作返回原有字符串
* 2. 新字符串拼接在原字符后面返回一个new String
*/
public String concat(String str) {
    int otherLen = str.length();
    if (otherLen == 0) {
        return this;
    }
    int len = value.length;
    char buf[] = Arrays.copyOf(value, len + otherLen);
    str.getChars(buf, len);
    return new String(buf, true);
}
````
+ <font color=#A23400 >**replace**</font>
````java
/*
*`replace`把oldChar替换成newChar
* 1.两个要替换的相等直接返回
* 2.从0开始循环到value.length
* 3.当找到oldChar跳出循环,未找到则 i==len 不操作字符串
* 4.循环替换旧值，返回new String
*/
public String replace(char oldChar, char newChar) {
    if (oldChar != newChar) {
        int len = value.length;
        int i = -1;
        char[] val = value; /* avoid getfield opcode */

        while (++i < len) {
            if (val[i] == oldChar) {
                break;
            }
        }
        if (i < len) {
            char buf[] = new char[len];
            for (int j = 0; j < i; j++) {
                buf[j] = val[j];
            }
            while (i < len) {
                char c = val[i];
                buf[i] = (c == oldChar) ? newChar : c;
                i++;
            }
            return new String(buf, true);
        }
    }
    return this;
}
````
+ <font color=#A23400 >**trim**</font>
````java
/*
*`trim`
* 1.第一个循环获取string 前面的空格
* 2.第二个循环获取string 后面的空格
* 3.如果有空格截取字符串
*/
public String trim() {
    int len = value.length;
    int st = 0;
    char[] val = value;    /* avoid getfield opcode */

    while ((st < len) && (val[st] <= ' ')) {
        st++;
    }
    while ((st < len) && (val[len - 1] <= ' ')) {
        len--;
    }
    return ((st > 0) || (len < value.length)) ? substring(st, len) : this;
}
````
+ <font color=#A23400 >**intern**</font>
````java
/**
*native 调用。作用如下
* 1. 在方法区中的常量池里通过equals方法寻找等值的对象
* 2. 如果没有找到则在常量池中开辟一片空间存放字符串并返回该对应String的引用，否则直接返回常量池中已存在String对象的引用。
* 3. 可以为new方法创建的 字符对象 也去强制查看常量池 是否已存在
*/
public native String intern();
````
:::tip
````java
String a = "ab1";
String b = new String("ab1");
System.out.println(a == b); //false

String c = "ab1";
String d = new String("ab1").intern();
System.out.println(c == d); //true
````
:::


### 总结

+ `String a = "A"` 和 `String a = new String("A")`区别：
  - `String a = "A"`会在**方法区**常量池中创建一个对象，之后无论创建多少个值为A的字符串对象，指向都是这一个。
  - `String a = new String("A")`会在**堆**中实例化一个新的对象，‘A’这个字符串如果常量池不存在，则还会创建一个字符串对象。之后再创建的 new String("A"),都会创建新的对象。

+ String对象的三种比较方式：
  - `==` 比较的是内存地址是否为同一个
  - `equals`比较的是两个引用所指的对象值是否相等  
  - `hashCode`将字符串数字化，这种b比较不能保证内存一定相同，不保证字面值一定相等  

### 字符串常量池的设计思想
+ 字符串常量池的设计初衷：每个字符串都是一个String对象，系统开发中将会频繁使用字符串，如果像其他对像那样创建销毁将极大影响程序的性能。  
  - JVM为了提高性能和减少内存开销，在实例化字符串的时候进行了优化
    - 为字符串开辟了一个字符串常量池，类似于缓存区
    - 创建字符串常量时，首先判断字符串常量池是否存在该字符串
    - 存在该字符串返回引用实例，不存在，实例化字符串，放入池中
  - 实现基础
    - 实现该优化的基础是每个字符串常量都是final修饰的常量，不用担心常量池存在数据冲突
    - 运行时实例创建的全局字符串常量池中有一个表，总是为池中每个唯一的字符串对象维护一个引用,这就意味着它们一直引用着字符串常量池中的对象，所以，在常量池中的这些字符串不会被垃圾收集器回收。

### 堆、栈、方法区
+ 堆  
  - 存储的是对象，每个对象都包含一个与之对应的class  
  - JVM只存在一个堆区，被所有线程共享，堆中不存在基本类型和对象引用，只存在对象本身 
  - 对象由垃圾回收器负责回收，因此大小和生命周期不需要确定 
+ 栈 
  - 每个线程都包含一个栈区，栈区只存放基础数据类型对象和自定义对象引用   
  - 每个栈中的数据(原始类型和对象引用)都是私有的   
  - 栈分为三个部分，基本类型变量区、执行环境上下文、操作指令区（存放操作指令）  
  - 数据大小和生命周期是可以确定的，当没有引用指向这个数据时，这个数据就会消失  
+ 方法区
  - 静态区，跟堆一样，被所有的线程共享    
  - 方法区包含的都是在整个程序中永远唯一的元素，如class、static变量   

