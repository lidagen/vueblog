## LRU算法
+ LRU是least recently used缩写，即最少使用，是一种常用的页面置换算法
+ 选择最久未使用的数据予以淘汰

### LRU思想
+ 既然有最久未使用概念，就应该有顺序。
+ 数据有读和写的操作，读有命中或者未命中，写如果内存满了需要置换最久的淘汰
+ 读操作如果命中，需要修改位置，确保其是最新访问
+ LRU的算法核心是哈希链表
  - 哈希确保了查找速度
  - 链表确保了有序

````java
/**参考LinkedHashMap实现
**/
public class LruDemo<k, v> extends LinkedHashMap<k, v> {
    private int capacity;

    LruDemo(int capacity) {
        super(capacity, 0.75F, true);
        this.capacity = capacity;
    }
    /**删除，如果存入的size大于定义的，删除最老使用的**/
    @Override
    protected boolean removeEldestEntry(Map.Entry<k, v> eldest) {
        return super.size() > capacity;
    }

    public static void main(String[] args) {
        LruDemo lru = new LruDemo(3);
        lru.put(1,"a");
        lru.put(2,"a");
        lru.put(3,"a");
        System.out.println(lru.keySet());

        lru.get(2);
        System.out.println(lru.keySet());

        lru.put(4,"a");
        System.out.println(lru.keySet());
    }
}
````  
### 手写算法