<template><div><h2 id="rabbitmq-高级" tabindex="-1"><a class="header-anchor" href="#rabbitmq-高级"><span>RabbitMQ 高级</span></a></h2>
<h3 id="一、rabbitmq高级特性" tabindex="-1"><a class="header-anchor" href="#一、rabbitmq高级特性"><span>一、RabbitMQ高级特性</span></a></h3>
<h4 id="_1-消息可靠投递-producer到mq" tabindex="-1"><a class="header-anchor" href="#_1-消息可靠投递-producer到mq"><span>1.消息可靠投递 <code v-pre>Producer到MQ</code></span></a></h4>
<ul>
<li>在使用RabbitMQ的时候，作为消息发送方希望杜绝消息丢失或者投递失败。RabbitMQ为我们提供两种方式控制消息的可靠性投递
<ul>
<li>confirm 确认模式</li>
<li>return 退回模式</li>
</ul>
</li>
<li>rabbitmq整个消息投递过程是 <code v-pre>producer -&gt; exchange -&gt;queue -&gt;consumer</code>
<ul>
<li>消息从<code v-pre>producer-&gt;exchange</code>则会返回一个callback</li>
<li>ConfirmCallback.confirm回调方法
<ul>
<li>CorrelationData correlationData 相关配置信息</li>
<li>boolean ack 布尔值，true说明exchange接收到信息</li>
<li>String cause 失败原因</li>
</ul>
</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#properties配置</span></span>
<span class="line"><span class="token comment">#开启confirm</span></span>
<span class="line">spring.rabbitmq.publisher-confirm-type<span class="token operator">=</span>correlated </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>消息从<code v-pre>exchange-&gt;queue</code>投递有一个ReturnsCallback.returnedMessage
<ul>
<li>ReturnedMessage returnedMessage 对象里分别是 错误对象、错误码、错误信息、交换机、路由键信息</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#properties配置</span></span>
<span class="line"><span class="token comment">#开启retrunCallback</span></span>
<span class="line">spring.rabbitmq.publisher-returns<span class="token operator">=</span>true</span>
<span class="line"><span class="token comment">#设置交换机处理失败消息模式</span></span>
<span class="line"><span class="token assign-left variable">spring.rabbitmq.template.mandatory</span><span class="token operator">=</span>true</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>我们利用这两个Callback控制消息可靠性投递</li>
</ul>
<h4 id="_2-consumer-ack-mq到consumer" tabindex="-1"><a class="header-anchor" href="#_2-consumer-ack-mq到consumer"><span>2.Consumer ACK <code v-pre>MQ到Consumer</code></span></a></h4>
<ul>
<li>ack 指的是Acknowledge,确认。表示消费者接收到消息的确认方式</li>
<li>ack有三种确认方式
<ul>
<li>自动确认：acknowledge = &quot;none&quot;</li>
<li>手动确认：acknowledge = &quot;manual&quot;</li>
<li>根据异常情况确认：acknowledge = &quot;auto&quot;</li>
</ul>
</li>
<li>其中自动确认是指，当消息一旦被consumer接收，则自动确认收到，并将message从MQ缓存中删除，但实际业务中，有可能发生消息接收成功，业务处理失败,那么消息就会丢失。如果设置了手动确认方式，则需要在业务处理成功后，调用channel.basicACK()；手动签收，如果出现异常，则调用channel.basicNack()方法，让其再次发送消息。</li>
<li>消息监听实现ChannelAwareMessageListener接口，手动业务对正常业务basicACK(),异常basicNack()</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#properties配置</span></span>
<span class="line"><span class="token comment">#开启direct类型exchange手动ack</span></span>
<span class="line">spring.rabbitmq.listener.direct.acknowledge-mode<span class="token operator">=</span>manual</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-消费限流" tabindex="-1"><a class="header-anchor" href="#_3-消费限流"><span>3.消费限流</span></a></h4>
<ul>
<li>消息限流，就是设置MQ消息到consumer的流量控制
<ul>
<li>确保ack机制为手动确认</li>
<li>配置perfetch</li>
</ul>
</li>
</ul>
<h4 id="_4-ttl" tabindex="-1"><a class="header-anchor" href="#_4-ttl"><span>4.TTL</span></a></h4>
<ul>
<li>TTL Time To Live 存活时间/过期时间</li>
<li>当消息到达中间件一定时间内，没被消费，则消息会被自动清除</li>
<li>RabbitMQ可以对消息设置过期时间，也可以对整个队列Queue设置过期时间</li>
</ul>
<h4 id="_5-死信队列" tabindex="-1"><a class="header-anchor" href="#_5-死信队列"><span>5.死信队列</span></a></h4>
<ul>
<li>死信队列DLX，Dead Letter Exchange(死信交换机),当消息成为Dead message后，可以被重新发送到另一个交换机，整个交换机就是DLX</li>
<li>设置了TTL的消息，如果过期时间没有被消费，而且我们绑定了死信队列，那么过期的消息就会被发到死信队列里（Exchange），然后发送给绑定了整个Exchange的Queue中。</li>
<li>消息在三种情况下会成为死信：
<ul>
<li>队列Queue的长度到达限制</li>
<li>消费者拒绝消费消息，basicNack/basicReject并且不把消息重新放回队列，requeue=false</li>
<li>原队列设置了TTL，到期未被消费</li>
</ul>
</li>
<li>队列绑定死信交换机
<ul>
<li>给队列设置参数<code v-pre>x-dead-letter-exchange</code>和<code v-pre>x-dead-letter-routing-key</code></li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>Dead Letter Exchange(死信交换机) 为什么叫死信队列，是因为其它MQ没有交换机Exchange的概念，为了统一名称，叫死信队列</li>
<li>简单理解就是，我们Queue的消息各种原因没办法投递给consumer,于是交给了另一个Exchange，投递给另一个queue</li>
</ul>
</div>
<h4 id="_6-延迟队列" tabindex="-1"><a class="header-anchor" href="#_6-延迟队列"><span>6.延迟队列</span></a></h4>
<ul>
<li>延迟队列，即消息进入Queue后不会立即被消费，而是要达到指定时间，才会被消费。</li>
<li>延迟队列很有用，RabbitMQ没有提供直接的延迟队列功能，但是可以使用<code v-pre>TTL+ 死信队列DLX</code>组合实现延迟对了效果
<ul>
<li>即我们给一个Queue设置过期时间TTL，当到期以后消息路由到死信交换机放入死信队列。然后对应的consumer处理业务逻辑</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>延迟队列场景
<ul>
<li>下单后，30分钟未支付，取消订单，回滚库存</li>
<li>新用户注册成功后，7天后发送短信问候</li>
</ul>
</li>
</ul>
</div>
<h4 id="_7-日志监控" tabindex="-1"><a class="header-anchor" href="#_7-日志监控"><span>7.日志监控</span></a></h4>
<ul>
<li>rabbitMQ默认日志存放路径 /var/log/rabbitmq/rabbit@xxx.log</li>
<li>web端 Overview 也可以看监控信息</li>
<li>命令查看
<ul>
<li><code v-pre>rabbitmqctl list_queues</code> 查看队列</li>
<li><code v-pre>rabbitmqctl list_exchanges</code>查看交换机</li>
<li><code v-pre>rabbitmqctl list_users</code>查看用户</li>
<li><code v-pre>rabbitmqctl list_connections</code>查看连接</li>
<li><code v-pre>rabbitmqctl list_consumers</code>查看消费者信息</li>
<li><code v-pre>rabbitmqctl environment</code> 查看环境变量</li>
<li><code v-pre>rabbitmqctl list_queues name messages_unacknowledged</code>查看未被确认队列</li>
<li><code v-pre>rabbitmqctl list_queues name memory</code> 查看单个队列内存使用情况</li>
<li><code v-pre>rabbitmqctl list_queues name messages_ready</code>查看准备就绪队列</li>
</ul>
</li>
</ul>
<h4 id="_8-消息可靠性分析与追踪" tabindex="-1"><a class="header-anchor" href="#_8-消息可靠性分析与追踪"><span>8.消息可靠性分析与追踪</span></a></h4>
<ul>
<li>在任何消息中间件使用过程中，难免会出现消息异常丢失情况，对于RabbitMQ来说，可能是因为生产者或消费者与RabbitMQ断开了连接，而它们与RabbitMQ又采用了不同的确认机制；也有可能因为交换机Exchange与队列Queue之间不同的转发策略，甚至是交换机没有与队列绑定；另外RabbitMQ的集群策略也可能导致消息丢失。这时候就需要一个好的机制跟踪消息的投递过程，以此协助开发人员定位问题。</li>
<li>RabbitMQ中可以使用Firehose和rabbitmq_tracing插件来实现消息追踪</li>
</ul>
<h5 id="firehose" tabindex="-1"><a class="header-anchor" href="#firehose"><span>Firehose</span></a></h5>
<ul>
<li>Firehose的机制是将<code v-pre>生产者投递给rabbitMQ的消息，rabbitMQ投递给消费者的消息</code>按照指定格式发送到默认的exchange，整个默认的exchange名叫<code v-pre>amq.rabbitmq.trace</code>,它是一个topic类型的exchange,发送到exchange的RoutingKey为public.exchangename和deliver.queuename.其中exchangename和queuename分别是exchange和queue名称。
<ul>
<li><code v-pre>rabbitmqctl trace_on</code> 开启Firehose</li>
<li><code v-pre>rabbitmqctl trace_off</code> 关闭Firehose</li>
<li>开始trace影响写入性能，适当打开后关闭</li>
</ul>
</li>
</ul>
<h5 id="rabbitmq-tracing-插件" tabindex="-1"><a class="header-anchor" href="#rabbitmq-tracing-插件"><span>rabbitmq_tracing 插件</span></a></h5>
<ul>
<li>rabbitmq_tracing 原理与Firehose一致，只是这个插件可以在web端使用管理更方便
<ul>
<li><code v-pre>rabbitmq-plugins enable rabbitmq_tracing</code></li>
<li>执行命令后，在web管理页面Admin就可以看到Tracing选项</li>
</ul>
</li>
<li>配置好web页面的Tracing后，发送消息可以在此看到tracing.log</li>
</ul>
<h3 id="二、rabbitmq应用问题" tabindex="-1"><a class="header-anchor" href="#二、rabbitmq应用问题"><span>二、RabbitMQ应用问题</span></a></h3>
<h4 id="_1-消息可靠性保障-消息补偿机制" tabindex="-1"><a class="header-anchor" href="#_1-消息可靠性保障-消息补偿机制"><span>1.消息可靠性保障 <code v-pre>消息补偿机制</code></span></a></h4>
<img :src="$withBase('/mq/6.png')" alt="dock">
<ul>
<li>第一步，生产者把要发的消息入库，并且发送给队列Q1，Consumer消费消息</li>
<li>第二步，Consumer消费消息以后，也会发送一条消费成功的消息给Q2，回调检查服务监听此Queue,将消息保存MDB</li>
<li>第三步，此时刚才发送消息的时候，同时发送了一条延迟队列的信息Q3也被回调检查服务监听到了，此时回调检查服务拿Q3的消息区MDB中检查有没有此消息，如果刚才第二步，Consumer消息未消费成功的话，此时MDB中就没有该消息。</li>
<li>第四步，如果有MDB数据有，流程结束，没有消息的话，会重新调Producer重新发送消息到Q1和Q3</li>
<li>还有一种极端场景就是Producer发送Q1、Q3都失败了，这时候我们有个定时检查服务，会对比Producer的DB和MDB数据是否一致（DB数据多与MDB），这时候定时任务通知Producer把多的数据继续发送给MQ</li>
</ul>
<h4 id="_2-消息幂等性" tabindex="-1"><a class="header-anchor" href="#_2-消息幂等性"><span>2.消息幂等性</span></a></h4>
<ul>
<li><code v-pre>消息补偿机制</code> 有可能导致消息的重复发送，这时候我们需要考虑消息幂等性，保证消息在重复消费的幂等问题
<ul>
<li>解决方案就是消息接收方接收消息也落DB，接收消息第一步先判断数据库是否存在该消息</li>
<li><code v-pre>乐观锁解决方案</code>也可以，在业务数据操作时判断是否已经有消息被消费</li>
</ul>
</li>
</ul>
</div></template>


