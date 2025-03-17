<template><div><h2 id="设计模式之适配器模式——adapter" tabindex="-1"><a class="header-anchor" href="#设计模式之适配器模式——adapter"><span>设计模式之适配器模式——Adapter</span></a></h2>
<h3 id="定义" tabindex="-1"><a class="header-anchor" href="#定义"><span>定义</span></a></h3>
<p>适配器模式把一个类的接口变换成客户端所期待的另一种接口，从而使原本接口不匹配而无法在一起工作的两个类能够在一起工作。</p>
<h3 id="适用场景" tabindex="-1"><a class="header-anchor" href="#适用场景"><span>适用场景</span></a></h3>
<ul>
<li>您想使用现有的类，但它的接口与您需要的接口不匹配</li>
<li>你想创建一个可重用的类，让它与不相关或不可预见的类（即不一定具有兼容接口的类）协作</li>
<li>你需要使用几个现有的子类，但通过对每个子类进行子类化来调整它们的接口是不切实际的。对象适配器可以调整其父类的接口。</li>
<li>大多数使用第三方库的应用程序使用适配器作为应用程序和第三方库之间的中间层，以将应用程序与库分离。如果必须使用另一个库，则只需要新库的适配器，而无需更改应用程序代码。</li>
</ul>
<h3 id="组件" tabindex="-1"><a class="header-anchor" href="#组件"><span>组件</span></a></h3>
<ul>
<li>目标角色（Target）:客户端所期待得到的接口</li>
<li>适配器角色（Adapter）：适配器类是本模式的核心。适配器把源接口转换成目标接口。（这一角色不可以是接口，而必须是具体类）。</li>
<li>源角色被适配者（Adapee）：现在需要被适配的接口</li>
</ul>
<h3 id="优点" tabindex="-1"><a class="header-anchor" href="#优点"><span>优点</span></a></h3>
<ul>
<li>一个适配器可以把多种不同的源适配到同一个目标。换言之，同一个适配器可以把源类和它的子类都适配到目标接口。因为对象适配器采用的是对象组合的关系，只要对象类型正确，是不是子类都无所谓。</li>
<li>符合设计原则：多用合成/聚合、少用继承，从而减少类之间的耦合</li>
</ul>
<h3 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点"><span>缺点</span></a></h3>
<ul>
<li>要重定义Adaptee的行为比较困难，这种情况下，需要定义Adaptee的子类来实现重定义，然后让适配器组合子类。虽然重定义Adaptee的行为比较困难，但是想要增加一些新的行为则方便的很，而且新增加的行为可同时适用于所有的源</li>
<li>需要额外的引用来间接得到Adaptee。</li>
</ul>
<h3 id="构造场景" tabindex="-1"><a class="header-anchor" href="#构造场景"><span>构造场景</span></a></h3>
<p>假设你有一台电脑，能接收5V电压。我国电压220V，日本电压110V,需要适配器支持电脑在两个国家都能用。</p>
<ul>
<li>Adapee</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">PowerAdaptee</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 输出电压</span>
<span class="line">     * <span class="token keyword">@return</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">int</span> <span class="token function">output</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//不同电压实现</span></span>
<span class="line"><span class="token comment">//中国</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ChinaPowerAdaptee</span> <span class="token keyword">implements</span> <span class="token class-name">PowerAdaptee</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">int</span> output <span class="token operator">=</span> <span class="token number">220</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">output</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"电源输出电压："</span> <span class="token operator">+</span> output<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> output<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//日本</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">JapanPowerAdaptee</span> <span class="token keyword">implements</span> <span class="token class-name">PowerAdaptee</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">int</span> output <span class="token operator">=</span> <span class="token number">110</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">output</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"电源输出电压："</span> <span class="token operator">+</span> output<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> output<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Target</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">ComputerTarget</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 220v输出5V电压</span>
<span class="line">     * <span class="token keyword">@return</span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">int</span> <span class="token function">output5V</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Adapter</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">PowerAdapter</span> <span class="token keyword">implements</span> <span class="token class-name">ComputerTarget</span><span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">PowerAdaptee</span> powerAdaptee<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">PowerAdapter</span><span class="token punctuation">(</span><span class="token class-name">PowerAdaptee</span> powerAdaptee<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>powerAdaptee <span class="token operator">=</span> powerAdaptee<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">output5V</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token function">transferOutPut</span><span class="token punctuation">(</span>powerAdaptee<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**转换方法*/</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">int</span> <span class="token function">transferOutPut</span><span class="token punctuation">(</span><span class="token class-name">PowerAdaptee</span> adaptee<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> v <span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>adaptee <span class="token keyword">instanceof</span> <span class="token class-name">ChinaPowerAdaptee</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            v <span class="token operator">=</span> adaptee<span class="token punctuation">.</span><span class="token function">output</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">44</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"中国220V电压转化为"</span><span class="token operator">+</span>v<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>adaptee <span class="token keyword">instanceof</span> <span class="token class-name">JapanPowerAdaptee</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">            v <span class="token operator">=</span> adaptee<span class="token punctuation">.</span><span class="token function">output</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">22</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"日本110V电压转化为"</span><span class="token operator">+</span>v<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalArgumentException</span><span class="token punctuation">(</span><span class="token string">"未找到对应适配器"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> v<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>测试方法</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">AdapterMain</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">ComputerTarget</span> chinaTarget <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PowerAdapter</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ChinaPowerAdaptee</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">ComputerTarget</span> japanTarget <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">PowerAdapter</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">JapanPowerAdaptee</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">;</span></span>
<span class="line">        chinaTarget<span class="token punctuation">.</span><span class="token function">output5V</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        japanTarget<span class="token punctuation">.</span><span class="token function">output5V</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token doc-comment comment">/**输出：</span>
<span class="line">电源输出电压：220</span>
<span class="line">中国220V电压转化为5</span>
<span class="line">电源输出电压：110</span>
<span class="line">日本110V电压转化为5</span>
<span class="line">*/</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>例子中看出，客户端所期待的接口Target需要适配器Adapter实现。Adapter中实现转化5V的方法。
接口ComputerTarget中是无参的，PowerAdapter通过构造器把被适配者Adapee注入进去，从而进行转化。</p>
<h3 id="适配器模式在spring-aop中的运用" tabindex="-1"><a class="header-anchor" href="#适配器模式在spring-aop中的运用"><span>适配器模式在spring AOP中的运用</span></a></h3>
<ul>
<li>
<p>在spring AOP中，使用<code v-pre>Advice</code>（通知）来增强被代理类的功能。</p>
</li>
<li>
<p><code v-pre>Advice</code>的类型有<code v-pre>MethodBeforeAdvice</code>、<code v-pre>AfterReturningAdvice</code> 、<code v-pre>ThrowsAdvice</code></p>
</li>
<li>
<p>每个<code v-pre>Advice</code>实现都有对应的拦截器<code v-pre>MethodBeforeAdviceInterceptor</code>、<code v-pre>AfterReturningAdviceInterceptor</code> 、<code v-pre>ThrowsAdviceInterceptor</code></p>
</li>
<li>
<p>spring需要将每个 <code v-pre>Advice</code>封装成对应的拦截器类型，返回给容器。</p>
</li>
</ul>
<p>结合之前的例子，<code v-pre>Advice</code>实现类就是对应的Adapee(被适配者),而拦截器就是目标角色Target。把Advice转换成对应的拦截器，就需要用适配器Adapter进行转换。</p>
<h4 id="三个adaptee如下" tabindex="-1"><a class="header-anchor" href="#三个adaptee如下"><span>三个Adaptee如下</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//BeforeAdvice 继承 Advice</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">MethodBeforeAdvice</span> <span class="token keyword">extends</span> <span class="token class-name">BeforeAdvice</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">void</span> <span class="token function">before</span><span class="token punctuation">(</span><span class="token class-name">Method</span> method<span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">,</span> <span class="token class-name">Object</span> target<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Throwable</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token comment">//AfterAdvice 继承 Advice</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">AfterReturningAdvice</span> <span class="token keyword">extends</span> <span class="token class-name">AfterAdvice</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">void</span> <span class="token function">afterReturning</span><span class="token punctuation">(</span><span class="token class-name">Object</span> returnValue<span class="token punctuation">,</span> <span class="token class-name">Method</span> method<span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">,</span> <span class="token class-name">Object</span> target<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Throwable</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">ThrowsAdvice</span> <span class="token keyword">extends</span> <span class="token class-name">AfterAdvice</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="目标接口-target-有两个方法-一个判断-advice-类型是否匹配-一个是工厂方法-创建对应类型的-advice-对应的拦截器" tabindex="-1"><a class="header-anchor" href="#目标接口-target-有两个方法-一个判断-advice-类型是否匹配-一个是工厂方法-创建对应类型的-advice-对应的拦截器"><span>目标接口 Target ,有两个方法，一个判断 Advice 类型是否匹配，一个是工厂方法，创建对应类型的 Advice 对应的拦截器</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">AdvisorAdapter</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">boolean</span> <span class="token function">supportsAdvice</span><span class="token punctuation">(</span><span class="token class-name">Advice</span> var1<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">//真正需要的方法是获取对应的拦截器</span></span>
<span class="line">    <span class="token class-name">MethodInterceptor</span> <span class="token function">getInterceptor</span><span class="token punctuation">(</span><span class="token class-name">Advisor</span> var1<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="三个adapter如下" tabindex="-1"><a class="header-anchor" href="#三个adapter如下"><span>三个Adapter如下:</span></a></h3>
<ul>
<li>MethodBeforeAdviceAdapter</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">MethodBeforeAdviceAdapter</span> <span class="token keyword">implements</span> <span class="token class-name">AdvisorAdapter</span><span class="token punctuation">,</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">supportsAdvice</span><span class="token punctuation">(</span><span class="token class-name">Advice</span> advice<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token punctuation">(</span>advice <span class="token keyword">instanceof</span> <span class="token class-name">MethodBeforeAdvice</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token class-name">MethodInterceptor</span> <span class="token function">getInterceptor</span><span class="token punctuation">(</span><span class="token class-name">Advisor</span> advisor<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">MethodBeforeAdvice</span> advice <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">MethodBeforeAdvice</span><span class="token punctuation">)</span> advisor<span class="token punctuation">.</span><span class="token function">getAdvice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">MethodBeforeAdviceInterceptor</span><span class="token punctuation">(</span>advice<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>AfterReturningAdviceAdapter</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">AfterReturningAdviceAdapter</span> <span class="token keyword">implements</span> <span class="token class-name">AdvisorAdapter</span><span class="token punctuation">,</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">supportsAdvice</span><span class="token punctuation">(</span><span class="token class-name">Advice</span> advice<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token punctuation">(</span>advice <span class="token keyword">instanceof</span> <span class="token class-name">AfterReturningAdvice</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token class-name">MethodInterceptor</span> <span class="token function">getInterceptor</span><span class="token punctuation">(</span><span class="token class-name">Advisor</span> advisor<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">AfterReturningAdvice</span> advice <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">AfterReturningAdvice</span><span class="token punctuation">)</span> advisor<span class="token punctuation">.</span><span class="token function">getAdvice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">AfterReturningAdviceInterceptor</span><span class="token punctuation">(</span>advice<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>ThrowsAdviceAdapter</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">class</span> <span class="token class-name">ThrowsAdviceAdapter</span> <span class="token keyword">implements</span> <span class="token class-name">AdvisorAdapter</span><span class="token punctuation">,</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">supportsAdvice</span><span class="token punctuation">(</span><span class="token class-name">Advice</span> advice<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token punctuation">(</span>advice <span class="token keyword">instanceof</span> <span class="token class-name">ThrowsAdvice</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token class-name">MethodInterceptor</span> <span class="token function">getInterceptor</span><span class="token punctuation">(</span><span class="token class-name">Advisor</span> advisor<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ThrowsAdviceInterceptor</span><span class="token punctuation">(</span>advisor<span class="token punctuation">.</span><span class="token function">getAdvice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="客户端-defaultadvisoradapterregistry" tabindex="-1"><a class="header-anchor" href="#客户端-defaultadvisoradapterregistry"><span>客户端 DefaultAdvisorAdapterRegistry</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DefaultAdvisorAdapterRegistry</span> <span class="token keyword">implements</span> <span class="token class-name">AdvisorAdapterRegistry</span><span class="token punctuation">,</span> <span class="token class-name">Serializable</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">	<span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">AdvisorAdapter</span><span class="token punctuation">></span></span> adapters <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">AdvisorAdapter</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">	<span class="token doc-comment comment">/**</span>
<span class="line">	 * Create a new DefaultAdvisorAdapterRegistry, registering well-known adapters.</span>
<span class="line">	 */</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token class-name">DefaultAdvisorAdapterRegistry</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token function">registerAdvisorAdapter</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">MethodBeforeAdviceAdapter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token function">registerAdvisorAdapter</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">AfterReturningAdviceAdapter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token function">registerAdvisorAdapter</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">ThrowsAdviceAdapter</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token class-name">Advisor</span> <span class="token function">wrap</span><span class="token punctuation">(</span><span class="token class-name">Object</span> adviceObject<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">UnknownAdviceTypeException</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">if</span> <span class="token punctuation">(</span>adviceObject <span class="token keyword">instanceof</span> <span class="token class-name">Advisor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">Advisor</span><span class="token punctuation">)</span> adviceObject<span class="token punctuation">;</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">		<span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token punctuation">(</span>adviceObject <span class="token keyword">instanceof</span> <span class="token class-name">Advice</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">UnknownAdviceTypeException</span><span class="token punctuation">(</span>adviceObject<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">		<span class="token class-name">Advice</span> advice <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">Advice</span><span class="token punctuation">)</span> adviceObject<span class="token punctuation">;</span></span>
<span class="line">		<span class="token keyword">if</span> <span class="token punctuation">(</span>advice <span class="token keyword">instanceof</span> <span class="token class-name">MethodInterceptor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token comment">// So well-known it doesn't even need an adapter.</span></span>
<span class="line">			<span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">DefaultPointcutAdvisor</span><span class="token punctuation">(</span>advice<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">		<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">AdvisorAdapter</span> adapter <span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>adapters<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token comment">// Check that it is supported.</span></span>
<span class="line">			<span class="token keyword">if</span> <span class="token punctuation">(</span>adapter<span class="token punctuation">.</span><span class="token function">supportsAdvice</span><span class="token punctuation">(</span>advice<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">				<span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">DefaultPointcutAdvisor</span><span class="token punctuation">(</span>advice<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">			<span class="token punctuation">}</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">		<span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">UnknownAdviceTypeException</span><span class="token punctuation">(</span>advice<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token class-name">MethodInterceptor</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">getInterceptors</span><span class="token punctuation">(</span><span class="token class-name">Advisor</span> advisor<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">UnknownAdviceTypeException</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">MethodInterceptor</span><span class="token punctuation">></span></span> interceptors <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ArrayList</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">MethodInterceptor</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token class-name">Advice</span> advice <span class="token operator">=</span> advisor<span class="token punctuation">.</span><span class="token function">getAdvice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token keyword">if</span> <span class="token punctuation">(</span>advice <span class="token keyword">instanceof</span> <span class="token class-name">MethodInterceptor</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">			interceptors<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">MethodInterceptor</span><span class="token punctuation">)</span> advice<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">		<span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">AdvisorAdapter</span> adapter <span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>adapters<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token keyword">if</span> <span class="token punctuation">(</span>adapter<span class="token punctuation">.</span><span class="token function">supportsAdvice</span><span class="token punctuation">(</span>advice<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// 这里调用适配器方法是否属于此`Advice`</span></span>
<span class="line">				interceptors<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>adapter<span class="token punctuation">.</span><span class="token function">getInterceptor</span><span class="token punctuation">(</span>advisor<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// 这里调用适配器方法转换对应拦截器</span></span>
<span class="line">			<span class="token punctuation">}</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">		<span class="token keyword">if</span> <span class="token punctuation">(</span>interceptors<span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">			<span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">UnknownAdviceTypeException</span><span class="token punctuation">(</span>advisor<span class="token punctuation">.</span><span class="token function">getAdvice</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">		<span class="token punctuation">}</span></span>
<span class="line">		<span class="token keyword">return</span> interceptors<span class="token punctuation">.</span><span class="token function">toArray</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">MethodInterceptor</span><span class="token punctuation">[</span>interceptors<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">	<span class="token annotation punctuation">@Override</span></span>
<span class="line">	<span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">registerAdvisorAdapter</span><span class="token punctuation">(</span><span class="token class-name">AdvisorAdapter</span> adapter<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">		<span class="token keyword">this</span><span class="token punctuation">.</span>adapters<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>adapter<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">	<span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>getInterceptors的forEach中，调用 supportsAdvice() 方法来判断 Advice 对应的类型，然后调用 getInterceptor() 创建对应类型的拦截器。</p>
</div></template>


