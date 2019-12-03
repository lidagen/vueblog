## INDEX 索引

### 概述
+ 索引（Index）是帮助MySQL高效获取数据的 **数据结构**。
+ 索引对于良好性能十分关键，数据量小的时候，不恰当的索引对性能影响可能还不明细。当数据量大的时候，性能会 **急剧下降**。
+ 索引优化应该是对查询性能优化最有效的手段了。索引能轻易把查询性能提高几个数量级。`最优` 的索引有时候比一个 `好的` 索引性能要好两个数量级。

### 索引的数据结构
B+Tree(B-Tree)索引是最为常见的，在了解该索引前介绍y一下与之密切相关的数据结构：

#### 二分查找法
+ 用来查找一组**有序**记录中的某条数据，其基本思想是：将记录按有序化排列，在查找中采用跳跃式方式查找，既以有序数列中点为比较对象。如果查找对象小于中点对象，则抛弃右边部分，然后再次对比，直到找到对象。

+ B+Tree(B-Tree)索引构造类似**平衡二叉树**，根据`key`快速找到数据。B+Tree并不能找到一个给定key的具体行，但是索引能找到数据所在页，然后把页读入内存中进行查找。 

+ 平衡树查询的速度很快，但是维护一颗平衡树开销很大，需要一次或多次的左旋或右旋使新增或者修改后的数据保持树平衡性。

#### B-Tree 和 B+Tree
::: tip
名词概念：
+ 叶子节点：就是没有子节点的节点
+ 扇出：本文中指的是索引树每层节点个数
+ 主索引：聚集索引中的主键索引
+ 辅助索引：叶子节点保存了主键key值的索引。
:::
+ B+Tree 结构如图：

<img :src="$withBase('/index/2.png')" alt="dock">

+ B+Tree(B-Tree)是为磁盘或者其它存取辅助设备设计的一种**平衡查找树**，所有记录节点按Key的大小顺序存放同一层的叶子节点上。各叶子节点由指针连接。

+ B+Tree(B-Tree)是一个二元组[key, data]，key为记录的键值，对于不同数据记录，key是互不相同的；data为数据记录除key外的数据。

+ B+Tree是B-Tree的变种，MySQL就普遍使用B+Tree实现其索引结构。B+Tree非叶子节点只存储key,data存储在叶子节点中。

#### B-/+Tree索引的性能分析
+ 由于磁盘本身存取就比内存慢很多，为了尽可能减少I/O，磁盘每次读取文件会预读，即使读一个字节，也会顺序向后读取一定长度的数据放入内存。预读的长度一般以页（page）的整倍数。

+ 数据库系统的设计者巧妙利用了磁盘预读原理，将一个节点的大小设为等于一个页，这样每个节点只需要一次I/O就可以完全载入。

+ B+Tree树索引一个特点是高扇出性，因此在数据库中B+Tree树索引高度一般都在2~4层，也就是说查一条数据只需要2~4次I/O.

综上所述，用B-Tree作为索引结构效率是非常高的。


### MySQL索引实现
MySQL中，索引属于存储引擎级别的概念，不同存储引擎的索引实现有所区别，本次只讨论MyISAM和InnoDB两种存储引擎的索引实现方式。

#### MyISAM索引实现
+ MyISAM引擎使用B+Tree作为索引结构，叶子节点存储的是数据记录的**物理地址**。

+ MyISAM中，主索引和辅助索引在结构上没有任何区别，只是主索引要求Key是唯一的，而辅助索引不用。

+ 在MyISAM中，索引检索的算法为首先按照B+Tree搜索算法搜索索引，如果找到Key,则取出data值，根据data保存的地址找出数据。

MyISAM的索引方式是“非聚集”的，这么称呼是为了和InnoDB的聚集索引区分。

#### InnoDB索引实现
+ InnoDB引擎也是使用B+Tree作为索引数据结构，但是InnoDB中，表数据结构本身就是按照B+Tree组织的索引结构，其叶子节点data域保存的是这条**完整数据**。这个索引的key就是表的主键。

+ 因为其叶子节点保存着完整数据，这种索引叫做聚集索引，所以InnoDB要求必须有主键，如果没有显式指定，则MySQL系统会自动选择一个可以作为唯一标识的列作为主键，如果不存在这种列，MySQL会隐式生成一个字段作为主键，这个字段长6个字节，类型为长整形。

