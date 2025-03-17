<template><div><h2 id="kafka-基础" tabindex="-1"><a class="header-anchor" href="#kafka-基础"><span>Kafka 基础</span></a></h2>
<ul>
<li>Kafka是一个<strong>分布式</strong>的基于<strong>发布\订阅</strong>的<strong>消息队列</strong></li>
</ul>
<h3 id="消息队列" tabindex="-1"><a class="header-anchor" href="#消息队列"><span>消息队列</span></a></h3>
<ul>
<li>缓冲和削峰：上游数据时有突发流量，下游可能扛不住</li>
<li>解耦和扩展性：项目开始的时候，并不能确定具体需求。消息队列可以作为一个接口层</li>
<li>冗余：可以采用一对多的方式，一个生产者发布消息，可以被多个订阅topic的服务消费到</li>
<li>健壮性：消息队列可以堆积请求，所以消费端业务即使短时间死掉，也不会影响主要业务的正常进行。</li>
<li>异步通信：有些数据不需要即时处理。</li>
</ul>
<h3 id="消费模式" tabindex="-1"><a class="header-anchor" href="#消费模式"><span>消费模式</span></a></h3>
<h4 id="_1-1消息队列两种模式" tabindex="-1"><a class="header-anchor" href="#_1-1消息队列两种模式"><span>1.1消息队列两种模式</span></a></h4>
<ul>
<li>点对点模式：消费者拉取数据，消息收到后清除</li>
<li>发布/订阅模式：消费者消费数据后不会清除消息（拉模式）</li>
</ul>
<h3 id="kafka组件" tabindex="-1"><a class="header-anchor" href="#kafka组件"><span>kafka组件</span></a></h3>
<ul>
<li>Topic ：消息根据Topic进行归类</li>
<li>Producer：发送消息者</li>
<li>Consumer：消息接受者</li>
<li>broker：每个kafka实例(server)</li>
<li>Segment：partition物理上由多个segment组成。</li>
<li>offset : 每个partition都由一系列有序的、不可变的消息组成，这些消息被连续的追加到partition中。partition中的每个消息都有一个连续递增的序列号叫做offset，偏移量offset在每个分区中是唯一的。</li>
<li>replica： partition 的副本，保障 partition 的高可用。</li>
<li>follower： replica 中的一个角色，从 leader 中复制（fentch）数据。</li>
<li>leader： replica 中的一个角色， producer 和 consumer 只跟 leader 交互。</li>
<li>controller：kafka 集群中的其中一个服务器，用来进行 leader election 以及 各种 failover。</li>
<li>Zookeeper：依赖集群保存meta信息。</li>
<li>Partition：每个 topic 包含一个或多个 partition。kafka 分配的单位是 partition。</li>
<li>Consumer group：high-level consumer API 中，每个 consumer 都属于一个 consumer group，每条消息和partition只能被 group 中的一个 Consumer 消费，但可以被多个 consumer group 消费。</li>
</ul>
<h3 id="集群配置" tabindex="-1"><a class="header-anchor" href="#集群配置"><span>集群配置</span></a></h3>
<h3 id="kafka命令" tabindex="-1"><a class="header-anchor" href="#kafka命令"><span>kafka命令</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># bin/kafka-topics.sh</span></span>
<span class="line"><span class="token comment"># 查看所有topic</span></span>
<span class="line">bin/kafka-topics.sh <span class="token parameter variable">--list</span> <span class="token parameter variable">--zookeeper</span> localhost:2181</span>
<span class="line"><span class="token comment"># 创建一个topic ,--topic定义topic名，--replication-factor定义副本数 ，--partitions 定义分区数</span></span>
<span class="line">bin/kafka-topics.sh <span class="token parameter variable">--create</span> <span class="token parameter variable">--zookeeper</span> localhost:2181 --replication-factor <span class="token number">1</span> <span class="token parameter variable">--partitions</span> <span class="token number">1</span> <span class="token parameter variable">--topic</span> <span class="token builtin class-name">test</span></span>
<span class="line"><span class="token comment"># 删除</span></span>
<span class="line"> bin/kafka-topics.sh  <span class="token parameter variable">--delete</span> <span class="token parameter variable">--zookeeper</span> localhost:2181 <span class="token parameter variable">--topic</span> <span class="token builtin class-name">test</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="数据日志分离" tabindex="-1"><a class="header-anchor" href="#数据日志分离"><span>数据日志分离</span></a></h3>
</div></template>


