## LinkedList 源码解析 JDK8

### 概述
+ `LinkedList` 是一个继承 `AbstractSequentialList`的双向链表,它也可以被当作*堆栈*、*队列*或者*双端队列*进行操作。

+ `LinkedList` 实现了 `List`接口,能对它进行队列操作。

+ `LinkedList` 实现了 `Deque`接口,能将它当作双端队列使用。

+ `LinkedList` 实现了 `Cloneable` `java.io.Serializable`接口,意味着它能够克隆以及序列化传输。

### 变量
````java
/**
 *集合元素数量
 */
 transient int size = 0;
/**
*链表头节点
*/
transient Node<E> first;
/**
*链表尾节点
*/
transient Node<E> last;
````
### Node 结构
````java
private static class Node<E> {
    E item;
    Node<E> next;
    Node<E> prev;

    Node(Node<E> prev, E element, Node<E> next) {
        this.item = element;
        this.next = next;
        this.prev = prev;
    }
}
````
::: tip
Node结构,包含三个元素,数据`item`,上一个节点`prev`,下一个节点`next`  
每个Node都包含上一个以及下一个的节点信息
:::

### 构造器
````java
public LinkedList() {
    }

public LinkedList(Collection< extends E> c) {
        this();
        addAll(c);
    }        
````

### API

+ **增**
  - <font color=#A23400 >addFirst(E e)</font>
  ````java
  public void addFirst(E e) {
        linkFirst(e);
    }

  private void linkFirst(E e) {
    final Node<E> f = first;//获取原来第一个
    final Node<E> newNode = new Node<>(null, e, f);
    first = newNode;//newNode设置为first
    if (f == null)//如果之前空list
        last = newNode;
    else
        f.prev = newNode;//原来第一个，既现在第二个的上一个指向新的Node
    size++;
    modCount++;
  }  
  ````

  - <font color=#A23400 >addLast(E e)</font>
  ````java
  public void addLast(E e) {
        linkLast(e);
    }

  void linkLast(E e) {//跟linkFirst操作相反
    final Node<E> l = last;
    final Node<E> newNode = new Node<>(l, e, null);
    last = newNode;
    if (l == null)
        first = newNode;
    else
        l.next = newNode;
    size++;
    modCount++;
  }  
  ````

  - <font color=#A23400 >add(E e)</font>
  ````java
  public boolean add(E e) {
        linkLast(e);//跟addLast一样,增加返回值
        return true;
    }
  ````

  - <font color=#A23400 >add(int index, E element)</font>
  ````java
  public void add(int index, E element) {
      checkPositionIndex(index);//检查下标是否越界

      if (index == size)//index是最后一个,尾部追加
          linkLast(element);
      else
          linkBefore(element, node(index));
  }
  
  //node 二分法，for循环查找下标index的元素
  Node<E> node(int index) {
       
      if (index < (size >> 1)) {
          Node<E> x = first;
          for (int i = 0; i < index; i++)
              x = x.next;
          return x;
      } else {
          Node<E> x = last;
          for (int i = size - 1; i > index; i--)
              x = x.prev;
          return x;
      }
  }
  
  void linkBefore(E e, Node<E> succ) {
        final Node<E> pred = succ.prev;//获取此下标的上一个
        final Node<E> newNode = new Node<>(pred, e, succ);//构建一个新Node
        succ.prev = newNode;//把原下标的Node指向更改
        if (pred == null)
            first = newNode;
        else
            pred.next = newNode;
        size++;
        modCount++;
    }
  ````

  - <font color=#A23400 >addAll(Collection< extends E> c)</font>
  ````java
  public boolean addAll(Collection< extends E> c) {
        return addAll(size, c);
  }
  ````

  - <font color=#A23400 >addAll(int index, Collection< extends E> c)</font>
  ````java
  public boolean addAll(int index, Collection< extends E> c) {
    checkPositionIndex(index);//检查越界 [0,size] 闭区间

    Object[] a = c.toArray();//转化为数组
    int numNew = a.length;
    if (numNew == 0)//如果新增元素数量为0，则不增加，并返回false
        return false;

    Node<E> pred, succ; //index节点的前置节点，后置节点
    if (index == size) {//构造器走这个条件分支,链表尾部追加数据
        succ = null;
        pred = last;//pred = 最后一个节点值
    } else {
        succ = node(index);//取出index节点，作为后置节点
        pred = succ.prev;//前置节点是，index节点的前一个节点
    }

    for (Object o : a) {//链表批量增加，是靠for循环遍历原数组，依次执行插入节点操作
        @SuppressWarnings("unchecked") E e = (E) o;
        //构造新Node,之前最后一个节点为上一个,下一个节点为Null
        Node<E> newNode = new Node<>(pred, e, null);
        if (pred == null)//之前LinkedList为空,说明是头结点
            first = newNode;
        else//否则 前置节点的后置节点设置问新节点
            pred.next = newNode;//给pred的next赋值newNode
        pred = newNode;
    }

    if (succ == null) {//循环结束后，判断，如果后置节点是null。 说明此时是在队尾append的。
        last = pred;
    } else {// 否则是在队中插入的节点 ，更新前置节点 后置节点
        pred.next = succ;
        succ.prev = pred;
    }

    size += numNew;
    modCount++;
    return true;
  }
  ````

