## ArrayList 源码解析 JDK8

### 概述

+ `ArrayList` 是一个 **动态数组**,其底层是数组。它实现了 `AbstractList` `List` `RandomAccess` `Cloneable` `java.io.Serializable`
几个接口、实现类。

+ `ArrayList` 继承了 `AbstractList`,实现了 `List` 。它是一个数组队列，提供了相关的*添加*、*删除*、*修改*、*遍历*等功能

+  `ArrayList` 实现`RandomAccess`接口 ,支持**快速随机访问**。ArrayList实现了,LinkedList未实现,它的作用是 *Collections.binarySearch()* 方法中,通过 *instanceof* 判断遍历集合的方式。
    实现了此接口,for 循环遍历,否则 Iterator 迭代遍历查找元素。
    ````java
    public static <T>
    int binarySearch(List<? extends Comparable<? super T>> list, T key) {
        if (list instanceof RandomAccess || list.size()<BINARYSEARCH_THRESHOLD)
            return Collections.indexedBinarySearch(list, key);
        else
            return Collections.iteratorBinarySearch(list, key);
    }
    ````
+ `ArrayList` 实现了 `Cloneable`接口。支持克隆
::: tip
  + `cloneable`其实就是一个标记接口，只有实现这个接口后，然后在类中重写Object中的clone方法，然后通过类调用clone方法才能克隆成功.
  + 如何判断类实现了 `cloneable`接口?  
    **native**关键字,每一个native方法在jvm中都有一个同名的实现体，native方法在逻辑上的判断都是由实现体实现的.
    判断是否实现cloneable接口，是在调用jvm中的实现体时进行判断的。

:::

+ `ArrayList`是默认大小为 10 的数组,扩容为原来容量的 1.5 倍。由于其扩容是个**消耗较大的操作**,所以在**已知数据大小**的前提下,指定容器大小。或者在需要扩容时,手动调用 `public void ensureCapacity(int minCapacity) {}`方法。

