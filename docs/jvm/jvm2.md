## 堆参数调整 -- 以1.8 + HotSpot为例
+ jdk7
<img :src="$withBase('/jvm/cs1.png')" alt="dock">
+ jkd8
<img :src="$withBase('/jvm/cs.png')" alt="dock">

+ jdk8以后永久代被移除，被一个称作元空间的代替。区别在于永久代使用JVM的堆内存，**元空间使用本机的物理内存。**
  - 因此默认情况下，元空间大小仅受本地内存限制，类的元数据放入本地内存，字符串池和类的常量放入java的`堆heap`中,这样可以加载多少类的元数据不再由MaxPermSize控制。
 