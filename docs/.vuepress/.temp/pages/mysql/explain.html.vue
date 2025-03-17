<template><div><h2 id="mysql-explain详解【转载】" tabindex="-1"><a class="header-anchor" href="#mysql-explain详解【转载】"><span>MySQL Explain详解【转载】</span></a></h2>
<p>在日常工作中，我们会有时会开慢查询去记录一些执行时间比较久的SQL语句，找出这些SQL语句并不意味着完事了，些时我们常常用到explain这个命令来查看一个这些SQL语句的执行计划，查看该SQL语句有没有使用上了索引，有没有做全表扫描，这都可以通过explain命令来查看。所以我们深入了解MySQL的基于开销的优化器，还可以获得很多可能被优化器考虑到的访问策略的细节，以及当运行SQL语句时哪种策略预计会被优化器采用。</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token comment">-- 实际SQL，查找用户名为Jefabc的员工</span></span>
<span class="line"><span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> emp <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">AND</span> age <span class="token operator">=</span> <span class="token string">'18'</span> <span class="token operator">AND</span> birthday <span class="token operator">=</span> <span class="token string">'2003-06-01'</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">-- 查看SQL是否使用索引，前面加上explain即可</span></span>
<span class="line"><span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> emp <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">AND</span> age <span class="token operator">=</span> <span class="token string">'18'</span> <span class="token operator">AND</span> birthday <span class="token operator">=</span> <span class="token string">'2003-06-01'</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>explain出来的信息有10列，分别是id、select_type、table、type、possible_keys、key、key_len、ref、rows、Extra</p>
<img :src="$withBase('/index/explain.png')" alt="dock">
<h3 id="概要描述" tabindex="-1"><a class="header-anchor" href="#概要描述"><span>概要描述：</span></a></h3>
<ul>
<li>id:选择标识符</li>
<li>select_type:表示查询的类型。</li>
<li>table:输出结果集的表</li>
<li>partitions:匹配的分区</li>
<li>type:表示表的连接类型</li>
<li>possible_keys:表示查询时，可能使用的索引</li>
<li>key:表示实际使用的索引</li>
<li>key_len:索引字段的长度</li>
<li>ref:列与索引的比较</li>
<li>rows:扫描出的行数(估算的行数)</li>
<li>filtered:按表条件过滤的行百分比</li>
<li>Extra:执行情况的描述和说明</li>
</ul>
<h4 id="id" tabindex="-1"><a class="header-anchor" href="#id"><span><strong>id:</strong></span></a></h4>
<p>SELECT识别符。这是SELECT的查询序列号</p>
<p>我的理解是SQL执行的顺序的标识，SQL从大到小的执行</p>
<ol>
<li>
<p>id相同时，执行顺序由上至下</p>
</li>
<li>
<p>如果是子查询，id的序号会递增，id值越大优先级越高，越先被执行</p>
</li>
<li>
<p>id如果相同，可以认为是一组，从上往下顺序执行；在所有组中，id值越大，优先级越高，越先执行</p>
</li>
</ol>
<h4 id="select-type" tabindex="-1"><a class="header-anchor" href="#select-type"><span><strong>select_type:</strong></span></a></h4>
<p>表示查询中每个select子句的类型</p>
<p>(1) SIMPLE(简单SELECT，不使用UNION或子查询等)</p>
<p>(2) PRIMARY(子查询中最外层查询，查询中若包含任何复杂的子部分，最外层的select被标记为PRIMARY)</p>
<p>(3) UNION(UNION中的第二个或后面的SELECT语句)</p>
<p>(4) DEPENDENT UNION(UNION中的第二个或后面的SELECT语句，取决于外面的查询)</p>
<p>(5) UNION RESULT(UNION的结果，union语句中第二个select开始后面所有select)</p>
<p>(6) SUBQUERY(子查询中的第一个SELECT，结果不依赖于外部查询)</p>
<p>(7) DEPENDENT SUBQUERY(子查询中的第一个SELECT，依赖于外部查询)</p>
<p>(8) DERIVED(派生表的SELECT, FROM子句的子查询)</p>
<p>(9) UNCACHEABLE SUBQUERY(一个子查询的结果不能被缓存，必须重新评估外链接的第一行)</p>
<h4 id="table" tabindex="-1"><a class="header-anchor" href="#table"><span><strong>table:</strong></span></a></h4>
<p>显示这一步所访问数据库中表名称（显示这一行的数据是关于哪张表的），有时不是真实的表名字，可能是简称，例如上面的e，d，也可能是第几步执行的结果的简称</p>
<h4 id="type" tabindex="-1"><a class="header-anchor" href="#type"><span><strong>type:</strong></span></a></h4>
<p>对表访问方式，表示MySQL在表中找到所需行的方式，又称“访问类型”。</p>
<p>常用的类型有： ALL、index、range、 ref、eq_ref、const、system、NULL（从左到右，性能从差到好）</p>
<p>ALL：Full Table Scan， MySQL将遍历全表以找到匹配的行</p>
<p>index: Full Index Scan，index与ALL区别为index类型只遍历索引树</p>
<p>range:只检索给定范围的行，使用一个索引来选择行</p>
<p>ref: 表示上述表的连接匹配条件，即哪些列或常量被用于查找索引列上的值</p>
<p>eq_ref: 类似ref，区别就在使用的索引是唯一索引，对于每个索引键值，表中只有一条记录匹配，简单来说，就是多表连接中使用primary key或者 unique key作为关联条件</p>
<p>const、system: 当MySQL对查询某部分进行优化，并转换为一个常量时，使用这些类型访问。如将主键置于where列表中，MySQL就能将该查询转换为一个常量，system是const类型的特例，当查询的表只有一行的情况下，使用system</p>
<p>NULL: MySQL在优化过程中分解语句，执行时甚至不用访问表或索引，例如从一个索引列里选取最小值可以通过单独索引查找完成。</p>
<h4 id="possible-keys" tabindex="-1"><a class="header-anchor" href="#possible-keys"><span><strong>possible_keys:</strong></span></a></h4>
<p>指出MySQL能使用哪个索引在表中找到记录，查询涉及到的字段上若存在索引，则该索引将被列出，但不一定被查询使用（该查询可以利用的索引，如果没有任何索引显示 null）</p>
<p>该列完全独立于EXPLAIN输出所示的表的次序。这意味着在possible_keys中的某些键实际上不能按生成的表次序使用。
如果该列是NULL，则没有相关的索引。在这种情况下，可以通过检查WHERE子句看是否它引用某些列或适合索引的列来提高你的查询性能。如果是这样，创造一个适当的索引并且再次用EXPLAIN检查查询</p>
<h4 id="key" tabindex="-1"><a class="header-anchor" href="#key"><span><strong>key:</strong></span></a></h4>
<p>key列显示MySQL实际决定使用的键（索引），必然包含在possible_keys中</p>
<p>如果没有选择索引，键是NULL。要想强制MySQL使用或忽视possible_keys列中的索引，在查询中使用FORCE INDEX、USE INDEX或者IGNORE INDEX。</p>
<h4 id="key-len" tabindex="-1"><a class="header-anchor" href="#key-len"><span><strong>key_len:</strong></span></a></h4>
<p>表示索引中使用的字节数，可通过该列计算查询中使用的索引的长度（key_len显示的值为索引字段的最大可能长度，并非实际使用长度，即key_len是根据表定义计算而得，不是通过表内检索出的）</p>
<p>不损失精确性的情况下，长度越短越好</p>
<h4 id="ref" tabindex="-1"><a class="header-anchor" href="#ref"><span><strong>ref:</strong></span></a></h4>
<p>列与索引的比较，表示上述表的连接匹配条件，即哪些列或常量被用于查找索引列上的值</p>
<h4 id="rows" tabindex="-1"><a class="header-anchor" href="#rows"><span><strong>rows:</strong></span></a></h4>
<p>估算出结果集行数，表示MySQL根据表统计信息及索引选用情况，估算的找到所需的记录所需要读取的行数</p>
<h4 id="extra" tabindex="-1"><a class="header-anchor" href="#extra"><span><strong>Extra:</strong></span></a></h4>
<p>该列包含MySQL解决查询的详细信息,有以下几种情况：</p>
<p>Using where:不用读取表中所有信息，仅通过索引就可以获取所需数据，这发生在对表的全部的请求列都是同一个索引的部分的时候，表示mysql服务器将在存储引擎检索行后再进行过滤</p>
<p>Using temporary：表示MySQL需要使用临时表来存储结果集，常见于排序和分组查询，常见 group by ; order by</p>
<p>Using filesort：当Query中包含 order by 操作，而且无法利用索引完成的排序操作称为“文件排序”</p>
<p>Using join buffer：改值强调了在获取连接条件时没有使用索引，并且需要连接缓冲区来存储中间结果。如果出现了这个值，那应该注意，根据查询的具体情况可能需要添加索引来改进能。</p>
<p>Impossible where：这个值强调了where语句会导致没有符合条件的行（通过收集统计信息不可能存在结果）。</p>
<p>Select tables optimized away：这个值意味着仅通过使用索引，优化器可能仅从聚合函数结果中返回一行</p>
<p>No tables used：Query语句中使用from dual 或不含任何from子句</p>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结：</span></a></h3>
<ul>
<li>EXPLAIN不会告诉你关于触发器、存储过程的信息或用户自定义函数对查询的影响情况</li>
<li>EXPLAIN不考虑各种Cache</li>
<li>EXPLAIN不能显示MySQL在执行查询时所作的优化工作</li>
<li>部分统计信息是估算的，并非精确值</li>
<li>EXPALIN只能解释SELECT操作，其他操作要重写为SELECT后查看执行计划。</li>
</ul>
</div></template>


