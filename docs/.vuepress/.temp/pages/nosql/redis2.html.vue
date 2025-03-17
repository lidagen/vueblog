<template><div><h2 id="redis高级" tabindex="-1"><a class="header-anchor" href="#redis高级"><span>Redis高级</span></a></h2>
<h3 id="linux-操作redis" tabindex="-1"><a class="header-anchor" href="#linux-操作redis"><span>linux 操作redis</span></a></h3>
<h4 id="_1安装" tabindex="-1"><a class="header-anchor" href="#_1安装"><span>1安装</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#下载解压tar.gz包</span></span>
<span class="line"><span class="token function">wget</span> http://download.redis.io/releases/redis-5.0.7.tar.gz</span>
<span class="line"><span class="token comment">#进入解压的包</span></span>
<span class="line"><span class="token builtin class-name">cd</span> ./redis-5.0.7</span>
<span class="line"><span class="token comment">#编译</span></span>
<span class="line"><span class="token function">make</span></span>
<span class="line"><span class="token comment">#安装</span></span>
<span class="line"><span class="token function">make</span> <span class="token function">install</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-指定端口启动" tabindex="-1"><a class="header-anchor" href="#_2-指定端口启动"><span>2.指定端口启动</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">redis-server <span class="token parameter variable">--prot</span> <span class="token number">6379</span></span>
<span class="line"><span class="token comment">#关闭redis</span></span>
<span class="line"><span class="token comment">#查进程,找PID号杀掉</span></span>
<span class="line"><span class="token function">ps</span> <span class="token parameter variable">-ef</span> <span class="token operator">|</span><span class="token function">grep</span> redis-</span>
<span class="line"><span class="token function">kill</span> <span class="token parameter variable">-s</span> <span class="token number">9</span> pid号</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-配置文件启动" tabindex="-1"><a class="header-anchor" href="#_3-配置文件启动"><span>3.配置文件启动</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#修改目录下的redis.conf,启动</span></span>
<span class="line">redis-server redis.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="持久化" tabindex="-1"><a class="header-anchor" href="#持久化"><span>持久化</span></a></h3>
<ul>
<li>持久化：利用永久存储介质进行保存，在特定时间将保存的数据进行恢复的机制。</li>
<li>持久化是防止意外丢失，确保数据安全</li>
<li>持久化过程工作方式：
<ul>
<li>数据（快照）：将当前的数据状态进行保存，存储数据结果，关注点在数据。（RDB）</li>
<li>过程（日志）：将数据的操作步骤记录，存储操作过程，关注点在数据操作的过程。（AOF）</li>
</ul>
</li>
</ul>
<h4 id="_1-rdb" tabindex="-1"><a class="header-anchor" href="#_1-rdb"><span>1.RDB</span></a></h4>
<ul>
<li>RDB启动方式---save指令</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#手动执行一次保存操作，保存位置在redis.conf配置的dir目录下dump.rdb文件</span></span>
<span class="line">save</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>RDB相关配置<code v-pre>redis.conf</code></li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#设置本地保存快照名称，默认值是dump.rdb，可改为dump_端口号.rdb</span></span>
<span class="line">dbfilename dump.rdb</span>
<span class="line"><span class="token comment">#存储rdb的路径</span></span>
<span class="line"><span class="token function">dir</span> <span class="token string">"/opt/redisData"</span></span>
<span class="line"><span class="token comment">#本地存储是否压缩数据，默认yes,如果设置为no,可节省CPU时间，但文件会变大巨大</span></span>
<span class="line">rdbcompression <span class="token function">yes</span></span>
<span class="line"><span class="token comment">#设置是如rdb文件格式校验，默认yes,如果设置no，可节约读写10%时间消耗，但存储数据有损坏风险</span></span>
<span class="line">rdbchecksum <span class="token function">yes</span></span>
<span class="line"><span class="token comment">#后台bgsave存储出错是否停止保存，默认yes</span></span>
<span class="line">stop-writes-on-bgsave-error <span class="token function">yes</span></span>
<span class="line"><span class="token comment">#配置RDB自动保存，叫save后台是bgsave指令</span></span>
<span class="line">save <span class="token number">300</span> <span class="token number">50</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>save指令工作原理
<ul>
<li>因为redis是单线程的，save指令保存数据会耗时，有可能导致长时间阻塞。线上环境不建议使用</li>
</ul>
</li>
<li>bgsave指令
<ul>
<li>basave命令后，其不是立刻执行，而是会调用fork函数生成子进程保存数据，不占用redis线程。</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#后台保存</span></span>
<span class="line">bgsave</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><strong>bgsave是针对save的优化，Redis涉及RDB的操作都用bgsave代替save指令</strong></p>
</li>
<li>
<p>bgsave自动执行</p>
<ul>
<li>配置：</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#second 监控时间 changes 监控key的变化量</span></span>
<span class="line"><span class="token comment"># 在10秒内监控到了10个key发生了变化就保存</span></span>
<span class="line"><span class="token comment"># 在redis.conf中配置</span></span>
<span class="line">save second changes</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p>注意：</p>
<ul>
<li>save配置要根据实际业务设定，频度过高或者过低都可能出现性能问题</li>
<li>save配置中second和changes设置通常互补对应关系，尽量不要设置成包含性的关系</li>
<li>save配置后是bgsave指令操作</li>
</ul>
</li>
<li>
<p>rdb特殊启动形式</p>
<ul>
<li>全量复制</li>
<li>服务器运行过程中重启</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">debug reload</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>关闭服务器时指定保存数据</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">  <span class="token function">shutdown</span> save</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>RDB优点
<ul>
<li>RDB是一个紧凑的二进制文件，存储效率高</li>
<li>RDB内部存储的是redis在某个时间点的数据快照，非常适用数据备份，全量复制</li>
<li>RDB恢复数据速度比AOF快</li>
<li>应用：服务器中每隔N小时执行bgsave备份，并将RDB文件拷贝到远程机器中，用于灾难恢复</li>
</ul>
</li>
<li>RDB缺点
<ul>
<li>RDB无论执行指令还是利用配置，都无法做到实时持久化，有较大可能丢失部分数据</li>
<li>bgsave指令每次运行需要fork子进程，要牺牲一些性能</li>
<li>Redis众多版本未就RDB文件格式统一，不同版本可能无法兼容</li>
</ul>
</li>
</ul>
<h4 id="_2-aof" tabindex="-1"><a class="header-anchor" href="#_2-aof"><span>2.AOF</span></a></h4>
<ul>
<li>append only file:以独立日志的方式记录每次命令，重启后再次执行AOF文件中的命令达到恢复数据的目的。</li>
<li>aof解决了数据持久化和实时性，是redis持久化的主流方式</li>
<li>aof持久化的三种策略（appendfsync）
<ul>
<li>always(每次): 每次写入都同步到aof文件中，数据零误差，<strong>性能较低</strong></li>
<li>everysec(每秒)：每秒将缓存区的数据同步到aof文件中，数据准确率较高，性能较高，最多丢失1秒内的数据</li>
<li>no (系统控制)：由操作系统控制每次aof的周期，<strong>时间不可控</strong></li>
</ul>
</li>
<li>aof开启</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#conf文件中配置，dir中生成aof文件</span></span>
<span class="line"><span class="token comment">#是否开启aof，默认no</span></span>
<span class="line">appendonly <span class="token function">yes</span><span class="token operator">|</span>no</span>
<span class="line"><span class="token comment">#策略</span></span>
<span class="line">appendfsync always<span class="token operator">|</span>everysec<span class="token operator">|</span>no</span>
<span class="line"><span class="token comment">#文件名</span></span>
<span class="line">appendfilename appendonly_端口号.aof</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>AOF重写
<ul>
<li>随着命令越来越多，文件会越来越大，为了解决这个问题，Redis引入了aof重写机制，简单来说就是对同一个数据若干条指令转化成的最终结果进行对于指令记录</li>
<li>重写好处：1.降低磁盘占用量；2.降低持久化时间，减少IO；3.数据恢复效率变高</li>
<li>重写方式</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#手动重写</span></span>
<span class="line">bgrewriteaof</span>
<span class="line"><span class="token comment">#conf配置</span></span>
<span class="line"><span class="token comment">#设置允许重写的最小aof文件大小，避免了达到约定百分比但尺寸仍然很小的情况还要重写</span></span>
<span class="line">auto-aof-rewrite-min-size 64mb</span>
<span class="line"><span class="token comment">#aof自动重写配置。当目前aof文件大小超过上一次重写的aof文件大小的百分之多少进行重写</span></span>
<span class="line">auto-aof-rewrite-percentage <span class="token number">100</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-rdb和aof的区别" tabindex="-1"><a class="header-anchor" href="#_3-rdb和aof的区别"><span>3.RDB和AOF的区别</span></a></h4>
<p>持久化方式 | RDB | AOF |</p>
<ul>
<li>| :-: | :-: | :-: | -:
占用存储空间  | java  |  AP |
存储速度  | 小（数据级：压缩）  |  大 （指令级：重写）|
恢复速度  | 快 |  慢
数据安全性  | 会丢失数据 |  依据策略决定
资源消耗  | 高/重量级  | 低/轻量级<br>
启动优先级  | 低  | 高|</li>
</ul>
<h5 id="_4-rdb和aof选择" tabindex="-1"><a class="header-anchor" href="#_4-rdb和aof选择"><span>4.RDB和AOF选择</span></a></h5>
<ul>
<li>
<p>数据十分敏感，选AOF</p>
<ul>
<li>策略为everysec,最多丢失1秒内数据</li>
<li>注意：AOF文件存储较大，恢复较慢</li>
</ul>
</li>
<li>
<p>数据呈现阶段有效性，选RDB</p>
<ul>
<li>数据可以良好做到阶段内无丢失，且恢复较快</li>
<li>注意:利用RDB实现紧凑数据持久化会使redis降的很低</li>
</ul>
</li>
<li>
<p>综合对比</p>
<ul>
<li>AOF适用数据敏感业务</li>
<li>如能承受数分钟内丢失，且追求大数据恢复速度，选RDB</li>
<li>容灾恢复选RDB</li>
<li>双保险策略，都开启，重启后Redis优先使用AOF恢复</li>
</ul>
</li>
</ul>
<h3 id="事务" tabindex="-1"><a class="header-anchor" href="#事务"><span>事务</span></a></h3>
<h4 id="_1-事务简介" tabindex="-1"><a class="header-anchor" href="#_1-事务简介"><span>1.事务简介</span></a></h4>
<ul>
<li>redis的一系列操作，中间不被打断</li>
</ul>
<h4 id="_2-事务基本操作" tabindex="-1"><a class="header-anchor" href="#_2-事务基本操作"><span>2.事务基本操作</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#开启事务,事务开启的位置，在这个命令后续的指令都在一个事务内</span></span>
<span class="line">multi</span>
<span class="line"><span class="token comment">#执行事务，设定的结束事务位置</span></span>
<span class="line"><span class="token builtin class-name">exec</span></span>
<span class="line"><span class="token comment"># 两个命令成对出现，设定了事务的开始和结束区间</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#取消事务命令,发生在exec之前，multi之后</span></span>
<span class="line">discard</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>注意：当我们加入事务命令的时候，命令加入任务队列中并未执行，只有执行了exec才真正执行</li>
<li><code v-pre>multi</code>命令开启后，redis会创建一个队列，对之后的指令都放入队列中，在识别到<code v-pre>exec</code>指令后，在依次执行队列里的指令</li>
<li>事务注意事项：
<ul>
<li><code v-pre>multi</code>开启后，后续指令出错（比如set写成est），则事务全不执行，事务取消，无法执行<code v-pre>exec</code></li>
<li><code v-pre>multi</code>开启后,对输入操作了不符合其数据结构的指令，比如对string用了lpush,则这行指令出错，其余正确执行。这种需要程序员自己回滚事务。</li>
</ul>
</li>
</ul>
<h4 id="_3-锁" tabindex="-1"><a class="header-anchor" href="#_3-锁"><span>3.锁</span></a></h4>
<h5 id="watch" tabindex="-1"><a class="header-anchor" href="#watch"><span>watch</span></a></h5>
<ul>
<li>一笔数据需要进行进行修改，这时几个客户端都有权限修改，为了保证不重复操作，需要锁来监控这个key是否发生了变化，如果变化则后续操作不发生。</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#对key进行监控，如果事务执行exec前key有了改动，则终止执行事务</span></span>
<span class="line"><span class="token function">watch</span> key1 <span class="token punctuation">[</span>key2<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#取消对所有key监控</span></span>
<span class="line">unwatch</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>监控在<code v-pre>multi</code>之前，在<code v-pre>exec</code>执行前，key的值发生变化，则<code v-pre>exec</code>不执行</li>
</ul>
<h5 id="分布式锁" tabindex="-1"><a class="header-anchor" href="#分布式锁"><span>分布式锁</span></a></h5>
<ul>
<li>多个人抢购一个物品，如何避免这件商品不被多个人抢到？</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#使用setnx设置一个公共锁</span></span>
<span class="line">setnx lock_key value</span>
<span class="line"><span class="token comment">#利用setnx返回值特征，有值则返回失败，无值则返回成功</span></span>
<span class="line"><span class="token comment">#抢购前，设置锁，成功则进入修改数据并删除锁，失败则等待</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="死锁" tabindex="-1"><a class="header-anchor" href="#死锁"><span>死锁</span></a></h5>
<ul>
<li>如果某个客户端加锁以后，客户端宕机无法执行之后步骤，或者忘记解锁，如何解决？</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#给锁设置一个时效，到期自动解锁</span></span>
<span class="line">expire key second</span>
<span class="line">pexpire key millisenconds</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>由于redis操作通常都是毫秒级，因此锁定时间不宜过大，具体需要业务测试后确定
<ul>
<li>测试百万次最长执行时间对应命令的最大耗时，测试百万次网络延迟平均耗时</li>
<li>锁时间推荐：最大耗时 * 1.2+平均网络耗时 * 1.1</li>
</ul>
</li>
</ul>
<h3 id="删除策略" tabindex="-1"><a class="header-anchor" href="#删除策略"><span>删除策略</span></a></h3>
<h4 id="_1-过期数据" tabindex="-1"><a class="header-anchor" href="#_1-过期数据"><span>1.过期数据</span></a></h4>
<ul>
<li>redis所有数据放在内存中，内存中可以用TTL指令获取其状态
<ul>
<li>XX：具有时效性数据</li>
<li>-1：永久有效数据</li>
<li>-2：已经过期的、被删除或为定义的的数据</li>
</ul>
</li>
</ul>
<h4 id="_2-数据删除策略" tabindex="-1"><a class="header-anchor" href="#_2-数据删除策略"><span>2.数据删除策略</span></a></h4>
<ul>
<li>
<p>过期的数据并不一定立刻被删除了，redis有三种删除策略：</p>
<ul>
<li>
<p>定时删除：创建一个定时器，当key设定了时间，且过期时间到达时，由定时任务执行删除</p>
<ul>
<li>优点：节约内存，到时就删除，快速释放不必要的内存占用</li>
<li>缺点：CPU压力很大，无论CPU此时负载多高，均占用CPU，会影响redis服务器响应时间和指令吞吐量。</li>
<li>总结：用处理器性能换取存储时间（时间换空间）</li>
</ul>
</li>
<li>
<p>惰性删除：数据到了过期时间，不做处理，等下次访问该数据时，如果过期就删除</p>
<ul>
<li>优点：节约CPU性能，发现必须删除时再删除</li>
<li>缺点：内存占用压力大，出现长期占用内存的数据</li>
<li>总结：用存储空间换取处理器性能</li>
</ul>
</li>
<li>
<p>定期删除：执行器在0-15个分区循环检查，在每个分区随机检查W个key,如果有失效的删除，当本次检查失效的key数量大于W * 25%,则继续这个过程，如果小于W * 25%，则检查下个分区</p>
<ul>
<li>conf中，w的取值= ACTIVE_EXPIRE_CYCLE_LOOKUPS_PRE_LOOP属性值</li>
<li>周期性轮询来检查redis中key的时效性，利用过期key占比方式控制删除频率</li>
<li>特点1：CPU性能占用设置有峰值，检测频度可设置</li>
<li>特点2：内存压力不会很大，长期占用的冷数据会被持续清理</li>
<li>总结：周期性抽查存储空间（随机检查，重点抽查）</li>
</ul>
</li>
</ul>
</li>
<li>
<p>redis内部时效性数据处理方法：</p>
<ul>
<li>当带有时效的指令设置key后，redis在内存开辟一块空间，里面存储这个数据的<em>地址-&gt;过期的时间</em>。</li>
<li>数据删除的目标是在内存占用和CPU占用中找平衡，避免redis性能下降甚至宕机。</li>
<li>删除的时候，会找已经时效的时间，根据时间能找到对应的数据位置，执行删除。</li>
</ul>
</li>
</ul>
<h4 id="_3-逐出算法" tabindex="-1"><a class="header-anchor" href="#_3-逐出算法"><span>3.逐出算法</span></a></h4>
<ul>
<li>当新数据进入redis中，如果内存不足。这时候需要逐出算法</li>
<li>影响数据逐出的相关配置</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#最大可使用内存,默认0，表示不限制，生产中根据需求来设定，通常设定50%以上</span></span>
<span class="line">maxmemory</span>
<span class="line"><span class="token comment">#每次选取待删除的个数</span></span>
<span class="line">maxmemory-sampes</span>
<span class="line"><span class="token comment">#删除策略配置</span></span>
<span class="line">maxmemory-policy</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="影响数据逐出的相关配置" tabindex="-1"><a class="header-anchor" href="#影响数据逐出的相关配置"><span>影响数据逐出的相关配置</span></a></h5>
<ul>
<li>
<p>检测易失数据（可能会过期的数据集server.bd[i].expire）</p>
<ul>
<li>volatile-lru:挑选最少使用的数据淘汰</li>
<li>volatile-lfu:挑选最近使用次数最少的淘汰</li>
<li>volatile-ttl:挑选即将失效的淘汰</li>
<li>volatile-random:随机选择数据淘汰</li>
</ul>
</li>
<li>
<p>检测全库数据（所有数据集server.db[i].dict)</p>
<ul>
<li>allkeys-lru:挑选最少使用的数据淘汰</li>
<li>allkeys-lfu:挑选最近使用次数最少的淘汰</li>
<li>allkeys-random:随机选择数据淘汰</li>
</ul>
</li>
<li>
<p>放弃数据逐出</p>
<ul>
<li>no-enviction:禁止驱逐,(4.0默认策略)，会引发错误OOM</li>
</ul>
</li>
</ul>
<h3 id="redis-conf" tabindex="-1"><a class="header-anchor" href="#redis-conf"><span>redis.conf</span></a></h3>
<h4 id="_1-redis核心配置" tabindex="-1"><a class="header-anchor" href="#_1-redis核心配置"><span>1.redis核心配置</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#基础配置#</span></span>
<span class="line"><span class="token comment">#设置redis以守护线程方式启动</span></span>
<span class="line">daemonize <span class="token function">yes</span><span class="token operator">|</span>no</span>
<span class="line"><span class="token comment">#绑定主机地址</span></span>
<span class="line"><span class="token builtin class-name">bind</span> <span class="token number">127.0</span>.0.1</span>
<span class="line"><span class="token comment">#设置端口号</span></span>
<span class="line">port <span class="token number">6379</span></span>
<span class="line"><span class="token comment">#设置数据库数量</span></span>
<span class="line">databases <span class="token number">16</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#日志配置#</span></span>
<span class="line"><span class="token comment">#设置服务器日志级别,默认verbose，生产notice即可，减少IO</span></span>
<span class="line">loglevel debug<span class="token operator">|</span>verbose<span class="token operator">|</span>notice<span class="token operator">|</span>warning</span>
<span class="line"><span class="token comment">#日志记录名</span></span>
<span class="line">logfile 端口号.log</span>
<span class="line"></span>
<span class="line"><span class="token comment">#客户端配置#</span></span>
<span class="line"><span class="token comment">#设置同一时间客户端最大连接数量，默认无限制，当客户端连接达到上限，redis会关闭新连接</span></span>
<span class="line">maxclients <span class="token number">0</span></span>
<span class="line"><span class="token comment">#客户端闲置等待最大时长，达到最大时长关闭连接，如需关闭此功能，设置为0</span></span>
<span class="line"><span class="token function">timeout</span> <span class="token number">300</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#多服务器快捷配置#</span></span>
<span class="line"><span class="token comment">#导入并加载指定配置文件信息，用于快捷创建redis公共配置较多的redis实例配置文件，便于维护</span></span>
<span class="line"><span class="token comment">#类似继承，公共的写一个，然后特别的配置用include</span></span>
<span class="line">include /path/server-端口号.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="redis高级数据类型" tabindex="-1"><a class="header-anchor" href="#redis高级数据类型"><span>redis高级数据类型</span></a></h3>
<ul>
<li>所谓高级数据类型是为了解决单一问题存在的，它不同于前面5种有明显模型特征的基础类型</li>
</ul>
<h4 id="_1-bitmaps" tabindex="-1"><a class="header-anchor" href="#_1-bitmaps"><span>1.Bitmaps</span></a></h4>
<ul>
<li>业务场景：视频网站需要统计一整年未被观看过的视频，并对其下架，redis如何统计这些数据？</li>
<li>方案：这个统计只区分是否，开关式的状态。Bitmaps提供一种二进制方案，二进制每一列代表一部电影，1表示播放过，0表示未播放，这样就最小力度可以保存大量数据</li>
<li>这样的方案保存很方便，但是取值比较麻烦，需要根据位置来取，改值也是。拿时间换空间</li>
<li>简单理解Bitmaps就是对字符串的二进制操作</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#基本操作#</span></span>
<span class="line"><span class="token comment">#设定指定key对应偏移量上的bit值，value只能是0和1</span></span>
<span class="line">setbit key offset value</span>
<span class="line"><span class="token comment">#获取指定值偏移量上的值</span></span>
<span class="line">getbit key offset</span>
<span class="line"><span class="token comment">#注意，如果没设置也会getbit 为0，只要不存在全部是0</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>扩展业务：1.统计每天某一部电影是否被点播 2.统计每天多少部电影被点播 3.统计每周/月/年多少部电影被点播4.统计年哪部没被点播</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#统计指定key中1的数量</span></span>
<span class="line">bitcount key <span class="token punctuation">[</span>start end<span class="token punctuation">]</span> <span class="token comment">#start end没有默认全部</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 对指定key按位op进行交and、并or、非not、异或xor操作，并将结果保存destkey中</span></span>
<span class="line">bitop <span class="token function">op</span> destkey key1 <span class="token punctuation">[</span>key2<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>业务的redis解决方案</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#假如我们有10部电影，电影在数据库的id就来确定他们的offset位置</span></span>
<span class="line"><span class="token comment">#按每一天设定一个key,对点击的电影进行值的修改</span></span>
<span class="line"><span class="token comment">#我们设定10部电影分别id 1-10,4.1日id为1、3、5的点击过</span></span>
<span class="line">setbit <span class="token number">20200401</span> <span class="token number">1</span> <span class="token number">1</span></span>
<span class="line">setbit <span class="token number">20200401</span> <span class="token number">3</span> <span class="token number">1</span></span>
<span class="line">setbit <span class="token number">20200401</span> <span class="token number">5</span> <span class="token number">1</span></span>
<span class="line"><span class="token comment">#4.2日 id为2、3、5被点击过</span></span>
<span class="line">setbit <span class="token number">20200402</span> <span class="token number">2</span> <span class="token number">1</span></span>
<span class="line">setbit <span class="token number">20200402</span> <span class="token number">3</span> <span class="token number">1</span></span>
<span class="line">setbit <span class="token number">20200402</span> <span class="token number">5</span> <span class="token number">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#统计总共被点击过的电影数量</span></span>
<span class="line">bitcount <span class="token number">20200401</span></span>
<span class="line">bitcount <span class="token number">20200402</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 统计两天被点击过的电影存如key为01-02中</span></span>
<span class="line">bitop or 01-02 <span class="token number">20200401</span> <span class="token number">20200402</span> </span>
<span class="line"><span class="token comment"># 现在分别查1-10位置的值</span></span>
<span class="line">getbit 01-02 <span class="token number">1</span><span class="token punctuation">..</span>.</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Bitmap只能统计是否被播放，不能统计某部电影被播放过多少次</li>
</ul>
<h4 id="_2-hyperloglog" tabindex="-1"><a class="header-anchor" href="#_2-hyperloglog"><span>2.HyperLogLog</span></a></h4>
<ul>
<li>HyperLogLog只干一件事，统计不重复数据的数量</li>
<li>基数：
<ul>
<li>基数就是数据集去重后元素个数</li>
<li>HyperLogLog就是用来作基数统计的，运用了LogLog算法</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#添加数据</span></span>
<span class="line">pfadd key element <span class="token punctuation">[</span>element<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#统计数据</span></span>
<span class="line">pfcount key <span class="token punctuation">[</span>key<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#合并数据</span></span>
<span class="line">pfmerge distkey sourcekey <span class="token punctuation">[</span>sourcekey<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>只用于基数统计，不保存数据</li>
<li>核心是估算算法，最终值存在一定误差</li>
<li>误差范围：基数估计的结果存在一个带有0.81%标准错误的近似值</li>
<li>耗空间极小，占用12k内存</li>
</ul>
<h4 id="_3-geo" tabindex="-1"><a class="header-anchor" href="#_3-geo"><span>3.GEO</span></a></h4>
<ul>
<li>基于坐标点，来做地理位置的相关操作</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#求距离#</span></span>
<span class="line"><span class="token comment">#添加坐标点lng经度lat纬度member是名称，如果两点需要计算，他们要放在一个key里</span></span>
<span class="line">geoadd key lng lat member <span class="token punctuation">[</span>lng lat member<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#获取坐标点</span></span>
<span class="line">geopos key member <span class="token punctuation">[</span>member<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#计算坐标间距离 unit是单位 可选m  km等</span></span>
<span class="line">geodist key member1 menber2 <span class="token punctuation">[</span>unit<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#求范围#</span></span>
<span class="line"><span class="token comment">#根据坐标求范围内数据 radius数字 后面加单位 m km</span></span>
<span class="line"><span class="token comment"># withcoord 返回坐标  #withdist返回距离多远 # count范围 #加asc desc升降序</span></span>
<span class="line">georadius key lng lat radius m<span class="token punctuation">\</span>km<span class="token punctuation">\</span>ft<span class="token punctuation">\</span>mi  <span class="token punctuation">[</span>withcoord<span class="token punctuation">]</span> <span class="token punctuation">[</span>withdist<span class="token punctuation">]</span> <span class="token punctuation">[</span>withhash<span class="token punctuation">]</span> <span class="token punctuation">[</span>count count<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#根据点求范围内数据</span></span>
<span class="line">georadiusbymember key member radius m<span class="token punctuation">\</span>km<span class="token punctuation">\</span>ft<span class="token punctuation">\</span>mi  <span class="token punctuation">[</span>withcoord<span class="token punctuation">]</span> <span class="token punctuation">[</span>withdist<span class="token punctuation">]</span> <span class="token punctuation">[</span>withhash<span class="token punctuation">]</span> <span class="token punctuation">[</span>count count<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment">#获取指定坐标hash值</span></span>
<span class="line">geohash key member <span class="token punctuation">[</span>menber<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#附近10km内10个人升序排列，并显示距离我多远#geos为保存所有人坐标的key</span></span>
<span class="line">georadius geos  <span class="token number">108</span>.xxx <span class="token number">34</span>.xxx <span class="token number">10</span> km withdist <span class="token number">1</span> <span class="token number">10</span> asc</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


