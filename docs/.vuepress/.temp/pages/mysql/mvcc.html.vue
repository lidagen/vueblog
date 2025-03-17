<template><div><h2 id="mysql-mvcc机制" tabindex="-1"><a class="header-anchor" href="#mysql-mvcc机制"><span>MySQL MVCC机制</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>MVCC是一种多版本并发控制机制，只作用在<code v-pre>Read Committed</code>、<code v-pre>Repeatable Read</code>隔离级别上。<code v-pre>READ UNCOMMITED</code>不是MVCC兼容的，因为查询不能找到适合他们事务版本的行版本(读未提交)；<code v-pre>SERIABLABLE</code>也不与MVCC兼容，因为读操作会锁定他们返回的每一行数据。</li>
<li>MYSQL事务型存储引擎,如,InnoDB，Falcon以及PBXT都不使用一种简单的行锁机制.事实上,他们都和MVCC–多版本并发控制来一起使用.</li>
<li>锁机制可以控制并发操作,但是其系统开销较大,而MVCC可以在大多数情况下代替行级锁,使用MVCC,能降低其系统开销.</li>
</ul>
<h3 id="mvcc具体实现" tabindex="-1"><a class="header-anchor" href="#mvcc具体实现"><span>MVCC具体实现</span></a></h3>
<ul>
<li>InnoDB的MVCC，是通过在每行数据后面保存两个隐藏列来实现的，这两个列分别保存的是这行数据创建时间和删除时间。这个时间不是真正的时间，可以理解为系统版本号或者<strong>事务的ID</strong>,每开启一个新的事务，系统版本号就会自动递增。</li>
</ul>
<h3 id="rr-隔离级别下的mvcc例子" tabindex="-1"><a class="header-anchor" href="#rr-隔离级别下的mvcc例子"><span>RR 隔离级别下的MVCC例子</span></a></h3>
<ul>
<li>创建一张表，开启事务插入两条数据</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token comment">/*创建一张 t_mvcc表*/</span></span>
<span class="line"><span class="token keyword">create</span> <span class="token keyword">table</span> t_mvcc<span class="token punctuation">(</span></span>
<span class="line">    ID <span class="token keyword">int</span> <span class="token keyword">primary</span> <span class="token keyword">key</span> <span class="token keyword">auto_increment</span><span class="token punctuation">,</span> </span>
<span class="line">    NAME <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">20</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"><span class="token comment">/* 开启事务插入数据*/</span></span>
<span class="line"><span class="token keyword">start</span> <span class="token keyword">transaction</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">insert</span> <span class="token keyword">into</span> t_mvcc <span class="token keyword">values</span><span class="token punctuation">(</span><span class="token boolean">NULL</span><span class="token punctuation">,</span><span class="token string">'lilei'</span><span class="token punctuation">)</span> <span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">insert</span> <span class="token keyword">into</span> t_mvcc <span class="token keyword">values</span><span class="token punctuation">(</span><span class="token boolean">NULL</span><span class="token punctuation">,</span><span class="token string">'hanmeimei'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">commit</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>在对应的数据 (后面两列是隐藏列,我们通过查询语句并看不到) 。<br/>
开启一个事务，会有一个事务ID。本例中，ID 1、2两条数据拥有同样的创建时间（事务ID） 1。</p>
<p>ID | NAME |  创建时间(事务ID) | 删除时间(事务ID)</p>
<ul>
<li>| :-: | :-: | :-: | -:
1 | lilei | 1 | undefined
2 | hanmeimei | 1 | undefined</li>
</ul>
<h4 id="select语句" tabindex="-1"><a class="header-anchor" href="#select语句"><span>SELECT语句</span></a></h4>
<p>InnoBD会根据两个条件来查找数据（两个条件是 &amp;&amp; 的关系）：</p>
<ul>
<li><strong>查找创建时间小于或等于当前事务ID的数据行。（确保查找的数据是之前存在的或者本次事务插入或修改过的）</strong></li>
<li><strong>查找时行的删除时间要么未定义，要么大于当前事务ID。（确保事务读取到的行，在事务开始前未被删除）</strong></li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>行的删除时间大于当前事务ID的含义是：
A事务开启，查询到数据库存在一条数据，在再次查这条数据的时候，B事务开始了，并且删除了此条数据，这时候这条数据删除时间是B事务的且大于A事务的ID，这时候A事务是可以看的这条数据的。
即保证了事务开启后确保了读取的行未被删除。</p>
</div>
<p>接着上面的例子，开启第二个事务（事务ID =2）</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">start</span> <span class="token keyword">transaction</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> t_mvcc<span class="token punctuation">;</span>  <span class="token comment">//(1)</span></span>
<span class="line"><span class="token keyword">select</span> <span class="token operator">*</span> <span class="token keyword">from</span> t_mvcc<span class="token punctuation">;</span>  <span class="token comment">//(2)</span></span>
<span class="line"><span class="token keyword">commit</span><span class="token punctuation">;</span> </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>假设 1</strong><br/>
假设在执行这个事务ID=2的事务时，刚执行到（1）,有一个事务ID=3的事务往表里插入一条数据</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">start</span> <span class="token keyword">transaction</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">/*事务 3*/</span></span>
<span class="line"><span class="token keyword">insert</span> <span class="token keyword">into</span> t_mvcc <span class="token keyword">values</span><span class="token punctuation">(</span><span class="token boolean">NULL</span><span class="token punctuation">,</span><span class="token string">'jim'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">commit</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时表里的数据如下：</p>
<p>ID | NAME |  创建时间(事务ID) | 删除时间(事务ID)</p>
<ul>
<li>| :-: | :-: | :-: | -:
1 | lilei | 1 | undefined
2 | hanmeimei | 1 | undefined
3 | jim | 3 | undefined</li>
</ul>
<p>然后接着执行事务ID=2中的（2）,由于ID=3的数据 <em>创建时间(事务ID)为 3</em>,执行事务ID=2中的（2）时，InnoDB只会查找<strong>创建时间小于或等于当前事务ID的数据行</strong>，所以后开启的事务ID=3插入的数据事务ID=2中是查不到的。（避免了幻读）</p>
<h4 id="delete语句" tabindex="-1"><a class="header-anchor" href="#delete语句"><span>DELETE语句</span></a></h4>
<p>InnoBD会给每条删除的数据增加一个删除时间（当前事务的ID号）</p>
<p><strong>假设 2</strong><br/>
假设在执行事务ID=2的事务时，刚执行到（1），假设执行完了事务ID=3,接着又执行了事务ID=4的事务。</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token comment">/*事务 4*/</span></span>
<span class="line"><span class="token keyword">start</span>  <span class="token keyword">transaction</span><span class="token punctuation">;</span>  </span>
<span class="line"><span class="token keyword">delete</span> <span class="token keyword">from</span> t_mvcc <span class="token keyword">where</span> id<span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">commit</span><span class="token punctuation">;</span>  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这时数据库里的数据如下：
ID | NAME |  创建时间(事务ID) | 删除时间(事务ID)</p>
<ul>
<li>| :-: | :-: | :-: | -:
1 | lilei | 1 | 4
2 | hanmeimei | 1 | undefined
3 | jim | 3 | undefined</li>
</ul>
<p>然后接着执行事务ID=2中的（2）,根据InnoDB的检索条件**查找时行的删除时间要么未定义，要么大于当前事务ID。**可知，删除时间列4是大于当前事务ID=2的，所以 ID=1 这行还是能保证会被事务查询出来。</p>
<h4 id="update语句" tabindex="-1"><a class="header-anchor" href="#update语句"><span>UPDATE语句</span></a></h4>
<p>InnoDB执行UPDATE，实际上是新插入了一行记录，并保存其创建时间为当前事务的ID，同时保存当前事务ID到要UPDATE的行的删除时间。</p>
<p><strong>假设 3</strong><br/>
假设执行事务ID=2中的（1）时,其它用户执行了事务ID=3和事务ID=4，这时有用户开启了事务ID=5的事务：</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token comment">/*事务 5*/</span></span>
<span class="line"><span class="token keyword">start</span>  <span class="token keyword">transaction</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">update</span> t_mvcc <span class="token keyword">set</span> name<span class="token operator">=</span><span class="token string">'long'</span> <span class="token keyword">where</span> id<span class="token operator">=</span><span class="token number">2</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">commit</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>根据update规则，这时数据库里的数据如下：
ID | NAME |  创建时间(事务ID) | 删除时间(事务ID)</p>
<ul>
<li>| :-: | :-: | :-: | -:
1 | lilei | 1 | 4
2 | hanmeimei | 1 | 5
3 | jim | 3 | undefined
2 | long | 5 | undefined</li>
</ul>
<p>继续执行事务ID=2中的（2）,根据InnoDB的检索条件：根据<strong>创建时间小于或等于当前事务ID的数据行</strong>，排除掉后两行。根据<strong>查找时行的删除时间要么未定义，要么大于当前事务ID。</strong>，前两行符合。</p>
<p>INSERT同理。</p>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li>通过上述例子可以看出，在RR隔离级别下，通过MVCC机制，在一个事务开启后，后续事务对数据的增删改。都不会影响当前事务查询数据的一致性。</li>
<li>这种额外列所带来的结果就是：对于大多数查询来说根本不需要获得一个锁，只需要根据两个条件来检索符合的数据，缺点是每行会存储更多的列，做更多的检查，处理更多的善后操作。</li>
<li>MVCC 结合 行锁（S S兼容），从而提高数据库系统的并发性能。</li>
</ul>
</div></template>