+ `ArrayList`特点时增删慢,查询快。
  - **查询**时,直接根据下标直接获取。<font color=#900000 >复杂度 O(1)</font>
  ````java
  E elementData(int index) {
        return (E) elementData[index];
    }
  ````
  - **增加**时,*add(element)* 会先确认容量是否足够,不够需要扩容。*add(index,element)* 查询后添加,插入位置后的元素都需要往后移一位。需要调用 *System.arraycopy()* 方法对数组进行复制操作。<font color=#900000 >复杂度 O(n)</font>
  - **删除**时,也会移动删除位置后的元素,调用 *System.arraycopy()*,对数组进行重排。 <font color=#900000 >复杂度 O(n)</font>
  ````java
  public void add(int index, E element) {
        rangeCheckForAdd(index);

        ensureCapacityInternal(size + 1);  // Increments modCount!!
        System.arraycopy(elementData, index, elementData, index + 1,
                         size - index);
        elementData[index] = element;
        size++;
    }
  ````

  ### 变量
  ````java
  // 默认初始化容量
  private static final int DEFAULT_CAPACITY = 10;
  // 空的数组
  private static final Object[] EMPTY_ELEMENTDATA = {};
  // 默认容量的空数组
  private static final Object[]  DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};
  // 真正存放对象的数组
  transient Object[] elementData; 
  // 容器的大小
  private int size;
  ````

  ### 构造器
  ````java
  /**默认无参构造器的容器**/
  public ArrayList() {
        this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
    }
  /**指定一个初始大小的容器**/
  public ArrayList(int initialCapacity) {
        if (initialCapacity > 0) {
            this.elementData = new Object[initialCapacity];
        } else if (initialCapacity == 0) {
            this.elementData = EMPTY_ELEMENTDATA;
        } else {
            throw new IllegalArgumentException("Illegal Capacity: "+
                                               initialCapacity);
        }
    }
  /**使用集合类来构建ArrayList**/
  public ArrayList(Collection<? extends E> c) {
        elementData = c.toArray();
        //因为size代表的是集合元素数量，通过集合类构造ArrayList时,给size赋值
        if ((size = elementData.length) != 0) {
            // 这里是当c.toArray出错,利用Arrays.copyOf 来复制集合c中的元素到elementData数组中
            if (elementData.getClass() != Object[].class)
                elementData = Arrays.copyOf(elementData, size, Object[].class);
        } else {
            // size=0时
            this.elementData = EMPTY_ELEMENTDATA;
        }
    }  
  ````
  :::tip
  实例化ArrayList后,会构建出数组 *elementData* 和数量 *size*
  :::

  ### API
  + **增**
    + <font color=#A23400 >add(E e)</font>
    ````java
    public boolean add(E e) {
        ensureCapacityInternal(size + 1);  // 判断是否需要扩容
        elementData[size++] = e;
        return true;
    }
    ````
    
    + <font color=#A23400 >add(int index, E element)</font>
    ````java
    //
    public void add(int index, E element) {
        rangeCheckForAdd(index);//检查下标是否越界
        ensureCapacityInternal(size + 1);  // 判断是否需要扩容
        System.arraycopy(elementData, index, elementData, index + 1,
                         size - index);//copy数组,index后数据后移一位
        elementData[index] = element;
        size++;//size+1
    }
    ````

    + <font color=#A23400 >addAll(Collection<? extends E> c)</font>
    ````java
    public boolean addAll(Collection<? extends E> c) {
        Object[] a = c.toArray();
        int numNew = a.length;
        ensureCapacityInternal(size + numNew);  // 判断是否需要扩容
        System.arraycopy(a, 0, elementData, size, numNew);
        size += numNew;
        return numNew != 0;
    }
    ````
    + <font color=#A23400 >addAll(int index, Collection<? extends E> c) </font>
    ````java
    public boolean addAll(int index, Collection<? extends E> c) {
        rangeCheckForAdd(index);//检查index是否越界

        Object[] a = c.toArray();
        int numNew = a.length;
        ensureCapacityInternal(size + numNew);  // 判断是否需要扩容

        int numMoved = size - index;
        if (numMoved > 0)//index在中间
            System.arraycopy(elementData, index, elementData, index + numNew,
                             numMoved);
        //index 最后一位
        System.arraycopy(a, 0, elementData, index, numNew);
        size += numNew;
        return numNew != 0;
    }
    ````

    ::: tip
    `rangeCheckForAdd(int index)` 检查下标是否越界
    `ensureCapacityInternal(int index)` 此方法判断入参index-elementData.length > 0,如果是，调用grow()方法对数组扩容
    ````java
    private void grow(int minCapacity) {
        // overflow-conscious code
        int oldCapacity = elementData.length;
        int newCapacity = oldCapacity + (oldCapacity >> 1);
        if (newCapacity - minCapacity < 0)
            newCapacity = minCapacity;
        if (newCapacity - MAX_ARRAY_SIZE > 0)
            newCapacity = hugeCapacity(minCapacity);
        // minCapacity is usually close to size, so this is a win:
        elementData = Arrays.copyOf(elementData, newCapacity);
    }
    ````
    :::

