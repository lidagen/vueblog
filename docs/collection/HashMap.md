## HashMap 源码 JDK8

### 概述
+ `HashMap`实现了`AbstractMap` `Map` `Cloneable` `Serializable`接口、抽象类。

+ `HashMap` JDK8中,采用Entry的**数组+链表+红黑树**实现。称之为哈希桶。使用链表处理冲突,同一hash值,存储在一个链表里。当链表长度超过阈值(8),将链表转换为红黑树。

+ `HashMap` 通过 key 的 hashCode经过<font color=#A23400 >**扰动函数**</font>处理过后得到hash值。然后通过 `(n-1) & hash` 判断当前元素存放的位置(n 指的是数组长度)。如果当前位置存在
元素的话,判断此元素 hash 值以及 key 是否相同,相同的话直接覆盖,不相同通过<font color=#A23400 >**拉链法**</font>解决冲突。
:::tip
+ `拉链法`又叫链地址法，Java中的HashMap在存储数据的时候就是用的拉链法来实现的，拉链发就是把具有相同散列地址的关键字(同义词)值放在同一个单链表中，称为同义词链表。
+ `扰动函数`指的就是 HashMap 的 hash 方法。使用 hash 方法也就是扰动函数是为了防止一些实现比较差的 hashCode() 方法 换句话说使用扰动函数之后可以减少碰撞。
::: 

### 变量
````java
//默认容量
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
//最大容量2的30次方
static final int MAXIMUM_CAPACITY = 1 << 30;
//默认负载因子
static final float DEFAULT_LOAD_FACTOR = 0.75f;
//当桶(bucket)上的结点数大于这个值时会转成红黑树
static final int TREEIFY_THRESHOLD = 8;
// 当桶(bucket)上的结点数小于这个值时树转链表
static final int UNTREEIFY_THRESHOLD = 6;
// 桶中结构转化为红黑树对应的table的最小大小
static final int MIN_TREEIFY_CAPACITY = 64;
//哈希桶，存放链表。 长度是2的N次方，或者初始化时为0.
transient Node<K,V>[] table;
// 存放具体元素的集
transient Set<Map.Entry<K,V>> entrySet;
// 存放元素的个数，注意这个不等于数组的长度。
transient int size;
//计数器
transient int modCount;
//哈希表内元素数量的阈值，当哈希表内元素数量超过阈值时，会发生扩容resize()
int threshold;
//加载因子，用于计算哈希表元素数量的阈值。  threshold = 哈希桶.length * loadFactor;
final float loadFactor;
````
::: tip
+ `loadFactor 加载因子` 控制数组存放数据的疏密程度，loadFactor越趋近于1，那么 数组中存放的数据(entry)也就越多，也就越密，也就是会让链表的长度增加，load Factor越小，也就是趋近于0
+ `threshold 阈值` threshold = capacity * loadFactor，当size >= threshold的时候，那么就要考虑对数组的扩增了，也就是说，这个的意思就是 衡量数组是否需要扩增的一个标准。
:::
### Node 结构

````java
//Map.Entry为Map接口的一个内部接口。它表示Map中的一个实体<K,V>对
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;

    Node(int hash, K key, V value, Node<K,V> next) {
        this.hash = hash;
        this.key = key;
        this.value = value;
        this.next = next;
    }

    public final K getKey()        { return key; }
    public final V getValue()      { return value; }
    public final String toString() { return key + "=" + value; }
     //每一个节点的hash值，是将key的hashCode 和 value的hashCode 异或运算得到的。
    public final int hashCode() {
        return Objects.hashCode(key) ^ Objects.hashCode(value);
    }

    public final V setValue(V newValue) {
        V oldValue = value;
        value = newValue;
        return oldValue;
    }

    public final boolean equals(Object o) {
        if (o == this)
            return true;
        if (o instanceof Map.Entry) {
            Map.Entry<?,?> e = (Map.Entry<?,?>)o;
            if (Objects.equals(key, e.getKey()) &&
                Objects.equals(value, e.getValue()))
                return true;
        }
        return false;
    }
}
````
::: tip
+ Node结构包含4个参数,key、hash都是final修饰,next为下一个节点
+ 从Node结构看出是一个单向链表.
:::
### TreeNode 结构
````java
static final class TreeNode<K,V> extends LinkedHashMap.Entry<K,V> {
    TreeNode<K,V> parent;  // 父
    TreeNode<K,V> left;    // 左
    TreeNode<K,V> right;   // 右
    TreeNode<K,V> prev;    // needed to unlink next upon deletion
    boolean red;           // 判断颜色
    TreeNode(int hash, K key, V val, Node<K,V> next) {
        super(hash, key, val, next);
    }
    // 返回根节点
    final TreeNode<K,V> root() {
        for (TreeNode<K,V> r = this, p;;) {
            if ((p = r.parent) == null)
                return r;
            r = p;
    }
````

### 构造器
````java
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                            initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                            loadFactor);
    this.loadFactor = loadFactor;
    //设置阈值为 >=初始化容量的 2的n次方的值
    this.threshold = tableSizeFor(initialCapacity);
}

public HashMap(int initialCapacity) {
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}

public HashMap() {
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all other fields defaulted
}

public HashMap(Map<? extends K, ? extends V> m) {
    this.loadFactor = DEFAULT_LOAD_FACTOR;
    //入参map加入表中
    putMapEntries(m, false);
}
````
+ 构造器用到的方法
````java
static final int tableSizeFor(int cap) {
    int n = cap - 1;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    return (n < 0) ? 1 : (n >= MAXIMUM_CAPACITY) ? MAXIMUM_CAPACITY : n + 1;
}

final void putMapEntries(Map<? extends K, ? extends V> m, boolean evict) {
    int s = m.size();
    if (s > 0) {
         // 判断table是否已经初始化
        if (table == null) { 
         // 未初始化，s为m的实际元素个数
            float ft = ((float)s / loadFactor) + 1.0F;
            int t = ((ft < (float)MAXIMUM_CAPACITY) ?
                        (int)ft : MAXIMUM_CAPACITY);
            // 计算得到的t大于阈值，则初始化阈值            
            if (t > threshold)
                threshold = tableSizeFor(t);
        }
        // 已初始化，并且m元素个数大于阈值，进行扩容处理
        else if (s > threshold)
            resize();
        // 将m中的所有元素添加至HashMap中    
        for (Map.Entry<? extends K, ? extends V> e : m.entrySet()) {
            K key = e.getKey();
            V value = e.getValue();
            putVal(hash(key), key, value, false, evict);
        }
    }
}
````
### API
### 总结 