+ **删**
  - <font color=#A23400 >removeFirst()</font>
  ````java
  public E removeFirst() {
        final Node<E> f = first;
        if (f == null)
            throw new NoSuchElementException();
        return unlinkFirst(f);
    }

  private E unlinkFirst(Node<E> f) {
        final E element = f.item;//获取第一个Node的item
        final Node<E> next = f.next;//拿到下一个Node
        f.item = null;
        f.next = null; // 置为null
        first = next; //first重新指向
        if (next == null)//判断next是否null
            last = null;
        else//next变first,它上一个为null
            next.prev = null;
        size--;
        modCount++;
        return element;
    }  
  ````

  - <font color=#A23400 >removeLast()</font>
  ````java
  public E removeLast() {
        final Node<E> l = last;
        if (l == null)
            throw new NoSuchElementException();
        return unlinkLast(l);
    }

  private E unlinkLast(Node<E> l) {
        // 跟unlinkFirst相反操作
        final E element = l.item;
        final Node<E> prev = l.prev;
        l.item = null;
        l.prev = null; // help GC
        last = prev;
        if (prev == null)
            first = null;
        else
            prev.next = null;
        size--;
        modCount++;
        return element;
    }  
  ````

  - <font color=#A23400 >remove(Object o)</font>
  ````java
  //for循环查找o是否与集合中元素equals
  public boolean remove(Object o) {
        if (o == null) {
            for (Node<E> x = first; x != null; x = x.next) {
                if (x.item == null) {
                    unlink(x);
                    return true;
                }
            }
        } else {
            for (Node<E> x = first; x != null; x = x.next) {
                if (o.equals(x.item)) {
                    unlink(x);
                    return true;
                }
            }
        }
        return false;
    }
  
  //移除item元素,重新prev next重新指向
  E unlink(Node<E> x) {
        final E element = x.item;
        final Node<E> next = x.next;
        final Node<E> prev = x.prev;

        if (prev == null) {//是不是第一个
            first = next;
        } else {
            prev.next = next;
            x.prev = null;
        }

        if (next == null) {//是不是最后一个
            last = prev;
        } else {
            next.prev = prev;
            x.next = null;
        }

        x.item = null;
        size--;
        modCount++;
        return element;
    }  
  ````

  - <font color=#A23400 >remove(int index)</font>
  ````java
  public E remove(int index) {
      checkElementIndex(index);
      return unlink(node(index));
  }
  ````

  - <font color=#A23400 >clear()</font>
  ````java
  public void clear() {
        // 循环 Node置null
        for (Node<E> x = first; x != null; ) {
            Node<E> next = x.next;
            x.item = null;
            x.next = null;
            x.prev = null;
            x = next;
        }
        first = last = null;
        size = 0;
        modCount++;
    }
  ````

