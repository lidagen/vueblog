<template><div><h2 id="class-源码解析-jdk8" tabindex="-1"><a class="header-anchor" href="#class-源码解析-jdk8"><span>Class 源码解析 JDK8</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p><code v-pre>Class</code>类实现了<code v-pre>Serializable</code> <code v-pre>GenericDeclaration</code> <code v-pre>Type</code> <code v-pre>AnnotatedElement</code> 接口。</p>
<ul>
<li>
<p><code v-pre>GenericDeclaration</code> 是接口继承了AnnotatedElement接口，是所有“可以声明（定义）范型变量”的实体（如Class，Constructor，Method）的公共接口。也就是说只有实现了这个接口的才能在对应“实体”上声明“范型变量”。</p>
</li>
<li>
<p><code v-pre>Type</code>是Java语言中所有类型的父接口。它并不是我们平常工作中经常使用的 int、String、List、Map等数据类型，而是从Java语言角度来说，对基本类型、引用类型向上的抽象；</p>
</li>
<li>
<p><code v-pre>AnnotatedElement</code> 表示目前正在此 VM 中运行的程序的一个已注释元素。该接口允许反射性地读取注释。由此接口中的方法返回的所有注释都是不可变并且可序列化的。调用者可以修改已赋值数组枚举成员的访问器返回的数组；这不会对其他调用者返回的数组产生任何影响。</p>
</li>
</ul>
</li>
<li>
<p>java反射是围绕Class类展开的，jvm将字节码文件加载到方法区内存中并返回一个Class对象。</p>
</li>
<li>
<p>java反射使得我们可以在程序运行时动态加载一个类，动态获取类的基本信息和定义的方法,构造函数,域等。还可以动态创建类的实例，执行类实例的方法，获取类实例的域值。反射使java这种静态语言有了动态的特性。</p>
</li>
<li>
<p>反射是通过反编译将<code v-pre>.class</code>文件转换成<code v-pre>.java</code>,从而操纵类的属性方法。</p>
</li>
</ul>
<h3 id="变量" tabindex="-1"><a class="header-anchor" href="#变量"><span>变量</span></a></h3>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token comment">//构造器缓存</span></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">transient</span> <span class="token class-name">Constructor</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> cachedConstructor<span class="token punctuation">;</span></span>
<span class="line"><span class="token comment">//实例缓存</span></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">volatile</span> <span class="token keyword">transient</span> <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span>       newInstanceCallerCache<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">transient</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token class-name">ClassLoader</span> classLoader<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="构造器" tabindex="-1"><a class="header-anchor" href="#构造器"><span>构造器</span></a></h3>
<ul>
<li>Class类构造器私有的，不允许手动创建</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">private</span> <span class="token class-name">Class</span><span class="token punctuation">(</span><span class="token class-name">ClassLoader</span> loader<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// Initialize final field for classLoader.  The initialization value of non-null</span></span>
<span class="line">    <span class="token comment">// prevents future JIT optimizations from assuming this final field is null.</span></span>
<span class="line">    classLoader <span class="token operator">=</span> loader<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="方法" tabindex="-1"><a class="header-anchor" href="#方法"><span>方法</span></a></h3>
<ul>
<li>Class类中方法主要有三类：生成实例、获取类信息、类型转换。
<ul>
<li><code v-pre>生成实例</code> 一类方法主要有两个：forName方法和newInstance方法。</li>
<li><code v-pre>获取类信息</code> 一类方法非常多，作用包括获取类的构造方法，已经声明的字段、方法，获取类或者方法的注解，获取类的包名、父类，以及判断类是否是数组、是否是枚举、是否是接口。</li>
<li><code v-pre>类型转换</code> 该类方法主要有两个： asSubclass方法和 cast</li>
</ul>
</li>
</ul>
<h4 id="生成实例" tabindex="-1"><a class="header-anchor" href="#生成实例"><span>生成实例</span></a></h4>
<ul>
<li>
<p>此方法主要是根据给定的类名，JVM将类加载、链接、初始化;生成类的实例。</p>
</li>
<li>
<p>初始化信息和生成实例一般包含两个方法 <code v-pre>forName</code> 和 <code v-pre>newInstance</code>:</p>
<ul>
<li><code v-pre>forName</code>有两种声明</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> <span class="token function">forName</span><span class="token punctuation">(</span><span class="token class-name">String</span> className<span class="token punctuation">)</span></span>
<span class="line">              <span class="token keyword">throws</span> <span class="token class-name">ClassNotFoundException</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> caller <span class="token operator">=</span> <span class="token class-name">Reflection</span><span class="token punctuation">.</span><span class="token function">getCallerClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">forName0</span><span class="token punctuation">(</span>className<span class="token punctuation">,</span> <span class="token boolean">true</span><span class="token punctuation">,</span> <span class="token class-name">ClassLoader</span><span class="token punctuation">.</span><span class="token function">getClassLoader</span><span class="token punctuation">(</span>caller<span class="token punctuation">)</span><span class="token punctuation">,</span> caller<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> <span class="token function">forName</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">,</span> <span class="token keyword">boolean</span> initialize<span class="token punctuation">,</span></span>
<span class="line">                                 <span class="token class-name">ClassLoader</span> loader<span class="token punctuation">)</span></span>
<span class="line">      <span class="token keyword">throws</span> <span class="token class-name">ClassNotFoundException</span></span>
<span class="line">  <span class="token punctuation">{</span></span>
<span class="line">      <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> caller <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token class-name">SecurityManager</span> sm <span class="token operator">=</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">getSecurityManager</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">      <span class="token keyword">if</span> <span class="token punctuation">(</span>sm <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">// Reflective call to get caller class is only needed if a security manager</span></span>
<span class="line">          <span class="token comment">// is present.  Avoid the overhead of making this call otherwise.</span></span>
<span class="line">          caller <span class="token operator">=</span> <span class="token class-name">Reflection</span><span class="token punctuation">.</span><span class="token function">getCallerClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">          <span class="token keyword">if</span> <span class="token punctuation">(</span>sun<span class="token punctuation">.</span>misc<span class="token punctuation">.</span><span class="token constant">VM</span><span class="token punctuation">.</span><span class="token function">isSystemDomainLoader</span><span class="token punctuation">(</span>loader<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">              <span class="token class-name">ClassLoader</span> ccl <span class="token operator">=</span> <span class="token class-name">ClassLoader</span><span class="token punctuation">.</span><span class="token function">getClassLoader</span><span class="token punctuation">(</span>caller<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">              <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>sun<span class="token punctuation">.</span>misc<span class="token punctuation">.</span><span class="token constant">VM</span><span class="token punctuation">.</span><span class="token function">isSystemDomainLoader</span><span class="token punctuation">(</span>ccl<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                  sm<span class="token punctuation">.</span><span class="token function">checkPermission</span><span class="token punctuation">(</span></span>
<span class="line">                      <span class="token class-name">SecurityConstants</span><span class="token punctuation">.</span><span class="token constant">GET_CLASSLOADER_PERMISSION</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">              <span class="token punctuation">}</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">      <span class="token keyword">return</span> <span class="token function">forName0</span><span class="token punctuation">(</span>name<span class="token punctuation">,</span> initialize<span class="token punctuation">,</span> loader<span class="token punctuation">,</span> caller<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>最终两个<code v-pre>forName</code>方法,都调用了<code v-pre>forName0</code>方法,这是一个本地方法。</li>
<li>在<code v-pre>forName</code>方法实现中，出现了两个类，一个是<code v-pre>SecurityManager</code>，另一个是<code v-pre>ClassLoader</code>
<ul>
<li>其中<code v-pre>SecurityManager</code>是jvm提供的在应用层进行安全检查的机制，应用程序可以根据策略文件被赋予一定的权限，例如是否可以读写文件，是否可以读写网络端口，是否可以读写内存，是否可以获取类加载器……。在进行特殊操作时，需要进行安全检查，从而给程序的运行安全提供一定保障。</li>
<li>而<code v-pre>ClassLoader</code>则涉及到另一个大的话题：类加载，我们程序运行中使用的类都需要由类加载器来完成加载，并执行一定的初始化，随后才可以被我们使用。</li>
</ul>
</li>
</ul>
</li>
<li>
<p><code v-pre>newInstance</code>:类加载完成后就需要实例化了，需要用到此方法。</p>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token class-name">T</span> <span class="token function">newInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token keyword">throws</span> <span class="token class-name">InstantiationException</span><span class="token punctuation">,</span> <span class="token class-name">IllegalAccessException</span></span>
<span class="line"><span class="token punctuation">{</span>   <span class="token comment">// 进行安全检查</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">getSecurityManager</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token function">checkMemberAccess</span><span class="token punctuation">(</span><span class="token class-name">Member</span><span class="token punctuation">.</span><span class="token constant">PUBLIC</span><span class="token punctuation">,</span> <span class="token class-name">Reflection</span><span class="token punctuation">.</span><span class="token function">getCallerClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token boolean">false</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  </span>
<span class="line"></span>
<span class="line">  <span class="token comment">// 每次先检查是否有已经缓存过的构造器，如果没有，则重新获取</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>cachedConstructor <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span> <span class="token operator">==</span> <span class="token class-name">Class</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">IllegalAccessException</span><span class="token punctuation">(</span></span>
<span class="line">                <span class="token string">"Can not call newInstance() on the Class for java.lang.Class"</span></span>
<span class="line">            <span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span><span class="token punctuation">[</span><span class="token punctuation">]</span> empty <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token comment">// 获取该类已经声明的的无参构造方法</span></span>
<span class="line">            <span class="token keyword">final</span> <span class="token class-name">Constructor</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> c <span class="token operator">=</span> <span class="token function">getConstructor0</span><span class="token punctuation">(</span>empty<span class="token punctuation">,</span> <span class="token class-name">Member</span><span class="token punctuation">.</span><span class="token constant">DECLARED</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">           <span class="token comment">// 此处是为了使无参构造方法可以被访问，因为有时，构造方法被声明为private的</span></span>
<span class="line">            <span class="token class-name"><span class="token namespace">java<span class="token punctuation">.</span>security<span class="token punctuation">.</span></span>AccessController</span><span class="token punctuation">.</span><span class="token function">doPrivileged</span><span class="token punctuation">(</span></span>
<span class="line">                <span class="token keyword">new</span> <span class="token class-name"><span class="token namespace">java<span class="token punctuation">.</span>security<span class="token punctuation">.</span></span>PrivilegedAction</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Void</span><span class="token punctuation">></span></span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                    <span class="token keyword">public</span> <span class="token class-name">Void</span> <span class="token function">run</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                            c<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">                            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">                        <span class="token punctuation">}</span></span>
<span class="line">                    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">             <span class="token comment">// 将获取的无参构造方法缓存        </span></span>
<span class="line">            cachedConstructor <span class="token operator">=</span> c<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">NoSuchMethodException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">throw</span> <span class="token punctuation">(</span><span class="token class-name">InstantiationException</span><span class="token punctuation">)</span></span>
<span class="line">                <span class="token keyword">new</span> <span class="token class-name">InstantiationException</span><span class="token punctuation">(</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">initCause</span><span class="token punctuation">(</span>e<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token class-name">Constructor</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">T</span><span class="token punctuation">></span></span> tmpConstructor <span class="token operator">=</span> cachedConstructor<span class="token punctuation">;</span></span>
<span class="line">   <span class="token comment">// 获取构造方法的语言修饰符，诸如public,private,static,final等</span></span>
<span class="line">    <span class="token keyword">int</span> modifiers <span class="token operator">=</span> tmpConstructor<span class="token punctuation">.</span><span class="token function">getModifiers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">     <span class="token comment">// 根据已经获取的语言修饰符判断是否具有访问权限，如果没有，则执行以下操作</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">Reflection</span><span class="token punctuation">.</span><span class="token function">quickCheckMemberAccess</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">,</span> modifiers<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> caller <span class="token operator">=</span> <span class="token class-name">Reflection</span><span class="token punctuation">.</span><span class="token function">getCallerClass</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">if</span> <span class="token punctuation">(</span>newInstanceCallerCache <span class="token operator">!=</span> caller<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token class-name">Reflection</span><span class="token punctuation">.</span><span class="token function">ensureMemberAccess</span><span class="token punctuation">(</span>caller<span class="token punctuation">,</span> <span class="token keyword">this</span><span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">,</span> modifiers<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            newInstanceCallerCache <span class="token operator">=</span> caller<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">// 整个方法的核心，使用类的构造方法来生成实例</span></span>
<span class="line">    <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> tmpConstructor<span class="token punctuation">.</span><span class="token function">newInstance</span><span class="token punctuation">(</span><span class="token punctuation">(</span><span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">InvocationTargetException</span> e<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Unsafe</span><span class="token punctuation">.</span><span class="token function">getUnsafe</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">throwException</span><span class="token punctuation">(</span>e<span class="token punctuation">.</span><span class="token function">getTargetException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">// Not reached</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>newInstance的具体实现，本质上是获取的类的无参构造方法，然后执行无参构造方法来生成实例。</li>
<li>所以说反射必须依赖类的无参构造器。否则会抛出<code v-pre>InstantiationException</code></li>
</ul>
<h4 id="获取类信息" tabindex="-1"><a class="header-anchor" href="#获取类信息"><span>获取类信息</span></a></h4>
<ul>
<li>这一类方法非常多，作用包括获取类的构造方法，已经声明的字段、方法，获取类或者方法的注解，获取类的包名、父类，以及判断类是否是数组、是否是枚举、是否是接口。</li>
<li>获取类信息之前必须先生成实例，即调用<code v-pre>froName</code> <code v-pre>newInstance</code>方法。</li>
<li>以获取方法举例：</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ReflectDemo</span> <span class="token punctuation">{</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> reflectString <span class="token operator">=</span> <span class="token string">"abc"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">//因为有 *有参构造器* 所有需要显示的定义一个无参构造器用于反射生成实例</span></span>
<span class="line">    <span class="token class-name">ReflectDemo</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">ReflectDemo</span><span class="token punctuation">(</span><span class="token class-name">String</span> reflectString<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>reflectString <span class="token operator">=</span> reflectString<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">//1.私有方法</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">priMethod</span><span class="token punctuation">(</span><span class="token keyword">int</span> a<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"this is [private] method"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">//2.公有方法</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">pubMethod</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">"this is [public] method"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">//3.有参方法</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getMath</span><span class="token punctuation">(</span><span class="token keyword">int</span> a<span class="token punctuation">,</span> <span class="token keyword">int</span> b<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">BigDecimal</span> bigDecimalA <span class="token operator">=</span> <span class="token class-name">BigDecimal</span><span class="token punctuation">.</span><span class="token function">valueOf</span><span class="token punctuation">(</span>a<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">BigDecimal</span> bigDecimalB <span class="token operator">=</span> <span class="token class-name">BigDecimal</span><span class="token punctuation">.</span><span class="token function">valueOf</span><span class="token punctuation">(</span>b<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">BigDecimal</span> bigDecimal <span class="token operator">=</span> bigDecimalA<span class="token punctuation">.</span><span class="token function">divide</span><span class="token punctuation">(</span>bigDecimalB<span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">,</span> <span class="token class-name">RoundingMode</span><span class="token punctuation">.</span><span class="token constant">HALF_UP</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">valueOf</span><span class="token punctuation">(</span>bigDecimal<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token comment">//4.可变参数方法</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">addString</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">StringBuilder</span> sb <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">StringBuilder</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">String</span> arg <span class="token operator">:</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            sb<span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">append</span><span class="token punctuation">(</span><span class="token string">"|"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line">        <span class="token keyword">return</span> sb<span class="token punctuation">.</span><span class="token function">substring</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> sb<span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">App</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span> reflectDemo <span class="token operator">=</span> <span class="token class-name">Class</span><span class="token punctuation">.</span><span class="token function">forName</span><span class="token punctuation">(</span><span class="token string">"com.project.ReflectDemo"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Object</span> o1 <span class="token operator">=</span> reflectDemo<span class="token punctuation">.</span><span class="token function">newInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//获取所有方法</span></span>
<span class="line">        <span class="token class-name">Method</span><span class="token punctuation">[</span><span class="token punctuation">]</span> methods <span class="token operator">=</span> reflectDemo<span class="token punctuation">.</span><span class="token function">getMethods</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">//1</span></span>
<span class="line">        <span class="token class-name">Method</span> priMethod <span class="token operator">=</span> reflectDemo<span class="token punctuation">.</span><span class="token function">getDeclaredMethod</span><span class="token punctuation">(</span><span class="token string">"priMethod"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//功能是启用或禁用安全检查</span></span>
<span class="line">        priMethod<span class="token punctuation">.</span><span class="token function">setAccessible</span><span class="token punctuation">(</span><span class="token boolean">true</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        priMethod<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span>o1<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">//2</span></span>
<span class="line">        <span class="token class-name">Method</span> pubMethod <span class="token operator">=</span> reflectDemo<span class="token punctuation">.</span><span class="token function">getMethod</span><span class="token punctuation">(</span><span class="token string">"pubMethod"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        pubMethod<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span>o1<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">//3</span></span>
<span class="line">        <span class="token comment">//因为入参是int 基本数据类型，这里也写int.class</span></span>
<span class="line">        <span class="token class-name">Method</span> pubMethod3 <span class="token operator">=</span> reflectDemo<span class="token punctuation">.</span><span class="token function">getMethod</span><span class="token punctuation">(</span><span class="token string">"getMath"</span><span class="token punctuation">,</span> <span class="token keyword">int</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span> <span class="token keyword">int</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">String</span> invoke <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">)</span> pubMethod3<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span>o1<span class="token punctuation">,</span> <span class="token number">10</span><span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>invoke<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">//4</span></span>
<span class="line">        <span class="token comment">//可变参数写法，可变参数本质是一个数组，外层需要包一个new Class[]{}, invoke时候包一个new Object[]{}</span></span>
<span class="line">        <span class="token comment">//否则报错</span></span>
<span class="line">        <span class="token class-name">Method</span> pubMethod4 <span class="token operator">=</span> reflectDemo<span class="token punctuation">.</span><span class="token function">getMethod</span><span class="token punctuation">(</span><span class="token string">"addString"</span><span class="token punctuation">,</span> <span class="token keyword">new</span> <span class="token class-name">Class</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Object</span> invoke1 <span class="token operator">=</span> pubMethod4<span class="token punctuation">.</span><span class="token function">invoke</span><span class="token punctuation">(</span>o1<span class="token punctuation">,</span><span class="token keyword">new</span> <span class="token class-name">Object</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token keyword">new</span> <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">{</span><span class="token string">"123"</span><span class="token punctuation">,</span> <span class="token string">"345"</span><span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>invoke1<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>获取私有方法调用，需要调用<code v-pre>setAccessible(true);</code>方法，关闭安全检查，这时程序不会检查访问修饰符</li>
</ul>
<h4 id="类型转换" tabindex="-1"><a class="header-anchor" href="#类型转换"><span>类型转换</span></a></h4>
<ul>
<li>类型转换方法有两个 <code v-pre>asSubclass</code> <code v-pre>cast</code></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * 将类转换为它的子类Class</span>
<span class="line"> * <span class="token keyword">@param</span> <span class="token parameter">clazz</span> 父类的Class</span>
<span class="line"> * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">&lt;</span>U<span class="token punctuation">></span></span> 父类</span>
<span class="line"> * <span class="token keyword">@return</span> U的子类Class</span>
<span class="line"> */</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">U</span><span class="token punctuation">></span></span> <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">extends</span> <span class="token class-name">U</span><span class="token punctuation">></span></span> <span class="token function">asSubclass</span><span class="token punctuation">(</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">U</span><span class="token punctuation">></span></span> clazz<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// 判断clazz是否是当前类，或者是当前类的父类</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>clazz<span class="token punctuation">.</span><span class="token function">isAssignableFrom</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span> <span class="token keyword">extends</span> <span class="token class-name">U</span><span class="token punctuation">></span></span><span class="token punctuation">)</span> <span class="token keyword">this</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">else</span></span>
<span class="line">        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">ClassCastException</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token doc-comment comment">/**</span>
<span class="line"> * 将给定的类转换为当前Class所代表的类</span>
<span class="line"> * <span class="token keyword">@param</span> <span class="token parameter">obj</span> 需要转换的类</span>
<span class="line"> * <span class="token keyword">@return</span> 当前Class所代表的类</span>
<span class="line"> */</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token class-name">T</span> <span class="token function">cast</span><span class="token punctuation">(</span><span class="token class-name">Object</span> obj<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// obj不为null，并且可以被转换为当前Class代表的类</span></span>
<span class="line">    <span class="token comment">// isInstance为native方法，类似于instanceOf的作用</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span>obj <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> <span class="token operator">!</span><span class="token function">isInstance</span><span class="token punctuation">(</span>obj<span class="token punctuation">)</span><span class="token punctuation">)</span></span>
<span class="line">        <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">ClassCastException</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">return</span> <span class="token punctuation">(</span><span class="token class-name">T</span><span class="token punctuation">)</span> obj<span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="总结" tabindex="-1"><a class="header-anchor" href="#总结"><span>总结</span></a></h3>
<ul>
<li>
<p>Class.forName(&quot;&quot;) 与  ClassLoader.getSystemClassLoader().loadClass(&quot;&quot;)</p>
<ul>
<li>Class.forName加载类是将类进了初始化(相当于调用无参构造函数,会调用static静态代码来初始化配置)</li>
<li>ClassLoader的loadClass并没有对类进行初始化，只是把类加载到了虚拟机中</li>
</ul>
</li>
<li>
<p>反射作用是把.class文件反编译,生成实例，动态获取实例的属性方法等。</p>
</li>
<li>
<p>spring 依赖注入也是这种反射机制获取对象</p>
</li>
</ul>
</div></template>


