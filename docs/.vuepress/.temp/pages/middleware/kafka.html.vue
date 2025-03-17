<template><div><h2 id="kafka-消息中间件框架运用" tabindex="-1"><a class="header-anchor" href="#kafka-消息中间件框架运用"><span>Kafka-消息中间件框架运用</span></a></h2>
<ul>
<li>官方文档 <code v-pre>http://kafka.apache.org/</code></li>
</ul>
<h3 id="与springboot-2-2-2-release-整合" tabindex="-1"><a class="header-anchor" href="#与springboot-2-2-2-release-整合"><span>与springboot 2.2.2.RELEASE 整合</span></a></h3>
<h4 id="生产者-消费者模式" tabindex="-1"><a class="header-anchor" href="#生产者-消费者模式"><span>生产者-消费者模式</span></a></h4>
<ul>
<li>
<p>下载kafka <code v-pre>http://kafka.apache.org/downloads</code>,本文选择二进制版本 <code v-pre>kafka-2.4.0-src.tgz (asc, sha512)</code></p>
</li>
<li>
<p>解压修改config目录下<code v-pre>server.properties</code>中的<strong>log.dirs</strong>日志输出位置以及配置ZK地址，默认为本地<strong>zookeeper.connect</strong></p>
</li>
<li>
<p>启动ZK后，在Kafka安装bin目录下window目录下CMD，输入<code v-pre>.\bin\windows\kafka-server-start.bat .\config\server.properties</code>启动kafka</p>
</li>
<li>
<p>创建一个聚合项目，分别包含生产者和消费者模块，参照dubbo</p>
</li>
<li>
<p>生产者和消费者引入同样依赖 2.2.2.RELEASE</p>
</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-starter<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-starter-web<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.kafka<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-kafka<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>dependency</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="生产方" tabindex="-1"><a class="header-anchor" href="#生产方"><span>生产方</span></a></h4>
<ul>
<li><code v-pre>application.properties</code>中配置kafka</li>
</ul>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties"><pre v-pre><code><span class="line"><span class="token key attr-name">server.port</span><span class="token punctuation">=</span><span class="token value attr-value">8787</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#============== kafka ===================</span></span>
<span class="line"><span class="token comment"># 指定kafka server的地址，集群配多个，中间，逗号隔开</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.bootstrap-servers</span><span class="token punctuation">=</span><span class="token value attr-value">127.0.0.1:9092</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 写入失败时，重试次数。当leader节点失效，一个repli节点会替代成为leader节点，此时可能出现写入失败，</span></span>
<span class="line"><span class="token comment"># 当retris为0时，produce不会重复。retirs重发，此时repli节点完全成为leader节点，不会产生消息丢失。</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.producer.retries</span><span class="token punctuation">=</span><span class="token value attr-value">0</span></span>
<span class="line"><span class="token comment"># 每次批量发送消息的数量,produce积累到一定数据，一次发送</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.producer.batch-size</span><span class="token punctuation">=</span><span class="token value attr-value">16384</span></span>
<span class="line"><span class="token comment"># produce积累数据一次发送，缓存大小达到buffer.memory就发送数据</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.producer.buffer-memory</span><span class="token punctuation">=</span><span class="token value attr-value">33554432</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#procedure要求leader在考虑完成请求之前收到的确认数，用于控制发送记录在服务端的持久化，其值可以为如下：</span></span>
<span class="line"><span class="token comment">#acks = 0 如果设置为零，则生产者将不会等待来自服务器的任何确认，该记录将立即添加到套接字缓冲区并视为已发送。在这种情况下，无法保证服务器已收到记录，并且重试配置将不会生效（因为客户端通常不会知道任何故障），为每条记录返回的偏移量始终设置为-1。</span></span>
<span class="line"><span class="token comment">#acks = 1 这意味着leader会将记录写入其本地日志，但无需等待所有副本服务器的完全确认即可做出回应，在这种情况下，如果leader在确认记录后立即失败，但在将数据复制到所有的副本服务器之前，则记录将会丢失。</span></span>
<span class="line"><span class="token comment">#acks = all 这意味着leader将等待完整的同步副本集以确认记录，这保证了只要至少一个同步副本服务器仍然存活，记录就不会丢失，这是最强有力的保证，这相当于acks = -1的设置。</span></span>
<span class="line"><span class="token comment">#可以设置的值为：all, -1, 0, 1</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.producer.acks</span><span class="token punctuation">=</span><span class="token value attr-value">1</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 指定消息key和消息体的编解码方式</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.producer.key-serializer</span><span class="token punctuation">=</span><span class="token value attr-value">org.apache.kafka.common.serialization.StringSerializer</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.producer.value-serializer</span><span class="token punctuation">=</span><span class="token value attr-value">org.apache.kafka.common.serialization.StringSerializer</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>创建一个发送kafka的类 KafkaUtil.java</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">KafkaUtil</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**kafka模板依赖直接提供**/</span></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">KafkaTemplate</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span><span class="token class-name">Object</span><span class="token punctuation">></span></span> kafkaTemplate<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">send</span><span class="token punctuation">(</span><span class="token class-name">String</span> topic<span class="token punctuation">,</span><span class="token class-name">String</span> message<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">ListenableFuture</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">SendResult</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">></span><span class="token punctuation">></span></span> future <span class="token operator">=</span> kafkaTemplate<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>topic<span class="token punctuation">,</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">RecordMetadata</span> recordMetadata <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            recordMetadata <span class="token operator">=</span> future<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getRecordMetadata</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span><span class="token operator">|</span> <span class="token class-name">ExecutionException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"发送失败"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"发送成功"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"partition:"</span><span class="token operator">+</span>recordMetadata<span class="token punctuation">.</span><span class="token function">partition</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"offset:"</span><span class="token operator">+</span>recordMetadata<span class="token punctuation">.</span><span class="token function">offset</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"topic:"</span><span class="token operator">+</span>recordMetadata<span class="token punctuation">.</span><span class="token function">topic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>创建一个controller用于测试</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@RestController</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">KafkaController</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Autowired</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">KafkaUtil</span> kafkaUtil<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">"/message/send"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">send</span><span class="token punctuation">(</span><span class="token class-name">String</span> message<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        kafkaUtil<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">"testTopic"</span><span class="token punctuation">,</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token class-name">Boolean</span><span class="token punctuation">.</span><span class="token constant">TRUE</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="消费方" tabindex="-1"><a class="header-anchor" href="#消费方"><span>消费方</span></a></h4>
<ul>
<li><code v-pre>application.properties</code>中配置kafka</li>
</ul>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties"><pre v-pre><code><span class="line"><span class="token key attr-name">server.port</span><span class="token punctuation">=</span><span class="token value attr-value">7878</span></span>
<span class="line"><span class="token comment">#=============== consumer  =======================</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.bootstrap-servers</span><span class="token punctuation">=</span><span class="token value attr-value">127.0.0.1:9092</span></span>
<span class="line"><span class="token comment"># 指定默认消费者group id --> 由于在kafka中，同一组中的consumer不会读取到同一个消息，依靠groud.id设置组名</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.consumer.group-id</span><span class="token punctuation">=</span><span class="token value attr-value">testGroup</span></span>
<span class="line"><span class="token comment"># smallest和largest才有效，如果smallest重新0开始读取，如果是largest从logfile的offset读取。一般情况下我们都是设置smallest</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.consumer.auto-offset-reset</span><span class="token punctuation">=</span><span class="token value attr-value">earliest</span></span>
<span class="line"><span class="token comment"># enable.auto.commit:true --> 设置自动提交offset</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.consumer.enable-auto-commit</span><span class="token punctuation">=</span><span class="token value attr-value">true</span></span>
<span class="line"><span class="token comment">#如果'enable.auto.commit'为true，则消费者偏移自动提交给Kafka的频率（以毫秒为单位），默认值为5000。</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.consumer.auto-commit-interval</span><span class="token punctuation">=</span><span class="token value attr-value">100</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 指定消息key和消息体的编解码方式</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.consumer.key-deserializer</span><span class="token punctuation">=</span><span class="token value attr-value">org.apache.kafka.common.serialization.StringDeserializer</span></span>
<span class="line"><span class="token key attr-name">spring.kafka.consumer.value-deserializer</span><span class="token punctuation">=</span><span class="token value attr-value">org.apache.kafka.common.serialization.StringDeserializer</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>listener监听</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ConsumerListener</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@KafkaListener</span><span class="token punctuation">(</span>topics <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"testTopic"</span><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">onMessage</span><span class="token punctuation">(</span><span class="token class-name">String</span> message<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>到这里简单demo完成</strong></p>
<h4 id="测试" tabindex="-1"><a class="header-anchor" href="#测试"><span>测试</span></a></h4>
<ul>
<li>
<p>启动一个生产方和两个消费方</p>
</li>
<li>
<p>浏览器中输入 <code v-pre>http://localhost:8787/message/send/?message=hello</code></p>
</li>
<li>
<p>查看消费方只有一台控制台打印出hello</p>
</li>
</ul>
<h4 id="组订阅模式" tabindex="-1"><a class="header-anchor" href="#组订阅模式"><span>组订阅模式</span></a></h4>
<ul>
<li>在上述基础上，Consumer增加config配置类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> kafkatemplateConfig <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">"${spring.kafka.bootstrap-servers}"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> bootstrapServers<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Value</span><span class="token punctuation">(</span><span class="token string">"${spring.kafka.consumer.group-id}"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> groupId<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Bean</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">KafkaListenerContainerFactory</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">ConcurrentMessageListenerContainer</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span><span class="token punctuation">></span></span> <span class="token function">kafkaListenerContainerFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">ConcurrentKafkaListenerContainerFactory</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span> factory <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentKafkaListenerContainerFactory</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        factory<span class="token punctuation">.</span><span class="token function">setConsumerFactory</span><span class="token punctuation">(</span><span class="token function">consumerFactory1</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        factory<span class="token punctuation">.</span><span class="token function">setConcurrency</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        factory<span class="token punctuation">.</span><span class="token function">getContainerProperties</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">setPollTimeout</span><span class="token punctuation">(</span><span class="token number">4000</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> factory<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">></span></span> <span class="token function">getCommonPropertis</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">></span></span> properties <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashMap</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        properties<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">ConsumerConfig</span><span class="token punctuation">.</span><span class="token constant">BOOTSTRAP_SERVERS_CONFIG</span><span class="token punctuation">,</span> bootstrapServers<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        properties<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">ConsumerConfig</span><span class="token punctuation">.</span><span class="token constant">ENABLE_AUTO_COMMIT_CONFIG</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        properties<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">ConsumerConfig</span><span class="token punctuation">.</span><span class="token constant">AUTO_COMMIT_INTERVAL_MS_CONFIG</span><span class="token punctuation">,</span> <span class="token string">"100"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        properties<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">ConsumerConfig</span><span class="token punctuation">.</span><span class="token constant">SESSION_TIMEOUT_MS_CONFIG</span><span class="token punctuation">,</span> <span class="token string">"15000"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        properties<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">ConsumerConfig</span><span class="token punctuation">.</span><span class="token constant">KEY_DESERIALIZER_CLASS_CONFIG</span><span class="token punctuation">,</span> <span class="token class-name">StringDeserializer</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        properties<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">ConsumerConfig</span><span class="token punctuation">.</span><span class="token constant">VALUE_DESERIALIZER_CLASS_CONFIG</span><span class="token punctuation">,</span> <span class="token class-name">StringDeserializer</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        properties<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">ConsumerConfig</span><span class="token punctuation">.</span><span class="token constant">GROUP_ID_CONFIG</span><span class="token punctuation">,</span> groupId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        properties<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">ConsumerConfig</span><span class="token punctuation">.</span><span class="token constant">AUTO_OFFSET_RESET_CONFIG</span><span class="token punctuation">,</span> <span class="token string">"latest"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> properties<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">ConsumerFactory</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span> <span class="token function">consumerFactory1</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Map</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">></span></span> properties <span class="token operator">=</span> <span class="token function">getCommonPropertis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        properties<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token class-name">ConsumerConfig</span><span class="token punctuation">.</span><span class="token constant">GROUP_ID_CONFIG</span><span class="token punctuation">,</span> groupId<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">DefaultKafkaConsumerFactory</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>properties<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>增加两个监听 <code v-pre>KafkaReceiverOne.java</code>和 <code v-pre>KafkaReceiverTwo.java</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">KafkaReceiverOne</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@KafkaListener</span><span class="token punctuation">(</span>id <span class="token operator">=</span> <span class="token string">"1"</span><span class="token punctuation">,</span>topics <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"groupTest"</span><span class="token punctuation">}</span><span class="token punctuation">,</span> containerFactory<span class="token operator">=</span><span class="token string">"kafkaListenerContainerFactory"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">listen</span><span class="token punctuation">(</span><span class="token class-name">ConsumerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">,</span> <span class="token operator">?</span><span class="token punctuation">></span></span> record<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Optional</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> kafkaMessage <span class="token operator">=</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">ofNullable</span><span class="token punctuation">(</span>record<span class="token punctuation">.</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>kafkaMessage<span class="token punctuation">.</span><span class="token function">isPresent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">Object</span> message <span class="token operator">=</span> kafkaMessage<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"ONE:"</span><span class="token operator">+</span>message<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">KafkaReceiverTwo</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@KafkaListener</span><span class="token punctuation">(</span>id <span class="token operator">=</span> <span class="token string">"2"</span><span class="token punctuation">,</span>topics <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token string">"groupTest"</span><span class="token punctuation">}</span><span class="token punctuation">,</span> containerFactory<span class="token operator">=</span><span class="token string">"kafkaListenerContainerFactory"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">listen</span><span class="token punctuation">(</span><span class="token class-name">ConsumerRecord</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">,</span> <span class="token operator">?</span><span class="token punctuation">></span></span> record<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Optional</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> kafkaMessage <span class="token operator">=</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">ofNullable</span><span class="token punctuation">(</span>record<span class="token punctuation">.</span><span class="token function">value</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>kafkaMessage<span class="token punctuation">.</span><span class="token function">isPresent</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">Object</span> message <span class="token operator">=</span> kafkaMessage<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Two:"</span><span class="token operator">+</span>message<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>生产者新增一个controller 测试</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span><span class="token string">"/message/group"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">Boolean</span> <span class="token function">group</span><span class="token punctuation">(</span><span class="token class-name">String</span> message<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        kafkaUtil<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span><span class="token string">"groupTest"</span><span class="token punctuation">,</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">return</span> <span class="token class-name">Boolean</span><span class="token punctuation">.</span><span class="token constant">TRUE</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="测试-1" tabindex="-1"><a class="header-anchor" href="#测试-1"><span>测试</span></a></h4>
<ul>
<li>
<p>浏览器输入 <code v-pre>http://localhost:8787/message/group/?message=helloworld1</code></p>
</li>
<li>
<p>消费方控制台打印,两个listener同时消费消息</p>
</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">ONE:helloworld1</span>
<span class="line">Two:helloworld1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>同时起两台consumer,只有一台打印消费信息</li>
</ul>
<h5 id="github-地址" tabindex="-1"><a class="header-anchor" href="#github-地址"><span>github 地址</span></a></h5>
<ul>
<li><code v-pre>https://github.com/lidagen/kafka_parent.git </code></li>
</ul>
</div></template>