+ **查**
  - <font color=#A23400 >getFirst()</font>
  ````java
  public E getFirst() {
        final Node<E> f = first;
        if (f == null)
            throw new NoSuchElementException();
        return f.item;
    }
  ````

  - <font color=#A23400 >getLast()</font>
  ````java
  public E getLast() {
        final Node<E> l = last;
        if (l == null)
            throw new NoSuchElementException();
        return l.item;
    }
  ````

  - <font color=#A23400 >get(int index)</font>
  ````java
  public E get(int index) {
        checkElementIndex(index);
        return node(index).item;
    }
  ````

+ **改**
  - <font color=#A23400 >set(int index, E element)</font>
  ````java
  public E set(int index, E element) {
        checkElementIndex(index);
        Node<E> x = node(index);
        E oldVal = x.item;
        x.item = element;
        return oldVal;
    }
  ````


+ **包含contains**
````java
public boolean contains(Object o) {
    return indexOf(o) != -1;
}

public int indexOf(Object o) {
    int index = 0;
    if (o == null) {
        for (Node<E> x = first; x != null; x = x.next) {
            if (x.item == null)
                return index;
            index++;
        }
    } else {
        for (Node<E> x = first; x != null; x = x.next) {
            if (o.equals(x.item))
                return index;
            index++;
        }
    }
    return -1;
}    
````

+ **迭代器 ListIterator**
````java
public ListIterator<E> listIterator(int index) {
    checkPositionIndex(index);
    return new ListItr(index);
}

private class ListItr implements ListIterator<E> {
    private Node<E> lastReturned;
    private Node<E> next;
    private int nextIndex;
    private int expectedModCount = modCount;

    ListItr(int index) {
        // assert isPositionIndex(index);
        next = (index == size) ? null : node(index);
        nextIndex = index;
    }

    public boolean hasNext() {
        return nextIndex < size;
    }

    public E next() {
        checkForComodification();
        if (!hasNext())
            throw new NoSuchElementException();

        lastReturned = next;
        next = next.next;
        nextIndex++;
        return lastReturned.item;
    }

    public boolean hasPrevious() {
        return nextIndex > 0;
    }

    public E previous() {
        checkForComodification();
        if (!hasPrevious())
            throw new NoSuchElementException();

        lastReturned = next = (next == null) ? last : next.prev;
        nextIndex--;
        return lastReturned.item;
    }

    public int nextIndex() {
        return nextIndex;
    }

    public int previousIndex() {
        return nextIndex - 1;
    }

    public void remove() {
        checkForComodification();
        if (lastReturned == null)
            throw new IllegalStateException();

        Node<E> lastNext = lastReturned.next;
        unlink(lastReturned);
        if (next == lastReturned)
            next = lastNext;
        else
            nextIndex--;
        lastReturned = null;
        expectedModCount++;
    }

    public void set(E e) {
        if (lastReturned == null)
            throw new IllegalStateException();
        checkForComodification();
        lastReturned.item = e;
    }

    public void add(E e) {
        checkForComodification();
        lastReturned = null;
        if (next == null)
            linkLast(e);
        else
            linkBefore(e, next);
        nextIndex++;
        expectedModCount++;
    }

    public void forEachRemaining(Consumer< super E> action) {
        Objects.requireNonNull(action);
        while (modCount == expectedModCount && nextIndex < size) {
            action.accept(next.item);
            lastReturned = next;
            next = next.next;
            nextIndex++;
        }
        checkForComodification();
    }

    final void checkForComodification() {
        if (modCount != expectedModCount)
            throw new ConcurrentModificationException();
    }
}
````

### 总结
+ 由代码可知,要操作首位两端的数字,是比较简单的  
+ 对于有 **(int index)** 的操作,都要 *node(int index)* 循环,根据`next` `prev`指向查找下标index的元素  
+ 越靠近中间的数据获取速度越慢  
+ LinkedList 查询慢是因为数据在内存中是**不连续的**,循环迭代查找起来就比较慢。 

<Valine></Valine>