+ **删**    
  - <font color=#A23400 >remove(int index)</font>
  ````java
  public E remove(int index) {
        rangeCheck(index);//下标越界检查
        modCount++;
        E oldValue = elementData(index);//获取原来的元素
        int numMoved = size - index - 1;
        if (numMoved > 0)//判断index是否最后一个元素
            System.arraycopy(elementData, index+1, elementData, index,
                             numMoved);
        elementData[--size] = null; // 清除最后一个
        return oldValue;
    }
  ````

  - <font color=#A23400 >remove(Object o)</font>
  ````java
  //分为null和非null,处理流程相同,非null equals比较null == 比较
  public boolean remove(Object o) {
        if (o == null) {
            for (int index = 0; index < size; index++)
                if (elementData[index] == null) {
                    fastRemove(index);
                    return true;
                }
        } else {
            for (int index = 0; index < size; index++)
                if (o.equals(elementData[index])) {
                    fastRemove(index);
                    return true;
                }
        }
        return false;
    }
  ````

  - <font color=#A23400 >removeAll(Collection<?> c)</font> 剔除在指定集合中的元素
  ````java
  public boolean removeAll(Collection<?> c) {
        Objects.requireNonNull(c);//判断元素不为null
        return batchRemove(c, false);
    }
  ````

  - <font color=#A23400 >retainAll(Collection<?> c)</font> 剔除不在指定集合的元素
  ````java
  public boolean retainAll(Collection<?> c) {
        Objects.requireNonNull(c);
        return batchRemove(c, true);
    }
  ````

  ::: tip
  `fastRemove(int index)` 快速移除元素,与`public E remove(int index)`区别就是少了校验和获取*oldValue*操作
  ````java
  private void fastRemove(int index) {
        modCount++;
        int numMoved = size - index - 1;
        if (numMoved > 0)
            System.arraycopy(elementData, index+1, elementData, index,
                             numMoved);
        elementData[--size] = null; // clear to let GC do its work
    }
  ````
  `batchRemove(Collection<?> c, boolean complement)` 集合操作： `removeAll(Collection<?> c)` 和 `retainAll(Collection<?> c)`都用了此方法，区别是
  第二个参数一个是 *true* 一个 *false*
  ````java
  private boolean batchRemove(Collection<?> c, boolean complement) {
        final Object[] elementData = this.elementData;
        int r = 0, w = 0;//w 代表批量删除后 数组还剩多少元素
        boolean modified = false;
        try {
            for (; r < size; r++)
        //这块代码很精妙
        /**c.contains(elementData[r])返回boolean值,表示c中有没有elementData[i]元素
        *当batchRemove(c, true),如果包含成立,包含的保存 ,移除非入参的集合内容=> retainAll
        *当batchRemove(c, false),如果不包含成立,不包含的保存,移除入参集合元素 =>removeAll
        **/
            if (c.contains(elementData[r]) == complement)
                elementData[w++] = elementData[r];
        } finally {
            // 如果出现异常处理情况
            if (r != size) {
                System.arraycopy(elementData, r,
                                 elementData, w,
                                 size - r);
                w += size - r;
            }
            if (w != size) {
                // clear to let GC do its work
                for (int i = w; i < size; i++)
                    elementData[i] = null;
                modCount += size - w;
                size = w;
                modified = true;
            }
        }
        return modified;
    }
  ````
  :::

+ **改**  
  - <font color=#A23400 >set(int index, E element)</font>
  ````java
  public E set(int index, E element) {
    rangeCheck(index);//越界检查
    E oldValue = elementData(index); //取出元素 
    elementData[index] = element;//覆盖元素
    return oldValue;//返回元素
  }
  ````
+ **查**
  - <font color=#A23400 >get(int index)</font>
  ````java
  public E get(int index) {
    rangeCheck(index);//越界检查
    return elementData(index); //下标取数据
  }
  ````
+ **迭代器 ListIterator**
````java
public ListIterator<E> listIterator() {
    return new ListItr(0);
}

private class ListItr extends Itr implements ListIterator<E> {
    ListItr(int index) {
        super();
        cursor = index;
    }

    public boolean hasPrevious() {
        return cursor != 0;
    }

    public int nextIndex() {
        return cursor;
    }

    public int previousIndex() {
        return cursor - 1;
    }

    @SuppressWarnings("unchecked")
    public E previous() {
        checkForComodification();
        int i = cursor - 1;
        if (i < 0)
            throw new NoSuchElementException();
        Object[] elementData = ArrayList.this.elementData;
        if (i >= elementData.length)
            throw new ConcurrentModificationException();
        cursor = i;
        return (E) elementData[lastRet = i];
    }

    public void set(E e) {
        if (lastRet < 0)
            throw new IllegalStateException();
        checkForComodification();

        try {
            ArrayList.this.set(lastRet, e);
        } catch (IndexOutOfBoundsException ex) {
            throw new ConcurrentModificationException();
        }
    }

    public void add(E e) {
        checkForComodification();

        try {
            int i = cursor;
            ArrayList.this.add(i, e);
            cursor = i + 1;
            lastRet = -1;
            expectedModCount = modCount;
        } catch (IndexOutOfBoundsException ex) {
            throw new ConcurrentModificationException();
        }
    }
}
````  
  
  ### 总结
  + **修改**和**查询**直接根据数组下标操作,是高效的,尾部追加的**增加**`add(E e)`,不扩容情况下也是高效的。

  + **增加**会因为**扩容**导致数组复制, 以及**增加，删除**都会调用`System.arraycopy`实现数组之间的复制。相对低效