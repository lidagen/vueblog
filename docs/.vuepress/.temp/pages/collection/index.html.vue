<template><div><h2 id="jdk8-函数式编程" tabindex="-1"><a class="header-anchor" href="#jdk8-函数式编程"><span>JDK8 函数式编程</span></a></h2>
<h3 id="lambda表达式" tabindex="-1"><a class="header-anchor" href="#lambda表达式"><span>lambda表达式</span></a></h3>
<ul>
<li>lambda表达式即匿名函数，它是一段没有函数名的函数体，可以作为参数直接传递给相关调用者.</li>
<li>Lambda 表达式通常使用 (argument) -&gt; (body) 语法书写：</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//有参数,且有返回值</span></span>
<span class="line"><span class="token punctuation">(</span><span class="token keyword">int</span> a<span class="token punctuation">,</span> <span class="token keyword">int</span> b<span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token punctuation">{</span>  <span class="token keyword">return</span> a <span class="token operator">+</span> b<span class="token punctuation">;</span> <span class="token punctuation">}</span></span>
<span class="line"><span class="token comment">//无参无返回值</span></span>
<span class="line"><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"Hello World"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//有参无返回值</span></span>
<span class="line"><span class="token punctuation">(</span><span class="token class-name">String</span> s<span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token punctuation">{</span> <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>s<span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span></span>
<span class="line"><span class="token comment">// 无参有返回值</span></span>
<span class="line"><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token number">3.1415</span> <span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>使用,例：</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">// 定义一个函数式接口</span></span>
<span class="line"><span class="token annotation punctuation">@FunctionalInterface</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">interface</span> <span class="token class-name">MyMap</span><span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">int</span> <span class="token function">getKV</span><span class="token punctuation">(</span><span class="token keyword">int</span> k<span class="token punctuation">,</span> <span class="token keyword">int</span> v<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// 调用</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">MyMap</span> myMap <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token keyword">int</span> a<span class="token punctuation">,</span><span class="token keyword">int</span> b<span class="token punctuation">)</span><span class="token operator">-></span> a <span class="token operator">+</span> b<span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> kv <span class="token operator">=</span> myMap<span class="token punctuation">.</span><span class="token function">getKV</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">,</span> <span class="token number">6</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>kv<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>Lambda 表达式的结构:</p>
<ul>
<li>一个 Lambda 表达式可以有零个或多个参数。</li>
<li>参数的类型既可以明确声明，也可以根据上下文来推断。例如：(int a)与(a)效果相同。</li>
<li>所有参数需包含在圆括号内，参数之间用逗号相隔。例如：(a, b) 或 (int a, int b) 或 (String a, int b, float c)</li>
<li>空圆括号代表参数集为空。例如：() -&gt; 42</li>
<li>当只有一个参数，且其类型可推导时，圆括号（）可省略。例如：a -&gt; return a*a</li>
<li>Lambda 表达式的主体可包含零条或多条语句。</li>
<li>如果 Lambda 表达式的主体只有一条语句，花括号{}可省略。匿名函数的返回类型与该主体表达式一致。</li>
<li>如果 Lambda 表达式的主体包含一条以上语句，则表达式必须包含在花括号{}中（形成代码块）。匿名函数的返回类型与代码块的返回类型一致，若没有返回则为空。</li>
</ul>
</li>
<li>
<p>方法引用：是Java 8中提出的用来简化lambda表达式的一种手段。它通过类名和方法名来定位到一个静态方法或者实例方法。 方法引用在Java 8中的使用非常灵活。总的来说，可以分为以下几种：</p>
<ul>
<li>静态方法引用：<code v-pre>ClassName::methodName</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">></span></span> ints <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">ints<span class="token punctuation">.</span><span class="token function">sort</span><span class="token punctuation">(</span><span class="token class-name">Integer</span><span class="token operator">::</span><span class="token function">compare</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>实例上的实例方法引用：<code v-pre> instanceReference::methodName</code> 方法引用使用”::”定义，”::”的前半部分表示类名或者实例名，后半部分表示方法名称。如果是构造函数，则使用new表示。</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line">words<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token operator">::</span><span class="token function">println</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">words<span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>word <span class="token operator">-></span> word<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// lambda</span></span>
<span class="line">words<span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token operator">::</span><span class="token function">length</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token comment">// method reference</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">// lambda</span></span>
<span class="line">words<span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>word <span class="token operator">-></span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token keyword">new</span> <span class="token class-name">StringBuilder</span><span class="token punctuation">(</span>word<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">// constructor reference</span></span>
<span class="line">words<span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span><span class="token class-name">StringBuilder</span><span class="token operator">::</span><span class="token keyword">new</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="函数式接口" tabindex="-1"><a class="header-anchor" href="#函数式接口"><span>函数式接口</span></a></h3>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>函数式接口：它指的是有且只有一个未实现的方法的接口，一般通过<code v-pre>@FunctionalInterface</code>这个注解来表明某个接口是一个函数式接口。函数式接口是Java支持函数式编程的基础。</p>
</div>
<ul>
<li><code v-pre>Consumer&lt;T&gt;</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token operator">-</span> <span class="token class-name">T</span>：入参类型；没有出参</span>
<span class="line"><span class="token operator">-</span> 调用方法：<span class="token keyword">void</span> <span class="token function">accept</span><span class="token punctuation">(</span><span class="token class-name">T</span> t<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token operator">-</span> 定义函数示例：<span class="token class-name">Consumer</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> consumer<span class="token operator">=</span> p <span class="token operator">-></span> <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>p<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token operator">-</span> 调用函数示例：consumer<span class="token punctuation">.</span><span class="token function">accept</span><span class="token punctuation">(</span><span class="token string">"a b c"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>Function&lt;T, R&gt; </code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token operator">-</span> <span class="token class-name">T</span><span class="token operator">:</span> 入参类型<span class="token punctuation">;</span><span class="token class-name">R</span><span class="token operator">:</span>出参类型</span>
<span class="line"><span class="token operator">-</span> 调用方法：<span class="token class-name">R</span> <span class="token function">apply</span><span class="token punctuation">(</span><span class="token class-name">T</span> t<span class="token punctuation">)</span><span class="token punctuation">;</span> </span>
<span class="line"><span class="token operator">-</span> 定义函数示例：<span class="token class-name">Function</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">,</span> <span class="token class-name">Integer</span><span class="token punctuation">></span></span> func <span class="token operator">=</span> p <span class="token operator">-></span> p <span class="token operator">*</span> <span class="token number">10</span><span class="token punctuation">;</span> </span>
<span class="line"><span class="token operator">-</span> 调用函数示例：func<span class="token punctuation">.</span><span class="token function">apply</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">)</span><span class="token punctuation">;</span> </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>Predicate&lt;T&gt;</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token operator">-</span> <span class="token class-name">T</span>：入参类型；出参类型是<span class="token class-name">Boolean</span></span>
<span class="line"><span class="token operator">-</span> 调用方法：<span class="token keyword">boolean</span> <span class="token function">test</span><span class="token punctuation">(</span><span class="token class-name">T</span> t<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token operator">-</span> 定义函数示例：<span class="token class-name">Predicate</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">></span></span> predicate <span class="token operator">=</span> p <span class="token operator">-></span> p <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">;</span>  </span>
<span class="line"><span class="token operator">-</span> 调用函数示例：predicate<span class="token punctuation">.</span><span class="token function">test</span><span class="token punctuation">(</span><span class="token number">100</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>Supplier&lt;T&gt;</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token operator">-</span> <span class="token class-name">T</span>：出参类型；没有入参</span>
<span class="line"><span class="token operator">-</span> 调用方法：<span class="token class-name">T</span> <span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token operator">-</span> 定义函数示例：<span class="token class-name">Supplier</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">></span></span> supplier<span class="token operator">=</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token number">100</span><span class="token punctuation">;</span>  </span>
<span class="line"><span class="token operator">-</span> 调用函数示例：supplier<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="函数式编程接口的使用" tabindex="-1"><a class="header-anchor" href="#函数式编程接口的使用"><span>函数式编程接口的使用</span></a></h3>
<h3 id="stream" tabindex="-1"><a class="header-anchor" href="#stream"><span><code v-pre>Stream </code></span></a></h3>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>Stream可以对多个元素进行一系列的操作，也可以支持对某些操作进行并发处理。</p>
</div>
<ul>
<li><code v-pre>Stream</code>对象的创建:</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//a: 创建空的Stream对象</span></span>
<span class="line"><span class="token class-name">Stream</span> stream <span class="token operator">=</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">empty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//b: 通过集合类中的stream或者parallelStream方法创建</span></span>
<span class="line"><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> list <span class="token operator">=</span> <span class="token class-name">Arrays</span><span class="token punctuation">.</span><span class="token function">asList</span><span class="token punctuation">(</span><span class="token string">"a"</span><span class="token punctuation">,</span> <span class="token string">"b"</span><span class="token punctuation">,</span> <span class="token string">"c"</span><span class="token punctuation">,</span> <span class="token string">"d"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">Stream</span> listStream <span class="token operator">=</span> list<span class="token punctuation">.</span><span class="token function">stream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>                   <span class="token comment">//获取串行的Stream对象</span></span>
<span class="line"><span class="token class-name">Stream</span> parallelListStream <span class="token operator">=</span> list<span class="token punctuation">.</span><span class="token function">parallelStream</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>   <span class="token comment">//获取并行的Stream对象  </span></span>
<span class="line"><span class="token comment">//c:通过Stream中的of方法创建</span></span>
<span class="line"><span class="token class-name">Stream</span> s <span class="token operator">=</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token class-name">Stream</span> s1 <span class="token operator">=</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">"a"</span><span class="token punctuation">,</span> <span class="token string">"b"</span><span class="token punctuation">,</span> <span class="token string">"c"</span><span class="token punctuation">,</span> <span class="token string">"d"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//d:通过Stream中的iterate方法创建</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token function">iterate</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">T</span> seed<span class="token punctuation">,</span> <span class="token keyword">final</span> <span class="token class-name">UnaryOperator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> f<span class="token punctuation">)</span><span class="token punctuation">;</span>  </span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token function">iterate</span><span class="token punctuation">(</span><span class="token class-name">T</span> seed<span class="token punctuation">,</span> <span class="token class-name">Predicate</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">super</span> <span class="token class-name">T</span><span class="token punctuation">></span></span> hasNext<span class="token punctuation">,</span> <span class="token class-name">UnaryOperator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> next<span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>Stream</code>对象的使用
Stream对象提供多个非常有用的方法，这些方法可以分成两类：
<ul>
<li>中间操作：将原始的Stream转换成另外一个Stream；如filter返回的是过滤后的Stream。</li>
<li>终端操作：产生的是一个结果或者其它的复合操作；如count或者forEach操作。</li>
</ul>
</li>
</ul>
<p><strong>所有中间操作</strong>
方法 | 说明</p>
<ul>
<li>| :-: | :-: | :-: | -:
sequential | 返回一个相等的串行的Stream对象，如果原Stream对象已经是串行就可能会返回原对象
parallel | 返回一个相等的并行的Stream对象，如果原Stream对象已经是并行的就会返回原对象
unordered | 返回一个不关心顺序的Stream对象，如果原对象已经是这类型的对象就会返回原对象
onClose | 返回一个相等的Steam对象，同时新的Stream对象在执行Close方法时会调用传入的Runnable对象
close | 关闭Stream对象
filter | 元素过滤：对Stream对象按指定的Predicate进行过滤，返回的Stream对象中仅包含未被过滤的元素
map | 元素一对一转换：使用传入的Function对象对Stream中的所有元素进行处理，返回的Stream对象中的元素为原元素处理后的结果
mapToInt | 元素一对一转换：将原Stream中的使用传入的IntFunction加工后返回一个IntStream对象
flatMap | 元素一对多转换：对原Stream中的所有元素进行操作，每个元素会有一个或者多个结果，然后将返回的所有元素组合成一个统一的Stream并返回
distinct | 去重：返回一个去重后的Stream对象
sorted | 排序：返回排序后的Stream对象
peek | 使用传入的Consumer对象对所有元素进行消费后，返回一个新的包含所有原来元素的Stream对象
limit | 获取有限个元素组成新的Stream对象返回
skip | 抛弃前指定个元素后使用剩下的元素组成新的Stream返回</li>
</ul>
<p><strong>所有终端操作</strong>
方法 | 说明</p>
<ul>
<li>
<p>| :-: | :-: | :-: | -:
iterator | 返回Stream中所有对象的迭代器
spliterator | 返回对所有对象进行的spliterator对象
forEach | 对所有元素进行迭代处理，无返回值
forEachOrdered | 按Stream的Encounter所决定的序列进行迭代处理，无返回值
toArray | 返回所有元素的数组
reduce | 使用一个初始化的值，与Stream中的元素一一做传入的二合运算后返回最终的值。每与一个元素做运算后的结果，再与下一个元素做运算。它不保证会按序列执行整个过程。
collect | 根据传入参数做相关汇聚计算
min | 返回所有元素中最小值的Optional对象；如果Stream中无任何元素，那么返回的Optional对象为Empty
max | 与Min相反
count | 所有元素个数
anyMatch | 只要其中有一个元素满足传入的Predicate时返回True，否则返回False
allMatch | 所有元素均满足传入的Predicate时返回True，否则False
noneMatch | 所有元素均不满足传入的Predicate时返回True，否则False
findFirst | 返回第一个元素的Optioanl对象；如果无元素返回的是空的Optional； 如果Stream是无序的，那么任何元素都可能被返回
findAny | 返回任意一个元素的Optional对象，如果无元素返回的是空的Optioanl。
isParallel | 判断是否当前Stream对象是并行的</p>
</li>
<li>
<p>常用的方法举例：</p>
<ul>
<li><code v-pre>filter</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//方法定义</span></span>
<span class="line"><span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> <span class="token function">filter</span><span class="token punctuation">(</span><span class="token class-name">Predicate</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">super</span> <span class="token class-name">T</span><span class="token punctuation">></span></span> predicate<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//使用示例：</span></span>
<span class="line"><span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> s <span class="token operator">=</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">,</span> <span class="token string">"t1"</span><span class="token punctuation">,</span> <span class="token string">"t2"</span><span class="token punctuation">,</span> <span class="token string">"teeeee"</span><span class="token punctuation">,</span> <span class="token string">"aaaa"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//查找所有包含t的元素并进行打印</span></span>
<span class="line">s<span class="token punctuation">.</span><span class="token function">filter</span><span class="token punctuation">(</span>n <span class="token operator">-></span> n<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span><span class="token string">"t"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token operator">::</span><span class="token function">println</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>map</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//方法定义</span></span>
<span class="line"><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">R</span><span class="token punctuation">></span></span> <span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">R</span><span class="token punctuation">></span></span> <span class="token function">map</span><span class="token punctuation">(</span><span class="token class-name">Function</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">super</span> <span class="token class-name">T</span><span class="token punctuation">,</span> <span class="token operator">?</span> <span class="token keyword">extends</span> <span class="token class-name">R</span><span class="token punctuation">></span></span> mapper<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//使用示例：</span></span>
<span class="line"><span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> s <span class="token operator">=</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">,</span> <span class="token string">"t1"</span><span class="token punctuation">,</span> <span class="token string">"t2"</span><span class="token punctuation">,</span> <span class="token string">"teeeee"</span><span class="token punctuation">,</span> <span class="token string">"aaaa"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">s<span class="token punctuation">.</span><span class="token function">map</span><span class="token punctuation">(</span>n <span class="token operator">-></span> n<span class="token punctuation">.</span><span class="token function">concat</span><span class="token punctuation">(</span><span class="token string">".txt"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token operator">::</span><span class="token function">println</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>flatMap</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//方法定义</span></span>
<span class="line"><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">R</span><span class="token punctuation">></span></span> <span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">R</span><span class="token punctuation">></span></span> <span class="token function">flatMap</span><span class="token punctuation">(</span><span class="token class-name">Function</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">super</span> <span class="token class-name">T</span><span class="token punctuation">,</span> <span class="token operator">?</span> <span class="token keyword">extends</span> <span class="token class-name">Stream</span><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">extends</span> <span class="token class-name">R</span><span class="token punctuation">></span><span class="token punctuation">></span></span> mapper<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//使用示例：</span></span>
<span class="line"><span class="token class-name">Stream</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">></span></span> s <span class="token operator">=</span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">,</span> <span class="token string">"t1"</span><span class="token punctuation">,</span> <span class="token string">"t2"</span><span class="token punctuation">,</span> <span class="token string">"teeeee"</span><span class="token punctuation">,</span> <span class="token string">"aaaa"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">s<span class="token punctuation">.</span><span class="token function">flatMap</span><span class="token punctuation">(</span>n <span class="token operator">-></span> <span class="token class-name">Stream</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span>n<span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">""</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token operator">::</span><span class="token function">println</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="optional" tabindex="-1"><a class="header-anchor" href="#optional"><span><code v-pre>Optional</code></span></a></h3>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>用于简化Java中对空值的判断处理，以防止出现各种空指针异常。
Optional实际上是对一个变量进行封装，它包含有一个属性value，实际上就是这个变量的值。</p>
</div>
<ul>
<li><code v-pre>Optional</code>对象创建:</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//empty用于创建一个空的Optional对象；其value属性为Null。</span></span>
<span class="line"><span class="token class-name">Optional</span> o <span class="token operator">=</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">empty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//of根据传入的值构建一个Optional对象; 传入的值必须是非空值，</span></span>
<span class="line"><span class="token comment">//否则如果传入的值为空值，则会抛出空指针异常。</span></span>
<span class="line"><span class="token class-name">Optional</span> o <span class="token operator">=</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">of</span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//ofNullable根据传入值构建一个Optional对象,传入的值可以是空值，</span></span>
<span class="line"><span class="token comment">//如果传入的值是空值，则与empty返回的结果是一样的</span></span>
<span class="line"><span class="token class-name">Optional</span> o <span class="token operator">=</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">ofNullable</span><span class="token punctuation">(</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>Optional</code>方法</li>
</ul>
<p>方法名 | 说明</p>
<ul>
<li>| :-: | :-: | :-: | -:
get | 获取Value的值，如果Value值是空值，则会抛出NoSuchElementException异常；因此返回的Value值无需再做空值判断，只要没有抛出异常，都会是非空值。
isPresent | Value是否为空值的判断；
ifPresent | 当Value不为空时，执行传入的Consumer；
ifPresentOrElse | Value不为空时，执行传入的Consumer；否则执行传入的Runnable对象；
filter	 | 当Value为空或者传入的Predicate对象调用test(value)返回False时，返回Empty对象；否则返回当前的Optional对象
map | 一对一转换：当Value为空时返回Empty对象，否则返回传入的Function执行apply(value)后的结果组装的Optional对象；
flatMap | 一对多转换：当Value为空时返回Empty对象，否则传入的Function执行apply(value)后返回的结果（其返回结果直接是Optional对象）
or | 如果Value不为空，则返回当前的Optional对象；否则，返回传入的Supplier生成的Optional对象；
stream | 如果Value为空，返回Stream对象的Empty值；否则返回Stream.of(value)的Stream对象；
orElse | Value不为空则返回Value，否则返回传入的值；
orElseGet | Value不为空则返回Value，否则返回传入的Supplier生成的值；
orElseThrow | Value不为空则返回Value，否则抛出Supplier中生成的异常对象；</li>
</ul>
<ul>
<li>
<p><code v-pre>Optional</code>使用场景</p>
<ul>
<li>判断结果不为空后使用</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Demo</span> <span class="token punctuation">{</span></span>
<span class="line"> <span class="token comment">//获取字符串</span></span>
<span class="line"> <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">getStr</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">     <span class="token class-name">Random</span> random <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">     <span class="token keyword">int</span> i <span class="token operator">=</span> random<span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">     <span class="token keyword">return</span> i <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token string">"not null"</span> <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line"> <span class="token punctuation">}</span></span>
<span class="line"> <span class="token comment">//打印string</span></span>
<span class="line"> <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">sy</span><span class="token punctuation">(</span><span class="token class-name">String</span> n<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">     <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>n<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"> <span class="token punctuation">}</span></span>
<span class="line"> <span class="token comment">//判断getStr()不为null，执行sy()方法</span></span>
<span class="line"> <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">     <span class="token class-name">Optional</span> o1 <span class="token operator">=</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">ofNullable</span><span class="token punctuation">(</span><span class="token function">getStr</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">     o1<span class="token punctuation">.</span><span class="token function">ifPresent</span><span class="token punctuation">(</span>n <span class="token operator">-></span> <span class="token function">sy</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span> n<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>变量为空时提供默认值</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Demo</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">getStr</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">Random</span> random <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> i <span class="token operator">=</span> random<span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> i <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token string">"not null"</span> <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">//为空时默认值为'is null'</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">Optional</span> o1 <span class="token operator">=</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">ofNullable</span><span class="token punctuation">(</span><span class="token function">getStr</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>o1<span class="token punctuation">.</span><span class="token function">orElse</span><span class="token punctuation">(</span><span class="token string">"is null"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>变量为空时抛出异常，否则使用</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Demo</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">String</span> <span class="token function">getStr</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token class-name">Random</span> random <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Random</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">int</span> i <span class="token operator">=</span> random<span class="token punctuation">.</span><span class="token function">nextInt</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> i <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">==</span> <span class="token number">0</span> <span class="token operator">?</span> <span class="token string">"not null"</span> <span class="token operator">:</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Throwable</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token class-name">Optional</span> o1 <span class="token operator">=</span> <span class="token class-name">Optional</span><span class="token punctuation">.</span><span class="token function">ofNullable</span><span class="token punctuation">(</span><span class="token function">getStr</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>o1<span class="token punctuation">.</span><span class="token function">orElseThrow</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token keyword">new</span> <span class="token class-name">AppException</span><span class="token punctuation">(</span><span class="token string">"test"</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</div></template>


