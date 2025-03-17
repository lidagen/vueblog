<template><div><h2 id="arraylist-源码解析-jdk8" tabindex="-1"><a class="header-anchor" href="#arraylist-源码解析-jdk8"><span>ArrayList 源码解析 JDK8</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p><code v-pre>ArrayList</code> 是一个 <strong>动态数组</strong>,其底层是数组。它实现了 <code v-pre>AbstractList</code> <code v-pre>List</code> <code v-pre>RandomAccess</code> <code v-pre>Cloneable</code> <code v-pre>java.io.Serializable</code>
几个接口、抽象类。</p>
</li>
<li>
<p><code v-pre>ArrayList</code> 继承了 <code v-pre>AbstractList</code>,实现了 <code v-pre>List</code> 。它是一个数组队列，提供了相关的<em>添加</em>、<em>删除</em>、<em>修改</em>、<em>遍历</em>等功能</p>
</li>
<li>
<p><code v-pre>ArrayList</code> 实现<code v-pre>RandomAccess</code>接口 ,支持<strong>快速随机访问</strong>。ArrayList实现了,LinkedList未实现,它的作用是 <em>Collections.binarySearch()</em> 方法中,通过 <em>instanceof</em> 判断遍历集合的方式。
实现了此接口,for 循环遍历,否则 Iterator 迭代遍历查找元素。</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token keyword">int</span> <span class="token function">binarySearch</span><span class="token punctuation">(</span><span class="token class-name">List</span> <span class="token operator">?</span> <span class="token keyword">extends</span> <span class="token class-name">Comparable</span> <span class="token operator">?</span> <span class="token keyword">super</span> <span class="token class-name">T</span> list<span class="token punctuation">,</span> <span class="token class-name">T</span> key<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>list <span class="token keyword">instanceof</span> <span class="token class-name">RandomAccess</span> <span class="token operator">||</span> list<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token operator">&lt;</span><span class="token constant">BINARYSEARCH_THRESHOLD</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token class-name">Collections</span><span class="token punctuation">.</span><span class="token function">indexedBinarySearch</span><span class="token punctuation">(</span>list<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token class-name">Collections</span><span class="token punctuation">.</span><span class="token function">iteratorBinarySearch</span><span class="token punctuation">(</span>list<span class="token punctuation">,</span> key<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><code v-pre>ArrayList</code> 实现了 <code v-pre>Cloneable</code>接口。支持克隆</p>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li><code v-pre>cloneable</code>其实就是一个标记接口，只有实现这个接口后，然后在类中重写Object中的clone方法，然后通过类调用clone方法才能克隆成功.</li>
<li>如何判断类实现了 <code v-pre>cloneable</code>接口?<br>
<strong>native</strong>关键字,每一个native方法在jvm中都有一个同名的实现体，native方法在逻辑上的判断都是由实现体实现的.
判断是否实现cloneable接口，是在调用jvm中的实现体时进行判断的。</li>
</ul>
</div>
<ul>
<li>
<p><code v-pre>ArrayList</code>是默认大小为 10 的数组,扩容为原来容量的 1.5 倍。由于其扩容是个<strong>消耗较大的操作</strong>,所以在<strong>已知数据大小</strong>的前提下,指定容器大小。或者在需要扩容时,手动调用 <code v-pre>public void ensureCapacity(int minCapacity) {}</code>方法。</p>
</li>
<li>
<p><code v-pre>ArrayList</code>特点时增删慢,查询快。</p>
<ul>
<li><strong>查询</strong>时,直接根据下标直接获取。<font color=#900000 >复杂度 O(1)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token class-name">E</span> <span class="token function">elementData</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">E</span><span class="token punctuation">)</span> elementData<span class="token punctuation">[</span>index<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>增加</strong>时,<em>add(element)</em> 会先确认容量是否足够,不够需要扩容。<em>add(index,element)</em> 查询后添加,插入位置后的元素都需要往后移一位。需要调用 <em>System.arraycopy()</em> 方法对数组进行复制操作。<font color=#900000 >复杂度 O(n)</font></li>
<li><strong>删除</strong>时,也会移动删除位置后的元素,调用 <em>System.arraycopy()</em>,对数组进行重排。 <font color=#900000 >复杂度 O(n)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">,</span> <span class="token class-name">E</span> element<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">rangeCheckForAdd</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">      <span class="token function">ensureCapacityInternal</span><span class="token punctuation">(</span>size <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// Increments modCount!!</span></span>
<span class="line">      <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> index<span class="token punctuation">,</span> elementData<span class="token punctuation">,</span> index <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">                       size <span class="token operator">-</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      elementData<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> element<span class="token punctuation">;</span></span>
<span class="line">      size<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="变量" tabindex="-1"><a class="header-anchor" href="#变量"><span>变量</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">// 默认初始化容量</span></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">int</span> <span class="token constant">DEFAULT_CAPACITY</span> <span class="token operator">=</span> <span class="token number">10</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">// 空的数组</span></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token constant">EMPTY_ELEMENTDATA</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">// 默认容量的空数组</span></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span>  <span class="token constant">DEFAULTCAPACITY_EMPTY_ELEMENTDATA</span> <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">// 真正存放对象的数组</span></span>
<span class="line"><span class="token keyword">transient</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> elementData<span class="token punctuation">;</span> </span>
<span class="line"><span class="token comment">// 容器的大小</span></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">int</span> size<span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="构造器" tabindex="-1"><a class="header-anchor" href="#构造器"><span>构造器</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**默认无参构造器的容器**/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">ArrayList</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">this</span><span class="token punctuation">.</span>elementData <span class="token operator">=</span> <span class="token constant">DEFAULTCAPACITY_EMPTY_ELEMENTDATA</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token doc-comment comment">/**指定一个初始大小的容器**/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">ArrayList</span><span class="token punctuation">(</span><span class="token keyword">int</span> initialCapacity<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>initialCapacity <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">this</span><span class="token punctuation">.</span>elementData <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">[</span>initialCapacity<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>initialCapacity <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">this</span><span class="token punctuation">.</span>elementData <span class="token operator">=</span> <span class="token constant">EMPTY_ELEMENTDATA</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalArgumentException</span><span class="token punctuation">(</span><span class="token string">"Illegal Capacity: "</span><span class="token operator">+</span></span>
<span class="line">                                             initialCapacity<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token doc-comment comment">/**使用集合类来构建ArrayList**/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">ArrayList</span><span class="token punctuation">(</span><span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span> <span class="token keyword">extends</span> <span class="token class-name">E</span><span class="token punctuation">></span></span> c<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      elementData <span class="token operator">=</span> c<span class="token punctuation">.</span><span class="token function">toArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token comment">//因为size代表的是集合元素数量，通过集合类构造ArrayList时,给size赋值</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>size <span class="token operator">=</span> elementData<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// 这里是当c.toArray出错,利用Arrays.copyOf 来复制集合c中的元素到elementData数组中</span></span>
<span class="line">          <span class="token keyword">if</span> <span class="token punctuation">(</span>elementData<span class="token punctuation">.</span><span class="token function">getClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span></span>
<span class="line">              elementData <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">copyOf</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> size<span class="token punctuation">,</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// size=0时</span></span>
<span class="line">          <span class="token keyword">this</span><span class="token punctuation">.</span>elementData <span class="token operator">=</span> <span class="token constant">EMPTY_ELEMENTDATA</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">  <span class="token punctuation">}</span>  </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>实例化ArrayList后,会构建出数组 <em>elementData</em> 和数量 <em>size</em></p>
</div>
<h3 id="api" tabindex="-1"><a class="header-anchor" href="#api"><span>API</span></a></h3>
<ul>
<li>
<p><strong>增</strong></p>
<ul>
<li>
<font color=#A23400 >add(E e)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">ensureCapacityInternal</span><span class="token punctuation">(</span>size <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 判断是否需要扩容</span></span>
<span class="line">    elementData<span class="token punctuation">[</span>size<span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">=</span> e<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >add(int index, E element)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">,</span> <span class="token class-name">E</span> element<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">rangeCheckForAdd</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//检查下标是否越界</span></span>
<span class="line">    <span class="token function">ensureCapacityInternal</span><span class="token punctuation">(</span>size <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 判断是否需要扩容</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> index<span class="token punctuation">,</span> elementData<span class="token punctuation">,</span> index <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span></span>
<span class="line">                     size <span class="token operator">-</span> index<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//copy数组,index后数据后移一位</span></span>
<span class="line">    elementData<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> element<span class="token punctuation">;</span></span>
<span class="line">    size<span class="token operator">++</span><span class="token punctuation">;</span><span class="token comment">//size+1</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >addAll(Collection< extends E> c)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">addAll</span><span class="token punctuation">(</span><span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span> <span class="token keyword">extends</span> <span class="token class-name">E</span><span class="token punctuation">></span></span> c<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> a <span class="token operator">=</span> c<span class="token punctuation">.</span><span class="token function">toArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> numNew <span class="token operator">=</span> a<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">    <span class="token function">ensureCapacityInternal</span><span class="token punctuation">(</span>size <span class="token operator">+</span> numNew<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 判断是否需要扩容</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> elementData<span class="token punctuation">,</span> size<span class="token punctuation">,</span> numNew<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    size <span class="token operator">+=</span> numNew<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> numNew <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >addAll(int index, Collection< extends E> c) </font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">addAll</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">,</span> <span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span> <span class="token keyword">extends</span> <span class="token class-name">E</span><span class="token punctuation">></span></span> c<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token function">rangeCheckForAdd</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//检查index是否越界</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> a <span class="token operator">=</span> c<span class="token punctuation">.</span><span class="token function">toArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> numNew <span class="token operator">=</span> a<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">    <span class="token function">ensureCapacityInternal</span><span class="token punctuation">(</span>size <span class="token operator">+</span> numNew<span class="token punctuation">)</span><span class="token punctuation">;</span>  <span class="token comment">// 判断是否需要扩容</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">int</span> numMoved <span class="token operator">=</span> size <span class="token operator">-</span> index<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>numMoved <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token comment">//index在中间</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> index<span class="token punctuation">,</span> elementData<span class="token punctuation">,</span> index <span class="token operator">+</span> numNew<span class="token punctuation">,</span></span>
<span class="line">                         numMoved<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">//index 最后一位</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> elementData<span class="token punctuation">,</span> index<span class="token punctuation">,</span> numNew<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    size <span class="token operator">+=</span> numNew<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> numNew <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p><code v-pre>rangeCheckForAdd(int index)</code> 检查下标是否越界
<code v-pre>ensureCapacityInternal(int index)</code> 此方法判断入参index-elementData.length &gt; 0,如果是，调用grow()方法对数组扩容</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">grow</span><span class="token punctuation">(</span><span class="token keyword">int</span> minCapacity<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// overflow-conscious code</span></span>
<span class="line">    <span class="token keyword">int</span> oldCapacity <span class="token operator">=</span> elementData<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> newCapacity <span class="token operator">=</span> oldCapacity <span class="token operator">+</span> <span class="token punctuation">(</span>oldCapacity <span class="token operator">>></span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>newCapacity <span class="token operator">-</span> minCapacity <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">        newCapacity <span class="token operator">=</span> minCapacity<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>newCapacity <span class="token operator">-</span> <span class="token constant">MAX_ARRAY_SIZE</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">        newCapacity <span class="token operator">=</span> <span class="token function">hugeCapacity</span><span class="token punctuation">(</span>minCapacity<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// minCapacity is usually close to size, so this is a win:</span></span>
<span class="line">    elementData <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">copyOf</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> newCapacity<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div>
</li>
</ul>
</li>
<li>
<p><strong>删</strong></p>
<ul>
<li>
<font color=#A23400 >remove(int index)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token function">rangeCheck</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//下标越界检查</span></span>
<span class="line">      modCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token class-name">E</span> oldValue <span class="token operator">=</span> <span class="token function">elementData</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//获取原来的元素</span></span>
<span class="line">      <span class="token keyword">int</span> numMoved <span class="token operator">=</span> size <span class="token operator">-</span> index <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>numMoved <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token comment">//判断index是否最后一个元素</span></span>
<span class="line">          <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> index<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">,</span> elementData<span class="token punctuation">,</span> index<span class="token punctuation">,</span></span>
<span class="line">                           numMoved<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      elementData<span class="token punctuation">[</span><span class="token operator">--</span>size<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// 清除最后一个</span></span>
<span class="line">      <span class="token keyword">return</span> oldValue<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >remove(Object o)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//分为null和非null,处理流程相同,非null equals比较null == 比较</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">remove</span><span class="token punctuation">(</span><span class="token class-name">Object</span> o<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>o <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> index <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> index<span class="token operator">++</span><span class="token punctuation">)</span></span>
<span class="line">              <span class="token keyword">if</span> <span class="token punctuation">(</span>elementData<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                  <span class="token function">fastRemove</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> index <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> index<span class="token operator">++</span><span class="token punctuation">)</span></span>
<span class="line">              <span class="token keyword">if</span> <span class="token punctuation">(</span>o<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>elementData<span class="token punctuation">[</span>index<span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                  <span class="token function">fastRemove</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                  <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >removeAll(Collection<> c)</font> 剔除在指定集合中的元素</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">removeAll</span><span class="token punctuation">(</span><span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span> c<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token class-name">Objects</span><span class="token punctuation">.</span><span class="token function">requireNonNull</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//判断元素不为null</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">batchRemove</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >retainAll(Collection<> c)</font> 剔除不在指定集合的元素</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">retainAll</span><span class="token punctuation">(</span><span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span> c<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token class-name">Objects</span><span class="token punctuation">.</span><span class="token function">requireNonNull</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">batchRemove</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p><code v-pre>fastRemove(int index)</code> 快速移除元素,与<code v-pre>public E remove(int index)</code>区别就是少了校验和获取<em>oldValue</em>操作</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">fastRemove</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      modCount<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">int</span> numMoved <span class="token operator">=</span> size <span class="token operator">-</span> index <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>numMoved <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">          <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> index<span class="token operator">+</span><span class="token number">1</span><span class="token punctuation">,</span> elementData<span class="token punctuation">,</span> index<span class="token punctuation">,</span></span>
<span class="line">                           numMoved<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      elementData<span class="token punctuation">[</span><span class="token operator">--</span>size<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// clear to let GC do its work</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>batchRemove(Collection&lt;&gt; c, boolean complement)</code> 集合操作： <code v-pre>removeAll(Collection&lt;&gt; c)</code> 和 <code v-pre>retainAll(Collection&lt;&gt; c)</code>都用了此方法，区别是
第二个参数一个是 <em>true</em> 一个 <em>false</em></p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">private</span> <span class="token keyword">boolean</span> <span class="token function">batchRemove</span><span class="token punctuation">(</span><span class="token class-name">Collection</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">></span></span> c<span class="token punctuation">,</span> <span class="token keyword">boolean</span> complement<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">final</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> elementData <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>elementData<span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">int</span> r <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">,</span> w <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span><span class="token comment">//w 代表批量删除后 数组还剩多少元素</span></span>
<span class="line">      <span class="token keyword">boolean</span> modified <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span> r <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> r<span class="token operator">++</span><span class="token punctuation">)</span></span>
<span class="line">      <span class="token comment">//这块代码很精妙</span></span>
<span class="line">      <span class="token doc-comment comment">/**c.contains(elementData[r])返回boolean值,表示c中有没有elementData[i]元素</span>
<span class="line">      *当batchRemove(c, true),如果包含成立,包含的保存 ,移除非入参的集合内容=> retainAll</span>
<span class="line">      *当batchRemove(c, false),如果不包含成立,不包含的保存,移除入参集合元素 =>removeAll</span>
<span class="line">      **/</span></span>
<span class="line">          <span class="token keyword">if</span> <span class="token punctuation">(</span>c<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>elementData<span class="token punctuation">[</span>r<span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token operator">==</span> complement<span class="token punctuation">)</span></span>
<span class="line">              elementData<span class="token punctuation">[</span>w<span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">=</span> elementData<span class="token punctuation">[</span>r<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// 如果出现异常处理情况</span></span>
<span class="line">          <span class="token keyword">if</span> <span class="token punctuation">(</span>r <span class="token operator">!=</span> size<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">arraycopy</span><span class="token punctuation">(</span>elementData<span class="token punctuation">,</span> r<span class="token punctuation">,</span></span>
<span class="line">                               elementData<span class="token punctuation">,</span> w<span class="token punctuation">,</span></span>
<span class="line">                               size <span class="token operator">-</span> r<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">              w <span class="token operator">+=</span> size <span class="token operator">-</span> r<span class="token punctuation">;</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">          <span class="token keyword">if</span> <span class="token punctuation">(</span>w <span class="token operator">!=</span> size<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token comment">// clear to let GC do its work</span></span>
<span class="line">              <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> w<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> size<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span></span>
<span class="line">                  elementData<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">              modCount <span class="token operator">+=</span> size <span class="token operator">-</span> w<span class="token punctuation">;</span></span>
<span class="line">              size <span class="token operator">=</span> w<span class="token punctuation">;</span></span>
<span class="line">              modified <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">      <span class="token keyword">return</span> modified<span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div>
</li>
<li>
<p><strong>改</strong></p>
<ul>
<li>
<font color=#A23400 >set(int index, E element)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">,</span> <span class="token class-name">E</span> element<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token function">rangeCheck</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//越界检查</span></span>
<span class="line">  <span class="token class-name">E</span> oldValue <span class="token operator">=</span> <span class="token function">elementData</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//取出元素 </span></span>
<span class="line">  elementData<span class="token punctuation">[</span>index<span class="token punctuation">]</span> <span class="token operator">=</span> element<span class="token punctuation">;</span><span class="token comment">//覆盖元素</span></span>
<span class="line">  <span class="token keyword">return</span> oldValue<span class="token punctuation">;</span><span class="token comment">//返回元素</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>查</strong></p>
<ul>
<li>
<font color=#A23400 >get(int index)</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token function">rangeCheck</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span><span class="token comment">//越界检查</span></span>
<span class="line">  <span class="token keyword">return</span> <span class="token function">elementData</span><span class="token punctuation">(</span>index<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//下标取数据</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>迭代器 ListIterator</strong></p>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">ListIterator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> <span class="token function">listIterator</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">ListItr</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">class</span> <span class="token class-name">ListItr</span> <span class="token keyword">extends</span> <span class="token class-name">Itr</span> <span class="token keyword">implements</span> <span class="token class-name">ListIterator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">E</span><span class="token punctuation">></span></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">ListItr</span><span class="token punctuation">(</span><span class="token keyword">int</span> index<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">super</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        cursor <span class="token operator">=</span> index<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">hasPrevious</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> cursor <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">nextIndex</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> cursor<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">previousIndex</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> cursor <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@SuppressWarnings</span><span class="token punctuation">(</span><span class="token string">"unchecked"</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">E</span> <span class="token function">previous</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">int</span> i <span class="token operator">=</span> cursor <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">NoSuchElementException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span> elementData <span class="token operator">=</span> <span class="token class-name">ArrayList</span><span class="token punctuation">.</span><span class="token keyword">this</span><span class="token punctuation">.</span>elementData<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">>=</span> elementData<span class="token punctuation">.</span>length<span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentModificationException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        cursor <span class="token operator">=</span> i<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">E</span><span class="token punctuation">)</span> elementData<span class="token punctuation">[</span>lastRet <span class="token operator">=</span> i<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">set</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>lastRet <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalStateException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">ArrayList</span><span class="token punctuation">.</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span>lastRet<span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">IndexOutOfBoundsException</span> ex<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentModificationException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">add</span><span class="token punctuation">(</span><span class="token class-name">E</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">checkForComodification</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">int</span> i <span class="token operator">=</span> cursor<span class="token punctuation">;</span></span>
<span class="line">            <span class="token class-name">ArrayList</span><span class="token punctuation">.</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>i<span class="token punctuation">,</span> e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            cursor <span class="token operator">=</span> i <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">            lastRet <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">            expectedModCount <span class="token operator">=</span> modCount<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">IndexOutOfBoundsException</span> ex<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">ConcurrentModificationException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li>
<p><strong>修改</strong>和<strong>查询</strong>直接根据数组下标操作,是高效的,尾部追加的<strong>增加</strong><code v-pre>add(E e)</code>,不扩容情况下也是高效的。</p>
</li>
<li>
<p><strong>增加</strong>会因为<strong>扩容</strong>导致数组复制, 以及<strong>增加，删除</strong>都会调用<code v-pre>System.arraycopy</code>实现数组之间的复制。相对低效</p>
</li>
</ul>
</div></template>


