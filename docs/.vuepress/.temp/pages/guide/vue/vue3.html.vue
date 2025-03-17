<template><div><h3 id="vue-elementui-自封装分页插件" tabindex="-1"><a class="header-anchor" href="#vue-elementui-自封装分页插件"><span>vue+ elementUI 自封装分页插件</span></a></h3>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>elementUI提供了一套很好的分页解决方案，但是项目中很多地方使用，每次要写重复代码，不够解耦合，于是考虑把分页单独提出来作为一个公共模块，使用时直接调用，代码更简洁好看</p>
</div>
<ul>
<li>封装Pagination
<ul>
<li>新建一个Pagination.vue页面，代码如下</li>
</ul>
</li>
</ul>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span></span>
<span class="line"> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>el-pagination</span></span>
<span class="line">   <span class="token attr-name">@size-change</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>handleSizeChange<span class="token punctuation">"</span></span></span>
<span class="line highlighted">   <span class="token attr-name">@current-change</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>handleCurrentChange<span class="token punctuation">"</span></span></span>
<span class="line">   <span class="token attr-name">:current-page</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>currentPage<span class="token punctuation">"</span></span></span>
<span class="line">   <span class="token attr-name">:page-sizes</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>[5, 10, 20, 40]<span class="token punctuation">"</span></span></span>
<span class="line">   <span class="token attr-name">:page-size</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>pagesize<span class="token punctuation">"</span></span></span>
<span class="line">   <span class="token attr-name">layout</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>total, sizes, prev, pager, next, jumper<span class="token punctuation">"</span></span></span>
<span class="line">   <span class="token attr-name">:total</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>total<span class="token punctuation">"</span></span></span>
<span class="line"> <span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>el-pagination</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span></span>
<span class="line"> <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">"Pagination"</span><span class="token punctuation">,</span></span>
<span class="line"> <span class="token literal-property property">props</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">   <span class="token literal-property property">url</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">     <span class="token literal-property property">type</span><span class="token operator">:</span> String<span class="token punctuation">,</span></span>
<span class="line">     <span class="token literal-property property">required</span><span class="token operator">:</span> <span class="token boolean">true</span></span>
<span class="line">   <span class="token punctuation">}</span></span>
<span class="line"> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"> <span class="token function">data</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">   <span class="token keyword">return</span> <span class="token punctuation">{</span></span>
<span class="line">     <span class="token literal-property property">total</span><span class="token operator">:</span> <span class="token number">0</span><span class="token punctuation">,</span></span>
<span class="line">     <span class="token literal-property property">pagesize</span><span class="token operator">:</span> <span class="token number">5</span><span class="token punctuation">,</span></span>
<span class="line">     <span class="token literal-property property">currentPage</span><span class="token operator">:</span> <span class="token number">1</span></span>
<span class="line">   <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"> <span class="token function">mounted</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">   <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">reload</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"> <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"> <span class="token literal-property property">methods</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">   <span class="token comment">// 初始页currentPage、初始每页数据数pagesize和数据data</span></span>
<span class="line">   <span class="token function-variable function">handleSizeChange</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">size</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">     <span class="token keyword">this</span><span class="token punctuation">.</span>pagesize <span class="token operator">=</span> size<span class="token punctuation">;</span></span>
<span class="line">     <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">reload</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">   <span class="token function-variable function">handleCurrentChange</span><span class="token operator">:</span> <span class="token keyword">function</span><span class="token punctuation">(</span><span class="token parameter">currentPage</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">     <span class="token keyword">this</span><span class="token punctuation">.</span>currentPage <span class="token operator">=</span> currentPage<span class="token punctuation">;</span></span>
<span class="line">     <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">reload</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">   <span class="token function">reload</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">     <span class="token keyword">this</span><span class="token punctuation">.</span>$Axios<span class="token punctuation">.</span><span class="token function">post</span><span class="token punctuation">(</span></span>
<span class="line">       <span class="token keyword">this</span><span class="token punctuation">.</span>url<span class="token punctuation">,</span></span>
<span class="line">       <span class="token punctuation">{</span> <span class="token literal-property property">page</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>currentPage<span class="token punctuation">,</span> <span class="token literal-property property">size</span><span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">.</span>pagesize <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line">       <span class="token parameter">res</span> <span class="token operator">=></span> <span class="token punctuation">{</span></span>
<span class="line">         <span class="token keyword">if</span> <span class="token punctuation">(</span>res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>success<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">           <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$emit</span><span class="token punctuation">(</span><span class="token string">"childByValue"</span><span class="token punctuation">,</span> res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>data<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">           <span class="token keyword">this</span><span class="token punctuation">.</span>total <span class="token operator">=</span> res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>count<span class="token punctuation">;</span></span>
<span class="line">         <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">           <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">$message</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">             <span class="token literal-property property">message</span><span class="token operator">:</span> res<span class="token punctuation">.</span>data<span class="token punctuation">.</span>msg<span class="token punctuation">,</span></span>
<span class="line">             <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">"warning"</span></span>
<span class="line">           <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">         <span class="token punctuation">}</span></span>
<span class="line">       <span class="token punctuation">}</span></span>
<span class="line">     <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">   <span class="token punctuation">}</span></span>
<span class="line"> <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>说明如下：</p>
<pre><code>      1.JS中this.$Axios.post换成你自己的访问后台api方法

      2.参数page,size也是你自己后台定义的接受分页参数名称

      3.返回类型res结构相应要改成你自己返回数据的格式
</code></pre>
</div>
<ul>
<li>页面处调用
<ul>
<li>引入Pagination.vue</li>
</ul>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token keyword">import</span> Pagination <span class="token keyword">from</span> <span class="token string">"@/components/Pagination.vue"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token literal-property property">components</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line"> Pagination</span>
<span class="line highlighted"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>调用</li>
</ul>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Pagination</span> <span class="token attr-name">url</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>user/query<span class="token punctuation">"</span></span> <span class="token attr-name"><span class="token namespace">v-on:</span>childByValue</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>childByValue<span class="token punctuation">"</span></span><span class="token punctuation">/></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>调用说明：</p>
<pre><code>     1.url对你的你请求后台的路径

     2.v-on接受 Pagination传递过来的childByValue值
</code></pre>
</div>
<ul>
<li>定义方法，接受childByValue值</li>
</ul>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token function">childByValue</span><span class="token punctuation">(</span><span class="token parameter">childValue</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">   <span class="token keyword">this</span><span class="token punctuation">.</span>usersData <span class="token operator">=</span> childValue<span class="token punctuation">;</span></span>
<span class="line"> <span class="token punctuation">}</span></span>
<span class="line highlighted"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>此处userData是你页面接受展示table页面是数组</p>
</div>
</li>
</ul>
</div></template>


