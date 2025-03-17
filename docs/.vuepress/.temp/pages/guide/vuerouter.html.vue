<template><div><h2 id="概念" tabindex="-1"><a class="header-anchor" href="#概念"><span>概念</span></a></h2>
<h3 id="vue-router介绍" tabindex="-1"><a class="header-anchor" href="#vue-router介绍"><span>vue router介绍</span></a></h3>
<ul>
<li>Vue Router 是 Vue.js 官方的路由管理器。它和 Vue.js 的核心深度集成，让构建单页面应用变得易如反掌。</li>
</ul>
<h3 id="使用方法" tabindex="-1"><a class="header-anchor" href="#使用方法"><span>使用方法</span></a></h3>
<ul>
<li>npm</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">npm</span> <span class="token function">install</span> vue-router</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>安装</li>
</ul>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">import</span> Vue <span class="token keyword">from</span> <span class="token string">'vue'</span></span>
<span class="line"><span class="token keyword">import</span> VueRouter <span class="token keyword">from</span> <span class="token string">'vue-router'</span></span>
<span class="line"></span>
<span class="line highlighted">Vue<span class="token punctuation">.</span><span class="token function">use</span><span class="token punctuation">(</span>VueRouter<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="路由具体指向" tabindex="-1"><a class="header-anchor" href="#路由具体指向"><span>路由具体指向</span></a></h3>
<ul>
<li>HTML</li>
</ul>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html"><pre v-pre><code><span class="line"><span class="token comment">&lt;!-- 通过传入 `to` 属性指定user链接. --></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>vue-router</span> <span class="token attr-name">:to</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">'</span>/user<span class="token punctuation">'</span></span><span class="token punctuation">></span></span> go to<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>vue-router</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>js</li>
</ul>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">this</span><span class="token punctuation">.</span>$router<span class="token punctuation">.</span><span class="token function">push</span><span class="token punctuation">(</span><span class="token string">'/user'</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="动态路由匹配" tabindex="-1"><a class="header-anchor" href="#动态路由匹配"><span>动态路由匹配</span></a></h3>
<ul>
<li>同一个组件，根据条件不同，都要使用这个组件渲染</li>
</ul>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> User <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token string">'&lt;div>User&lt;/div>'</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line highlighted"></span>
<span class="line"><span class="token keyword">const</span> router <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">VueRouter</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">routes</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token comment">// 动态路径参数 以冒号开头</span></span>
<span class="line">    <span class="token punctuation">{</span> <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">'/user/:id'</span><span class="token punctuation">,</span> <span class="token literal-property property">component</span><span class="token operator">:</span> User <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="响应路由参数的变化" tabindex="-1"><a class="header-anchor" href="#响应路由参数的变化"><span>响应路由参数的变化</span></a></h3>
<ul>
<li>
<p>对于多个url使用同一个组件路由匹配，组件实例被复用，
意味着组件的生命周期钩子不会再被调用。</p>
</li>
<li>
<p>如果想要对参数变化响应的化，推荐2.2以后的导航守卫，
beforeRouteUpdate</p>
</li>
</ul>
<h2 id="进阶" tabindex="-1"><a class="header-anchor" href="#进阶"><span>进阶</span></a></h2>
<h3 id="导航守卫" tabindex="-1"><a class="header-anchor" href="#导航守卫"><span>导航守卫</span></a></h3>
<p>导航守卫主要用来通过跳转或取消的方式守卫导航，参数或查询的改变并不会触发进入/离开的导航守卫</p>
<h4 id="全局前置守卫-beforeeach" tabindex="-1"><a class="header-anchor" href="#全局前置守卫-beforeeach"><span>全局前置守卫 beforeEach</span></a></h4>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> router <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">VueRouter</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token operator">...</span><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line">router<span class="token punctuation">.</span><span class="token function">beforeEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">to<span class="token punctuation">,</span>from<span class="token punctuation">,</span>nexe</span><span class="token punctuation">)</span><span class="token operator">=></span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">//...</span></span>
<span class="line highlighted"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>当一个导航触发时，全局前置守卫按照创建顺序调用。守卫是异步解析执行，此时导航在所有守卫 resolve 完之前一直处于 等待中。</li>
<li>每个守卫方法接收三个参数:
<ul>
<li>to(router):即将要进入的路由对象</li>
<li>from(router): 当前要离开的路由对象</li>
<li>next(function):一定要调用该方法来 resolve 这个钩子,执行效果依赖 next 方法的调用参数.
<ul>
<li>next():当前管道中的下一个钩子</li>
<li>next(false):中断当前的导航</li>
<li>next('/'):跳进'/'这个url</li>
<li>next(error):导航会被终止且该错误会被传递给 router.onError() 注册过的回调.</li>
</ul>
</li>
</ul>
</li>
</ul>
<h4 id="全局解析守卫-beforeresolve" tabindex="-1"><a class="header-anchor" href="#全局解析守卫-beforeresolve"><span>全局解析守卫 beforeResolve</span></a></h4>
<ul>
<li>这和 router.beforeEach 类似，区别是在导航被确认之前，同时在所有组件内守卫和异步路由组件被解析之后，解析守卫就被调用</li>
</ul>
<h4 id="全局后置钩子-aftereach" tabindex="-1"><a class="header-anchor" href="#全局后置钩子-aftereach"><span>全局后置钩子 afterEach</span></a></h4>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line">router<span class="token punctuation">.</span><span class="token function">afterEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token parameter">to<span class="token punctuation">,</span> <span class="token keyword">from</span></span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token comment">// ...</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line highlighted"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>解析守卫不会接收next函数也不会改变导航</li>
</ul>
<h4 id="路由独享的守卫" tabindex="-1"><a class="header-anchor" href="#路由独享的守卫"><span>路由独享的守卫</span></a></h4>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">const</span> router <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">VueRouter</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">routes</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">{</span></span>
<span class="line highlighted">      <span class="token literal-property property">path</span><span class="token operator">:</span> <span class="token string">'/foo'</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">component</span><span class="token operator">:</span> Foo<span class="token punctuation">,</span></span>
<span class="line">      <span class="token function-variable function">beforeEnter</span><span class="token operator">:</span> <span class="token punctuation">(</span><span class="token parameter">to<span class="token punctuation">,</span> from<span class="token punctuation">,</span> next</span><span class="token punctuation">)</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// ...</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<h4 id="完整的导航解析流程" tabindex="-1"><a class="header-anchor" href="#完整的导航解析流程"><span>完整的导航解析流程</span></a></h4>
<ul>
<li>导航被触发。</li>
<li>在失活的组件里调用离开守卫。</li>
<li>调用全局的 beforeEach 守卫。</li>
<li>在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。</li>
<li>在路由配置里调用 beforeEnter。</li>
<li>解析异步路由组件。</li>
<li>在被激活的组件里调用 beforeRouteEnter。</li>
<li>调用全局的 beforeResolve 守卫 (2.5+)。</li>
<li>导航被确认。</li>
<li>调用全局的 afterEach 钩子。</li>
<li>触发 DOM 更新。</li>
<li>用创建好的实例调用 beforeRouteEnter 守卫中传给 next 的回调函数。</li>
</ul>
</div>
</div></template>


