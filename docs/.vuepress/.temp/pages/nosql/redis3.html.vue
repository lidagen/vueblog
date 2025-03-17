<template><div><h2 id="redis集群" tabindex="-1"><a class="header-anchor" href="#redis集群"><span>Redis集群</span></a></h2>
<h3 id="主从复制" tabindex="-1"><a class="header-anchor" href="#主从复制"><span>主从复制</span></a></h3>
<h4 id="_1-主从复制简介" tabindex="-1"><a class="header-anchor" href="#_1-主从复制简介"><span>1.主从复制简介</span></a></h4>
<ul>
<li>
<p>单机Redis风险与问题</p>
<ul>
<li>机器故障</li>
<li>容量瓶颈</li>
</ul>
</li>
<li>
<p>为了避免单机的服务器故障，我们准备多台服务器，将数据复制多个副本保存在不同服务器上，<strong>连接在一起</strong>，并保证数据是<strong>同步</strong>的，这样即使有一台Redis出现故障，其他机器仍然能够提供服务，实现Redis的搞可用，同时实现数据<strong>冗余备份</strong>。</p>
</li>
<li>
<p>多台服务器连接方案：一主(master)多从(slave)，主提供写操作，从提供读操作，主的数据同步给从，保证数据一致性。</p>
</li>
<li>
<p>主从复制的作用：</p>
<ul>
<li>读写分离：master写，slave读，提高服务器的读写负载能力</li>
<li>负载均衡：基于主从架构，配合读写分离，由slave分担master负载，并根据需求的变化，改变slave的数量，通过多个从节点分担数据读取负载，大大提高了redis服务器并发量和数据吞吐量</li>
<li>故障恢复：当master出现问题，有slave提供服务，实现快速故障恢复</li>
<li>数据冗余：实现数据热备份，是持久化之外的一种数据冗余方式</li>
<li>高可用基石：基于主从复制，构建哨兵模式和集群，实现redis高可用方案</li>
</ul>
</li>
</ul>
<h4 id="_2-主从复制工作流程" tabindex="-1"><a class="header-anchor" href="#_2-主从复制工作流程"><span>2.主从复制工作流程</span></a></h4>
<ul>
<li>主从复制大体可以分为3个阶段：
<ul>
<li>建立连接阶段：slave连接master</li>
<li>数据同步阶段：master同步数据给slave</li>
<li>命令传播阶段：master数据变化同步给slave</li>
</ul>
</li>
</ul>
<h5 id="_2-1建立连接阶段工作流程" tabindex="-1"><a class="header-anchor" href="#_2-1建立连接阶段工作流程"><span>2.1建立连接阶段工作流程</span></a></h5>
<ul>
<li>设置master地址和端口，保存master信息</li>
<li>建立socket连接</li>
<li>发送ping命令（定时器）</li>
<li>身份验证</li>
<li>发送slave端口信息</li>
</ul>
<p>| master |  slave |</p>
<ul>
<li>| :-: | :-: | :-: | -:
|| 1.发送指令：slaveof ip port |
| 2.接受指令，响应对方 |  |
|  | 3.保存master ip port
|  | 4.根据保存的信息创立socket
|  | 5.周期性的发送ping
| 6.响应pong |
|  | 7.发送指令 auth passord
| 8.响应鉴权 |
|  | 9.发送指令 replconf listening-port &lt;port-number&gt;
| 10.保存slave port |</li>
</ul>
<ul>
<li>主从复制配置</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#设置slave redis.conf#</span></span>
<span class="line"><span class="token comment">#redis.conf配置文件加主ip 端口</span></span>
<span class="line">slaveof <span class="token number">127.0</span>.0.1 <span class="token number">6379</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#如果需要设置密码#</span></span>
<span class="line"><span class="token comment">#master配置文件</span></span>
<span class="line">requirepass <span class="token operator">&lt;</span>password<span class="token operator">></span></span>
<span class="line"><span class="token comment">#slaver配置文件</span></span>
<span class="line">masterauth <span class="token operator">&lt;</span>password<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_2-2数据同步阶段工作流程" tabindex="-1"><a class="header-anchor" href="#_2-2数据同步阶段工作流程"><span>2.2数据同步阶段工作流程</span></a></h5>
<ul>
<li>请求同步数据</li>
<li>创建RDB同步数据</li>
<li>恢复RDB同步数据</li>
<li>请求部分同步数据</li>
<li>恢复部分同步数据</li>
</ul>
<p>| master |  slave |</p>
<ul>
<li>| :-: | :-: | :-: | -:
|| 1.发送指令：sync2 |
| 2.执行bgsave |  |
| 3.第一个slave连接时，创建命令缓冲区 |
| 4.生成RDB文件，通过socket发送给slave|
|  | 5.接收RDB文件，并清空自己的数据，执行RDB文件恢复
|  | 6.发送命令告知RDB恢复完成
|  7.发送复制缓冲区信息|
|  | 8.接受信息，执行bgrewriteaof，恢复数据</li>
</ul>
<p><strong>1~5全量复制，6～8增量复制</strong></p>
<h6 id="_2-2-1数据同步注意事项" tabindex="-1"><a class="header-anchor" href="#_2-2-1数据同步注意事项"><span>2.2.1数据同步注意事项</span></a></h6>
<ul>
<li>
<p>master端：</p>
<ul>
<li>如果master数据量巨大，数据同步应避开流量高峰期，避免造成master阻塞</li>
<li>复制缓冲区大小设定不合理，会导致数据溢出，如进行全量复制周期太长，进行部分复制时发现数据已经存在丢失的情况，必须进行第二次全量复制，使slave陷入死循环</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#master端,设定复制缓冲区大小</span></span>
<span class="line">repl-backlog-size 1mb</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>master单机内存占用主机内存不应过大，建议使用50%-70%的内存，留下30%-50%执行bgsave命令和创建复制缓冲区</li>
</ul>
</li>
<li>
<p>slave端：</p>
<ul>
<li>为避免slave进行全量复制、增量复制时服务器响应阻塞或数据不同步，建议关闭此时对外服务</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#slave端</span></span>
<span class="line">slave-server-slate-data <span class="token function">yes</span><span class="token operator">|</span>no</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>数据同步阶段，master发送给slave信息可以理解master是slave的客户端，主动向slave发送命令</li>
<li>多个slave同时对master请求数据同步，master发送的RDB文件增多，会对带宽造成巨大冲击，因此数据同步需要根据业务需求，适量错峰</li>
<li>slave过多时，建议调整拓扑结构，由一主多从结构变为树状结构，中间的节点即是master,也是slave。注意树状结构，层数越高，导致最地层slave和顶层master间数据同步延迟较大，谨慎选择</li>
</ul>
</li>
</ul>
<h5 id="_2-3命令传播阶段工作流程" tabindex="-1"><a class="header-anchor" href="#_2-3命令传播阶段工作流程"><span>2.3命令传播阶段工作流程</span></a></h5>
<h6 id="_2-3-1概念" tabindex="-1"><a class="header-anchor" href="#_2-3-1概念"><span>2.3.1概念</span></a></h6>
<ul>
<li>
<p>当master数据被修改后，导致主从数据不一致，这时需要从master同步数据到slave,这个阶段就是命令传播阶段</p>
</li>
<li>
<p>master将接收的数据变更命令发送给slave,slave接到命令后执行命令</p>
</li>
<li>
<p>命令传播阶段可能出现断网情况</p>
<ul>
<li>网络闪断闪连     ---- 忽略</li>
<li>端世界网络中断 ---- 部分复制</li>
<li>长时间网络中断 ---- 全量复制</li>
</ul>
</li>
<li>
<p>部分复制的时候需要三个核心要素</p>
<ul>
<li>服务器的运行id (run_id)
<ul>
<li>每个redis启动都会生成一个运行run_id,多次运行id不同</li>
</ul>
</li>
<li>主服务器复制积压缓冲区
<ul>
<li>是一个先进先出的队列，用于存储服务器执行过的命令，每次传播命令，master都将传播的命令记录下来，并保存在复制积压缓冲区</li>
<li>每台服务器启动时，如果开启AOF或被连接成为master节点，即创建复制缓冲区（所以AOF一般需要开启）</li>
<li>它的作用就是保存master收到的所有修改数据的指令（同步给slave）</li>
</ul>
</li>
<li>主服务器的复制偏移量(offset)
<ul>
<li>偏移量对应字节值，用来确定不同slave同步数据的位置</li>
<li>同步信息，对比master和slave差异，当slave断线，恢复数据用</li>
</ul>
</li>
</ul>
</li>
</ul>
<h6 id="_2-3-2-数据同步-命令传播流程" tabindex="-1"><a class="header-anchor" href="#_2-3-2-数据同步-命令传播流程"><span>2.3.2 数据同步+命令传播流程</span></a></h6>
<font color=#900000  >红色为master</font>,<font color=#116100 >绿色为slave</font>，<p>1～5全量复制，6～8部分复制
| master |  slave |</p>
<ul>
<li>| :-: | :-: | :-: | -:
|| 1.发送指令：psync2  ? -1|
| 2.执行bgsave 生成RDB文件，记录当前复制偏移量<font color=#900000 >offset</font>|  |
| 3.发送 +FULLRESYNC  <font color=#900000 >run_id</font>,<font color=#900000 >offset</font> 通过socket发送RDB给slave,期间接受客户端命令，<font color=#900000 >offset</font>发生变化|
| | 4.收到 +FULLRESYNC 保存了master的 <font color=#900000 >run_id</font>,<font color=#900000 >offset</font> 清空当前数据，通过socket接收RDB数据，恢复RDB数据
|  | 5.发送命令：psync2 <font color=#116100 >run_id</font>, <font color=#116100 >offset</font>
| 6.接收命令，判断<font color=#116100 >run_id</font> ,<font color=#116100 >offset</font>是否在复制缓冲区 |
|  7.如果<font color=#116100 >run_id</font> ,<font color=#116100 >offset</font>有一个不满足，执行全量复制1|
|  7.如果<font color=#116100 >run_id</font> ,<font color=#116100 >offset</font>校验通过，<font color=#116100 >offset</font>和<font color=#900000 >offset</font>相同，忽略|
|7.如果<font color=#116100 >run_id</font> ,<font color=#116100 >offset</font>校验通过，<font color=#116100 >offset</font>和<font color=#900000 >offset</font>不相同，发送 + CONTINUE <font color=#900000 >offset</font>，通过socket发送复制缓冲区中的<font color=#116100 >offset</font>到<font color=#900000 >offset</font>的数据|
||8.收到+ CONTINUE ，保存master的<font color=#900000 >offset</font>，接收消息后执行bgrewirteaof，恢复数据</li>
</ul>
<h5 id="_2-3-3-心跳机制" tabindex="-1"><a class="header-anchor" href="#_2-3-3-心跳机制"><span>2.3.3 心跳机制</span></a></h5>
<ul>
<li>进入命令传播阶段，master与slave间需要进行信息交换，使用心跳机制进行维护，实现双方连接在线</li>
<li>当slave多数掉线或者延迟过高，master为了保障数据稳定性，将拒绝所有数据同步操作</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#slave数量小于2个，或者所有slave的延迟大于8秒，将拒绝同步操作</span></span>
<span class="line">min-slaves-to-wirte <span class="token number">2</span></span>
<span class="line">min-slaves-max-lag <span class="token number">8</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-主从复制常见问题" tabindex="-1"><a class="header-anchor" href="#_3-主从复制常见问题"><span>3.主从复制常见问题</span></a></h4>
<h5 id="_3-1频繁全量复制1" tabindex="-1"><a class="header-anchor" href="#_3-1频繁全量复制1"><span>3.1频繁全量复制1</span></a></h5>
<ul>
<li>问题现象：伴随系统运行，master数量也会变多，一旦master重启，其run_id变化，会导致所有slave全量复制操作</li>
<li>内部优化方案：
<ul>
<li>master内部创建一个master_replid变量，使用和run_id一样生成策略，并发送给所有slave</li>
<li>当master需要关闭时执行shutdown save,将RDB持久化，将run_id和offset保存在RDB中</li>
<li>master重启后加载RDB，恢复数据，并将run_id和offset加载到内存中</li>
<li>作用：master重启后恢复原来的run_id，使所有slave认为还是以前的master</li>
</ul>
</li>
</ul>
<h5 id="_3-2频繁全量复制2" tabindex="-1"><a class="header-anchor" href="#_3-2频繁全量复制2"><span>3.2频繁全量复制2</span></a></h5>
<ul>
<li>问题现象： 网络环境不佳，出现网络中断，slave不提供服务</li>
<li>复制缓冲区过小，断网后slave的offset过界，触发全量复制</li>
<li>解决方案：修改复制缓冲区大小 repl-backlog-size</li>
<li>设置建议：
<ul>
<li>测算从master到slave重连的second</li>
<li>获取master平均每秒产生写命令的数据总量，write_size_per_second</li>
<li>最优 repl-backlog-size = 2 * second * write_size_per_second</li>
</ul>
</li>
</ul>
<h5 id="_3-3频繁的网络中断1" tabindex="-1"><a class="header-anchor" href="#_3-3频繁的网络中断1"><span>3.3频繁的网络中断1</span></a></h5>
<ul>
<li>问题现象：master的CPU占用过高或slave频繁断开连接</li>
<li>问题原因：
<ul>
<li>slave每秒发送心跳命令到master</li>
<li>当slave接到了慢查询时（keys *、hgetall）,会大量占用CPU性能</li>
<li>master每秒调用复制函数replicationCron(),比对slave发现长时间没有响应</li>
</ul>
</li>
<li>最终结果：master各种资源被严重占用</li>
<li>解决方案：
<ul>
<li>通过设置合适的超时时间，确认是否释放slave</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#默认60秒，超过该值，释放slave</span></span>
<span class="line">repl-timeout</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h5 id="_3-4频繁的网络中断2" tabindex="-1"><a class="header-anchor" href="#_3-4频繁的网络中断2"><span>3.4频繁的网络中断2</span></a></h5>
<ul>
<li>问题现象：slave与master断开连接</li>
<li>问题原因：
<ul>
<li>master发送ping指令频度过低</li>
<li>master设定超时时间过短</li>
<li>ping指令网络丢包</li>
</ul>
</li>
<li>解决方案：提高ping指令发送频度</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#超时时间repl-timeout的时间至少是ping指令的频度5-10倍，否则slave容易被判定超时</span></span>
<span class="line">repl-ping-salve-period</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="_3-5数据不同步" tabindex="-1"><a class="header-anchor" href="#_3-5数据不同步"><span>3.5数据不同步</span></a></h5>
<ul>
<li>问题现象：多个slave间数据不同步</li>
<li>问题原因：网络信息不同步，数据发送有延迟</li>
<li>解决方案：
<ul>
<li>优化主从间网络环境，通常部署在一个机房，如使用云服务需要注意这个问题</li>
<li>监控从节点延迟（通过offset)判断，如果slave延迟过大，暂时屏蔽程序对该slave访问</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">slave-serve-stale-data <span class="token function">yes</span><span class="token operator">|</span>no</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
</ul>
<h3 id="哨兵模式" tabindex="-1"><a class="header-anchor" href="#哨兵模式"><span>哨兵模式</span></a></h3>
<h4 id="_1-哨兵简介" tabindex="-1"><a class="header-anchor" href="#_1-哨兵简介"><span>1.哨兵简介</span></a></h4>
<ul>
<li>
<p>哨兵（sentinel）是一个分布式系统，用于对主从结构中的每台服务器进行监控，当master出现故障时重新选择新的master并将所有slave连接到新的master</p>
</li>
<li>
<p>哨兵的作用</p>
<ul>
<li>监控：不断的检查master、slave是否正常运行，master存活检测,master、slave运行情况检测</li>
<li>通知： 当被检测的服务出现问题时，向其他（哨兵间、客户端）发送通知</li>
<li>自动故障转移：断开master与slave之间连接，选取一个slave作为master,将其他slave转移到新master,并告知客户端新的master地址</li>
</ul>
</li>
<li>
<p>注意：</p>
<ul>
<li>哨兵也是一台redis服务器，只是不提供数据服务</li>
<li>通常哨兵配置为单数</li>
</ul>
</li>
</ul>
<h4 id="_2-启用哨兵模式" tabindex="-1"><a class="header-anchor" href="#_2-启用哨兵模式"><span>2.启用哨兵模式</span></a></h4>
<h5 id="_2-1哨兵模式搭建" tabindex="-1"><a class="header-anchor" href="#_2-1哨兵模式搭建"><span>2.1哨兵模式搭建</span></a></h5>
<ul>
<li>演示搭建，我们会起3个哨兵，一个master两个slave</li>
<li>redis安装目录有一个<code v-pre>sentinel.conf</code>是哨兵配置，我们去注释复制修改它<code v-pre>cat sentinel.conf |grep -v &quot;#&quot; |grep -v &quot;^$&quot; &gt; ./conf/sentinel_26379.conf</code>,修改dir指向自己设定的目录</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">port <span class="token number">26379</span></span>
<span class="line">daemonize no</span>
<span class="line">pidfile /var/run/redis-sentinel.pid</span>
<span class="line">logfile <span class="token string">""</span></span>
<span class="line"><span class="token function">dir</span> /media/ws/disk3/redisData</span>
<span class="line"><span class="token comment"># 监控的ip 端口，2代表有两个哨兵判定那么就认定它挂了</span></span>
<span class="line">sentinel monitor mymaster <span class="token number">127.0</span>.0.1 <span class="token number">6379</span> <span class="token number">2</span></span>
<span class="line"><span class="token comment">#sentinel会向master发送心跳PING来确认master是否存活，</span></span>
<span class="line"><span class="token comment">#如果master在“一定时间范围”内不回应PONG 或者是回复了一个错误消息，</span></span>
<span class="line"><span class="token comment">#那么这个sentinel会主观地(单方面地)认为这个master已经不可用</span></span>
<span class="line">sentinel down-after-milliseconds mymaster <span class="token number">30000</span></span>
<span class="line"><span class="token comment">#在发生failover主备切换时，这个选项指定了最多可以有多少个slave同时对</span></span>
<span class="line"><span class="token comment">#新的master进行同步，这个数字越小，完成failover所需的时间就越长，</span></span>
<span class="line"><span class="token comment">#但是如果这个数字越大，就意味着越多的slave因为replication而不可用。</span></span>
<span class="line"><span class="token comment">#可以通过将这个值设为 1 来保证每次只有一个slave处于不能处理命令请求的状态。</span></span>
<span class="line">sentinel parallel-syncs mymaster <span class="token number">1</span></span>
<span class="line"><span class="token comment">#主从切换时间</span></span>
<span class="line">sentinel failover-timeout mymaster <span class="token number">180000</span></span>
<span class="line">sentinel deny-scripts-reconfig <span class="token function">yes</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>再复制两个，修改端口号<code v-pre>sed 's/26379/26380/g' sentinel_26379.conf &gt; sentinel_26380.conf </code></li>
<li>准备一个master,两个slave的配置文件</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#master</span></span>
<span class="line">port <span class="token number">6379</span></span>
<span class="line">daemonize <span class="token function">yes</span></span>
<span class="line">logfile <span class="token string">"6379.log"</span></span>
<span class="line"><span class="token function">dir</span> <span class="token string">"/media/ws/disk3/redisData"</span></span>
<span class="line">dbfilename dump_6379.rdb</span>
<span class="line">rdbcompression <span class="token function">yes</span></span>
<span class="line">rdbchecksum <span class="token function">yes</span></span>
<span class="line">save <span class="token number">10</span> <span class="token number">2</span></span>
<span class="line">appendonly <span class="token function">yes</span></span>
<span class="line">appendfsync everysec</span>
<span class="line">appendfilename appendonly_6379.aof</span>
<span class="line">auto-aof-rewrite-percentage <span class="token number">100</span> </span>
<span class="line">auto-aof-rewrite-min-size 64mb</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#slave</span></span>
<span class="line">port <span class="token number">6380</span></span>
<span class="line">daemonize <span class="token function">yes</span></span>
<span class="line">logfile <span class="token string">"6380.log"</span></span>
<span class="line"><span class="token function">dir</span> <span class="token string">"/media/ws/disk3/redisData"</span></span>
<span class="line">slaveof <span class="token number">127.0</span>.0.1 <span class="token number">6379</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>启动顺序，先master,然后slave,最后三个哨兵</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#启动主从</span></span>
<span class="line">redis-server  /conf/redis _xxxx.conf</span>
<span class="line"><span class="token comment">#启动哨兵</span></span>
<span class="line">redis-sentinel /conf/sentinel_xxx.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-哨兵工作原理" tabindex="-1"><a class="header-anchor" href="#_3-哨兵工作原理"><span>3.哨兵工作原理</span></a></h4>
<ul>
<li>哨兵在进行主从切换过程经历三个阶段
<ul>
<li>监控：同步信息</li>
<li>通知：保持联通</li>
<li>故障转移：
<ul>
<li>发现问题</li>
<li>竞选负责人</li>
<li>优选新master</li>
<li>新master上任，其它slave切换新master,原master作为slave故障恢复后重连</li>
</ul>
</li>
</ul>
</li>
</ul>
<h3 id="集群" tabindex="-1"><a class="header-anchor" href="#集群"><span>集群</span></a></h3>
<h4 id="_1-集群简介" tabindex="-1"><a class="header-anchor" href="#_1-集群简介"><span>1.集群简介</span></a></h4>
<ul>
<li>现状问题：
<ul>
<li>redis的OPS最大达到10w/s,当前业务量OPS已经达到20w/s</li>
<li>内存单机256G，业务需求内存时1T</li>
</ul>
</li>
<li>集群架构：集群就是使用网络将若干台计算机联通起来，并统一管理，使其对外呈现单机服务效果</li>
<li>集群作用：
<ul>
<li>分散单台服务器的访问压力，实现负载均衡</li>
<li>分散单台服务器的存储压力，实现可扩展</li>
<li>降低单机宕机带来的业务灾难</li>
</ul>
</li>
</ul>
<h4 id="_2-redis集群结构设计" tabindex="-1"><a class="header-anchor" href="#_2-redis集群结构设计"><span>2.Redis集群结构设计</span></a></h4>
<h5 id="_2-1数据存储设计" tabindex="-1"><a class="header-anchor" href="#_2-1数据存储设计"><span>2.1数据存储设计</span></a></h5>
<ul>
<li>redis会对集群机器进行一个16384的等分（槽）。通过算法设计，对key进行计算取值之后对16384取余，得到的值来确定在redis集群中，处于哪台机器中</li>
<li>如果增加机器，redis会对原来集群进行计算优化，把原来每台机器的槽分一部分给新机器。如果减少机器，则把这台机器槽分给其他几台机器上。</li>
</ul>
<h5 id="_2-2相互之间通信设计" tabindex="-1"><a class="header-anchor" href="#_2-2相互之间通信设计"><span>2.2相互之间通信设计</span></a></h5>
<ul>
<li>各个数据库互相通信，保存各个库中槽的编号数据</li>
<li>根据对key的算法计算，找数据在集群中哪个机器上，如果命中就返回，未命中则根据机器内保存的槽编号数据找到对应的机器</li>
</ul>
<h4 id="_3-cluster集群结构搭建" tabindex="-1"><a class="header-anchor" href="#_3-cluster集群结构搭建"><span>3.cluster集群结构搭建</span></a></h4>
<ul>
<li>我们配一个三主三从的结构，启动6个redis服务</li>
<li>新建配置文件</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">port <span class="token number">6379</span></span>
<span class="line">daemonize no</span>
<span class="line">logfile <span class="token string">"6379.log"</span></span>
<span class="line"><span class="token function">dir</span> <span class="token string">"/media/ws/disk3/redisData"</span></span>
<span class="line">dbfilename <span class="token string">"dump_6379.rdb"</span></span>
<span class="line">rdbcompression <span class="token function">yes</span></span>
<span class="line">rdbchecksum <span class="token function">yes</span></span>
<span class="line">save <span class="token number">10</span> <span class="token number">2</span></span>
<span class="line">appendonly <span class="token function">yes</span></span>
<span class="line">appendfsync everysec</span>
<span class="line">appendfilename <span class="token string">"appendonly_6379.aof"</span></span>
<span class="line">auto-aof-rewrite-percentage <span class="token number">100</span></span>
<span class="line">auto-aof-rewrite-min-size 64mb</span>
<span class="line"><span class="token builtin class-name">bind</span> <span class="token number">127.0</span>.0.1</span>
<span class="line">databases <span class="token number">16</span></span>
<span class="line"><span class="token comment">#集群部署</span></span>
<span class="line">cluster-enabled <span class="token function">yes</span></span>
<span class="line"><span class="token comment">#配置文件</span></span>
<span class="line">cluster-config-file nodes-6379.conf</span>
<span class="line"><span class="token comment">#超时时间10秒</span></span>
<span class="line">cluster-node-timeout <span class="token number">10000</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><code v-pre>sed 's/6379/6380/g' redis-cluster-6379.conf &gt; redis-cluster-6380.conf</code> 复制5份</p>
</li>
<li>
<p>启动服务 <code v-pre>redis-server redis-cluster-6379.conf</code>,启动6个服务</p>
</li>
<li>
<p>执行集群指令</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#进入当前目录下启动集群 其中的1代表一个master一个slave,如果是2则是一个master两个slave</span></span>
<span class="line"><span class="token comment"># 5.0启动集群方式,后面的连续IP，前3个为master,后3个为slave,yes确定</span></span>
<span class="line">redis-cli <span class="token parameter variable">--cluster</span> create <span class="token number">127.0</span>.0.1:6379 <span class="token number">127.0</span>.0.1:6380 <span class="token number">127.0</span>.0.1:6381 <span class="token number">127.0</span>.0.1:6382 <span class="token number">127.0</span>.0.1:6383 <span class="token number">127.0</span>.0.1:6384 --cluster-replicas <span class="token number">1</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>操作cli</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#-c为集群参数，会自动找对应的redis</span></span>
<span class="line">redis-cli <span class="token parameter variable">-c</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>主从下线和主从切换
<ul>
<li>slave掉线：slave掉线对功能不影响，重连上线后继续提供服务</li>
<li>master掉线：掉线后选举slave当master,如果master后续上限则成为slave提供服务</li>
</ul>
</li>
</ul>
</div></template>


