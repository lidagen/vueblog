<template><div><h2 id="index-索引" tabindex="-1"><a class="header-anchor" href="#index-索引"><span>INDEX 索引</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>索引（Index）是帮助MySQL高效获取数据的 <strong>数据结构</strong>。</li>
<li>索引对于良好性能十分关键，数据量小的时候，不恰当的索引对性能影响可能还不明细。当数据量大的时候，性能会 <strong>急剧下降</strong>。</li>
<li>索引优化应该是对查询性能优化最有效的手段了。索引能轻易把查询性能提高几个数量级。<code v-pre>最优</code> 的索引有时候比一个 <code v-pre>好的</code> 索引性能要好两个数量级。</li>
</ul>
<h3 id="索引的数据结构" tabindex="-1"><a class="header-anchor" href="#索引的数据结构"><span>索引的数据结构</span></a></h3>
<p>B+Tree(B-Tree)索引是最为常见的，在了解该索引前介绍y一下与之密切相关的数据结构：</p>
<h4 id="二分查找法" tabindex="-1"><a class="header-anchor" href="#二分查找法"><span>二分查找法</span></a></h4>
<ul>
<li>
<p>用来查找一组<strong>有序</strong>记录中的某条数据，其基本思想是：将记录按有序化排列，在查找中采用跳跃式方式查找，既以有序数列中点为比较对象。如果查找对象小于中点对象，则抛弃右边部分，然后再次对比，直到找到对象。</p>
</li>
<li>
<p>B+Tree(B-Tree)索引构造类似<strong>平衡二叉树</strong>，根据<code v-pre>key</code>快速找到数据。B+Tree并不能找到一个给定key的具体行，但是索引能找到数据所在页，然后把页读入内存中进行查找。</p>
</li>
<li>
<p>平衡树查询的速度很快，但是维护一颗平衡树开销很大，需要一次或多次的左旋或右旋使新增或者修改后的数据保持树平衡性。</p>
</li>
</ul>
<h4 id="b-tree-和-b-tree" tabindex="-1"><a class="header-anchor" href="#b-tree-和-b-tree"><span>B-Tree 和 B+Tree</span></a></h4>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>名词概念：</p>
<ul>
<li>叶子节点：就是没有子节点的节点</li>
<li>扇出：本文中指的是索引树每层节点个数</li>
<li>主索引：聚集索引中的主键索引</li>
<li>辅助索引：叶子节点保存了主键key值的索引。</li>
</ul>
</div>
<ul>
<li>B+Tree 结构如图：</li>
</ul>
<img :src="$withBase('/index/2.png')" alt="dock">
<ul>
<li>
<p>B+Tree(B-Tree)是为磁盘或者其它存取辅助设备设计的一种<strong>平衡查找树</strong>，所有记录节点按Key的大小顺序存放同一层的叶子节点上。各叶子节点由指针连接。</p>
</li>
<li>
<p>B+Tree(B-Tree)是一个二元组[key, data]，key为记录的键值，对于不同数据记录，key是互不相同的；data为数据记录除key外的数据。</p>
</li>
<li>
<p>B+Tree是B-Tree的变种，MySQL就普遍使用B+Tree实现其索引结构。B+Tree非叶子节点只存储key,data存储在叶子节点中。</p>
</li>
</ul>
<h4 id="b-tree索引的性能分析" tabindex="-1"><a class="header-anchor" href="#b-tree索引的性能分析"><span>B-/+Tree索引的性能分析</span></a></h4>
<ul>
<li>
<p>由于磁盘本身存取就比内存慢很多，为了尽可能减少I/O，磁盘每次读取文件会预读，即使读一个字节，也会顺序向后读取一定长度的数据放入内存。预读的长度一般以页（page）的整倍数。</p>
</li>
<li>
<p>数据库系统的设计者巧妙利用了磁盘预读原理，将一个节点的大小设为等于一个页，这样每个节点只需要一次I/O就可以完全载入。</p>
</li>
<li>
<p>B+Tree树索引一个特点是高扇出性，因此在数据库中B+Tree树索引高度一般都在2~4层，也就是说查一条数据只需要2~4次I/O.</p>
</li>
</ul>
<p>综上所述，用B-Tree作为索引结构效率是非常高的。</p>
<h3 id="mysql索引实现" tabindex="-1"><a class="header-anchor" href="#mysql索引实现"><span>MySQL索引实现</span></a></h3>
<p>MySQL中，索引属于存储引擎级别的概念，不同存储引擎的索引实现有所区别，本次只讨论MyISAM和InnoDB两种存储引擎的索引实现方式。</p>
<h4 id="myisam索引实现" tabindex="-1"><a class="header-anchor" href="#myisam索引实现"><span>MyISAM索引实现</span></a></h4>
<ul>
<li>
<p>MyISAM引擎使用B+Tree作为索引结构，叶子节点存储的是数据记录的<strong>物理地址</strong>。</p>
</li>
<li>
<p>MyISAM中，主索引和辅助索引在结构上没有任何区别，只是主索引要求Key是唯一的，而辅助索引不用。</p>
</li>
<li>
<p>在MyISAM中，索引检索的算法为首先按照B+Tree搜索算法搜索索引，如果找到Key,则取出data值，根据data保存的地址找出数据。</p>
</li>
</ul>
<p>MyISAM的索引方式是“非聚集”的，这么称呼是为了和InnoDB的聚集索引区分。</p>
<h4 id="innodb索引实现" tabindex="-1"><a class="header-anchor" href="#innodb索引实现"><span>InnoDB索引实现</span></a></h4>
<ul>
<li>
<p>InnoDB引擎也是使用B+Tree作为索引数据结构，但是InnoDB中，表数据结构本身就是按照B+Tree组织的索引结构，其叶子节点data域保存的是这条<strong>完整数据</strong>。这个索引的key就是表的主键。</p>
</li>
<li>
<p>因为其叶子节点保存着完整数据，这种索引叫做聚集索引，所以InnoDB要求必须有主键，如果没有显式指定，则MySQL系统会自动选择一个可以作为唯一标识的列作为主键，如果不存在这种列，MySQL会隐式生成一个字段作为主键，这个字段长6个字节，类型为长整形。</p>
</li>
<li>
<p>InnoDB的辅助索引data域存储的是主键的值而不是地址，换句话说，InnoDB所有的辅助索引都是引用主键作为data域。</p>
</li>
</ul>
<p>总结：
聚集索引这种实现方式使得按主键的搜索十分高效，但是辅助索引搜索需要检索两遍索引：首先检索辅助索引获得主键，然后用主键到主索引中检索获得记录。</p>
<p>知道了InnoDB索引实现后，就容易明白了为什么不建议使用过长的字段作为主键，因为这样会使辅助索引的data域过大。</p>
<p>使用非单调的字段作为InnoDB主键也不是个好主意，因为InnoDB数据文件本身是一个B+Tree,非单调的主键在插入新记录时，B+Tree数据结构为了维持顺序且平衡的特性会频繁分裂调整。十分低效，而使用自增字段作为主键是个好选择。</p>
<h3 id="索引使用策略以及优化" tabindex="-1"><a class="header-anchor" href="#索引使用策略以及优化"><span>索引使用策略以及优化</span></a></h3>
<p>MySQL优化主要分为<code v-pre>结构优化</code>和<code v-pre>查询优化</code>。本次主要讨论的高性能索引策略属于结构优化范畴。</p>
<h4 id="索引类型" tabindex="-1"><a class="header-anchor" href="#索引类型"><span>索引类型</span></a></h4>
<ul>
<li>PRIMARY KEY（主键索引）</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> table_name <span class="token keyword">ADD</span> <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span> <span class="token punctuation">(</span> <span class="token keyword">column</span> <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>UNIQUE(唯一索引)</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> table_name <span class="token keyword">ADD</span> <span class="token keyword">UNIQUE</span> <span class="token punctuation">(</span><span class="token keyword">column</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>INDEX(普通索引)</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> table_name <span class="token keyword">ADD</span> <span class="token keyword">INDEX</span> index_name <span class="token punctuation">(</span> <span class="token keyword">column</span> <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>FULLTEXT(全文索引)</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> table_name <span class="token keyword">ADD</span> FULLTEXT <span class="token punctuation">(</span> <span class="token keyword">column</span> <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>多列索引</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">ALTER</span> <span class="token keyword">TABLE</span> table_name <span class="token keyword">ADD</span> <span class="token keyword">INDEX</span> index_name <span class="token punctuation">(</span> column1<span class="token punctuation">,</span> column2<span class="token punctuation">,</span> column3 <span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="联合索引概念" tabindex="-1"><a class="header-anchor" href="#联合索引概念"><span>联合索引概念</span></a></h4>
<p>在上文中，我们都是假设索引只引用了单个的列，实际上，MySQL中的索引可以以一定顺序引用多个列，这种索引叫做联合索引，单列索引可以看成联合索引元素数为1的特例。</p>
<h4 id="实例表" tabindex="-1"><a class="header-anchor" href="#实例表"><span>实例表</span></a></h4>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">DROP</span> <span class="token keyword">TABLE</span> <span class="token keyword">IF</span> <span class="token keyword">EXISTS</span> <span class="token identifier"><span class="token punctuation">`</span>emp<span class="token punctuation">`</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">CREATE</span> <span class="token keyword">TABLE</span> <span class="token identifier"><span class="token punctuation">`</span>emp<span class="token punctuation">`</span></span> <span class="token punctuation">(</span></span>
<span class="line">  <span class="token identifier"><span class="token punctuation">`</span>id<span class="token punctuation">`</span></span> <span class="token keyword">int</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token identifier"><span class="token punctuation">`</span>first_name<span class="token punctuation">`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">16</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token identifier"><span class="token punctuation">`</span>last_name<span class="token punctuation">`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">16</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token identifier"><span class="token punctuation">`</span>age<span class="token punctuation">`</span></span> <span class="token keyword">int</span><span class="token punctuation">(</span><span class="token number">11</span><span class="token punctuation">)</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token identifier"><span class="token punctuation">`</span>birthday<span class="token punctuation">`</span></span> <span class="token keyword">date</span> <span class="token operator">NOT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token identifier"><span class="token punctuation">`</span>remark<span class="token punctuation">`</span></span> <span class="token keyword">varchar</span><span class="token punctuation">(</span><span class="token number">64</span><span class="token punctuation">)</span> <span class="token keyword">DEFAULT</span> <span class="token boolean">NULL</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token keyword">PRIMARY</span> <span class="token keyword">KEY</span> <span class="token punctuation">(</span><span class="token identifier"><span class="token punctuation">`</span>id<span class="token punctuation">`</span></span><span class="token punctuation">,</span><span class="token identifier"><span class="token punctuation">`</span>age<span class="token punctuation">`</span></span><span class="token punctuation">,</span><span class="token identifier"><span class="token punctuation">`</span>birthday<span class="token punctuation">`</span></span><span class="token punctuation">)</span></span>
<span class="line"><span class="token punctuation">)</span> <span class="token keyword">ENGINE</span><span class="token operator">=</span><span class="token keyword">InnoDB</span> <span class="token keyword">DEFAULT</span> <span class="token keyword">CHARSET</span><span class="token operator">=</span>utf8<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">-- ----------------------------</span></span>
<span class="line"><span class="token comment">-- Records of emp</span></span>
<span class="line"><span class="token comment">-- ----------------------------</span></span>
<span class="line"><span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>emp<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token string">'1'</span><span class="token punctuation">,</span> <span class="token string">'jim'</span><span class="token punctuation">,</span> <span class="token string">'green'</span><span class="token punctuation">,</span> <span class="token string">'18'</span><span class="token punctuation">,</span> <span class="token string">'2003-06-01'</span><span class="token punctuation">,</span> <span class="token string">'吉姆'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>emp<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token string">'2'</span><span class="token punctuation">,</span> <span class="token string">'li'</span><span class="token punctuation">,</span> <span class="token string">'lei'</span><span class="token punctuation">,</span> <span class="token string">'17'</span><span class="token punctuation">,</span> <span class="token string">'2004-12-03'</span><span class="token punctuation">,</span> <span class="token string">'李雷'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>emp<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token string">'4'</span><span class="token punctuation">,</span> <span class="token string">'eric'</span><span class="token punctuation">,</span> <span class="token string">'anido'</span><span class="token punctuation">,</span> <span class="token string">'19'</span><span class="token punctuation">,</span> <span class="token string">'2002-11-20'</span><span class="token punctuation">,</span> <span class="token string">'eric'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>emp<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token string">'5'</span><span class="token punctuation">,</span> <span class="token string">'leBron'</span><span class="token punctuation">,</span> <span class="token string">'james'</span><span class="token punctuation">,</span> <span class="token string">'35'</span><span class="token punctuation">,</span> <span class="token string">'1983-12-03'</span><span class="token punctuation">,</span> <span class="token string">'勒布朗'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>emp<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token string">'6'</span><span class="token punctuation">,</span> <span class="token string">'kobe'</span><span class="token punctuation">,</span> <span class="token string">'bryant'</span><span class="token punctuation">,</span> <span class="token string">'38'</span><span class="token punctuation">,</span> <span class="token string">'1980-09-12'</span><span class="token punctuation">,</span> <span class="token string">'科比'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>emp<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token string">'7'</span><span class="token punctuation">,</span> <span class="token string">'allen'</span><span class="token punctuation">,</span> <span class="token string">'inversion'</span><span class="token punctuation">,</span> <span class="token string">'40'</span><span class="token punctuation">,</span> <span class="token string">'1979-08-13'</span><span class="token punctuation">,</span> <span class="token string">'艾佛森'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">INSERT</span> <span class="token keyword">INTO</span> <span class="token identifier"><span class="token punctuation">`</span>emp<span class="token punctuation">`</span></span> <span class="token keyword">VALUES</span> <span class="token punctuation">(</span><span class="token string">'8'</span><span class="token punctuation">,</span> <span class="token string">'li'</span><span class="token punctuation">,</span> <span class="token string">'james'</span><span class="token punctuation">,</span> <span class="token string">'17'</span><span class="token punctuation">,</span> <span class="token string">'2019-12-03'</span><span class="token punctuation">,</span> <span class="token string">'jackma'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>该表有一个联合索引&lt;id,age,birthday&gt;作为主键索引。</p>
<h4 id="情况一-全列匹配" tabindex="-1"><a class="header-anchor" href="#情况一-全列匹配"><span>情况一：全列匹配</span></a></h4>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> emp <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">AND</span> age <span class="token operator">in</span><span class="token punctuation">(</span><span class="token string">'18'</span><span class="token punctuation">)</span> <span class="token operator">AND</span> birthday <span class="token operator">=</span> <span class="token string">'2003-06-01'</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><img :src="$withBase('/index/explain.png')" alt="dock">
<p>当按照索引中所有列进行<strong>精确匹配（这里精确匹配指“=”或“IN”匹配）<strong>时，索引可以被用到。这里有一点需要注意，理论上索引对顺序是敏感的，但是由于MySQL的查询优化器会</strong>自动调整where子句的条件顺序以使用适合的索引</strong>，例如我们将where中的条件顺序颠倒：</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> emp <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span>  <span class="token operator">AND</span> birthday <span class="token operator">=</span> <span class="token string">'2003-06-01'</span> <span class="token operator">AND</span> age <span class="token operator">in</span><span class="token punctuation">(</span><span class="token string">'18'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><img :src="$withBase('/index/explain.png')" alt="dock">
<p>效果是一样的。</p>
<h4 id="情况二-最左前缀匹配。" tabindex="-1"><a class="header-anchor" href="#情况二-最左前缀匹配。"><span>情况二：最左前缀匹配。</span></a></h4>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> emp <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><img :src="$withBase('/index/explain1.png')" alt="dock">
<p>当查询条件精确匹配索引的左边连续一个或几个列时，如(id)或(id, age)，所以可以被用到，但是只能用到一部分，即条件所组成的最左前缀。上面的查询从分析结果看用到了PRIMARY索引，但是key_len为4，说明只用到了索引的第一列前缀。</p>
<h4 id="情况三-查询条件用到了索引中列的精确匹配-但是中间某个条件未提供。" tabindex="-1"><a class="header-anchor" href="#情况三-查询条件用到了索引中列的精确匹配-但是中间某个条件未提供。"><span>情况三：查询条件用到了索引中列的精确匹配，但是中间某个条件未提供。</span></a></h4>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> emp <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">AND</span> birthday <span class="token operator">=</span> <span class="token string">'2003-06-01'</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><img :src="$withBase('/index/explain1.png')" alt="dock">
<p>此时索引使用情况和情况二相同，因为<code v-pre>age</code>未提供，所以查询只用到了索引的第一列，虽然后面有<code v-pre>birthday</code>，但是由于<code v-pre>age</code>不存在而无法和左前缀连接。如果想让<code v-pre>birthday</code>也使用索引而不是<code v-pre>where</code>过滤，可以增加一个辅助索引(id, birthday)，此时上面的查询会使用这个索引。除此之外，还可以使用一种称之为“隔离列”的优化方法，将<code v-pre>id</code>与<code v-pre>birthday</code>之间的“坑”填上。</p>
<p>首先我们看看age的值</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">SELECT</span> <span class="token keyword">DISTINCT</span><span class="token punctuation">(</span>age<span class="token punctuation">)</span> <span class="token keyword">FROM</span> emp<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><img :src="$withBase('/index/explain2.png')" alt="dock">
<p>只有6种。在这种成为“坑”的列值比较少的情况下，可以考虑用“IN”来填补这个“坑”从而形成最左前缀：</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> emp <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">AND</span> age <span class="token operator">in</span> <span class="token punctuation">(</span><span class="token string">'17'</span><span class="token punctuation">,</span><span class="token string">'18'</span><span class="token punctuation">,</span><span class="token string">'19'</span><span class="token punctuation">,</span><span class="token string">'35'</span><span class="token punctuation">,</span><span class="token string">'38'</span><span class="token punctuation">,</span><span class="token string">'40'</span><span class="token punctuation">)</span> <span class="token operator">AND</span> birthday <span class="token operator">=</span> <span class="token string">'2003-06-01'</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><img :src="$withBase('/index/explain3.png')" alt="dock">
<h4 id="情况四-查询条件没有指定索引第一列。" tabindex="-1"><a class="header-anchor" href="#情况四-查询条件没有指定索引第一列。"><span>情况四：查询条件没有指定索引第一列。</span></a></h4>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> emp <span class="token keyword">WHERE</span> birthday <span class="token operator">=</span> <span class="token string">'2003-06-01'</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><img :src="$withBase('/index/explain4.png')" alt="dock">
由于不是最左前缀，索引这样的查询显然用不到索引。
<h4 id="情况五-匹配某列的前缀字符串。" tabindex="-1"><a class="header-anchor" href="#情况五-匹配某列的前缀字符串。"><span>情况五：匹配某列的前缀字符串。</span></a></h4>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">EXPLAIN</span> <span class="token keyword">SELECT</span> <span class="token operator">*</span> <span class="token keyword">FROM</span> emp <span class="token keyword">WHERE</span> id <span class="token operator">=</span> <span class="token number">1</span> <span class="token operator">AND</span> age <span class="token operator">LIKE</span> <span class="token string">'1%'</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><img :src="$withBase('/index/explain5.png')" alt="dock">
如果通配符%不出现在开头,此时可以用到索引,
<h4 id="情况六-查询条件中含有函数或表达式。" tabindex="-1"><a class="header-anchor" href="#情况六-查询条件中含有函数或表达式。"><span>情况六：查询条件中含有函数或表达式。</span></a></h4>
<p>如果查询条件中含有函数或表达式，则MySQL不会为这列使用索引。因此在写查询语句时尽量避免表达式出现在查询中，而是先手工私下代数运算，转换为无表达式的查询语句。</p>
<h3 id="索引选择性与前缀索引" tabindex="-1"><a class="header-anchor" href="#索引选择性与前缀索引"><span>索引选择性与前缀索引</span></a></h3>
<p>既然索引可以加快查询速度，那么是不是只要是查询语句需要，就建上索引？答案是否定的。因为索引虽然加快了查询速度，但索引也是有代价的：索引文件本身要消耗存储空间，同时索引会加重插入、删除和修改记录时的负担，另外，MySQL在运行时也要消耗资源维护索引，因此索引并不是越多越好。一般两种情况下不建议建索引。</p>
<ul>
<li>
<p>第一种情况是表记录比较少，例如一两千条甚至只有几百条记录的表，没必要建索引，让查询做全表扫描就好了。至于多少条记录才算多，这个个人有个人的看法，我个人的经验是以2000作为分界线，记录数不超过 2000可以考虑不建索引，超过2000条可以酌情考虑索引。</p>
</li>
<li>
<p>另一种不建议建索引的情况是索引的选择性较低。所谓索引的选择性（Selectivity），是指不重复的索引值（也叫基数，Cardinality）与表记录数（#T）的比值，选择性的取值范围为(0, 1]，选择性越高的索引价值越大，这是由B+Tree的性质决定的。</p>
</li>
</ul>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">SELECT</span> <span class="token function">count</span><span class="token punctuation">(</span><span class="token keyword">DISTINCT</span><span class="token punctuation">(</span>last_name<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">/</span><span class="token function">count</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> Selectivity <span class="token keyword">FROM</span> emp<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>查看emp表中last_name字段的选择性：
<img :src="$withBase('/index/explain6.png')" alt="dock"></p>
<p>本例中，last_name选择性是1，有必要建立索引。</p>
<p>如果我想要用人名来查询，由于没有索引，会全表查询，这时候我们考虑可以建索引，此时有两种选择(first_name)或者(first_name,last_name)，看一下选择性。</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">SELECT</span> <span class="token function">count</span><span class="token punctuation">(</span><span class="token keyword">DISTINCT</span><span class="token punctuation">(</span>first_name<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">/</span><span class="token function">count</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> Selectivity <span class="token keyword">FROM</span> emp<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><img :src="$withBase('/index/explain7.png')" alt="dock">
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">SELECT</span> <span class="token function">count</span><span class="token punctuation">(</span><span class="token keyword">DISTINCT</span><span class="token punctuation">(</span>concat<span class="token punctuation">(</span>first_name<span class="token punctuation">,</span> last_name<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">/</span><span class="token function">count</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> Selectivity <span class="token keyword">FROM</span> emp<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><img :src="$withBase('/index/explain6.png')" alt="dock">
<p>显示联合索引的选择性更高，但是first_name、last_name加起来长度太长，可以考虑用first_name和last_name的前几个字符建立索引：</p>
<div class="language-sql line-numbers-mode" data-highlighter="prismjs" data-ext="sql"><pre v-pre><code><span class="line"><span class="token keyword">SELECT</span> <span class="token function">count</span><span class="token punctuation">(</span><span class="token keyword">DISTINCT</span><span class="token punctuation">(</span>concat<span class="token punctuation">(</span>first_name<span class="token punctuation">,</span> <span class="token keyword">left</span><span class="token punctuation">(</span>last_name<span class="token punctuation">,</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token operator">/</span><span class="token function">count</span><span class="token punctuation">(</span><span class="token operator">*</span><span class="token punctuation">)</span> <span class="token keyword">AS</span> Selectivity <span class="token keyword">FROM</span> emp<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>前缀索引兼顾索引大小和查询速度，但是其缺点是不能用于ORDER BY和GROUP BY操作，也不能用于Covering index（即当索引本身包含查询所需全部数据时，不再访问数据文件本身）</p>
<h3 id="innodb的主键选择与插入优化" tabindex="-1"><a class="header-anchor" href="#innodb的主键选择与插入优化"><span>InnoDB的主键选择与插入优化</span></a></h3>
<p><strong>在使用InnoDB存储引擎时，如果没有特别的需要，请永远使用一个与业务无关的自增字段作为主键。</strong></p>
<ul>
<li>如果表使用自增主键，那么每次插入新的记录，记录就会顺序添加到当前索引节点的后续位置，当一页写满，就会自动开辟一个新的页。</li>
<li>如果使用非自增主键（如果身份证号或学号等），由于每次插入主键的值近似于随机，因此每次新纪录都要被插到现有索引页得中间某个位置，此时MySQL不得不为了将新记录插到合适位置而移动数据，甚至目标页面可能已经被回写到磁盘上而从缓存中清掉，此时又要从磁盘上读回来，这增加了很多开销，同时频繁的移动、分页操作造成了大量的碎片，得到了不够紧凑的索引结构，后续不得不通过OPTIMIZE TABLE来重建表并优化填充页面。</li>
</ul>
</div></template>


