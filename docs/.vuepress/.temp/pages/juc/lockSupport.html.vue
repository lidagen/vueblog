<template><div><h2 id="locksupport" tabindex="-1"><a class="header-anchor" href="#locksupport"><span>LockSupport</span></a></h2>
<ul>
<li>LockSupport是用来创建锁和其它同步类的基本线程阻塞原语。简单来说，<strong>就是对原有锁支持，使线程等待唤醒机制（wait/notify）的改良加强版。</strong></li>
<li>LockSupport中的park()和unpark(thread)作用分别是阻塞线程和解除线程阻塞。</li>
</ul>
<h3 id="三种让线程等待唤醒的方法" tabindex="-1"><a class="header-anchor" href="#三种让线程等待唤醒的方法"><span>三种让线程等待唤醒的方法</span></a></h3>
<ul>
<li>Object中的wait()、notify()</li>
<li>JUC包中的Condition类的await()、signal()</li>
<li><strong>LockSupport类可以阻塞当前线程以及唤醒指定被阻塞的线程</strong></li>
</ul>
<h3 id="wait-、notify-限制-await-、signal-限制" tabindex="-1"><a class="header-anchor" href="#wait-、notify-限制-await-、signal-限制"><span>wait()、notify()限制 / await()、signal()限制</span></a></h3>
<h4 id="wait-、notify" tabindex="-1"><a class="header-anchor" href="#wait-、notify"><span>wait()、notify()</span></a></h4>
<ul>
<li>这两个方法不能脱离synchronized存在</li>
<li>wait、notify方法使用上有顺序，如果线程先执行了notify方法，则wait一直会等待，无法被唤醒</li>
</ul>
<h4 id="await-、signal" tabindex="-1"><a class="header-anchor" href="#await-、signal"><span>await()、signal()</span></a></h4>
<ul>
<li>这两个方法不能脱离Lock存在</li>
<li>await()、signal()方法使用上有顺序，如果线程先执行了signal方法，则await一直会等待，无法被唤醒</li>
</ul>
<h3 id="locksupport方法介绍" tabindex="-1"><a class="header-anchor" href="#locksupport方法介绍"><span>LockSupport方法介绍</span></a></h3>
<ul>
<li>LockSupport类使用了一个名为Permit（许可）的概念了阻塞和唤醒线程的功能，每个线程都有一个permit,permit只有两个值1和0,默认是0</li>
<li>可以把permit看作一个信号量Semaplehore，但与Semaphore不同的是，许可的累加上限是1</li>
<li></li>
</ul>
<h4 id="api" tabindex="-1"><a class="header-anchor" href="#api"><span>API</span></a></h4>
<ul>
<li>pack()
<ul>
<li>permit默认是0，如果一开始调用<code v-pre>park()</code>方法，当前线程就会被阻塞，直到别的线程将当前线程permit设置为1,park方法会被唤醒，然后再将将permit再次设置为0返回</li>
</ul>
</li>
<li>unpack(thread)
<ul>
<li>调用<code v-pre>unpack(thread)</code>方法后，会将thread线程的许可permit设置为1（注意多次调用unpack方法不会累加permit）,会自动唤醒thread线程</li>
</ul>
</li>
</ul>
<h4 id="代码演示" tabindex="-1"><a class="header-anchor" href="#代码演示"><span>代码演示</span></a></h4>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line">* 无锁 并且pack和unpack没有顺序上的要求</span>
<span class="line">*</span>
<span class="line">*/</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">LockSupportDemo</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">InterruptedException</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Thread</span> a <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token punctuation">{</span></span>
<span class="line">            </span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"\t ---come in"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">try</span> <span class="token punctuation">{</span> <span class="token class-name">TimeUnit</span><span class="token punctuation">.</span><span class="token constant">SECONDS</span><span class="token punctuation">.</span><span class="token function">sleep</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InterruptedException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span> e<span class="token punctuation">.</span><span class="token function">printStackTrace</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token punctuation">}</span></span>
<span class="line">            <span class="token class-name">LockSupport</span><span class="token punctuation">.</span><span class="token function">park</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"\t ---被唤醒"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        a<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">       </span>
<span class="line">        <span class="token class-name">Thread</span> b <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Thread</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-></span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">LockSupport</span><span class="token punctuation">.</span><span class="token function">unpark</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">"\t 通知了"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        b<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