+ InnoDB的辅助索引data域存储的是主键的值而不是地址，换句话说，InnoDB所有的辅助索引都是引用主键作为data域。

总结：
聚集索引这种实现方式使得按主键的搜索十分高效，但是辅助索引搜索需要检索两遍索引：首先检索辅助索引获得主键，然后用主键到主索引中检索获得记录。

知道了InnoDB索引实现后，就容易明白了为什么不建议使用过长的字段作为主键，因为这样会使辅助索引的data域过大。

使用非单调的字段作为InnoDB主键也不是个好主意，因为InnoDB数据文件本身是一个B+Tree,非单调的主键在插入新记录时，B+Tree数据结构为了维持顺序且平衡的特性会频繁分裂调整。十分低效，而使用自增字段作为主键是个好选择。

### 索引使用策略以及优化
MySQL优化主要分为`结构优化`和`查询优化`。本次主要讨论的高性能索引策略属于结构优化范畴。

#### 联合索引概念
在上文中，我们都是假设索引只引用了单个的列，实际上，MySQL中的索引可以以一定顺序引用多个列，这种索引叫做联合索引，单列索引可以看成联合索引元素数为1的特例。

#### 实例表
````sql
DROP TABLE IF EXISTS `emp`;
CREATE TABLE `emp` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(16) DEFAULT NULL,
  `last_name` varchar(16) DEFAULT NULL,
  `age` int(11) DEFAULT NULL,
  `birthday` date DEFAULT NULL,
  `remark` varchar(64) DEFAULT NULL,
  UNIQUE KEY `UI_INDEX` (`id`,`age`,`birthday`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8;
````
该表有一个联合索引<id,age,birthday>作为主键索引。

#### 情况一：全列匹配
````sql
EXPLAIN SELECT * FROM emp WHERE id = 1 AND age in('18') AND birthday = '2003-06-01';
````

<img :src="$withBase('/index/explain.png')" alt="dock">

当按照索引中所有列进行**精确匹配（这里精确匹配指“=”或“IN”匹配）**时，索引可以被用到。这里有一点需要注意，理论上索引对顺序是敏感的，但是由于MySQL的查询优化器会**自动调整where子句的条件顺序以使用适合的索引**，例如我们将where中的条件顺序颠倒：
````sql
EXPLAIN SELECT * FROM emp WHERE id = 1  AND birthday = '2003-06-01' AND age in('18');
````

<img :src="$withBase('/index/explain.png')" alt="dock">

效果是一样的。

#### 情况二：最左前缀匹配。
````sql
EXPLAIN SELECT * FROM emp WHERE id = 1;
````

<img :src="$withBase('/index/explain1.png')" alt="dock">

当查询条件精确匹配索引的左边连续一个或几个列时，如(id)或(id, age)，所以可以被用到，但是只能用到一部分，即条件所组成的最左前缀。上面的查询从分析结果看用到了PRIMARY索引，但是key_len为4，说明只用到了索引的第一列前缀。


#### 情况三：查询条件用到了索引中列的精确匹配，但是中间某个条件未提供。
````sql
EXPLAIN SELECT * FROM emp WHERE id = 1 AND birthday = '2003-06-01';
````
<img :src="$withBase('/index/explain1.png')" alt="dock">

此时索引使用情况和情况二相同，因为`age`未提供，所以查询只用到了索引的第一列，虽然后面有`birthday`，但是由于`age`不存在而无法和左前缀连接。如果想让`birthday`也使用索引而不是`where`过滤，可以增加一个辅助索引(id, birthday)，此时上面的查询会使用这个索引。除此之外，还可以使用一种称之为“隔离列”的优化方法，将`id`与`birthday`之间的“坑”填上。

首先我们看看age的值
````sql
SELECT DISTINCT(age) FROM emp;
````
<img :src="$withBase('/index/explain2.png')" alt="dock">

只有6种。在这种成为“坑”的列值比较少的情况下，可以考虑用“IN”来填补这个“坑”从而形成最左前缀：
````sql
EXPLAIN SELECT * FROM emp WHERE id = 1 AND age in ('17','18','19','35','38','40') AND birthday = '2003-06-01';
````
<img :src="$withBase('/index/explain3.png')" alt="dock">

#### 情况四：查询条件没有指定索引第一列。
````sql
EXPLAIN SELECT * FROM emp WHERE birthday = '2003-06-01';
````
<img :src="$withBase('/index/explain4.png')" alt="dock">
由于不是最左前缀，索引这样的查询显然用不到索引。

#### 情况五：匹配某列的前缀字符串。
````sql
EXPLAIN SELECT * FROM emp WHERE id = 1 AND age LIKE '1%'
````
<img :src="$withBase('/index/explain5.png')" alt="dock">
如果通配符%不出现在开头,此时可以用到索引,

#### 情况六：查询条件中含有函数或表达式。
如果查询条件中含有函数或表达式，则MySQL不会为这列使用索引。因此在写查询语句时尽量避免表达式出现在查询中，而是先手工私下代数运算，转换为无表达式的查询语句。

### 索引选择性与前缀索引
既然索引可以加快查询速度，那么是不是只要是查询语句需要，就建上索引？答案是否定的。因为索引虽然加快了查询速度，但索引也是有代价的：索引文件本身要消耗存储空间，同时索引会加重插入、删除和修改记录时的负担，另外，MySQL在运行时也要消耗资源维护索引，因此索引并不是越多越好。一般两种情况下不建议建索引。

+ 第一种情况是表记录比较少，例如一两千条甚至只有几百条记录的表，没必要建索引，让查询做全表扫描就好了。至于多少条记录才算多，这个个人有个人的看法，我个人的经验是以2000作为分界线，记录数不超过 2000可以考虑不建索引，超过2000条可以酌情考虑索引。

+ 另一种不建议建索引的情况是索引的选择性较低。所谓索引的选择性（Selectivity），是指不重复的索引值（也叫基数，Cardinality）与表记录数（#T）的比值，选择性的取值范围为(0, 1]，选择性越高的索引价值越大，这是由B+Tree的性质决定的。
````sql
SELECT count(DISTINCT(last_name))/count(*) AS Selectivity FROM emp;
````
查看emp表中last_name字段的选择性：
<img :src="$withBase('/index/explain6.png')" alt="dock">

本例中，last_name选择性是1，有必要建立索引。

如果我想要用人名来查询，由于没有索引，会全表查询，这时候我们考虑可以建索引，此时有两种选择(first_name)或者(first_name,last_name)，看一下选择性。
````sql
SELECT count(DISTINCT(first_name))/count(*) AS Selectivity FROM emp;
````

<img :src="$withBase('/index/explain7.png')" alt="dock">

````sql
SELECT count(DISTINCT(concat(first_name, last_name)))/count(*) AS Selectivity FROM emp;
````
<img :src="$withBase('/index/explain6.png')" alt="dock">

显示联合索引的选择性更高，但是first_name、last_name加起来长度太长，可以考虑用first_name和last_name的前几个字符建立索引：
````sql
SELECT count(DISTINCT(concat(first_name, left(last_name,2))))/count(*) AS Selectivity FROM emp;
````

前缀索引兼顾索引大小和查询速度，但是其缺点是不能用于ORDER BY和GROUP BY操作，也不能用于Covering index（即当索引本身包含查询所需全部数据时，不再访问数据文件本身）

### InnoDB的主键选择与插入优化
**在使用InnoDB存储引擎时，如果没有特别的需要，请永远使用一个与业务无关的自增字段作为主键。**

+ 如果表使用自增主键，那么每次插入新的记录，记录就会顺序添加到当前索引节点的后续位置，当一页写满，就会自动开辟一个新的页。
+ 如果使用非自增主键（如果身份证号或学号等），由于每次插入主键的值近似于随机，因此每次新纪录都要被插到现有索引页得中间某个位置，此时MySQL不得不为了将新记录插到合适位置而移动数据，甚至目标页面可能已经被回写到磁盘上而从缓存中清掉，此时又要从磁盘上读回来，这增加了很多开销，同时频繁的移动、分页操作造成了大量的碎片，得到了不够紧凑的索引结构，后续不得不通过OPTIMIZE TABLE来重建表并优化填充页面。


