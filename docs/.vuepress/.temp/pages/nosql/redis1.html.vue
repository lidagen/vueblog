<template><div><h2 id="redis基础" tabindex="-1"><a class="header-anchor" href="#redis基础"><span>Redis基础</span></a></h2>
<h3 id="redis入门" tabindex="-1"><a class="header-anchor" href="#redis入门"><span>Redis入门</span></a></h3>
<h4 id="_1-nosql" tabindex="-1"><a class="header-anchor" href="#_1-nosql"><span>1.NoSQL</span></a></h4>
<ul>
<li>
<p>NoSQL:即Not-Only SQL(泛指非关系型数据库)，作为关系型数据库的补充。</p>
</li>
<li>
<p>作用：应对基于海量用户和海量数据前提下的数据处理问题。</p>
</li>
<li>
<p>特征：</p>
<ul>
<li>可伸缩，可扩容</li>
<li>大数据量下的高性能</li>
<li>灵活的数据类型</li>
<li>高可用</li>
</ul>
</li>
<li>
<p>常见的NoSQL</p>
<ul>
<li>Redis</li>
<li>memcache</li>
<li>HBase</li>
<li>MongoDB</li>
</ul>
</li>
</ul>
<h4 id="_2-redis-简介" tabindex="-1"><a class="header-anchor" href="#_2-redis-简介"><span>2.Redis 简介</span></a></h4>
<ul>
<li>
<p>Redis: (REmote DIctionary Server) 是C语言开发的开源高性能的键值对<code v-pre>key-value</code>数据库。</p>
</li>
<li>
<p><strong>特征：</strong></p>
<ul>
<li>数据间没有必然的关联关系</li>
<li>内部采用单线程机制进行工作</li>
<li>高性能（官方测试：50个并发执行100000个请求，读的速度是110000次/s,写的速度是81000次/s）</li>
<li>多数据类型支持
<ul>
<li>字符串类型 string</li>
<li>列表类型 list</li>
<li>散列类型 hash</li>
<li>集合类型 set</li>
<li>有序集合类型 sorted_set</li>
</ul>
</li>
<li>持久化支持，可进行数据容灾恢复</li>
</ul>
</li>
<li>
<p><strong>Redis 应用</strong></p>
<ul>
<li>为热点数据加速查询（主要场景），比如热点商品，热点资讯等高访问量信息等。</li>
<li>任务队列，如秒杀、抢购、购票排队等。</li>
<li>即时信息查询，如各类排行榜、网站访问统计、公交到站信息、在线人数信息、设备信号等。</li>
<li>时效信息控制，如验证码控制，投票控制等。</li>
<li>分布式数据共享，比如分布式应用中的session共享。</li>
<li>消息队列</li>
<li>分布式锁</li>
</ul>
</li>
</ul>
<h3 id="数据类型" tabindex="-1"><a class="header-anchor" href="#数据类型"><span>数据类型</span></a></h3>
<h4 id="_1-string字符串" tabindex="-1"><a class="header-anchor" href="#_1-string字符串"><span>1.<strong>string字符串</strong></span></a></h4>
<ul>
<li>存储的数据：单个数据，最简单的数据存储类型，也是最常用的数据存储类型</li>
<li>存储的数据格式： 一个存储空间保存一个数据</li>
<li>存储的内容： 通常使用字符串，如果字符串以整数的形式展示，可以作为数字操作使用</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#添加/修改数据</span></span>
<span class="line"><span class="token builtin class-name">set</span> key value</span>
<span class="line"><span class="token comment">#获取数据</span></span>
<span class="line">get key</span>
<span class="line"><span class="token comment">#删除</span></span>
<span class="line">del key</span>
<span class="line"><span class="token comment"># 添加/修改多个</span></span>
<span class="line">mset key1 value1 key2 value2</span>
<span class="line"><span class="token comment">#获取多个</span></span>
<span class="line">mget key1 key2</span>
<span class="line"><span class="token comment">#获取字符串长度</span></span>
<span class="line">strlen key</span>
<span class="line"><span class="token comment">#追加数据到值后面</span></span>
<span class="line">append key value</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>string 类型的扩展操作
<ul>
<li>string在redis内部就是个字符串，但是遇到incr、decr会转成数值运算</li>
<li>redis所有操作都是原子性的，采用单线程处理所有请求，无需考虑并发数据一致性问题</li>
<li>数值的操作时候，超过redis上限会报错（java中long.MAX_VALUE）</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 设置数值增加指定范围的值（可以解决mysql分表后主键唯一的问题）</span></span>
<span class="line">incr key</span>
<span class="line">incrby key increment <span class="token comment">#指定步长</span></span>
<span class="line">incrbyfloat key increment <span class="token comment">#可以加小数</span></span>
<span class="line"><span class="token comment"># 设置数值减少指定范围的值</span></span>
<span class="line">decr key</span>
<span class="line">decrby key increment</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>string 数据实效性设置</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#设置多少秒后实效</span></span>
<span class="line">setex key seconds value</span>
<span class="line"><span class="token comment">#毫秒</span></span>
<span class="line">psetex key milliseconds value</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>数据库中热点数据的key的命名规范
<ul>
<li><code v-pre>emp:id:88395515:name</code> (表名:主键名:值:字段名)</li>
</ul>
</li>
<li>应用场景
<ul>
<li>mysql分表的sequence管理</li>
<li>短信验证等5分钟时效过期</li>
</ul>
</li>
</ul>
<h4 id="_2-hash哈希" tabindex="-1"><a class="header-anchor" href="#_2-hash哈希"><span>2.<strong>hash哈希</strong></span></a></h4>
<ul>
<li>存储需求： 对一系列存储的数据进行编组，方便管理，典型应用存储对象信息</li>
<li>需要的存储结构：一个存储空间保存多个键值对数据</li>
<li>hash类型： 底层使用哈希表结构实现数据存储
<ul>
<li>hash类型下的value只能存字符串，不允许其它结构</li>
<li>每个hash可以存储2^32-1个键值对</li>
<li>hash类型十分贴近对象的数据存储类型，并且可以灵活的增加删除对象属性，但hash设计初衷不是为了存大量对象而设计的，切记不可乱用，更不可将hash作为对象列表使用</li>
<li>hgetall操作可以获取全部属性，如果内部field过多，遍历的整体效率会低，有可能成为数据访问的瓶颈</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#添加/修改数据</span></span>
<span class="line">hset key field value</span>
<span class="line"><span class="token comment"># 获取数据</span></span>
<span class="line">hget key field</span>
<span class="line">hgetall key</span>
<span class="line"><span class="token comment">#删除数据</span></span>
<span class="line">hdel key field1</span>
<span class="line"></span>
<span class="line"><span class="token comment">#添加/修改多个数据</span></span>
<span class="line">hmset key field1 value1 field2 value2</span>
<span class="line"><span class="token comment">#获取多个值</span></span>
<span class="line">hmget key field1 field2</span>
<span class="line"><span class="token comment">#获取hash表中字段的数量</span></span>
<span class="line">hlen key</span>
<span class="line"><span class="token comment">#获取hash表中是否存在指定字段</span></span>
<span class="line">hexists key field1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>hash扩展操作与使用注意</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#获取hash表中所有的field名</span></span>
<span class="line">hkeys key</span>
<span class="line"><span class="token comment">#获取hash表中所有的value值</span></span>
<span class="line">hvals key</span>
<span class="line"><span class="token comment">#指定字段的数值增加指定范围的值</span></span>
<span class="line">hincrby key field incrment</span>
<span class="line">hincrbyfloat key filde incrment</span>
<span class="line"><span class="token comment">#如果没值set,有的话什么都不做(value不同也不操作)</span></span>
<span class="line">hsetnx key field value</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>string的json字符串和hash存储区别</p>
<ul>
<li>string的json读为主</li>
<li>hash的存储可以灵活增减，适用数据修改较多情况</li>
</ul>
</li>
<li>
<p>应用场景</p>
<ul>
<li>用户购物车</li>
<li>抢购</li>
</ul>
</li>
</ul>
<h4 id="_3-list列表" tabindex="-1"><a class="header-anchor" href="#_3-list列表"><span>3.<strong>list列表</strong></span></a></h4>
<ul>
<li>数据存储需求：存储多个数据，并对数据进入存储空间的顺序进行区分</li>
<li>需要的数据结构： 一个存储空间保存多个数据，且通过数据体现进入的顺序</li>
<li>list类型：保存多个数据，地层使用双向链表存储结构实现</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#添加/修改数据</span></span>
<span class="line">lpush key value1 <span class="token punctuation">[</span>value2<span class="token punctuation">..</span>.<span class="token punctuation">]</span> <span class="token comment">#左push,后lpush的在前面</span></span>
<span class="line">rpush key value1 <span class="token punctuation">[</span>value2<span class="token punctuation">..</span>.<span class="token punctuation">]</span> <span class="token comment">#右push，跟push顺序一致 </span></span>
<span class="line"><span class="token comment">#获取数据</span></span>
<span class="line">lrange key start stop <span class="token comment">#左开始读，start stop理解为开始-结束的index(0 -1看所有)</span></span>
<span class="line">lindex key index <span class="token comment">#直接下标读取</span></span>
<span class="line">llen key <span class="token comment">#获取长度</span></span>
<span class="line"><span class="token comment">#获取并移除</span></span>
<span class="line">lpop key <span class="token comment">#左边弹出1个</span></span>
<span class="line">rpop key <span class="token comment">#右边弹出1个</span></span>
<span class="line"><span class="token comment">#移除指定数据</span></span>
<span class="line">lrem key count value <span class="token comment">#count是个数，list值有重复的情况</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>list的阻塞数据获取</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#规定时间获取并移除数据</span></span>
<span class="line">blpop key1 <span class="token punctuation">[</span>key2<span class="token punctuation">..</span>.<span class="token punctuation">]</span> <span class="token function">timeout</span></span>
<span class="line">bropo key1 <span class="token punctuation">[</span>key2<span class="token punctuation">..</span>.<span class="token punctuation">]</span> <span class="token function">timeout</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>list操作注意事项
<ul>
<li>list中保存的都是string类型，值的个数也是2^32-1个</li>
<li>list具有索引概念 。通常操作以队列形式出队入队，或以栈的形式出栈入栈</li>
<li>获取全内容结束索引为-1</li>
<li>list可以对数据分页操作，通常第一页走redis,后续页查询数据库</li>
</ul>
</li>
<li>应用场景
<ul>
<li>最新消息的展示</li>
</ul>
</li>
</ul>
<h4 id="_4-set集合" tabindex="-1"><a class="header-anchor" href="#_4-set集合"><span>4.<strong>set集合</strong></span></a></h4>
<ul>
<li>新的存储需求：存储大量数据，在查询方面更高效率</li>
<li>需要的存储结构： 能够保存大量数据，高效的内部存储结构，便于查询</li>
<li>对hash结构的变形，仅使用field的存储空间</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#添加数据</span></span>
<span class="line">sadd key member1 <span class="token punctuation">[</span>member2<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#获取全部</span></span>
<span class="line">smembers key</span>
<span class="line"><span class="token comment">#删除数据</span></span>
<span class="line">srem key member1 <span class="token punctuation">[</span>member2<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#获取集合总量</span></span>
<span class="line">scard key</span>
<span class="line"><span class="token comment">#判断集合中包含某元素</span></span>
<span class="line">sismember key member1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>set的随机取值删值操作
<ul>
<li>业务场景 (随机推 ： 每位用户注册今日头条，都会让选择几项新闻类型，但是后期为了增加用户活跃度，必须让用户对其他类别逐渐产生兴趣，增加客户留存（随机取一定数量的热点类别加入到用户自己选择的类别中)</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#随机获取集合中指定数量的数据</span></span>
<span class="line">srandmember key <span class="token punctuation">[</span>count<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#随机获取集合中某几个数据并移除集合</span></span>
<span class="line">spop key   <span class="token punctuation">[</span>count<span class="token punctuation">]</span>     </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>set数据交并差操作
<ul>
<li>业务场景（社交软件可能认识的人）</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#求两个set的交集、并集、差集</span></span>
<span class="line"><span class="token comment"># 交集（权限set对权限去重）</span></span>
<span class="line">sinter key1 key2</span>
<span class="line"><span class="token comment">#并集</span></span>
<span class="line">sunion key1 key2</span>
<span class="line"><span class="token comment">#差集</span></span>
<span class="line"><span class="token function">sdiff</span> key1 key2 <span class="token comment">#只查左边（key1）的差集</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#求多个set的交集、并集、差集并存指定集合中</span></span>
<span class="line">sinterstore destination key1 <span class="token punctuation">[</span>key2<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line">sunionstore destination key1 <span class="token punctuation">[</span>key2<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line">sdiffstore destination key1 <span class="token punctuation">[</span>key2<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#将set中元素移动到另一个set中</span></span>
<span class="line">smove <span class="token builtin class-name">source</span> destination menber</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>set操作注意事项
<ul>
<li>set类型不允许值重复</li>
<li>set虽然和hash存储结构相同，但是无法使用hash中的存储value的空间</li>
</ul>
</li>
</ul>
<h4 id="_5-sorted-set有序集合" tabindex="-1"><a class="header-anchor" href="#_5-sorted-set有序集合"><span>5.<strong>sorted_set有序集合</strong></span></a></h4>
<ul>
<li>新的存储需求：数据排序有利于数据有效展示，需要提供一个根据自身特征进行排序的方式</li>
<li>sorted_set：在set的基础上，增加了可排序字段</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#添加数据 （score是排序的规则顺序）</span></span>
<span class="line">zadd key score1 member1 <span class="token punctuation">[</span>score2 member2<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#获取全部数据</span></span>
<span class="line">zrange key start stop <span class="token punctuation">[</span>WITHSCORES<span class="token punctuation">]</span> <span class="token comment">#带上withscores参数，会显示score</span></span>
<span class="line">zrevrange key start stop <span class="token punctuation">[</span>WITHSCORES<span class="token punctuation">]</span> <span class="token comment">#反转显示 </span></span>
<span class="line"><span class="token comment">#删除数据</span></span>
<span class="line">zrem key member <span class="token punctuation">[</span>menber1<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#按score值范围获取数据</span></span>
<span class="line">zrangebyscore key min max <span class="token punctuation">[</span>WITHSCORES<span class="token punctuation">]</span> <span class="token punctuation">[</span>LIMIT<span class="token punctuation">]</span>  <span class="token comment">#limit和mysql用法一样，筛选前几位</span></span>
<span class="line">zrevrangebyscore key max min <span class="token punctuation">[</span>WITHSCORES<span class="token punctuation">]</span> <span class="token punctuation">[</span>LIMIT<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#按索引删除</span></span>
<span class="line">zremrangebyrank key start stop </span>
<span class="line"><span class="token comment">#按score值删除数据</span></span>
<span class="line">zremrangebyscore key min max</span>
<span class="line"></span>
<span class="line"><span class="token comment">#获取集合总数</span></span>
<span class="line">zcard key</span>
<span class="line">zcount key min max <span class="token comment">#score范围count</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#集合交集、并集 #score 会求和</span></span>
<span class="line">zinterstore destination numkeys key1 <span class="token punctuation">[</span>key2<span class="token punctuation">..</span>.<span class="token punctuation">]</span> </span>
<span class="line">zunionstore destination numkeys key1 <span class="token punctuation">[</span>key2<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>sorted_set扩展操作
<ul>
<li>业务场景：各类榜单排名，根据score排序，根据score值顺序来获取值的索引</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#获取数据对应的索引</span></span>
<span class="line">zrank key member</span>
<span class="line">zrevrank key menber</span>
<span class="line"></span>
<span class="line">zscore key member <span class="token comment">#获取score值</span></span>
<span class="line">zincrby key increment member <span class="token comment">#score值的修改</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>sorted_set注意事项
<ul>
<li>score可以保存整数和小数（双精度double），小数可能有精度问题</li>
<li>sorted_set地层还是set，其值不能重复，重复后一次覆盖前一次</li>
<li>score比较需要位数一致，否则可能不准确，不足的可以补0</li>
</ul>
</li>
</ul>
<h3 id="通用命令" tabindex="-1"><a class="header-anchor" href="#通用命令"><span>通用命令</span></a></h3>
<h4 id="_1-key通用命令" tabindex="-1"><a class="header-anchor" href="#_1-key通用命令"><span>1.key通用命令</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#删除</span></span>
<span class="line">del key</span>
<span class="line"><span class="token comment">#key是否存在</span></span>
<span class="line">exists key</span>
<span class="line"><span class="token comment">#根据key获取数据类型</span></span>
<span class="line"><span class="token builtin class-name">type</span> key</span>
<span class="line"></span>
<span class="line"><span class="token comment">#为key设置时效</span></span>
<span class="line">expire key seconds</span>
<span class="line">pexpire key milliseconds</span>
<span class="line">expireat key timstaamp</span>
<span class="line">pexpireat key milliseconds timstaamp</span>
<span class="line"></span>
<span class="line"><span class="token comment">#获取key的有效时间</span></span>
<span class="line">ttl key</span>
<span class="line">pttl key <span class="token comment">#毫秒</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#切换key从有时效变为永久件</span></span>
<span class="line">persist key</span>
<span class="line"></span>
<span class="line"><span class="token comment">#key的扩展操作 keys pattern</span></span>
<span class="line">keys * <span class="token comment">#查询所有</span></span>
<span class="line">keys it* <span class="token comment">#it开头的key</span></span>
<span class="line">keys *it  <span class="token comment">#it结尾的key</span></span>
<span class="line">keys ??it <span class="token comment">#前两个字符随意，后面it结尾</span></span>
<span class="line">keys user:? <span class="token comment">#查询user:开头，后一个字符随意</span></span>
<span class="line">keys u<span class="token punctuation">[</span>st<span class="token punctuation">]</span>er <span class="token comment">#查询u开头，er结尾，中间一个值为s或t</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-数据库通用命令" tabindex="-1"><a class="header-anchor" href="#_2-数据库通用命令"><span>2.数据库通用命令</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#redis使用过程中，如果数据不区分种类、类别，可能会出现key重复的情况.</span></span>
<span class="line"><span class="token comment">#解决方案：redis为每个服务提供16个数据库，编号从0-15，每个数据库之间相互独立</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#切换数据库</span></span>
<span class="line"><span class="token keyword">select</span> index  <span class="token comment">#0-15  </span></span>
<span class="line"><span class="token comment">#把本库数据移动到</span></span>
<span class="line">move key index</span>
<span class="line"><span class="token comment">#数据清除</span></span>
<span class="line">dbsize <span class="token comment">#数据库大小</span></span>
<span class="line">flushdb <span class="token comment">#清除本编号内的内容</span></span>
<span class="line">flushall <span class="token comment">#清除所有</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#其他操作</span></span>
<span class="line">quit</span>
<span class="line"><span class="token function">ping</span></span>
<span class="line"><span class="token builtin class-name">echo</span> message</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


