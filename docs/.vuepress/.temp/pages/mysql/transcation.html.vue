<template><div><h2 id="mysql-acid-与-事务-transcation" tabindex="-1"><a class="header-anchor" href="#mysql-acid-与-事务-transcation"><span>MySQL ACID 与 事务(transcation)</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>MySQL中只有InnoDB引擎数据库支持事务。</li>
<li>事务是数据库进行多个增删改操作的时候，用于保证数据完整性，多个SQL语句要么全执行要么全不执行。</li>
</ul>
<h3 id="事务的acid" tabindex="-1"><a class="header-anchor" href="#事务的acid"><span>事务的ACID</span></a></h3>
<ul>
<li>事务要么全执行要么全不执行，就是所谓的ACID概念，本质是：<strong>锁和并发和重做日志的结合体</strong>。</li>
<li>ACID指的是：
<ul>
<li>原子性（Atomicity）</li>
<li>一致性（Consistency）</li>
<li>隔离性（Isolation）</li>
<li>持久性（Durability）</li>
</ul>
</li>
</ul>
<h3 id="隔离性-isolation" tabindex="-1"><a class="header-anchor" href="#隔离性-isolation"><span>隔离性（Isolation）</span></a></h3>
<ul>
<li>隔离性的实现原理是<strong>锁</strong>，因而隔离性也可称为并发控制、锁等。事务的隔离性就是要求每个事务的读写对其它事务分离。</li>
</ul>
<h4 id="innodb中的锁" tabindex="-1"><a class="header-anchor" href="#innodb中的锁"><span>InnoDB中的锁</span></a></h4>
<ul>
<li>InnoDB中的锁实现只有两类，一种是行级锁，一种是意向锁。</li>
</ul>
<h5 id="行级锁" tabindex="-1"><a class="header-anchor" href="#行级锁"><span>行级锁</span></a></h5>
<ul>
<li>InnoDB实现了如下两种行级锁：
<ul>
<li><strong>共享锁（读锁 S Lock）</strong>：允许事务读一行数据</li>
<li><strong>排他锁（写锁 X Lock）</strong>：允许事务删除一行数据或者更新一行数据</li>
</ul>
</li>
<li>行级锁中，除了S和S兼容，其它都不兼容</li>
</ul>
<h5 id="意向锁" tabindex="-1"><a class="header-anchor" href="#意向锁"><span>意向锁</span></a></h5>
<ul>
<li>InnoDB支持两种意向锁（即为表级别的锁）
<ul>
<li><strong>意向共享锁（读锁 IS Lock）</strong>：事务想要获取一张表的几行数据的共享锁，事务在给一行数据加S Lock时必须先获取该表的IS Lock</li>
<li><strong>意向排他锁（写锁 IX Lock）</strong>：事务想要获取一张表中几行数据的排他锁，事务在给一行数据加X Lock时必须先获取该表的IX Lock</li>
</ul>
</li>
<li>意向锁是为了表明某个事务正在锁定一行或者将要锁定一行
<ul>
<li>事务A要给第5行上X锁,那么InnoDB会先申请IX锁，再锁定第5行的X锁。在事务A未完成前。事务B想要获取一个表锁，此时直接在表级别的IX锁就会告诉事务B需要等待，而不需要每一行判断。<strong>意向锁的价值在于节约InnoDB对于锁的定位和处理性能</strong> ，另外需要注意：<strong>除了全表扫描以外意向锁都不会阻塞</strong>。</li>
</ul>
</li>
</ul>
<h4 id="锁的算法" tabindex="-1"><a class="header-anchor" href="#锁的算法"><span>锁的算法</span></a></h4>
<ul>
<li>InnoDB有三种锁的算法
<ul>
<li>Record lock:单行锁</li>
<li>Gap lock:间隙锁，锁定一个范围而不是数据本身</li>
<li>Next-Key lock:结合Record lock和Gap lock,锁定一个范围，并且锁定记录本身。主要解决的是RR隔离级别的幻读。</li>
</ul>
</li>
<li>MySQL的默认级别RR下，事务默认采用的是Next-Key lock，这种间隙锁的目的就是阻止多个事务将记录插入同一范围从而导致幻读。注意：<strong>如果事务隔离级别为RR,SQL走唯一索引，主键索引，那么Next-Key lock将会降级为Record lock</strong>。</li>
</ul>
<h4 id="死锁" tabindex="-1"><a class="header-anchor" href="#死锁"><span>死锁</span></a></h4>
<ul>
<li>死锁本质是两个事务相互等待对方释放持有的锁导致的。</li>
</ul>
<h4 id="四种隔离级别" tabindex="-1"><a class="header-anchor" href="#四种隔离级别"><span>四种隔离级别</span></a></h4>
<p>SQL标准定义了四种事务的隔离级别，它们分别是：</p>
<ul>
<li>
<p><strong>Read Uncommitted (读取未提交)</strong></p>
<ul>
<li>在该隔离级别，所有事务都可以看到其他未提交事务的执行结果。</li>
</ul>
</li>
<li>
<p><strong>Read Committed (读取已提交)</strong></p>
<ul>
<li>这是大多数数据库系统的默认隔离级别（但不是MySQL默认的）。它满足了隔离的简单定义：一个事务只能看见已经提交事务所做的改变。</li>
</ul>
</li>
<li>
<p><strong>Repeatable Read (可重复读)</strong></p>
<ul>
<li>这是MySQL的默认事务隔离级别，它确保同一事务的多个实例在并发读取数据时，会看到同样的数据行。InnoDB和Falcon存储引擎通过多版本并发控制（MVCC，Multiversion Concurrency Control）机制解决了幻读问题。</li>
</ul>
</li>
<li>
<p><strong>Serializable (串行化)</strong></p>
<ul>
<li>这是最高的隔离级别，它通过强制事务排序，使之不可能相互冲突，从而解决幻读问题。简言之，它是在每个读的数据行上加上共享锁。在这个级别，可能导致大量的超时现象和锁竞争。</li>
</ul>
</li>
</ul>
<p>不同隔离级别会导致的问题：</p>
<ul>
<li>脏读(Drity Read)：某个事务已更新一份数据，另一个事务在此时读取了同一份数据，由于某些原因，前一个RollBack了操作，则后一个事务所读取的数据就会是不正确的。</li>
<li>不可重复读(Non-repeatable read):在一个事务的两次查询之中数据不一致，这可能是两次查询过程中间插入了一个事务更新的原有的数据。</li>
<li>幻读(Phantom Read):在一个事务的两次查询中数据笔数不一致，例如有一个事务查询了几列(Row)数据，而另一个事务却在此时插入了新的几列数据，先前的事务在接下来的查询中，就会发现有几列数据是它先前所没有的。</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>不可重复读的重点是修改，同样的条件，你读取过的数据，再次读取出来发现值不一样了
幻读的重点在于新增或者删除，同样的条件，第 1 次和第 2 次读出来的记录数不一样</p>
</div>
<p>隔离级别 | 脏读 |  不可重复读 | 幻读</p>
<ul>
<li>| :-: | :-: | :-: | -:
Read Uncommitted | Y | Y | Y
Read Committed | N | Y | Y
Repeatable Read | N | N | Y
Serializable | N | N | N</li>
</ul>
<h3 id="持久性-durability-、-原子性-atomicity-、-一致性-consistency" tabindex="-1"><a class="header-anchor" href="#持久性-durability-、-原子性-atomicity-、-一致性-consistency"><span>持久性（Durability）、 原子性（Atomicity）  、 一致性（Consistency）</span></a></h3>
<ul>
<li>事务隔离性是由<strong>锁</strong>实现的，原子性、一致性、持久性是由数据库的redo log、undo log实现。</li>
<li>redo log称为重做日志，用来保证事务的<strong>原子性和持久性，恢复提交事务修改的页操作</strong>。</li>
<li>undo log来保证事务的一致性，undo回滚记录到某个特性版本以及<strong>MVCC</strong>功能。</li>
<li>redo 记录物理日志，undo 记录逻辑日志。</li>
</ul>
<h4 id="redo" tabindex="-1"><a class="header-anchor" href="#redo"><span>redo</span></a></h4>
<ul>
<li>重做日志由重做日志缓冲(redo log buffer)和重做日志文件(redo log file)组成，前者是易失的，后者是持久的。InnoDB通过Force Log at Commit机制来实现持久性，当commit时，必须先将事务的所有日志写到重做日志文件进行持久化，待commit操作完成才算完成。</li>
<li>当事务提交时，日志不写入重做日志文件，而是等待一个事件周期后再执行fsync操作，由于并非强制在事务提交时进行一次fsync操作，显然这可以提高数据库性能。</li>
<li>记住3点：
<ul>
<li>重做日志是在InnoDB层产生的</li>
<li>重做日志是物理格式日志，记录的是对每个页的修改</li>
<li>重做日志在事务进行中不断被写入</li>
</ul>
</li>
</ul>
<h4 id="undo" tabindex="-1"><a class="header-anchor" href="#undo"><span>undo</span></a></h4>
<ul>
<li>事务回滚和MVCC，这就需要undo。undo是逻辑日志，只是将数据库逻辑的恢复到原来的样子，但是数据结构和页本身在回滚之后可能不同。例如：用户执行insert 10w条数据的事务，表空间因而增大。用户执行ROLLBACK之后，会对插入的数据回滚，但是表空间大小不会因此收缩。</li>
<li>实际的做法就是做与之前想法的操作，insert对应delete，update对应反向update来实现原子性。</li>
<li>InnoDB中MVCC的实现就是靠undo。</li>
<li>undo log会产生redo log，因为undo log需要持久性保护</li>
</ul>
</div></template>


