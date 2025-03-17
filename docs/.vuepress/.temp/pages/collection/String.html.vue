<template><div><h2 id="string-源码分析-jdk8" tabindex="-1"><a class="header-anchor" href="#string-源码分析-jdk8"><span>String 源码分析 JDK8</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p><code v-pre>String</code>实现了<code v-pre>Serializable</code>、 <code v-pre>Comparable</code>、 <code v-pre>CharSequence</code>接口。<code v-pre>Comparable</code>接口实现了compareTo(T 0)方法，用于比较对象大小，<code v-pre>CharSequence</code>接口对多种不同的对char访问的统一接口，包括length(), charAt(int index), subSequence(int start, int end)这几个API接口。</p>
</li>
<li>
<p><code v-pre>String</code>类是被final修饰的，表明了其定义的对象是不可变的。</p>
</li>
</ul>
<h3 id="变量" tabindex="-1"><a class="header-anchor" href="#变量"><span>变量</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"> <span class="token comment">//存储String内容</span></span>
<span class="line"> <span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">char</span> value<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"> <span class="token comment">//ash是String实例化的hashcode的一个缓存</span></span>
<span class="line"> <span class="token keyword">private</span> <span class="token keyword">int</span> hash<span class="token punctuation">;</span> <span class="token comment">// Default to 0</span></span>
<span class="line"> <span class="token comment">//CASE_INSENSITIVE_ORDER，其根本就是持有一个静态内部类，用于忽略大小写得比较两个字符串。</span></span>
<span class="line"> <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token class-name">Comparator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> <span class="token constant">CASE_INSENSITIVE_ORDER</span></span>
<span class="line">                                         <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">CaseInsensitiveComparator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><code v-pre>value[]</code>数组是存储String的内容的，所有String定义的对象，本质上保存在char类型的数组中。且final修饰的。</p>
</li>
<li>
<p><code v-pre>hash</code> String重写了hashCode方法，用于String之间的比较，String类的hash采用多项式计算得来，可能存在不同String计算得来相同的hash。也就是说，String相等的必然hash相同，但hash相同的不一定String相等。</p>
</li>
</ul>
<h3 id="构造器" tabindex="-1"><a class="header-anchor" href="#构造器"><span>构造器</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//不含参数的构造函数，一般没什么用，因为value是不可变量</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">String</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">.</span>value<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//参数为String类型</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">String</span><span class="token punctuation">(</span><span class="token class-name">String</span> original<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> original<span class="token punctuation">.</span>value<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>hash <span class="token operator">=</span> original<span class="token punctuation">.</span>hash<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//参数为char数组，使用java.utils包中的Arrays类复制</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">String</span><span class="token punctuation">(</span><span class="token keyword">char</span> value<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">copyOf</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> value<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//参数为char数组和int，复制value[] 从offset 到 offset + count</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">String</span><span class="token punctuation">(</span><span class="token keyword">char</span> value<span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span> <span class="token keyword">int</span> offset<span class="token punctuation">,</span> <span class="token keyword">int</span> count<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>offset <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">StringIndexOutOfBoundsException</span><span class="token punctuation">(</span>offset<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>count <span class="token operator">&lt;=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>count <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">StringIndexOutOfBoundsException</span><span class="token punctuation">(</span>count<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>offset <span class="token operator">&lt;=</span> value<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">.</span>value<span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">// Note: offset or count might be near -1>>>1.</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>offset <span class="token operator">></span> value<span class="token punctuation">.</span>length <span class="token operator">-</span> count<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">StringIndexOutOfBoundsException</span><span class="token punctuation">(</span>offset <span class="token operator">+</span> count<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">copyOfRange</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> offset<span class="token punctuation">,</span> offset<span class="token operator">+</span>count<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">String</span><span class="token punctuation">(</span><span class="token keyword">int</span><span class="token punctuation">[</span><span class="token punctuation">]</span> codePoints<span class="token punctuation">,</span> <span class="token keyword">int</span> offset<span class="token punctuation">,</span> <span class="token keyword">int</span> count<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>offset <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">StringIndexOutOfBoundsException</span><span class="token punctuation">(</span>offset<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>count <span class="token operator">&lt;=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>count <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">StringIndexOutOfBoundsException</span><span class="token punctuation">(</span>count<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>offset <span class="token operator">&lt;=</span> codePoints<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> <span class="token string">""</span><span class="token punctuation">.</span>value<span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">return</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">// Note: offset or count might be near -1>>>1.</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>offset <span class="token operator">></span> codePoints<span class="token punctuation">.</span>length <span class="token operator">-</span> count<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">StringIndexOutOfBoundsException</span><span class="token punctuation">(</span>offset <span class="token operator">+</span> count<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">final</span> <span class="token keyword">int</span> end <span class="token operator">=</span> offset <span class="token operator">+</span> count<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// Pass 1: Compute precise size of char[]</span></span>
<span class="line">    <span class="token keyword">int</span> n <span class="token operator">=</span> count<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> offset<span class="token punctuation">;</span> i <span class="token operator">&lt;</span> end<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> c <span class="token operator">=</span> codePoints<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">Character</span><span class="token punctuation">.</span><span class="token function">isBmpCodePoint</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">            <span class="token keyword">continue</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">Character</span><span class="token punctuation">.</span><span class="token function">isValidCodePoint</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">            n<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">else</span> <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalArgumentException</span><span class="token punctuation">(</span><span class="token class-name">Integer</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">// Pass 2: Allocate and fill in char[]</span></span>
<span class="line">    <span class="token keyword">final</span> <span class="token keyword">char</span><span class="token punctuation">[</span><span class="token punctuation">]</span> v <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">char</span><span class="token punctuation">[</span>n<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> offset<span class="token punctuation">,</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> end<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">,</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> c <span class="token operator">=</span> codePoints<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">Character</span><span class="token punctuation">.</span><span class="token function">isBmpCodePoint</span><span class="token punctuation">(</span>c<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">            v<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">char</span><span class="token punctuation">)</span>c<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">else</span></span>
<span class="line">            <span class="token class-name">Character</span><span class="token punctuation">.</span><span class="token function">toSurrogates</span><span class="token punctuation">(</span>c<span class="token punctuation">,</span> v<span class="token punctuation">,</span> j<span class="token operator">++</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">this</span><span class="token punctuation">.</span>value <span class="token operator">=</span> v<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="api" tabindex="-1"><a class="header-anchor" href="#api"><span>API</span></a></h3>
<ul>
<li>
<font color=#A23400 >**equals**</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*`equals`比较分三部分，1.比较是否相等。2.比较长度。3.char数组一个一个比较</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">equals</span><span class="token punctuation">(</span><span class="token class-name">Object</span> anObject<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">==</span> anObject<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>anObject <span class="token keyword">instanceof</span> <span class="token class-name">String</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">String</span> anotherString <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span>anObject<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">int</span> n <span class="token operator">=</span> value<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>n <span class="token operator">==</span> anotherString<span class="token punctuation">.</span>value<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">char</span> v1<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> value<span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">char</span> v2<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> anotherString<span class="token punctuation">.</span>value<span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">while</span> <span class="token punctuation">(</span>n<span class="token operator">--</span> <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">if</span> <span class="token punctuation">(</span>v1<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">!=</span> v2<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">)</span></span>
<span class="line">                    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">                i<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >**compareTo**</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*`compareTo`1.先获取两个字符串的长度，lim获取短的那个</span>
<span class="line">* 2.循环获取字符串每一个char字符比较，不相等则用原字符串char - 比较的字符串char</span>
<span class="line">* 3.在lim中,未比较出大小，则直接长度比较 原字符串len1 -len2</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">compareTo</span><span class="token punctuation">(</span><span class="token class-name">String</span> anotherString<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> len1 <span class="token operator">=</span> value<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> len2 <span class="token operator">=</span> anotherString<span class="token punctuation">.</span>value<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> lim <span class="token operator">=</span> <span class="token class-name">Math</span><span class="token punctuation">.</span><span class="token function">min</span><span class="token punctuation">(</span>len1<span class="token punctuation">,</span> len2<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">char</span> v1<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> value<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">char</span> v2<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> anotherString<span class="token punctuation">.</span>value<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">int</span> k <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">while</span> <span class="token punctuation">(</span>k <span class="token operator">&lt;</span> lim<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">char</span> c1 <span class="token operator">=</span> v1<span class="token punctuation">[</span>k<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">char</span> c2 <span class="token operator">=</span> v2<span class="token punctuation">[</span>k<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>c1 <span class="token operator">!=</span> c2<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> c1 <span class="token operator">-</span> c2<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        k<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> len1 <span class="token operator">-</span> len2<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >**hashCode**</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*`hashCode`方法，1.判断hash是否生成过值，有值直接返回，没值计算</span>
<span class="line">* 2.String为空的话 hash不计算返回0</span>
<span class="line">* 3.计算生成hash值</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">hashCode</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> h <span class="token operator">=</span> hash<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>h <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> value<span class="token punctuation">.</span>length <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">char</span> val<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> value<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> value<span class="token punctuation">.</span>length<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            h <span class="token operator">=</span> <span class="token number">31</span> <span class="token operator">*</span> h <span class="token operator">+</span> val<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        hash <span class="token operator">=</span> h<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> h<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >**startsWith**</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*`startsWith`入参有两位，prefix是要比较的值，toffset 从数组下标哪个开始</span>
<span class="line">* 1. 检查 toffset 位置是否正确,不在范围内false</span>
<span class="line">* 2. 循环比较两个char数组的值，不符合返回false</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">startsWith</span><span class="token punctuation">(</span><span class="token class-name">String</span> prefix<span class="token punctuation">,</span> <span class="token keyword">int</span> toffset<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">char</span> ta<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> value<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> <span class="token keyword">to</span> <span class="token operator">=</span> toffset<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">char</span> pa<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> prefix<span class="token punctuation">.</span>value<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> po <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> pc <span class="token operator">=</span> prefix<span class="token punctuation">.</span>value<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">// Note: toffset might be near -1>>>1.</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>toffset <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">(</span>toffset <span class="token operator">></span> value<span class="token punctuation">.</span>length <span class="token operator">-</span> pc<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">--</span>pc <span class="token operator">>=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>ta<span class="token punctuation">[</span><span class="token keyword">to</span><span class="token operator">++</span><span class="token punctuation">]</span> <span class="token operator">!=</span> pa<span class="token punctuation">[</span>po<span class="token operator">++</span><span class="token punctuation">]</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >**concat**</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">/*</span>
<span class="line">*`concat`是对字符串拼接的操作</span>
<span class="line">* 1.判断要拼接的字符串长度是否为0，是的话不操作返回原有字符串</span>
<span class="line">* 2. 新字符串拼接在原字符后面返回一个new String</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">concat</span><span class="token punctuation">(</span><span class="token class-name">String</span> str<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> otherLen <span class="token operator">=</span> str<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>otherLen <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">int</span> len <span class="token operator">=</span> value<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">char</span> buf<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">copyOf</span><span class="token punctuation">(</span>value<span class="token punctuation">,</span> len <span class="token operator">+</span> otherLen<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    str<span class="token punctuation">.</span><span class="token function">getChars</span><span class="token punctuation">(</span>buf<span class="token punctuation">,</span> len<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">(</span>buf<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >**replace**</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">/*</span>
<span class="line">*`replace`把oldChar替换成newChar</span>
<span class="line">* 1.两个要替换的相等直接返回</span>
<span class="line">* 2.从0开始循环到value.length</span>
<span class="line">* 3.当找到oldChar跳出循环,未找到则 i==len 不操作字符串</span>
<span class="line">* 4.循环替换旧值，返回new String</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">replace</span><span class="token punctuation">(</span><span class="token keyword">char</span> oldChar<span class="token punctuation">,</span> <span class="token keyword">char</span> newChar<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>oldChar <span class="token operator">!=</span> newChar<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">int</span> len <span class="token operator">=</span> value<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">char</span><span class="token punctuation">[</span><span class="token punctuation">]</span> val <span class="token operator">=</span> value<span class="token punctuation">;</span> <span class="token comment">/* avoid getfield opcode */</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token operator">++</span>i <span class="token operator">&lt;</span> len<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span>val<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">==</span> oldChar<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">break</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;</span> len<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">char</span> buf<span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token keyword">char</span><span class="token punctuation">[</span>len<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> j <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> j <span class="token operator">&lt;</span> i<span class="token punctuation">;</span> j<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                buf<span class="token punctuation">[</span>j<span class="token punctuation">]</span> <span class="token operator">=</span> val<span class="token punctuation">[</span>j<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            <span class="token keyword">while</span> <span class="token punctuation">(</span>i <span class="token operator">&lt;</span> len<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">char</span> c <span class="token operator">=</span> val<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span></span>
<span class="line">                buf<span class="token punctuation">[</span>i<span class="token punctuation">]</span> <span class="token operator">=</span> <span class="token punctuation">(</span>c <span class="token operator">==</span> oldChar<span class="token punctuation">)</span> <span class="token operator">?</span> newChar <span class="token operator">:</span> c<span class="token punctuation">;</span></span>
<span class="line">                i<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line">            <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">(</span>buf<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">this</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >**trim**</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">/*</span>
<span class="line">*`trim`</span>
<span class="line">* 1.第一个循环获取string 前面的空格</span>
<span class="line">* 2.第二个循环获取string 后面的空格</span>
<span class="line">* 3.如果有空格截取字符串</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">trim</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> len <span class="token operator">=</span> value<span class="token punctuation">.</span>length<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> st <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">char</span><span class="token punctuation">[</span><span class="token punctuation">]</span> val <span class="token operator">=</span> value<span class="token punctuation">;</span>    <span class="token comment">/* avoid getfield opcode */</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>st <span class="token operator">&lt;</span> len<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>val<span class="token punctuation">[</span>st<span class="token punctuation">]</span> <span class="token operator">&lt;=</span> <span class="token char">' '</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        st<span class="token operator">++</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">while</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>st <span class="token operator">&lt;</span> len<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span>val<span class="token punctuation">[</span>len <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">]</span> <span class="token operator">&lt;=</span> <span class="token char">' '</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        len<span class="token operator">--</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>st <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token operator">||</span> <span class="token punctuation">(</span>len <span class="token operator">&lt;</span> value<span class="token punctuation">.</span>length<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">?</span> <span class="token function">substring</span><span class="token punctuation">(</span>st<span class="token punctuation">,</span> len<span class="token punctuation">)</span> <span class="token operator">:</span> <span class="token keyword">this</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<font color=#A23400 >**intern**</font></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">*native 调用。作用如下</span>
<span class="line">* 1. 在方法区中的常量池里通过equals方法寻找等值的对象</span>
<span class="line">* 2. 如果没有找到则在常量池中开辟一片空间存放字符串并返回该对应String的引用，否则直接返回常量池中已存在String对象的引用。</span>
<span class="line">* 3. 可以为new方法创建的 字符对象 也去强制查看常量池 是否已存在</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">native</span> <span class="token class-name">String</span> <span class="token function">intern</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token class-name">String</span> a <span class="token operator">=</span> <span class="token string">"ab1"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">String</span> b <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">(</span><span class="token string">"ab1"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>a <span class="token operator">==</span> b<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//false</span></span>
<span class="line"></span>
<span class="line"><span class="token class-name">String</span> c <span class="token operator">=</span> <span class="token string">"ab1"</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">String</span> d <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">(</span><span class="token string">"ab1"</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">intern</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>c <span class="token operator">==</span> d<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">//true</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div>
<h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li>
<p><code v-pre>String a = &quot;A&quot;</code> 和 <code v-pre>String a = new String(&quot;A&quot;)</code>区别：</p>
<ul>
<li><code v-pre>String a = &quot;A&quot;</code>会在<strong>方法区</strong>常量池中创建一个对象，之后无论创建多少个值为A的字符串对象，指向都是这一个。</li>
<li><code v-pre>String a = new String(&quot;A&quot;)</code>会在<strong>堆</strong>中实例化一个新的对象，‘A’这个字符串如果常量池不存在，则还会创建一个字符串对象。之后再创建的 new String(&quot;A&quot;),都会创建新的对象。</li>
</ul>
</li>
<li>
<p>String对象的三种比较方式：</p>
<ul>
<li><code v-pre>==</code> 比较的是内存地址是否为同一个</li>
<li><code v-pre>equals</code>比较的是两个引用所指的对象值是否相等</li>
<li><code v-pre>hashCode</code>将字符串数字化，这种b比较不能保证内存一定相同，不保证字面值一定相等</li>
</ul>
</li>
</ul>
<h3 id="字符串常量池的设计思想" tabindex="-1"><a class="header-anchor" href="#字符串常量池的设计思想"><span>字符串常量池的设计思想</span></a></h3>
<ul>
<li>字符串常量池的设计初衷：每个字符串都是一个String对象，系统开发中将会频繁使用字符串，如果像其他对像那样创建销毁将极大影响程序的性能。
<ul>
<li>JVM为了提高性能和减少内存开销，在实例化字符串的时候进行了优化
<ul>
<li>为字符串开辟了一个字符串常量池，类似于缓存区</li>
<li>创建字符串常量时，首先判断字符串常量池是否存在该字符串</li>
<li>存在该字符串返回引用实例，不存在，实例化字符串，放入池中</li>
</ul>
</li>
<li>实现基础
<ul>
<li>实现该优化的基础是每个字符串常量都是final修饰的常量，不用担心常量池存在数据冲突</li>
<li>运行时实例创建的全局字符串常量池中有一个表，总是为池中每个唯一的字符串对象维护一个引用,这就意味着它们一直引用着字符串常量池中的对象，所以，在常量池中的这些字符串不会被垃圾收集器回收。</li>
</ul>
</li>
</ul>
</li>
</ul>
<h3 id="堆、栈、方法区" tabindex="-1"><a class="header-anchor" href="#堆、栈、方法区"><span>堆、栈、方法区</span></a></h3>
<ul>
<li>堆
<ul>
<li>存储的是对象，每个对象都包含一个与之对应的class</li>
<li>JVM只存在一个堆区，被所有线程共享，堆中不存在基本类型和对象引用，只存在对象本身</li>
<li>对象由垃圾回收器负责回收，因此大小和生命周期不需要确定</li>
</ul>
</li>
<li>栈
<ul>
<li>每个线程都包含一个栈区，栈区只存放基础数据类型对象和自定义对象引用</li>
<li>每个栈中的数据(原始类型和对象引用)都是私有的</li>
<li>栈分为三个部分，基本类型变量区、执行环境上下文、操作指令区（存放操作指令）</li>
<li>数据大小和生命周期是可以确定的，当没有引用指向这个数据时，这个数据就会消失</li>
</ul>
</li>
<li>方法区
<ul>
<li>静态区，跟堆一样，被所有的线程共享</li>
<li>方法区包含的都是在整个程序中永远唯一的元素，如class、static变量</li>
</ul>
</li>
</ul>
</div></template>


