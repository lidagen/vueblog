<template><div><h2 id="基于mysql-的乐观锁与悲观锁" tabindex="-1"><a class="header-anchor" href="#基于mysql-的乐观锁与悲观锁"><span>基于mySql 的乐观锁与悲观锁</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p>乐观锁：认为每次拿的数据别人都不会修改，所以不会上锁，只有在更新数据的时候判断一下数据是否修改过。可以使用版本号实现。乐观锁用于读多于写的场景。这个机制可以提高吞吐量。</p>
</li>
<li>
<p>悲观锁：认为每次拿数据的时候都认为别人会修改，所以每次拿数据的时候都会上锁。传统数据库用到很多这种锁机制，比如行锁、表锁、读锁、写锁等。悲观锁是对数据修改持保守态度。一般用于写比较多的情况。</p>
</li>
</ul>
<h3 id="实现" tabindex="-1"><a class="header-anchor" href="#实现"><span>实现</span></a></h3>
<ul>
<li>
<p>乐观锁：乐观锁的实现是依赖于建表语句中增加一个int类型的version字段。在每次修改的时候，这个version都会+1，并且where语句条件加上查询到的version版本号，例如：<code v-pre>uptate t_account set amount = #{userAmount,jdbcType=DECIMAL} ,version = version + 1 where id = #{id,jdbcType=INTEGER} and version =#{version,jdbcType=INTEGER} </code></p>
</li>
<li>
<p>悲观锁：悲观锁依赖mysql内部实现，在查询的时候，增加for update语句。获取锁（获取锁的前提：结果集中的数据没有使用排他锁或共享锁时，才能获取锁，否则将会阻塞。），例如：<code v-pre>select * from t_account where id=#{id,jdbcType=INTEGER} for update;</code>MySQL InnoDB 默认为行级锁。当查询语句指定了主键时，MySQL会执行「行级锁」，否则MySQL会执行「表锁」。</p>
</li>
</ul>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li>
<p>不管悲观锁还是乐观锁，应对的都是update语句。在高并发的情况下，两个线程同时读到这条数据，但是在对数据更新上，A线程修改了数据，而B线程不知，B线程拿着旧的数据做更新，导致了数据不一致。</p>
</li>
<li>
<p>乐观锁的缺陷是只要是更新数据之前，都需要查询一遍该数据，增加数据库的访问次数。增加数据库的访问压力。</p>
</li>
<li>
<p>悲观锁采用的是「先获取锁再访问」的策略，来保障数据的安全。但是加锁策略，依赖数据库实现，会增加数据库的负担，且会增加死锁的发生几率。对于并发很高的场景并不会使用悲观锁，因为当一个事务锁住了数据，那么其他事务都会发生阻塞，会导致大量的事务发生积压拖垮整个系统。</p>
</li>
<li>
<p>mybatis-plus有乐观锁插件，需要运用乐观锁时了解。</p>
</li>
</ul>
</div></template>


