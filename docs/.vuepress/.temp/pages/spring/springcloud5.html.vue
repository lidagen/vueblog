<template><div><h2 id="hystrix-断路器" tabindex="-1"><a class="header-anchor" href="#hystrix-断路器"><span>Hystrix -断路器</span></a></h2>
<h3 id="服务雪崩" tabindex="-1"><a class="header-anchor" href="#服务雪崩"><span>服务雪崩</span></a></h3>
<ul>
<li>
<p>多个微服务调用的时候，假设微服务A调用微服务B和微服务C，微服务B和微服务C又调用其它微服务。这就是所谓的<strong>扇出</strong>，如果扇出的链路上某个微服务调用时间过长或者不可用，对微服务A的调用就会占用越来越多的系统资源，进而引起系统崩溃，这就是所谓的<strong>雪崩效应</strong>。</p>
</li>
<li>
<p>对于高流量的应用来说，单一的后端依赖可能会导致所有服务器上的所有资源都在几秒中内饱和。比失败更糟糕的是，这些应用程序还可能导致服务之间的延迟增加，备份队列，线程和其它资源紧张。导致整个系统发生级联故障。这些都表示需要对故障和延迟进行隔离和管理，以便单个依赖关系的失败，不能取消整个应用程序或系统。</p>
</li>
<li>
<p>通常当你发现一个模块下的某个实例失败后，这时候这个模块仍会接收流量，然后这个有问题的模块还调用了其它模块，这样就发生了级联故障，或者叫雪崩。</p>
</li>
</ul>
<h3 id="hystrix-是什么" tabindex="-1"><a class="header-anchor" href="#hystrix-是什么"><span>Hystrix 是什么</span></a></h3>
<ul>
<li>
<p>Hystrix 是一个用在分布式系统的<strong>延迟</strong>和<strong>容错</strong>的开源库，许多依赖不可避免的会调用失败，比如超时或者异常等，Hystrix能够保证在一个依赖出问题的时候，<strong>不会导致整体服务失败，避免级联故障，提高分布式系统弹性</strong>。</p>
</li>
<li>
<p>“断路器”本身是一种开关装置，当某个服务发生故障时，通过断路器的故障监控，<strong>向调用方返回一个符合预期的，可处理的备选响应（Fallback）,而不是长时间的等待或者抛出调用方无法处理的异常</strong>。这样就保证了调用方不会长时间等待，不必要的占用，从而避免故障在分布式系统中蔓延，雪崩。</p>
</li>
</ul>
<h3 id="hystrix-能干什么" tabindex="-1"><a class="header-anchor" href="#hystrix-能干什么"><span>Hystrix 能干什么</span></a></h3>
<h4 id="服务降级-fallback" tabindex="-1"><a class="header-anchor" href="#服务降级-fallback"><span>服务降级(fallback)</span></a></h4>
<ul>
<li>
<p>服务器没反应，返回一个友好的备用反应fallback</p>
</li>
<li>
<p>哪些情况会服务降级</p>
<ul>
<li>程序运行异常</li>
<li>超时</li>
<li>服务熔断触发降级</li>
<li>线程池/信号量打满也会导致服务降级</li>
</ul>
</li>
</ul>
<h4 id="服务熔断-break" tabindex="-1"><a class="header-anchor" href="#服务熔断-break"><span>服务熔断(break)</span></a></h4>
<ul>
<li>熔断机制是应对雪崩效应的一种微服务链路保护机制，当扇出链路的某个微服务出错不可用或者响应时间过长，会进行服务降级，<strong>进而熔断该节点微服务调用</strong>，快速返回错误的响应信息。<strong>当检测到该节点微服务响应正常时，恢复链路调用。</strong></li>
<li>类似保险丝，达到最大访问量了，直接拒绝访问，然后调用服务降级返回友好提示。</li>
<li>熔断过程：服务降级-&gt;进而熔断-&gt;恢复调用链路</li>
</ul>
<h4 id="服务限流-flowlimit" tabindex="-1"><a class="header-anchor" href="#服务限流-flowlimit"><span>服务限流(flowlimit)</span></a></h4>
<ul>
<li>秒杀高并发等操作，严禁一窝蜂的过来拥挤，大家排队，一秒N个，有序进行。</li>
</ul>
<h3 id="hystrix-案例" tabindex="-1"><a class="header-anchor" href="#hystrix-案例"><span>Hystrix 案例</span></a></h3>
<ul>
<li>
<p>假设一个8001端口的项目，用80端口的feign调用，方法耗时1s(OpenFeign 默认的调用超时为1秒钟),这时用jmeter压测工具增加一个线程组，200个线程访问100次，这时候feign就会频繁报RetryableException，调用时间超出了等待时间或系统程序出错，这时候就需要hystrix进行限流。</p>
<ul>
<li>超时：超时不再等待</li>
<li>出错：出错要有兜底</li>
</ul>
</li>
<li>
<p>如何解决：</p>
<ul>
<li>对方服务（8001）超时了，  调用者（80）不能一直卡死等待，需要服务降级。</li>
<li>对方服务（8001）宕机了，  调用者（80）不能一直卡死等待，需要服务降级。</li>
<li>对方服务（8001）正常，自身服务（80）出故障或者自我要求(自己设定的等待时间小于服务提供者)，自己降级处理。</li>
</ul>
</li>
</ul>
<h4 id="服务降级" tabindex="-1"><a class="header-anchor" href="#服务降级"><span>服务降级</span></a></h4>
<ul>
<li>
<p>降级配置</p>
<ul>
<li>@HystrixCommand</li>
</ul>
</li>
<li>
<p>8001从自身找问题</p>
<ul>
<li>设置自身服务超时时间的峰值，峰值内正常运行</li>
<li>超过了峰值时间有兜底处理，作服务降级fallback</li>
</ul>
</li>
<li>
<p>8001 fallback</p>
<ul>
<li>业务类增加配置 @HystrixCommand</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Service</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">PaymentHystrixServiceImpl</span> <span class="token keyword">implements</span> <span class="token class-name">PaymentHystrixService</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">payment_OK</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> id<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token string">"线程池："</span><span class="token operator">+</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">"payment_OK,id:"</span> <span class="token operator">+</span> id<span class="token operator">+</span><span class="token string">"===>"</span><span class="token operator">+</span><span class="token string">"OKOK"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@HystrixCommand</span><span class="token punctuation">(</span>fallbackMethod <span class="token operator">=</span> <span class="token string">"payInfo_TimeoutHandle"</span><span class="token punctuation">,</span>commandProperties <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token annotation punctuation">@HystrixProperty</span><span class="token punctuation">(</span>name <span class="token operator">=</span> <span class="token string">"execution.isolation.thread.timeoutInMilliseconds"</span><span class="token punctuation">,</span>value <span class="token operator">=</span> <span class="token string">"3000"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">payment_FAIL</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> id<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> time <span class="token operator">=</span> id <span class="token operator">*</span> <span class="token number">1000</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//int i = 10 / 0;</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span>time<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token string">"线程池："</span><span class="token operator">+</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">"payment_Timeout,id:"</span> <span class="token operator">+</span> id<span class="token operator">+</span><span class="token string">"===>"</span><span class="token operator">+</span><span class="token string">"OUT +333+ OUT"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> <span class="token function">payInfo_TimeoutHandle</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> id<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token string">"线程池："</span><span class="token operator">+</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">"8001系統繁忙或运行错误，請稍候再試,id:"</span> <span class="token operator">+</span> id<span class="token operator">+</span><span class="token string">"===>"</span><span class="token operator">+</span><span class="token string">"超时啦！！！"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>主程序入口增加注解 @EnableCircuitBreaker</li>
</ul>
<ul>
<li>
<p>80 fallback</p>
<ul>
<li>服务端也可配置降级</li>
</ul>
</li>
<li>
<p>目前问题</p>
<ul>
<li>每个方法配置一个服务降级，导致代码膨胀也不解耦</li>
</ul>
</li>
<li>
<p>解决问题</p>
<ul>
<li>与feign配合全局性的服务降级</li>
<li>在80客户端配置演示</li>
</ul>
</li>
<li>
<p>yml</p>
</li>
</ul>
<div class="language-yaml line-numbers-mode" data-highlighter="prismjs" data-ext="yml"><pre v-pre><code><span class="line"><span class="token key atrule">server</span><span class="token punctuation">:</span></span>
<span class="line"> <span class="token key atrule">port</span><span class="token punctuation">:</span> <span class="token number">8000</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">eureka</span><span class="token punctuation">:</span></span>
<span class="line"> <span class="token key atrule">client</span><span class="token punctuation">:</span></span>
<span class="line">   <span class="token key atrule">register-with-eureka</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">   <span class="token key atrule">service-url</span><span class="token punctuation">:</span></span>
<span class="line">     <span class="token comment">#设置与eureka交互的地址查询服务和注册服务需要依赖这个地址</span></span>
<span class="line">     <span class="token key atrule">defaultZone</span><span class="token punctuation">:</span> http<span class="token punctuation">:</span>//eureka7001<span class="token punctuation">:</span>7001/eureka/<span class="token punctuation">,</span>http<span class="token punctuation">:</span>//eureka7002<span class="token punctuation">:</span>7002/eureka/</span>
<span class="line"><span class="token key atrule">ribbon</span><span class="token punctuation">:</span></span>
<span class="line"> <span class="token comment">#建立连接所用时间，两端连接需要时间</span></span>
<span class="line"> <span class="token key atrule">ReadTimeout</span><span class="token punctuation">:</span> <span class="token number">5000</span></span>
<span class="line"> <span class="token comment"># 建立连接从服务器获取可用资源的时间</span></span>
<span class="line"> <span class="token key atrule">ConnectTimeout</span><span class="token punctuation">:</span> <span class="token number">5000</span></span>
<span class="line"><span class="token key atrule">spring</span><span class="token punctuation">:</span></span>
<span class="line"> <span class="token key atrule">application</span><span class="token punctuation">:</span></span>
<span class="line">   <span class="token key atrule">name</span><span class="token punctuation">:</span> cloud<span class="token punctuation">-</span>consumer<span class="token punctuation">-</span>feign<span class="token punctuation">-</span>hystrix<span class="token punctuation">-</span>order</span>
<span class="line"><span class="token key atrule">feign</span><span class="token punctuation">:</span></span>
<span class="line"> <span class="token key atrule">hystrix</span><span class="token punctuation">:</span></span>
<span class="line">   <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span> <span class="token comment">#feign中开启hystrix</span></span>
<span class="line"></span>
<span class="line"><span class="token key atrule">hystrix</span><span class="token punctuation">:</span></span>
<span class="line"> <span class="token key atrule">command</span><span class="token punctuation">:</span></span>
<span class="line">   <span class="token key atrule">default</span><span class="token punctuation">:</span></span>
<span class="line">     <span class="token key atrule">execution</span><span class="token punctuation">:</span></span>
<span class="line">       <span class="token key atrule">timeout</span><span class="token punctuation">:</span></span>
<span class="line">         <span class="token key atrule">enabled</span><span class="token punctuation">:</span> <span class="token boolean important">true</span></span>
<span class="line">       <span class="token key atrule">isolation</span><span class="token punctuation">:</span></span>
<span class="line">         <span class="token key atrule">thread</span><span class="token punctuation">:</span></span>
<span class="line">           <span class="token key atrule">timeoutInMilliseconds</span><span class="token punctuation">:</span> <span class="token number">3000</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>入口类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span></span><span class="token class-name">SpringApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token punctuation">.</span>autoconfigure<span class="token punctuation">.</span></span><span class="token class-name">SpringBootApplication</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>netflix<span class="token punctuation">.</span>eureka<span class="token punctuation">.</span></span><span class="token class-name">EnableEurekaClient</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>netflix<span class="token punctuation">.</span>hystrix<span class="token punctuation">.</span></span><span class="token class-name">EnableHystrix</span></span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">import</span> <span class="token import"><span class="token namespace">org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token punctuation">.</span>openfeign<span class="token punctuation">.</span></span><span class="token class-name">EnableFeignClients</span></span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * USER: wang_s</span>
<span class="line"> * DATE：2020/3/12</span>
<span class="line"> * DESC：</span>
<span class="line"> **/</span></span>
<span class="line"><span class="token annotation punctuation">@SpringBootApplication</span></span>
<span class="line"><span class="token annotation punctuation">@EnableFeignClients</span></span>
<span class="line"><span class="token annotation punctuation">@EnableEurekaClient</span></span>
<span class="line"><span class="token annotation punctuation">@EnableHystrix</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">OrderFeignHystrix80</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">SpringApplication</span><span class="token punctuation">.</span><span class="token function">run</span><span class="token punctuation">(</span><span class="token class-name">OrderFeignHystrix80</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span>args<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>service</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token annotation punctuation">@FeignClient</span><span class="token punctuation">(</span>value <span class="token operator">=</span>  <span class="token string">"CLOUD-PAYMENT-HYSTRIX-SERVICE"</span><span class="token punctuation">,</span>fallback <span class="token operator">=</span> <span class="token class-name">FeignHystrixFallbackService</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> <span class="token comment">//增加fallback</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">OrderFeignHystrixService</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">     <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">"/payment/hystrix/ok/{id}"</span><span class="token punctuation">)</span></span>
<span class="line">     <span class="token class-name">CommonResult</span> <span class="token function">getOK</span><span class="token punctuation">(</span><span class="token annotation punctuation">@PathVariable</span><span class="token punctuation">(</span><span class="token string">"id"</span><span class="token punctuation">)</span> <span class="token class-name">Integer</span> id<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@GetMapping</span><span class="token punctuation">(</span>value <span class="token operator">=</span> <span class="token string">"/payment/hystrix/timeout/{id}"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token class-name">CommonResult</span> <span class="token function">timeout</span><span class="token punctuation">(</span><span class="token annotation punctuation">@PathVariable</span><span class="token punctuation">(</span><span class="token string">"id"</span><span class="token punctuation">)</span> <span class="token class-name">Integer</span> id<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    </span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//FeignHystrixFallbackService 类</span></span>
<span class="line"><span class="token annotation punctuation">@Component</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">FeignHystrixFallbackService</span> <span class="token keyword">implements</span> <span class="token class-name">OrderFeignHystrixService</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">CommonResult</span> <span class="token function">getOK</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> id<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">//接口有问题走这个</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">CommonResult</span><span class="token punctuation">(</span><span class="token string">"getOK,error"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">CommonResult</span> <span class="token function">timeout</span><span class="token punctuation">(</span><span class="token class-name">Integer</span> id<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">//接口有问题走这个</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">CommonResult</span><span class="token punctuation">(</span><span class="token string">"timeout,error"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="服务熔断" tabindex="-1"><a class="header-anchor" href="#服务熔断"><span>服务熔断</span></a></h4>
<ul>
<li>
<p>SpringCloud框架中，熔断机制是Hystrix实现，Hystrix会监控微服务调用情况，当失败到达一定阈值，缺省是5秒20次调用失败，就会启用熔断机制，熔断机制的注解是@HystrixCommand</p>
</li>
<li>
<p>断路器涉及三个参数：快照时间窗、请求总数阈值、错误百分比阈值</p>
<ul>
<li>
<p>快照时间窗：断路器确定是否打开需要统计一些请求和错误数据，而统计的时间范围就是快照时间窗，默认最近10秒</p>
</li>
<li>
<p>请求总数阈值：在快照时间窗内，必须满足请求总数阈值才会熔断。默认20，意味着10秒内，如果该hystrix命令的调用次数不超过20次，即使全部失败，断路器也不会打开。</p>
</li>
<li>
<p>错误百分比阈值： 当在快照时间窗内，满足了请求总数阈值（30次），如果有15次调用失败，那失败的百分比就是50%，如果错误百分比阈值设置50%的情况下，断路器会打开。</p>
</li>
</ul>
</li>
<li>
<p>熔断三种状态</p>
<ul>
<li>
<p>熔断打开：请求不再调用当前服务，内部设置时钟一般为MTTR（平均故障处理时间），当熔断打开时常超过所设时钟则到达熔断半开状态。</p>
</li>
<li>
<p>熔断半开 ：部分请求会根据规则调用当前服务，如果请求成功且符合 规则则认为当前服务恢复政策，关闭熔断。</p>
</li>
<li>
<p>熔断关闭 ： 熔断关闭不会对服务镜像熔断。</p>
</li>
</ul>
</li>
<li>
<p>熔断以后的流程：</p>
<ul>
<li>
<p>熔断以后，服务调用将不再调用主逻辑，而是直接调用降级的fallback。</p>
</li>
<li>
<p>主逻辑恢复：当熔断器打开进行熔断以后，hystrix启动一个休眠时间窗，超过这个时间窗，熔断半开，释放一次请求到主逻辑，如果调用正常，熔断关闭。主逻辑恢复。如果这次调用失败，断路器打开，休眠时间窗重新计时。</p>
</li>
</ul>
</li>
</ul>
<h4 id="服务限流" tabindex="-1"><a class="header-anchor" href="#服务限流"><span>服务限流</span></a></h4>
<ul>
<li>Alibaba Sentinel 说明</li>
</ul>
<h3 id="服务监控-hystrixdashboard" tabindex="-1"><a class="header-anchor" href="#服务监控-hystrixdashboard"><span>服务监控 hystrixDashboard</span></a></h3>
<ul>
<li>监控界面的图形化展示</li>
</ul>
<h4 id="增加9001-module" tabindex="-1"><a class="header-anchor" href="#增加9001-module"><span>增加9001 Module</span></a></h4>
<ul>
<li>pom.xml</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token operator">&lt;</span><span class="token operator">?</span>xml version<span class="token operator">=</span><span class="token string">"1.0"</span> encoding<span class="token operator">=</span><span class="token string">"UTF-8"</span><span class="token operator">?</span><span class="token operator">></span></span>
<span class="line"><span class="token operator">&lt;</span>project xmlns<span class="token operator">=</span><span class="token string">"http://maven.apache.org/POM/4.0.0"</span></span>
<span class="line">         xmlns<span class="token operator">:</span>xsi<span class="token operator">=</span><span class="token string">"http://www.w3.org/2001/XMLSchema-instance"</span></span>
<span class="line">         xsi<span class="token operator">:</span>schemaLocation<span class="token operator">=</span><span class="token string">"http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd"</span><span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>parent<span class="token punctuation">></span></span></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>cloud2020<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>version<span class="token punctuation">></span></span><span class="token number">1.0</span><span class="token operator">-</span><span class="token constant">SNAPSHOT</span><span class="token operator">&lt;</span><span class="token operator">/</span>version<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span><span class="token operator">/</span>parent<span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>modelVersion<span class="token punctuation">></span></span><span class="token number">4.0</span><span class="token number">.0</span><span class="token operator">&lt;</span><span class="token operator">/</span>modelVersion<span class="token operator">></span></span>
<span class="line"></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>cloud<span class="token operator">-</span>comsumer<span class="token operator">-</span>hystrix<span class="token operator">-</span>dashboard9001<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">    <span class="token generics"><span class="token punctuation">&lt;</span>dependencies<span class="token punctuation">></span></span></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>dependency<span class="token punctuation">></span></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>com<span class="token punctuation">.</span>ws<span class="token punctuation">.</span>springcloud<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>api<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>version<span class="token punctuation">></span></span>$<span class="token punctuation">{</span>project<span class="token punctuation">.</span>version<span class="token punctuation">}</span><span class="token operator">&lt;</span><span class="token operator">/</span>version<span class="token operator">></span></span>
<span class="line">        <span class="token operator">&lt;</span><span class="token operator">/</span>dependency<span class="token operator">></span></span>
<span class="line">        <span class="token operator">&lt;</span><span class="token operator">!</span><span class="token operator">--</span>仪表盘监控<span class="token operator">--</span><span class="token operator">></span></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>dependency<span class="token punctuation">></span></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>cloud<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>spring<span class="token operator">-</span>cloud<span class="token operator">-</span>starter<span class="token operator">-</span>netflix<span class="token operator">-</span>hystrix<span class="token operator">-</span>dashboard<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">        <span class="token operator">&lt;</span><span class="token operator">/</span>dependency<span class="token operator">></span></span>
<span class="line"></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>dependency<span class="token punctuation">></span></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>spring<span class="token operator">-</span>boot<span class="token operator">-</span>starter<span class="token operator">-</span>actuator<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">        <span class="token operator">&lt;</span><span class="token operator">/</span>dependency<span class="token operator">></span></span>
<span class="line"></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>dependency<span class="token punctuation">></span></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>spring<span class="token operator">-</span>boot<span class="token operator">-</span>devtools<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>scope<span class="token punctuation">></span></span>runtime<span class="token operator">&lt;</span><span class="token operator">/</span>scope<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>optional<span class="token punctuation">></span></span><span class="token boolean">true</span><span class="token operator">&lt;</span><span class="token operator">/</span>optional<span class="token operator">></span></span>
<span class="line">        <span class="token operator">&lt;</span><span class="token operator">/</span>dependency<span class="token operator">></span></span>
<span class="line"></span>
<span class="line">        <span class="token generics"><span class="token punctuation">&lt;</span>dependency<span class="token punctuation">></span></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>groupId<span class="token punctuation">></span></span>org<span class="token punctuation">.</span>springframework<span class="token punctuation">.</span>boot<span class="token operator">&lt;</span><span class="token operator">/</span>groupId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>artifactId<span class="token punctuation">></span></span>spring<span class="token operator">-</span>boot<span class="token operator">-</span>starter<span class="token operator">-</span>test<span class="token operator">&lt;</span><span class="token operator">/</span>artifactId<span class="token operator">></span></span>
<span class="line">            <span class="token generics"><span class="token punctuation">&lt;</span>scope<span class="token punctuation">></span></span>test<span class="token operator">&lt;</span><span class="token operator">/</span>scope<span class="token operator">></span></span>
<span class="line">        <span class="token operator">&lt;</span><span class="token operator">/</span>dependency<span class="token operator">></span></span>
<span class="line">    <span class="token operator">&lt;</span><span class="token operator">/</span>dependencies<span class="token operator">></span></span>
<span class="line"></span>
<span class="line"><span class="token operator">&lt;</span><span class="token operator">/</span>project<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>application.yml 增加端口号9001</p>
</li>
<li>
<p>入口类加注解 @EnableHystrixDashboard</p>
</li>
<li>
<p>需要被监控的provider 都需要依赖 <code v-pre>spring-boot-starter-actuator</code></p>
</li>
<li>
<p>启动9001，输入 <code v-pre>http://localhost:9001/hystrix</code></p>
</li>
</ul>
<h4 id="被监控的主入口类增加" tabindex="-1"><a class="header-anchor" href="#被监控的主入口类增加"><span>被监控的主入口类增加</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"> <span class="token doc-comment comment">/**</span>
<span class="line">     * 此配置是为了服务监控bashdoard配置，与服务容错本身无关，是springcloud升级的坑</span>
<span class="line">     * ServletRegistrationBean因为springboot中默认路径不是/hystrix.stream</span>
<span class="line">     * 本项目在hystrix80增加</span>
<span class="line">     * <span class="token keyword">@return</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token annotation punctuation">@Bean</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">ServletRegistrationBean</span> <span class="token function">getServlet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">HystrixMetricsStreamServlet</span> streamServlet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HystrixMetricsStreamServlet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">ServletRegistrationBean</span> registrationBean <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ServletRegistrationBean</span><span class="token punctuation">(</span>streamServlet<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        registrationBean<span class="token punctuation">.</span><span class="token function">setLoadOnStartup</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        registrationBean<span class="token punctuation">.</span><span class="token function">addUrlMappings</span><span class="token punctuation">(</span><span class="token string">"/hystrix.stream"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        registrationBean<span class="token punctuation">.</span><span class="token function">setName</span><span class="token punctuation">(</span><span class="token string">"HystrixMetricsStreamServlet"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> registrationBean<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>http://localhost:9001/hystrix</code>中输入路径 <code v-pre>localhost:8000</code> Delay <code v-pre>2000</code> Title <code v-pre>consumer80</code> 启动，之后 访问 正确和错误的请求测试断路器监控</li>
</ul>
</div></template>


