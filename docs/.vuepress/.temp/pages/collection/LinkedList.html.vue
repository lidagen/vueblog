<template><div><h2 id="linkedlist-源码解析-jdk8" tabindex="-1"><a class="header-anchor" href="#linkedlist-源码解析-jdk8"><span>LinkedList 源码解析 JDK8</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p><code v-pre>LinkedList</code> 是一个继承 <code v-pre>AbstractSequentialList</code>的双向链表,它也可以被当作<em>堆栈</em>、<em>队列</em>或者<em>双端队列</em>进行操作。</p>
</li>
<li>
<p><code v-pre>LinkedList</code> 实现了 <code v-pre>List</code>接口,能对它进行队列操作。</p>
</li>
<li>
<p><code v-pre>LinkedList</code> 实现了 <code v-pre>Deque</code>接口,能将它当作双端队列使用。</p>
</li>
<li>
<p><code v-pre>LinkedList</code> 实现了 <code v-pre>Cloneable</code> <code v-pre>java.io.Serializable</code>接口,意味着它能够克隆以及序列化传输。</p>
</li>
</ul>
<h3 id="变量" tabindex="-1"><a class="header-anchor" href="#变量"><span>变量</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> *集合元素数量</span>
<span class="line"> */</span></span>
<span class="line"> <span class="token keyword">transient</span> <span class="token keyword">int</span> size <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*链表头节点</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">transient</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> first<span class="token punctuation">;</span></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*链表尾节点</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">transient</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> last<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="node-结构" tabindex="-1"><a class="header-anchor" href="#node-结构"><span>Node 结构</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">class</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">E</span> item<span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> next<span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> prev<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">Node</span><span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> prev<span class="token punctuation">,</span> <span class="token class-name">E</span> element<span class="token punctuation">,</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> next<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>item <span class="token operator">=</span> element<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>next <span class="token operator">=</span> next<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>prev <span class="token operator">=</span> prev<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>Node结构,包含三个元素,数据<code v-pre>item</code>,上一个节点<code v-pre>prev</code>,下一个节点<code v-pre>next</code><br>
每个Node都包含上一个以及下一个的节点信息</p>
</div>
<h3 id="构造器" tabindex="-1"><a class="header-anchor" href="#构造器"><span>构造器</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">LinkedList</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">LinkedList</span><span class="token punctuation">(</span><span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span> <span class="token keyword">extends</span> <span class="token class-name">E</span><span class="token punctuation">></span></span> c<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">addAll</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span>        </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="api" tabindex="-1"><a class="header-anchor" href="#api"><span>API</span></a></h3>
<ul>
<li>
<p><strong>增</strong></p>
<ul>
<li>
<font color=#A23400 >addFirst(E e)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">addFirst</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">linkFirst</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">linkFirst</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> f <span class="token operator">=</span> first<span class="token punctuation">;</span><span class="token comment">//获取原来第一个</span></span>
<span class="line">  <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> newNode <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">,</span> e<span class="token punctuation">,</span> f<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  first <span class="token operator">=</span> newNode<span class="token punctuation">;</span><span class="token comment">//newNode设置为first</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>f <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token comment">//如果之前空list</span></span>
<span class="line">      last <span class="token operator">=</span> newNode<span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">else</span></span>
<span class="line">      f<span class="token punctuation">.</span>prev <span class="token operator">=</span> newNode<span class="token punctuation">;</span><span class="token comment">//原来第一个，既现在第二个的上一个指向新的Node</span></span>
<span class="line">  size<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">  modCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span>  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >addLast(E e)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">addLast</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">linkLast</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">void</span> <span class="token function">linkLast</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//跟linkFirst操作相反</span></span>
<span class="line">  <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> l <span class="token operator">=</span> last<span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> newNode <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>l<span class="token punctuation">,</span> e<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  last <span class="token operator">=</span> newNode<span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>l <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">      first <span class="token operator">=</span> newNode<span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">else</span></span>
<span class="line">      l<span class="token punctuation">.</span>next <span class="token operator">=</span> newNode<span class="token punctuation">;</span></span>
<span class="line">  size<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">  modCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span>  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >add(E e)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">linkLast</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//跟addLast一样,增加返回值</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >add(int index, E element)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">,</span> <span class="token class-name">E</span> element<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">checkPositionIndex</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//检查下标是否越界</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>index <span class="token operator">==</span> size<span class="token punctuation">)</span><span class="token comment">//index是最后一个,尾部追加</span></span>
<span class="line">        <span class="token function">linkLast</span><span class="token punctuation">(</span>element<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token function">linkBefore</span><span class="token punctuation">(</span>element<span class="token punctuation">,</span> <span class="token function">node</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//node 二分法，for循环查找下标index的元素</span></span>
<span class="line"><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> <span class="token function">node</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">     </span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>index <span class="token operator">&lt;</span> <span class="token punctuation">(</span>size <span class="token operator">>></span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> x <span class="token operator">=</span> first<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> index<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span></span>
<span class="line">            x <span class="token operator">=</span> x<span class="token punctuation">.</span>next<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> x<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> x <span class="token operator">=</span> last<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> size <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">></span> index<span class="token punctuation">;</span> i<span class="token operator">--</span><span class="token punctuation">)</span></span>
<span class="line">            x <span class="token operator">=</span> x<span class="token punctuation">.</span>prev<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> x<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">void</span> <span class="token function">linkBefore</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">,</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> succ<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> pred <span class="token operator">=</span> succ<span class="token punctuation">.</span>prev<span class="token punctuation">;</span><span class="token comment">//获取此下标的上一个</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> newNode <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>pred<span class="token punctuation">,</span> e<span class="token punctuation">,</span> succ<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//构建一个新Node</span></span>
<span class="line">      succ<span class="token punctuation">.</span>prev <span class="token operator">=</span> newNode<span class="token punctuation">;</span><span class="token comment">//把原下标的Node指向更改</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>pred <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">          first <span class="token operator">=</span> newNode<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">else</span></span>
<span class="line">          pred<span class="token punctuation">.</span>next <span class="token operator">=</span> newNode<span class="token punctuation">;</span></span>
<span class="line">      size<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">      modCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >addAll(Collection< extends E> c)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">addAll</span><span class="token punctuation">(</span><span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span> <span class="token keyword">extends</span> <span class="token class-name">E</span><span class="token punctuation">></span></span> c<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">addAll</span><span class="token punctuation">(</span>size<span class="token punctuation">,</span> c<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >addAll(int index, Collection< extends E> c)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">addAll</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">,</span> <span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span> <span class="token keyword">extends</span> <span class="token class-name">E</span><span class="token punctuation">></span></span> c<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token function">checkPositionIndex</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//检查越界 [0,size] 闭区间</span></span>
<span class="line"></span>
<span class="line">  <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> a <span class="token operator">=</span> c<span class="token punctuation">.</span><span class="token function">toArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//转化为数组</span></span>
<span class="line">  <span class="token keyword">int</span> numNew <span class="token operator">=</span> a<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>numNew <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token comment">//如果新增元素数量为0，则不增加，并返回false</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> pred<span class="token punctuation">,</span> succ<span class="token punctuation">;</span> <span class="token comment">//index节点的前置节点，后置节点</span></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>index <span class="token operator">==</span> size<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//构造器走这个条件分支,链表尾部追加数据</span></span>
<span class="line">      succ <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      pred <span class="token operator">=</span> last<span class="token punctuation">;</span><span class="token comment">//pred = 最后一个节点值</span></span>
<span class="line">  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">      succ <span class="token operator">=</span> <span class="token function">node</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//取出index节点，作为后置节点</span></span>
<span class="line">      pred <span class="token operator">=</span> succ<span class="token punctuation">.</span>prev<span class="token punctuation">;</span><span class="token comment">//前置节点是，index节点的前一个节点</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Object</span> o <span class="token operator">:</span> a<span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//链表批量增加，是靠for循环遍历原数组，依次执行插入节点操作</span></span>
<span class="line">      <span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token string">"unchecked"</span><span class="token punctuation">)</span> <span class="token class-name">E</span> e <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">E</span><span class="token punctuation">)</span> o<span class="token punctuation">;</span></span>
<span class="line">      <span class="token comment">//构造新Node,之前最后一个节点为上一个,下一个节点为Null</span></span>
<span class="line">      <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> newNode <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span><span class="token punctuation">(</span>pred<span class="token punctuation">,</span> e<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>pred <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token comment">//之前LinkedList为空,说明是头结点</span></span>
<span class="line">          first <span class="token operator">=</span> newNode<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">else</span><span class="token comment">//否则 前置节点的后置节点设置问新节点</span></span>
<span class="line">          pred<span class="token punctuation">.</span>next <span class="token operator">=</span> newNode<span class="token punctuation">;</span><span class="token comment">//给pred的next赋值newNode</span></span>
<span class="line">      pred <span class="token operator">=</span> newNode<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token keyword">if</span> <span class="token punctuation">(</span>succ <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//循环结束后，判断，如果后置节点是null。 说明此时是在队尾append的。</span></span>
<span class="line">      last <span class="token operator">=</span> pred<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span><span class="token comment">// 否则是在队中插入的节点 ，更新前置节点 后置节点</span></span>
<span class="line">      pred<span class="token punctuation">.</span>next <span class="token operator">=</span> succ<span class="token punctuation">;</span></span>
<span class="line">      succ<span class="token punctuation">.</span>prev <span class="token operator">=</span> pred<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  size <span class="token operator">+=</span> numNew<span class="token punctuation">;</span></span>
<span class="line">  modCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>删</strong></p>
<ul>
<li>
<font color=#A23400 >removeFirst()</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">removeFirst</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> f <span class="token operator">=</span> first<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>f <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">          <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NoSuchElementException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">unlinkFirst</span><span class="token punctuation">(</span>f<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">private</span> <span class="token class-name">E</span> <span class="token function">unlinkFirst</span><span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> f<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">E</span> element <span class="token operator">=</span> f<span class="token punctuation">.</span>item<span class="token punctuation">;</span><span class="token comment">//获取第一个Node的item</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> next <span class="token operator">=</span> f<span class="token punctuation">.</span>next<span class="token punctuation">;</span><span class="token comment">//拿到下一个Node</span></span>
<span class="line">      f<span class="token punctuation">.</span>item <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      f<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 置为null</span></span>
<span class="line">      first <span class="token operator">=</span> next<span class="token punctuation">;</span> <span class="token comment">//first重新指向</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>next <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token comment">//判断next是否null</span></span>
<span class="line">          last <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">else</span><span class="token comment">//next变first,它上一个为null</span></span>
<span class="line">          next<span class="token punctuation">.</span>prev <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      size<span class="token operator">--</span><span class="token punctuation">;</span></span>
<span class="line">      modCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> element<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span>  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >removeLast()</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">removeLast</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> l <span class="token operator">=</span> last<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>l <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">          <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NoSuchElementException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">unlinkLast</span><span class="token punctuation">(</span>l<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">private</span> <span class="token class-name">E</span> <span class="token function">unlinkLast</span><span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> l<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 跟unlinkFirst相反操作</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">E</span> element <span class="token operator">=</span> l<span class="token punctuation">.</span>item<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> prev <span class="token operator">=</span> l<span class="token punctuation">.</span>prev<span class="token punctuation">;</span></span>
<span class="line">      l<span class="token punctuation">.</span>item <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      l<span class="token punctuation">.</span>prev <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// help GC</span></span>
<span class="line">      last <span class="token operator">=</span> prev<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>prev <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">          first <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">else</span></span>
<span class="line">          prev<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      size<span class="token operator">--</span><span class="token punctuation">;</span></span>
<span class="line">      modCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> element<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span>  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >remove(Object o)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//for循环查找o是否与集合中元素equals</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token class-name">Object</span> o<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>o <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> x <span class="token operator">=</span> first<span class="token punctuation">;</span> x <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> x <span class="token operator">=</span> x<span class="token punctuation">.</span>next<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token keyword">if</span> <span class="token punctuation">(</span>x<span class="token punctuation">.</span>item <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                  <span class="token function">unlink</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> x <span class="token operator">=</span> first<span class="token punctuation">;</span> x <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> x <span class="token operator">=</span> x<span class="token punctuation">.</span>next<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token keyword">if</span> <span class="token punctuation">(</span>o<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>x<span class="token punctuation">.</span>item<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                  <span class="token function">unlink</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//移除item元素,重新prev next重新指向</span></span>
<span class="line"><span class="token class-name">E</span> <span class="token function">unlink</span><span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> x<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">E</span> element <span class="token operator">=</span> x<span class="token punctuation">.</span>item<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> next <span class="token operator">=</span> x<span class="token punctuation">.</span>next<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> prev <span class="token operator">=</span> x<span class="token punctuation">.</span>prev<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>prev <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//是不是第一个</span></span>
<span class="line">          first <span class="token operator">=</span> next<span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">          prev<span class="token punctuation">.</span>next <span class="token operator">=</span> next<span class="token punctuation">;</span></span>
<span class="line">          x<span class="token punctuation">.</span>prev <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>next <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span><span class="token comment">//是不是最后一个</span></span>
<span class="line">          last <span class="token operator">=</span> prev<span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">          next<span class="token punctuation">.</span>prev <span class="token operator">=</span> prev<span class="token punctuation">;</span></span>
<span class="line">          x<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">      x<span class="token punctuation">.</span>item <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      size<span class="token operator">--</span><span class="token punctuation">;</span></span>
<span class="line">      modCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> element<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span>  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >remove(int index)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">checkElementIndex</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token function">unlink</span><span class="token punctuation">(</span><span class="token function">node</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >clear()</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">clear</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token comment">// 循环 Node置null</span></span>
<span class="line">      <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> x <span class="token operator">=</span> first<span class="token punctuation">;</span> x <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> next <span class="token operator">=</span> x<span class="token punctuation">.</span>next<span class="token punctuation">;</span></span>
<span class="line">          x<span class="token punctuation">.</span>item <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">          x<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">          x<span class="token punctuation">.</span>prev <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">          x <span class="token operator">=</span> next<span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">      first <span class="token operator">=</span> last <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      size <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">      modCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>查</strong></p>
<ul>
<li>
<font color=#A23400 >getFirst()</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">getFirst</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> f <span class="token operator">=</span> first<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>f <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">          <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NoSuchElementException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> f<span class="token punctuation">.</span>item<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >getLast()</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">getLast</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> l <span class="token operator">=</span> last<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>l <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">          <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NoSuchElementException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> l<span class="token punctuation">.</span>item<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >get(int index)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">checkElementIndex</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">node</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">.</span>item<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>改</strong></p>
<ul>
<li>
<font color=#A23400 >set(int index, E element)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">,</span> <span class="token class-name">E</span> element<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">checkElementIndex</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> x <span class="token operator">=</span> <span class="token function">node</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token class-name">E</span> oldVal <span class="token operator">=</span> x<span class="token punctuation">.</span>item<span class="token punctuation">;</span></span>
<span class="line">      x<span class="token punctuation">.</span>item <span class="token operator">=</span> element<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> oldVal<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>包含contains</strong></p>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">contains</span><span class="token punctuation">(</span><span class="token class-name">Object</span> o<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token function">indexOf</span><span class="token punctuation">(</span>o<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">indexOf</span><span class="token punctuation">(</span><span class="token class-name">Object</span> o<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>o <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> x <span class="token operator">=</span> first<span class="token punctuation">;</span> x <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> x <span class="token operator">=</span> x<span class="token punctuation">.</span>next<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>x<span class="token punctuation">.</span>item <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">                <span class="token keyword">return</span> index<span class="token punctuation">;</span></span>
<span class="line">            index<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> x <span class="token operator">=</span> first<span class="token punctuation">;</span> x <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> x <span class="token operator">=</span> x<span class="token punctuation">.</span>next<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>o<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>x<span class="token punctuation">.</span>item<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">                <span class="token keyword">return</span> index<span class="token punctuation">;</span></span>
<span class="line">            index<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span>    </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>迭代器 ListIterator</strong></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">ListIterator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> <span class="token function">listIterator</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">checkPositionIndex</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ListItr</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">class</span> <span class="token class-name">ListItr</span> <span class="token keyword">implements</span> <span class="token class-name">ListIterator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> lastReturned<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> next<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">int</span> nextIndex<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">int</span> expectedModCount <span class="token operator">=</span> modCount<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">ListItr</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token comment">// assert isPositionIndex(index);</span></span>
<span class="line">        next <span class="token operator">=</span> <span class="token punctuation">(</span>index <span class="token operator">==</span> size<span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token keyword">null</span> <span class="token operator">:</span> <span class="token function">node</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        nextIndex <span class="token operator">=</span> index<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">hasNext</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> nextIndex <span class="token operator">&lt;</span> size<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">hasNext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NoSuchElementException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        lastReturned <span class="token operator">=</span> next<span class="token punctuation">;</span></span>
<span class="line">        next <span class="token operator">=</span> next<span class="token punctuation">.</span>next<span class="token punctuation">;</span></span>
<span class="line">        nextIndex<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> lastReturned<span class="token punctuation">.</span>item<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">hasPrevious</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> nextIndex <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">previous</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">hasPrevious</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NoSuchElementException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        lastReturned <span class="token operator">=</span> next <span class="token operator">=</span> <span class="token punctuation">(</span>next <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token operator">?</span> last <span class="token operator">:</span> next<span class="token punctuation">.</span>prev<span class="token punctuation">;</span></span>
<span class="line">        nextIndex<span class="token operator">--</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> lastReturned<span class="token punctuation">.</span>item<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">nextIndex</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> nextIndex<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">previousIndex</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> nextIndex <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>lastReturned <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalStateException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">Node</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> lastNext <span class="token operator">=</span> lastReturned<span class="token punctuation">.</span>next<span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">unlink</span><span class="token punctuation">(</span>lastReturned<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>next <span class="token operator">==</span> lastReturned<span class="token punctuation">)</span></span>
<span class="line">            next <span class="token operator">=</span> lastNext<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">else</span></span>
<span class="line">            nextIndex<span class="token operator">--</span><span class="token punctuation">;</span></span>
<span class="line">        lastReturned <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        expectedModCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>lastReturned <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalStateException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        lastReturned<span class="token punctuation">.</span>item <span class="token operator">=</span> e<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        lastReturned <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>next <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token function">linkLast</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">else</span></span>
<span class="line">            <span class="token function">linkBefore</span><span class="token punctuation">(</span>e<span class="token punctuation">,</span> next<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        nextIndex<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">        expectedModCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">forEachRemaining</span><span class="token punctuation">(</span><span class="token class-name">Consumer</span><span class="token generics"><span class="token punctuation">&lt;</span> <span class="token keyword">super</span> <span class="token class-name">E</span><span class="token punctuation">></span></span> action<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Objects</span><span class="token punctuation">.</span><span class="token function">requireNonNull</span><span class="token punctuation">(</span>action<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">while</span> <span class="token punctuation">(</span>modCount <span class="token operator">==</span> expectedModCount <span class="token operator">&amp;&amp;</span> nextIndex <span class="token operator">&lt;</span> size<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            action<span class="token punctuation">.</span><span class="token function">accept</span><span class="token punctuation">(</span>next<span class="token punctuation">.</span>item<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            lastReturned <span class="token operator">=</span> next<span class="token punctuation">;</span></span>
<span class="line">            next <span class="token operator">=</span> next<span class="token punctuation">.</span>next<span class="token punctuation">;</span></span>
<span class="line">            nextIndex<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">final</span> <span class="token keyword">void</span> <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>modCount <span class="token operator">!=</span> expectedModCount<span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentModificationException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li>由代码可知,要操作首位两端的数字,是比较简单的</li>
<li>对于有 <strong>(int index)</strong> 的操作,都要 <em>node(int index)</em> 循环,根据<code v-pre>next</code> <code v-pre>prev</code>指向查找下标index的元素</li>
<li>越靠近中间的数据获取速度越慢</li>
<li>LinkedList 查询慢是因为数据在内存中是<strong>不连续的</strong>,循环迭代查找起来就比较慢。</li>
</ul>
<Valine></Valine></div></template>


