<template><div><h2 id="lru算法" tabindex="-1"><a class="header-anchor" href="#lru算法"><span>LRU算法</span></a></h2>
<ul>
<li>LRU是least recently used缩写，即最少使用，是一种常用的页面置换算法</li>
<li>选择最久未使用的数据予以淘汰</li>
</ul>
<h3 id="lru思想" tabindex="-1"><a class="header-anchor" href="#lru思想"><span>LRU思想</span></a></h3>
<ul>
<li>既然有最久未使用概念，就应该有顺序。</li>
<li>数据有读和写的操作，读有命中或者未命中，写如果内存满了需要置换最久的淘汰</li>
<li>读操作如果命中，需要修改位置，确保其是最新访问</li>
<li>LRU的算法核心是哈希链表
<ul>
<li>哈希确保了查找速度</li>
<li>链表确保了有序</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**参考LinkedHashMap实现</span>
<span class="line">**/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">LruDemo</span><span class="token generics"><span class="token punctuation">&lt;</span>k<span class="token punctuation">,</span> v<span class="token punctuation">></span></span> <span class="token keyword">extends</span> <span class="token class-name">LinkedHashMap</span><span class="token generics"><span class="token punctuation">&lt;</span>k<span class="token punctuation">,</span> v<span class="token punctuation">></span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">int</span> capacity<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">LruDemo</span><span class="token punctuation">(</span><span class="token keyword">int</span> capacity<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">super</span><span class="token punctuation">(</span>capacity<span class="token punctuation">,</span> <span class="token number">0.75F</span><span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>capacity <span class="token operator">=</span> capacity<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token doc-comment comment">/**删除，如果存入的size大于定义的，删除最老使用的**/</span></span>
<span class="line">    <span class="token annotation punctuation">@Override</span></span>
<span class="line">    <span class="token keyword">protected</span> <span class="token keyword">boolean</span> <span class="token function">removeEldestEntry</span><span class="token punctuation">(</span><span class="token class-name">Map<span class="token punctuation">.</span>Entry</span><span class="token generics"><span class="token punctuation">&lt;</span>k<span class="token punctuation">,</span> v<span class="token punctuation">></span></span> eldest<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">super</span><span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">></span> capacity<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">LruDemo</span> lru <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">LruDemo</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        lru<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span><span class="token string">"a"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        lru<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">,</span><span class="token string">"a"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        lru<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">,</span><span class="token string">"a"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>lru<span class="token punctuation">.</span><span class="token function">keySet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        lru<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>lru<span class="token punctuation">.</span><span class="token function">keySet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        lru<span class="token punctuation">.</span><span class="token function">put</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">,</span><span class="token string">"a"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>lru<span class="token punctuation">.</span><span class="token function">keySet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="手写算法" tabindex="-1"><a class="header-anchor" href="#手写算法"><span>手写算法</span></a></h3>
</div></template>


