## MySQL MVCC机制

### 概述

+ MVCC是一种多版本并发控制机制，只作用在`Read Committed`、`Repeatable Read`隔离级别上。`READ UNCOMMITED`不是MVCC兼容的，因为查询不能找到适合他们事务版本的行版本(读未提交)；`SERIABLABLE`也不与MVCC兼容，因为读操作会锁定他们返回的每一行数据。
+ MYSQL事务型存储引擎,如,InnoDB，Falcon以及PBXT都不使用一种简单的行锁机制.事实上,他们都和MVCC–多版本并发控制来一起使用.
+ 锁机制可以控制并发操作,但是其系统开销较大,而MVCC可以在大多数情况下代替行级锁,使用MVCC,能降低其系统开销.

### MVCC具体实现
+ InnoDB的MVCC，是通过在每行数据后面保存两个隐藏列来实现的，这两个列分别保存的是这行数据创建时间和删除时间。这个时间不是真正的时间，可以理解为系统版本号或者**事务的ID**,每开启一个新的事务，系统版本号就会自动递增。

### RR 隔离级别下的MVCC例子

+ 创建一张表，开启事务插入两条数据
````sql
/*创建一张 t_mvcc表*/
create table t_mvcc(
    ID int primary key auto_increment, 
    NAME varchar(20)
)
/* 开启事务插入数据*/
start transaction;
insert into t_mvcc values(NULL,'lilei') ;
insert into t_mvcc values(NULL,'hanmeimei');
commit;
````
在对应的数据 (后面两列是隐藏列,我们通过查询语句并看不到) 。<br/>
开启一个事务，会有一个事务ID。本例中，ID 1、2两条数据拥有同样的创建时间（事务ID） 1。

ID | NAME |  创建时间(事务ID) | 删除时间(事务ID)  
- | :-: | :-: | :-: | -:
1 | lilei | 1 | undefined
2 | hanmeimei | 1 | undefined

#### SELECT语句

InnoBD会根据两个条件来查找数据（两个条件是 && 的关系）：
+ **查找创建时间小于或等于当前事务ID的数据行。（确保查找的数据是之前存在的或者本次事务插入或修改过的）**
+ **查找时行的删除时间要么未定义，要么大于当前事务ID。（确保事务读取到的行，在事务开始前未被删除）**
:::tip
行的删除时间大于当前事务ID的含义是：
A事务开启，查询到数据库存在一条数据，在再次查这条数据的时候，B事务开始了，并且删除了此条数据，这时候这条数据删除时间是B事务的且大于A事务的ID，这时候A事务是可以看的这条数据的。
即保证了事务开启后确保了读取的行未被删除。
:::

接着上面的例子，开启第二个事务（事务ID =2）
````sql
start transaction;
select * from t_mvcc;  //(1)
select * from t_mvcc;  //(2)
commit; 
````

**假设 1**<br/>
假设在执行这个事务ID=2的事务时，刚执行到（1）,有一个事务ID=3的事务往表里插入一条数据
````sql
start transaction;
/*事务 3*/
insert into t_mvcc values(NULL,'jim');
commit;
````

这时表里的数据如下：

ID | NAME |  创建时间(事务ID) | 删除时间(事务ID)  
- | :-: | :-: | :-: | -:
1 | lilei | 1 | undefined
2 | hanmeimei | 1 | undefined
3 | jim | 3 | undefined

然后接着执行事务ID=2中的（2）,由于ID=3的数据 *创建时间(事务ID)为 3*,执行事务ID=2中的（2）时，InnoDB只会查找**创建时间小于或等于当前事务ID的数据行**，所以后开启的事务ID=3插入的数据事务ID=2中是查不到的。（避免了幻读）


#### DELETE语句
InnoBD会给每条删除的数据增加一个删除时间（当前事务的ID号）

**假设 2**<br/>
假设在执行事务ID=2的事务时，刚执行到（1），假设执行完了事务ID=3,接着又执行了事务ID=4的事务。
````sql
/*事务 4*/
start  transaction;  
delete from t_mvcc where id=1;
commit;  
````

这时数据库里的数据如下：
ID | NAME |  创建时间(事务ID) | 删除时间(事务ID)  
- | :-: | :-: | :-: | -:
1 | lilei | 1 | 4
2 | hanmeimei | 1 | undefined
3 | jim | 3 | undefined

然后接着执行事务ID=2中的（2）,根据InnoDB的检索条件**查找时行的删除时间要么未定义，要么大于当前事务ID。**可知，删除时间列4是大于当前事务ID=2的，所以 ID=1 这行还是能保证会被事务查询出来。

#### UPDATE语句
InnoDB执行UPDATE，实际上是新插入了一行记录，并保存其创建时间为当前事务的ID，同时保存当前事务ID到要UPDATE的行的删除时间。

**假设 3**<br/>
假设执行事务ID=2中的（1）时,其它用户执行了事务ID=3和事务ID=4，这时有用户开启了事务ID=5的事务：
````sql
/*事务 5*/
start  transaction;
update t_mvcc set name='long' where id=2;
commit;
````
根据update规则，这时数据库里的数据如下：
ID | NAME |  创建时间(事务ID) | 删除时间(事务ID)  
- | :-: | :-: | :-: | -:
1 | lilei | 1 | 4
2 | hanmeimei | 1 | 5
3 | jim | 3 | undefined
2 | long | 5 | undefined

继续执行事务ID=2中的（2）,根据InnoDB的检索条件：根据**创建时间小于或等于当前事务ID的数据行**，排除掉后两行。根据**查找时行的删除时间要么未定义，要么大于当前事务ID。**，前两行符合。

INSERT同理。

### 总结
+ 通过上述例子可以看出，在RR隔离级别下，通过MVCC机制，在一个事务开启后，后续事务对数据的增删改。都不会影响当前事务查询数据的一致性。
+ 这种额外列所带来的结果就是：对于大多数查询来说根本不需要获得一个锁，只需要根据两个条件来检索符合的数据，缺点是每行会存储更多的列，做更多的检查，处理更多的善后操作。
+ MVCC 结合 行锁（S S兼容），从而提高数据库系统的并发性能。