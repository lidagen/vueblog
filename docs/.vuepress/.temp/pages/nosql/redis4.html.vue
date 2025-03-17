<template><div><h2 id="企业级解决方案" tabindex="-1"><a class="header-anchor" href="#企业级解决方案"><span>企业级解决方案</span></a></h2>
<h3 id="缓存预热" tabindex="-1"><a class="header-anchor" href="#缓存预热"><span>缓存预热</span></a></h3>
<h4 id="现象" tabindex="-1"><a class="header-anchor" href="#现象"><span>现象</span></a></h4>
<ul>
<li>服务器启动后快速宕机</li>
</ul>
<h4 id="原因" tabindex="-1"><a class="header-anchor" href="#原因"><span>原因</span></a></h4>
<ul>
<li>请求数量较大</li>
<li>主从之间数据吞吐量比较大，数据同步操作频率高</li>
</ul>
<h4 id="解决方案" tabindex="-1"><a class="header-anchor" href="#解决方案"><span>解决方案</span></a></h4>
<ul>
<li>前置准备工作
<ul>
<li>日常例行统计数据访问记录，统计访问频度较高的热度数据</li>
<li>利用LRU数据删除策略，构建数据保留队列</li>
</ul>
</li>
<li>准备工作
<ul>
<li>将统计结果中的数据分类，根据级别，redis优先加载级别较高的热点数据</li>
<li>利用分布式多服务器同时进行数据读取，提速数据加载过程</li>
</ul>
</li>
<li>实施
<ul>
<li>使用脚本固定触发数据预热过程</li>
<li>如果条件允许，使用CDN</li>
</ul>
</li>
</ul>
<h3 id="缓存雪崩" tabindex="-1"><a class="header-anchor" href="#缓存雪崩"><span>缓存雪崩</span></a></h3>
<h4 id="现象-1" tabindex="-1"><a class="header-anchor" href="#现象-1"><span>现象</span></a></h4>
<ul>
<li>系统运行过程突然数据库访问激增</li>
<li>导致数据库崩溃引发应用服务器崩溃</li>
</ul>
<h4 id="原因-1" tabindex="-1"><a class="header-anchor" href="#原因-1"><span>原因</span></a></h4>
<ul>
<li>在一个较短时间内，缓存中较多的<strong>key集中过期</strong></li>
<li>大量请求未命中redis,从而给数据库带来大的压力</li>
<li>应用服务器，redis,数据库的重启效果不明显</li>
</ul>
<h4 id="解决方案-1" tabindex="-1"><a class="header-anchor" href="#解决方案-1"><span>解决方案</span></a></h4>
<ul>
<li>解决方案1
<ul>
<li>更多页面静态化处理</li>
<li>构建多级缓存架构
<ul>
<li>nginx+redis+ehcache</li>
</ul>
</li>
<li>对数据库查询进行优化</li>
<li>灾难预警：
<ul>
<li>监控CPU使用</li>
<li>内存容量</li>
<li>平均响应时间</li>
<li>线程数</li>
</ul>
</li>
<li>服务限流、熔断</li>
</ul>
</li>
<li>解决方案2
<ul>
<li>LRU和LFU的切换</li>
<li>数据有效期策略
<ul>
<li>根据业务不同，key失效时间错峰</li>
<li>过期时间使用固定时间+随机值，稀释集中到期key数量</li>
</ul>
</li>
<li>定期维护，对即将过期的数据做访问量统计，确认是否需要延期</li>
<li>加锁：慎用</li>
</ul>
</li>
</ul>
<h3 id="缓存击穿" tabindex="-1"><a class="header-anchor" href="#缓存击穿"><span>缓存击穿</span></a></h3>
<h4 id="现象-2" tabindex="-1"><a class="header-anchor" href="#现象-2"><span>现象</span></a></h4>
<ul>
<li>系统运**行中，数据库访问激增</li>
<li>redis服务器无大量key过期，CPU正常，内存平稳无波动</li>
<li>数据库崩溃</li>
</ul>
<h4 id="原因-2" tabindex="-1"><a class="header-anchor" href="#原因-2"><span>原因</span></a></h4>
<ul>
<li><strong>单个key</strong>过期，而这个key访问量很大</li>
<li>大量对这个key的请求，redis未命中，短时间对数据库发起大量访问</li>
</ul>
<h4 id="解决方案-2" tabindex="-1"><a class="header-anchor" href="#解决方案-2"><span>解决方案</span></a></h4>
<ul>
<li>预先对可能的高热key加大过期时长</li>
<li>实时对流量激增的key延长过期时间或者设置永久key</li>
<li>对可能的高峰访问前，提前刷新数据有效期，确保key在访问时不过期</li>
<li>分布式锁，防止被击穿，但是也影响性能</li>
</ul>
<h3 id="缓存穿透" tabindex="-1"><a class="header-anchor" href="#缓存穿透"><span>缓存穿透</span></a></h3>
<h4 id="现象-3" tabindex="-1"><a class="header-anchor" href="#现象-3"><span>现象</span></a></h4>
<ul>
<li>应用服务器访问增加，redis命中<strong>逐步降低</strong></li>
<li>redis服务器CPU占用激增</li>
<li>数据库压力激增</li>
<li>数据库崩溃</li>
</ul>
<h4 id="原因-3" tabindex="-1"><a class="header-anchor" href="#原因-3"><span>原因</span></a></h4>
<ul>
<li>大量非正常URL，要获取的数据根本不存在</li>
<li>redis中没有这些数据，所以去请求数据库</li>
<li>可能的黑客攻击</li>
</ul>
<h4 id="解决方案1" tabindex="-1"><a class="header-anchor" href="#解决方案1"><span>解决方案1</span></a></h4>
<ul>
<li>redis对没有的数据缓存null,设置较短过期时间（&lt;5min）</li>
<li>白名单策略
<ul>
<li>提前预热各种分类数据id对于的bitmaps,当数据正常放行，数据异常拦截（效率较低）</li>
<li>布隆过滤器（布隆过滤器命中率这种情况可以忽略）</li>
</ul>
</li>
<li>实施监控
<ul>
<li>监控redis命中率与null数据的占比
<ul>
<li>非活动时间波动，通常检测3～5倍，超过5纳入排查</li>
<li>活动时间波动，通村检测10～50倍，超过50纳入排查</li>
</ul>
</li>
</ul>
</li>
<li>key加密
<ul>
<li>问题出现后，临时启动防灾业务key,对key进行业务层传输加密，设定校验程序，对key校验（例如每天随机分配60个加密串，挑选2～3个，混淆在页面数据id中，发现key不满足规则，驳回请求）</li>
</ul>
</li>
</ul>
<h3 id="数据库与缓存双写一致性" tabindex="-1"><a class="header-anchor" href="#数据库与缓存双写一致性"><span>数据库与缓存双写一致性</span></a></h3>
<ul>
<li>双写一致性，主要是在更新数据库的操作，如何保证数据库更新的值和缓存更新的值保持一致</li>
<li>理论上了来说，对缓存数据设置过期时间，是保证最终一致性的解决方案，所有的写操作都是依数据库为准，如果数据库写成功，缓存更新失败，那只要到达过期时间，自然会从数据库取新值回填。这里讨论不依赖过期时间的三种解决方案</li>
</ul>
<h4 id="三种更新策略" tabindex="-1"><a class="header-anchor" href="#三种更新策略"><span>三种更新策略</span></a></h4>
<ul>
<li>先更新数据库，再更新缓存</li>
<li>先删除缓存，再更新数据库</li>
<li>先更新数据库，再删除缓存</li>
</ul>
<h4 id="方案1——先更新数据库-再更新缓存" tabindex="-1"><a class="header-anchor" href="#方案1——先更新数据库-再更新缓存"><span>方案1——先更新数据库，再更新缓存</span></a></h4>
<ul>
<li>这套方案是大家普遍反对的，有如下两个原因
<ul>
<li>原因一，线程安全角度
<ul>
<li>两个线程对数据修改，有可能导致数据库和缓存不一致</li>
</ul>
</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#1线程A更新了数据库</span></span>
<span class="line"><span class="token comment">#2线程B更新了数据库</span></span>
<span class="line"><span class="token comment">#3线程B更新了缓存</span></span>
<span class="line"><span class="token comment">#4线程A更新了缓存</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>原因二，业务场景角度
<ul>
<li>场景1，如果是一个写多读少的业务，频繁的更新缓存是浪费性能的</li>
<li>场景2，如果写入数据库的值，并不直接写入缓存，而是需要复杂计算的，那么每次写入再计算不如删除更合适</li>
</ul>
</li>
</ul>
<h4 id="方案2——先删除缓存-再更新数据库" tabindex="-1"><a class="header-anchor" href="#方案2——先删除缓存-再更新数据库"><span>方案2——先删除缓存，再更新数据库</span></a></h4>
<ul>
<li>这套方案也会导致不一致</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 1请求A删除缓存，准备修改数据库</span></span>
<span class="line"><span class="token comment"># 2请求B查询发现缓存不存在</span></span>
<span class="line"><span class="token comment"># 3请求B去数据库查到了旧值</span></span>
<span class="line"><span class="token comment"># 4请求B把旧值写入缓存</span></span>
<span class="line"><span class="token comment"># 5请求A将新值写入数据库</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>这种问题可以采用延时双删策略</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line">#伪代码</span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">write</span><span class="token punctuation">(</span><span class="token class-name">String</span> key<span class="token punctuation">,</span><span class="token class-name">Object</span> data<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">    redis<span class="token punctuation">.</span><span class="token function">del</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    db<span class="token punctuation">.</span><span class="token function">update</span><span class="token punctuation">(</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">1000</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    redis<span class="token punctuation">.</span><span class="token function">del</span><span class="token punctuation">(</span>key<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>这个方案可以将1秒内造成的缓存脏数据再次删除，这个1秒如何确定，需要评估自己业务逻辑耗时</li>
<li>若数据库是读写分离架构，还会出现问题</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 1请求A删除缓存，准备修改数据库</span></span>
<span class="line"><span class="token comment"># 2请求A将新值写入数据库</span></span>
<span class="line"><span class="token comment"># 3请求B查询缓存发现，缓存没有值</span></span>
<span class="line"><span class="token comment"># 4请求B去从库查询，这时，还没有完成主从同步，因此查询到的是旧值</span></span>
<span class="line"><span class="token comment"># 5请求B将旧值写入缓存</span></span>
<span class="line"><span class="token comment"># 6数据库完成主从同步，从库变为新值</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="方案3——先更新数据库-再删除缓存" tabindex="-1"><a class="header-anchor" href="#方案3——先更新数据库-再删除缓存"><span>方案3——先更新数据库，再删除缓存</span></a></h4>
<ul>
<li>这种方案也有并发问题</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#1缓存刚好失效</span></span>
<span class="line"><span class="token comment">#2请求A查询数据库，得到一个旧值</span></span>
<span class="line"><span class="token comment">#3请求B将新值写入</span></span>
<span class="line"><span class="token comment">#4请求B删除缓存</span></span>
<span class="line"><span class="token comment">#5请求A将旧值写入缓存</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>这种情况发生概率有多高
<ul>
<li>发生上述情况有一个先天条件，就是步骤3的写操作要比步骤2读操作耗时更短，才有可能步骤4先与步骤5。但是数据库读操作速度远大于写操作（读写分离的意义就是读操作快，消耗资源小）。因此步骤3耗时比步骤2更短，这一情况很难发生</li>
</ul>
</li>
<li>如果一定要解决这个问题
<ul>
<li>设置缓存过期时间，并采用策略2异步延时删除策略</li>
</ul>
</li>
</ul>
<h4 id="还有其它不一致原因吗" tabindex="-1"><a class="header-anchor" href="#还有其它不一致原因吗"><span>还有其它不一致原因吗</span></a></h4>
<ul>
<li>策略2和策略3都存在一个问题，就是删除缓存失败导致的不一致</li>
<li>如何解决：
<ul>
<li>方案1</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#更新数据库数据</span></span>
<span class="line"><span class="token comment">#缓存因问题未删除</span></span>
<span class="line"><span class="token comment">#将需要删除的key发送消息队列</span></span>
<span class="line"><span class="token comment">#自己消费消息，获得要删除的key</span></span>
<span class="line"><span class="token comment">#继续重试删除，直到成功</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>该方案有一个缺点，对业务线代码造成大量的侵入</p>
</div>
<ul>
<li>方案2</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#更新数据库数据,数据库会将操作信息写入binlog日志中</span></span>
<span class="line"><span class="token comment">#订阅程序提取出来所需要的数据以及key</span></span>
<span class="line"><span class="token comment">#另起一段非业务代码，获得该信息</span></span>
<span class="line"><span class="token comment">#尝试删除缓存操作，发现删除失败</span></span>
<span class="line"><span class="token comment">#将这些信息发送消息队列</span></span>
<span class="line"><span class="token comment">#重新从消息队列获取该数据，重试操作</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>上述的订阅binlog程序在mysql中有现成的中间件叫canal，可以完成订阅binlog日志的功能</p>
</div>
<h3 id="性能指标监控" tabindex="-1"><a class="header-anchor" href="#性能指标监控"><span>性能指标监控</span></a></h3>
<h4 id="监控指标" tabindex="-1"><a class="header-anchor" href="#监控指标"><span>监控指标</span></a></h4>
<ul>
<li>性能指标：Performance</li>
<li>内存指标：Memory</li>
<li>基本活动指标：Basicactivity</li>
<li>持久性指标：Persistence</li>
<li>错误指标：Error</li>
</ul>
<h4 id="性能指标-performance" tabindex="-1"><a class="header-anchor" href="#性能指标-performance"><span>性能指标：Performance</span></a></h4>
<p>NAME | DESC |</p>
<ul>
<li>| :-: | :-: | :-: | -:
latency | redis响应一个请求的时间
OPS | 每秒处理请求总数
hit rate | 缓存命中率（计算出来的）</li>
</ul>
<h4 id="内存指标-memory" tabindex="-1"><a class="header-anchor" href="#内存指标-memory"><span>内存指标：Memory</span></a></h4>
<p>NAME | DESC |</p>
<ul>
<li>| :-: | :-: | :-: | -:
used_memory | 已使用内存
mem_fragmentation_ratio| 内存碎片率
evicted_keys | 由于内存限制而被移除key数量
blocked clients | 由于BLPOP、BRPOP等命令而阻塞的客户端</li>
</ul>
<h4 id="基本活动指标-basicactivity" tabindex="-1"><a class="header-anchor" href="#基本活动指标-basicactivity"><span>基本活动指标：Basicactivity</span></a></h4>
<p>NAME | DESC |</p>
<ul>
<li>| :-: | :-: | :-: | -:
connected_clients | 客户端连接数
connected_slaves | slave数量
master_last_io_senconds_ago | 最近一次主从交互之后的秒数
keyspace | 数据库key总数</li>
</ul>
<h4 id="持久性指标-persistence" tabindex="-1"><a class="header-anchor" href="#持久性指标-persistence"><span>持久性指标：Persistence</span></a></h4>
<p>NAME | DESC |</p>
<ul>
<li>| :-: | :-: | :-: | -:
rdb_last_save_time | 最后一次保存到磁盘的时间戳
rdb_changes_since_last_save | 自最后一次持久化磁盘后的更改数</li>
</ul>
<h4 id="错误指标-error" tabindex="-1"><a class="header-anchor" href="#错误指标-error"><span>错误指标：Error</span></a></h4>
<p>NAME | DESC |</p>
<ul>
<li>| :-: | :-: | :-: | -:
rejected_connections | 由于达到最大连接数maxcliens限制而被拒绝的连接数
keyspace_misses | key值查找未命中数
master_link_down_since_seconds | 主从断开的秒数</li>
</ul>
<h3 id="性能指标监控命令" tabindex="-1"><a class="header-anchor" href="#性能指标监控命令"><span>性能指标监控命令</span></a></h3>
<h4 id="监控工具" tabindex="-1"><a class="header-anchor" href="#监控工具"><span>监控工具</span></a></h4>
<ul>
<li>cloud insight redis</li>
<li>Prometheus</li>
<li>Redis-stat</li>
<li>Redis-faina</li>
<li>RedisLive</li>
<li>Zabbix</li>
</ul>
<h4 id="监控命令" tabindex="-1"><a class="header-anchor" href="#监控命令"><span>监控命令</span></a></h4>
<ul>
<li>benchmark</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#50个连接，10000次请求对应性能</span></span>
<span class="line">redis-benchmark</span>
<span class="line"><span class="token comment">#100个连接，5000次请求对应性能</span></span>
<span class="line">redis-benchmark <span class="token parameter variable">-c</span> <span class="token number">100</span> <span class="token parameter variable">-n</span> <span class="token number">5000</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>redis cli
<ul>
<li>monitor</li>
<li>showlog</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#命令 get 获取慢查询日志 len 获取慢查询条数 reset重置慢查询日志</span></span>
<span class="line">showlog <span class="token punctuation">[</span>operator<span class="token punctuation">]</span></span>
<span class="line"> <span class="token comment">#相关配置</span></span>
<span class="line"> slowlog-log-slower-than <span class="token number">1000</span> <span class="token comment">#设置慢查询时间下限</span></span>
<span class="line"> slowlog-max-len <span class="token number">100</span> <span class="token comment">#设置慢查询命令对应日志显示长度</span></span>
<span class="line">````+</span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


