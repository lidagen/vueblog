<template><div><h2 id="设计模式之模板模式——template" tabindex="-1"><a class="header-anchor" href="#设计模式之模板模式——template"><span>设计模式之模板模式——Template</span></a></h2>
<h3 id="定义" tabindex="-1"><a class="header-anchor" href="#定义"><span>定义</span></a></h3>
<p>在一个方法中定义了一个算法的骨架，而将一些步骤延迟到子类中，模板方法使得子类可以在不改变算法结构的情况下，重新定义算法中某些结构。</p>
<h3 id="适用场景" tabindex="-1"><a class="header-anchor" href="#适用场景"><span>适用场景</span></a></h3>
<p>多个类有相同的方法，并且逻辑基本相同,可以选择抽离通用方法，子类只需要实现自己的特殊逻辑。</p>
<h3 id="组件" tabindex="-1"><a class="header-anchor" href="#组件"><span>组件</span></a></h3>
<ul>
<li>
<p><code v-pre>AbstractClass</code>:实现一个模板方法，定义了算法的骨架，具体子类将重定义抽象方法以实现一个算法的步骤</p>
</li>
<li>
<p><code v-pre>ConcreteClass</code>:实现父类中的抽象方法。</p>
</li>
</ul>
<h3 id="优点" tabindex="-1"><a class="header-anchor" href="#优点"><span>优点</span></a></h3>
<ul>
<li>
<p>封装不变部分，扩展可变部分</p>
</li>
<li>
<p>提取公共部分代码，便于维护</p>
</li>
<li>
<p>行为由父类控制，子类实现</p>
</li>
</ul>
<h3 id="缺点" tabindex="-1"><a class="header-anchor" href="#缺点"><span>缺点</span></a></h3>
<ul>
<li>每一个不同的实现都需要一个子类实现，导致类的个数增加，使得系统更加庞大</li>
</ul>
<h3 id="构造场景" tabindex="-1"><a class="header-anchor" href="#构造场景"><span>构造场景</span></a></h3>
<ul>
<li>
<p>假设有个饮吧，提供咖啡和茶两种含咖啡因的饮品，假设两种饮品制作步骤分别如下：</p>
<ul>
<li>
<p>咖啡：</p>
<ul>
<li>煮沸水</li>
<li>用水冲泡咖啡</li>
<li>把咖啡倒进杯子</li>
<li>加糖和牛奶</li>
</ul>
</li>
<li>
<p>茶：</p>
<ul>
<li>煮沸水</li>
<li>用水冲泡茶袋</li>
<li>把茶倒进杯子</li>
<li>加柠檬片</li>
</ul>
</li>
</ul>
</li>
<li>
<p>从上面两个饮品的制作步骤可以看出，它们有类似的地方（1，3），有不同的地方（2，4）,可以考虑使用模板方法封装相同的步骤，子类实现不同的步骤。</p>
</li>
<li>
<p>两个品类的第四步，根据客人的口味可以选择加或者不加，我们考虑造一个钩子，即子类可以自行选择是否实现。</p>
</li>
<li>
<p>一个抽象的咖啡因父类:</p>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">abstract</span> <span class="token keyword">class</span> <span class="token class-name">AbstractCaffeine</span> <span class="token punctuation">{</span></span>
<span class="line">     <span class="token doc-comment comment">/**</span>
<span class="line">       * 功能描述: <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>br</span><span class="token punctuation">></span></span></span>
<span class="line">       *<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>制作方法</span><span class="token punctuation">></span></span></span>
<span class="line">       * 我们可以把方法设置为final,以免被子类重写</span>
<span class="line">       */</span></span>
<span class="line">    <span class="token keyword">final</span> <span class="token keyword">void</span> <span class="token function">prepareRecipe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">boilWater</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">brew</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">pourInCup</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">addCondiments</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 煮沸水</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">boilWater</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"水开了！"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    </span>
<span class="line">    <span class="token doc-comment comment">/**冲泡饮品*/</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">abstract</span> <span class="token keyword">void</span> <span class="token function">brew</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**</span>
<span class="line">     * 倒入杯子</span>
<span class="line">     */</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">pourInCup</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"饮品倒入杯子中了！"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**加一些调料（钩子，子类自行选择是否添加佐料）**/</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">addCondiments</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">{</span><span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>两个子类，继承实现抽象方法：
<ul>
<li>咖啡</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Coffee</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractCaffeine</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**冲泡饮品*/</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">brew</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"用水冲泡咖啡"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token doc-comment comment">/**加佐料**/</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">addCondiments</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"加入糖和牛奶"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>茶</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Tea</span> <span class="token keyword">extends</span> <span class="token class-name">AbstractCaffeine</span> <span class="token punctuation">{</span></span>
<span class="line">    </span>
<span class="line">    <span class="token doc-comment comment">/**冲泡饮品**/</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">void</span> <span class="token function">brew</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"用水冲泡茶袋！"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>例子中咖啡我们实现了钩子，加入糖和牛奶，茶叶我们选择什么都不加。</li>
</ul>
<h4 id="运行结果" tabindex="-1"><a class="header-anchor" href="#运行结果"><span>运行结果</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TemplateDemo</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">AbstractCaffeine</span> coffee <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Coffee</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        coffee<span class="token punctuation">.</span><span class="token function">prepareRecipe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"---------------------------"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">AbstractCaffeine</span> tea <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Tea</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        tea<span class="token punctuation">.</span><span class="token function">prepareRecipe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">水开了！</span>
<span class="line">用水冲泡咖啡</span>
<span class="line">饮品倒入杯子中了！</span>
<span class="line">加入糖和牛奶</span>
<span class="line">---------------------------</span>
<span class="line">水开了！</span>
<span class="line">用水冲泡茶袋！</span>
<span class="line">饮品倒入杯子中了！</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


