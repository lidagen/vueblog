<template><div><h2 id="设计模式之装饰者模式——decorator" tabindex="-1"><a class="header-anchor" href="#设计模式之装饰者模式——decorator"><span>设计模式之装饰者模式——Decorator</span></a></h2>
<h3 id="定义" tabindex="-1"><a class="header-anchor" href="#定义"><span>定义</span></a></h3>
<p>在不改变原有对象的基础之上，将功能附加对象之上。提供了比继承更有弹性的替代方案（扩展原有对象功能）。</p>
<h3 id="适用场景" tabindex="-1"><a class="header-anchor" href="#适用场景"><span>适用场景</span></a></h3>
<ul>
<li>拓展一个类的功能</li>
<li>给一个对象动态添加或者撤销功能</li>
</ul>
<h3 id="组件" tabindex="-1"><a class="header-anchor" href="#组件"><span>组件</span></a></h3>
<ul>
<li>装饰者（Decorator）：继承(实现)需要装饰的抽象类（接口）。在抽象类构造方法中注入需要被装饰的抽象类（接口）。</li>
</ul>
<h3 id="优点" tabindex="-1"><a class="header-anchor" href="#优点"><span>优点</span></a></h3>
<ul>
<li>比继承灵活，不改变原有对象的同时给另一个对象扩展功能（继承是静态的，在编译期就确定好的，而使用装饰者模式，是可以在运行时决定的）。</li>
<li>通过使用不同的装饰者类以及这些类的排列组合，可以实现不同的效果。</li>
<li>符合开闭原则</li>
</ul>
<h3 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点"><span>缺点</span></a></h3>
<ul>
<li>会出现更多的类，更多的代码，增加程序的复杂性。</li>
<li>动态装饰时，多层装饰时会更加复杂（装饰者模式会增加对象的数量，当数量增加到一定级别，会大大增加代码调试的难度）。</li>
</ul>
<h3 id="构造场景" tabindex="-1"><a class="header-anchor" href="#构造场景"><span>构造场景</span></a></h3>
<p>假设我们有一个煎饼摊，有杂粮（4元）和小麦面粉（3元）两种基础的煎饼，在此基础上可以选择加鸡蛋（1元）、香肠（2元）、里脊（4元）。
假设我们用继承方式来实现。</p>
<h4 id="普通继承" tabindex="-1"><a class="header-anchor" href="#普通继承"><span>普通继承</span></a></h4>
<ul>
<li>创建也给杂粮煎饼类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ZaLiangCake</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> <span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token string">"杂粮煎饼"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">int</span> <span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token number">4</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>需要加一个鸡蛋，让加鸡蛋的煎饼继承杂粮果子类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ZaLiangCakeWithEgg</span> <span class="token keyword">extends</span> <span class="token class-name">ZaLiangCake</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> <span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">",加一个鸡蛋"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">int</span> <span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>在鸡蛋煎饼果子基础上再加一个烤肠</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ZaLiangCakeWithEggSausage</span> <span class="token keyword">extends</span> <span class="token class-name">ZaLiangCakeWithEgg</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> <span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token string">",加一个香肠"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">int</span> <span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">+</span><span class="token number">2</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>测试方法</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">ZaLiangCake</span> cake <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ZaLiangCake</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>cake<span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">",cost:"</span><span class="token operator">+</span>cake<span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">ZaLiangCake</span> eggCake <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ZaLiangCakeWithEgg</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>eggCake<span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">",cost:"</span><span class="token operator">+</span>eggCake<span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">ZaLiangCake</span> eggSausage <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ZaLiangCakeWithEggSausage</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>eggSausage<span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">",cost:"</span><span class="token operator">+</span>eggSausage<span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/** 输出</span>
<span class="line">杂粮煎饼,cost:4</span>
<span class="line">杂粮煎饼,加一个鸡蛋,cost:5</span>
<span class="line">杂粮煎饼,加一个鸡蛋,加一个香肠,cost:7</span>
<span class="line">*/</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这样做有什么问题？假设我们要加2个鸡蛋呢，我们还需要写一个两个鸡蛋的类，如果两个鸡蛋再加里脊呢。随着种类的各种搭配，会导致类爆炸。这时候用装饰者模式来实现一下。</p>
<h4 id="装饰者模式" tabindex="-1"><a class="header-anchor" href="#装饰者模式"><span>装饰者模式</span></a></h4>
<ul>
<li>定义一个煎饼果子抽象类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">AbstractCake</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> desc <span class="token operator">=</span> <span class="token string">"UnKnown Cake"</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>描述</span><span class="token punctuation">></span></span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> <span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> desc<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>价格</span><span class="token punctuation">></span></span></span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">abstract</span> <span class="token keyword">int</span> <span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>煎饼的两种实现，杂粮的和普通的</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ZaLiangCake</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractCake</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> <span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token string">"杂粮煎饼"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">int</span> <span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token number">4</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">MianFenCake</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractCake</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> <span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token string">"普通煎饼"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">int</span> <span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token number">3</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>定义一个装饰父类。（装饰者拥有被装饰者的对象，一般当构造参数传入）</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">AbstractDecorator</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractCake</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">AbstractCake</span> abstractCake<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">AbstractDecorator</span><span class="token punctuation">(</span><span class="token class-name">AbstractCake</span> abstractCake<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>abstractCake <span class="token operator">=</span> abstractCake<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> <span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>abstractCake<span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">int</span> <span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">.</span>abstractCake<span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>分别增加鸡蛋、烤肠、里脊装饰类</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">EggDecorator</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractDecorator</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">EggDecorator</span><span class="token punctuation">(</span><span class="token class-name">AbstractCake</span> abstractCake<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">super</span><span class="token punctuation">(</span>abstractCake<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> <span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">",加一个鸡蛋"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">int</span> <span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">SauageDecorator</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractDecorator</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">SauageDecorator</span><span class="token punctuation">(</span><span class="token class-name">AbstractCake</span> abstractCake<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">super</span><span class="token punctuation">(</span>abstractCake<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> <span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">",加一根香肠"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">int</span> <span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">2</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">BaconDecorator</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractDecorator</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">BaconDecorator</span><span class="token punctuation">(</span><span class="token class-name">AbstractCake</span> abstractCake<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">super</span><span class="token punctuation">(</span>abstractCake<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token class-name">String</span> <span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">", 加里脊肉"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">int</span> <span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token number">4</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>测试方法</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">AbstractCake</span> zaLiang <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ZaLiangCake</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    zaLiang <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">EggDecorator</span><span class="token punctuation">(</span>zaLiang<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    zaLiang <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">EggDecorator</span><span class="token punctuation">(</span>zaLiang<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    zaLiang <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SauageDecorator</span><span class="token punctuation">(</span>zaLiang<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>zaLiang<span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">",cost:"</span> <span class="token operator">+</span> zaLiang<span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">AbstractCake</span> mianFenCake <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">MianFenCake</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    mianFenCake <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">EggDecorator</span><span class="token punctuation">(</span>mianFenCake<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    mianFenCake <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">SauageDecorator</span><span class="token punctuation">(</span>mianFenCake<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    mianFenCake <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BaconDecorator</span><span class="token punctuation">(</span>mianFenCake<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>mianFenCake<span class="token punctuation">.</span><span class="token function">getDesc</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">",cost:"</span> <span class="token operator">+</span> mianFenCake<span class="token punctuation">.</span><span class="token function">cost</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">杂粮煎饼,加一个鸡蛋,加一个鸡蛋,加一根香肠,cost:8</span>
<span class="line">普通煎饼,加一个鸡蛋,加一根香肠, 加里脊肉,cost:11</span>
<span class="line">*/</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>这种设计模式伸缩性就很强，不管你怎么搭配，在定义好的类直接可以随意组合。
此例子简单理解例子是，只有一个被装饰的实现类 ZaliangCake,装饰者可以对其自由组合。</p>
<h3 id="装饰者模式在java-io体系中的运用" tabindex="-1"><a class="header-anchor" href="#装饰者模式在java-io体系中的运用"><span>装饰者模式在java IO体系中的运用</span></a></h3>
<p>java 的IO体系很好地应用了装饰者模式，下边我们可以先看一下Java IO流体系。</p>
<img :src="$withBase('/desgin/1.jpg')" alt="dock">
<ul>
<li>从图中看出，InputStream就是装饰者模式的超类，<code v-pre>ByteArrayInputStream</code>，<code v-pre>FileInputStream</code>相当于被装饰者。这些类都提供了最基本的字节读取的功能。</li>
<li>而和这些类同一级别的类<code v-pre>FilterInputStream</code>即是装饰者（Decorator），<code v-pre>BufferedInputStream</code>，<code v-pre>DataInputStream</code>，<code v-pre>PushbackInputStream</code>这些类继承<code v-pre>FilterInputStream</code>，是具体的装饰类。</li>
</ul>
<p>根据装饰者模式，我们可以总结这些流的用法:</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">DesignMain</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">File</span> file <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">File</span><span class="token punctuation">(</span><span class="token string">"text.txt"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">InputStream</span> is <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">FileInputStream</span><span class="token punctuation">(</span>file<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">BufferedInputStream</span> bufferedInputStream <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">BufferedInputStream</span><span class="token punctuation">(</span>is<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从使用的角度来看装饰者模式，可以看出它的一个缺点：装饰者模式的实现对于使用者是透明的，当使用者不熟悉你的实现的时，就很难理解。 同理你可以学习一下另外一个结构outputStream 。</p>
</div></template>


