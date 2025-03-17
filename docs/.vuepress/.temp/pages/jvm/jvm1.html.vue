<template><div><h2 id="jvm体系架构概述" tabindex="-1"><a class="header-anchor" href="#jvm体系架构概述"><span>JVM体系架构概述</span></a></h2>
<ul>
<li>JVM内存结构
<img :src="$withBase('/jvm/jvm.png')" alt="dock"></li>
</ul>
<h3 id="类加载器-classloader" tabindex="-1"><a class="header-anchor" href="#类加载器-classloader"><span>类加载器 ClassLoader</span></a></h3>
<ul>
<li>负责加载class文件，class文件在<strong>文件开头有特定的文件标示</strong>，将class文件字节码内容加载到内存中，并将这些内容换成方法区中的运行时数据结构并且ClassLoader只负责class文件加载，至于是否可运行，则由执行引擎Execution Engine决定。</li>
<li>JVM中提供了三层的ClassLoader：
<ul>
<li>Bootstrap classLoader 启动类加载器:主要负责加载核心的类库(java.lang.*等)，构造ExtClassLoader和APPClassLoader</li>
<li>ExtClassLoader扩展类加载器：主要负责加载jre/lib/ext目录下的一些扩展的jar。</li>
<li>AppClassLoader应用程序类加载器：主要负责加载应用程序的主函数类</li>
</ul>
</li>
</ul>
<h4 id="双亲委派机制" tabindex="-1"><a class="header-anchor" href="#双亲委派机制"><span>双亲委派机制</span></a></h4>
<ul>
<li>
<p>双亲委派模型的工作作过程是 ：如果一个类加载器收到了类加载的请求，它首先不会自己去尝试加载这个类，而是把这个请求委派给父类加载器去完成，每一个层次的类加载器都是如此，因此所有的加载请求最终都应该传送到顶层的启动类加载器中，只有当父加载器反馈自己无法完全这个加载请求（它的搜索范围中没有找到所需的类）时，子加载器才会尝试自己去加载。</p>
</li>
<li>
<p>这种设计有个好处是，如果有人想替换系统级别的类：String.java，篡改它的实现，在这种机制下这些系统的类已经被Bootstrap classLoader加载过了。所以其他类加载器并没有机会再去加载，从一定程度上防止了危险代码的植入。</p>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>假设当一个Hello.class这样的文件要被加载时。不考虑我们自定义类加载器，首先会在AppClassLoader中检查是否加载过，如果有那就无需再加载了。如果没有，那么会拿到父加载器，然后调用父加载器的loadClass方法。父类中同理也会先检查自己是否已经加载过，如果没有再往上。注意这个类似递归的过程，直到到达Bootstrap classLoader之前，都是在检查是否加载过，并不会选择自己去加载。直到BootstrapClassLoader，已经没有父加载器了，这时候开始考虑自己是否能加载了，如果自己无法加载，会下沉到子加载器去加载，一直到最底层，如果没有任何加载器能加载，就会抛出ClassNotFoundException。</li>
</ul>
</div>
<h4 id="沙箱安全机制" tabindex="-1"><a class="header-anchor" href="#沙箱安全机制"><span>沙箱安全机制</span></a></h4>
<ul>
<li>字节码校验器（bytecode verifier）：确保Java类文件遵循Java语言规范。这样可以帮助Java程序实现内存保护。但并不是所有的类文件都会经过字节码校验，比如核心类。</li>
<li>类装载器（class loader）：其中类装载器在3个方面对Java沙箱起作用
<ul>
<li>它防止恶意代码去干涉善意的代码；</li>
<li>它守护了被信任的类库边界；</li>
<li>它将代码归入保护域，确定了代码可以进行哪些操作。</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>比如我定义了一个类名为String所在包为java.lang，因为这个类本来是属于jdk的，如果没有沙箱安全机制的话，这个类将会污染到我所有的String,但是由于沙箱安全机制，所以就委托顶层的bootstrap加载器查找这个类，如果没有的话就委托extsion,extsion没有就到aapclassloader，但是由于String就是jdk的源代码，所以在bootstrap那里就加载到了，先找到先使用，所以就使用bootstrap里面的String,后面的一概不能使用，这就保证了不被恶意代码污染</li>
</ul>
</div>
<h3 id="本地接口-native-interface" tabindex="-1"><a class="header-anchor" href="#本地接口-native-interface"><span>本地接口 Native Interface</span></a></h3>
<ul>
<li>本地接口的作用是融合不同的语言为java所用，它的初衷是融合C/C++程序。所以在内存中开辟了一块空间处理标记为native的代码。它的具体做法是本地方法栈（Native Method Stack）中登记native方法，在执行引擎（Execution Engine）执行是加载native libraies</li>
</ul>
<h3 id="程序计数器-pc寄存器-program-counter-register" tabindex="-1"><a class="header-anchor" href="#程序计数器-pc寄存器-program-counter-register"><span>程序计数器（PC寄存器） Program Counter Register</span></a></h3>
<ul>
<li>每个线程都有一个程序计数器，是线程私有的。就是一个指针指向方法区中的方法字节码（用来存储下一条指令的地址，也就是即将要执行的指令代码）。这是个非常小的内存空间。如果是native方法，这个计数器是空的</li>
<li>该程序计数器用于完成分支、循环、跳转、异常处理、线程恢复等基础功能。该内存空间不会发生OOM错误。</li>
</ul>
<h3 id="方法区-method-area" tabindex="-1"><a class="header-anchor" href="#方法区-method-area"><span>方法区 Method Area</span></a></h3>
<ul>
<li>供各线程共享的运行时内存区域。它存储了<strong>每一个类的结构信息</strong>（类的模板信息），例如运行时常量池、字段和方法数据、构造函数和普通方法的字节码内容。</li>
<li>方法区是规范，在不同的虚拟机里实现不同，最典型的是永久代(PermGen space) 1.7和元空间(Metaspace)1.8+</li>
<li>实例变量在堆内存中，和方法区无关</li>
</ul>
<h3 id="栈-jave-stack" tabindex="-1"><a class="header-anchor" href="#栈-jave-stack"><span>栈 Jave Stack</span></a></h3>
<ul>
<li>栈也叫栈内存，主管java程序运行，是在线程创建时创建（线程私有），它的生命周期是跟随线程的生命周期。所以<em>对于栈来说不存在垃圾回收问题</em>。<strong>8种基本类型变量 + 对象的引用变量 + 实例方法</strong>都是在函数的占内存中分配。</li>
<li>栈存储什么
<ul>
<li>本地变量：输入参数、输出参数以及方法内变量</li>
<li>栈操作：记录入栈、出栈操作</li>
<li>栈帧数据：包括类文件、方法等</li>
</ul>
</li>
<li>StackOverflowError 栈溢出错误
<ul>
<li>简单理解就是栈被压爆了（简单操作就是递归且没结束条件），导致溢出</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>栈管运行，堆管存储</li>
<li>栈和FIFO相反，先进后出</li>
<li>栈帧：**每个方法执行时都会创建一个栈帧，有用存储局部变量表、操作数栈、动态链接、方法出口等信息.**每个方法从调用直至执行完毕的过程，就对应着一个栈桢在虚拟机中从入栈到出栈的过程。<strong>栈的大小和具体JVM实现有关，通常在256K~756K之间，约等于1M左右。</strong></li>
</ul>
</div>
<h3 id="堆-heap" tabindex="-1"><a class="header-anchor" href="#堆-heap"><span>堆 Heap</span></a></h3>
<ul>
<li>
<p>堆内存空间结构
<img :src="$withBase('/jvm/heap.png')" alt="dock"></p>
</li>
<li>
<p>逻辑上，堆内存分为<code v-pre>新生、老年、元空间MetaSpace（1.7之前叫永久区Perm Gen）</code>，在物理上之分为<code v-pre>新生、老年</code>两个区。</p>
</li>
<li>
<p>新生区是类的诞生、成长、消亡的区域，一个类在这里产生，应用，最后被垃圾回收器回收，结束生命。新区分为两个区，<code v-pre>伊甸区Eden Space</code>和<code v-pre>Survivor Space</code>。所有类都是在伊甸区Eden Space被new出来的，幸存区有两个0区和1区。当Eden Space空间用完时，程序又要创建新的对象，JVM的垃圾回收器会对Eden Space进行依次Minor GC（会清空Eden区）,将不在被其它对象引用的对象进行销毁，然后再将剩余的对象移放进Survivor 0 Space。若Survivor 0 Space也满了，则再次进行YGC，剩余的存活者放入Survivor 1 Space。若Survivor 1 Space满了，继续YGC放回Survivor 0 Space。达到一定次数后（JVM参数MaxTenuringThreshold设置，默认15），还存活的对象，就会放入老年代。老年代满了以后会进行Full GC(重量级GC)进行内存清理，若老年代FGC还是无法满足对新对象的存储,就会产生OOM异常（OutOfMemoryError）。</p>
<ul>
<li>如果出现OOM异常，说明了java虚拟机内存不够，原因有二
<ul>
<li>java内存堆空间设置不够，可以通过调整-Xms、-Xmx来调整</li>
<li>代码中创建了大量对象，并且长时间不能被垃圾回收机制回收（存在被引用）</li>
</ul>
</li>
</ul>
</li>
<li>
<p>Survivor 0 Space 也叫from区，Survivor 1 Space叫to区，他俩不是固定的，即from区进行垃圾回收以后，把存活的复制到to区，然后清空from区。这时候他俩交换，这时候空的from区就变成了to区，而有存活对象的to区变成from区。幸存者区一定有一个是空的</p>
</li>
<li>
<p>eden和from、to区比例是 8：1：1，新生与老年区分别是1/3、2/3</p>
</li>
<li>
<p>Minor GC后，有一种情况是from区放不下存活的对象，这时候会部分放入老年代</p>
</li>
</ul>
<h4 id="永久代-parmanent-gen-jdk7" tabindex="-1"><a class="header-anchor" href="#永久代-parmanent-gen-jdk7"><span>永久代 Parmanent Gen JDK7</span></a></h4>
<ul>
<li>实际而言，<code v-pre>方法区Method Area</code>和<code v-pre>堆Heap</code>一样，是各线程共享区域，用于存储虚拟机加载的：类信息+普通常量+静态常量+编译器编译后代码等。<strong>虽然JVM规范把它描述成堆的逻辑一部分，但它还有个名字叫Non-heap(非堆)，目的就是跟堆分开。</strong></li>
<li>对于HotSpot虚拟机而言，很多开发者习惯把<code v-pre>方法区Method Area</code>描述成<code v-pre>永久代Parmanent Gen</code>,但严格意义上两者不同，或者说使用永久代来实现方法区而已，永久代是方法区（相当于一个接口interface）的一个实现。</li>
<li><code v-pre>永久代Parmanent Gen</code>是一个常驻内存区域，用于存放JDK自身携带的Class,Interface的元数据，也就是说它存储运行环境必须的的类信息，被装进此区域的数据是不会被GC回收的，关闭JVM才会释放此区域占用的内存。</li>
</ul>
<h3 id="栈-、堆-、方法区交互关系" tabindex="-1"><a class="header-anchor" href="#栈-、堆-、方法区交互关系"><span>栈 、堆 、方法区交互关系</span></a></h3>
<ul>
<li>关系交互图
<img :src="$withBase('/jvm/relation.png')" alt="dock"></li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">getHello</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">,</span><span class="token keyword">int</span> age<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>name <span class="token operator">+</span> <span class="token string">"说TA"</span> <span class="token operator">+</span> age <span class="token operator">+</span> <span class="token string">"了"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">Person</span> p1 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        p1<span class="token punctuation">.</span><span class="token function">getHello</span><span class="token punctuation">(</span><span class="token string">"w"</span><span class="token punctuation">,</span><span class="token number">18</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Person</span> p2 <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        p2<span class="token punctuation">.</span><span class="token function">getHello</span><span class="token punctuation">(</span><span class="token string">"s"</span><span class="token punctuation">,</span><span class="token number">24</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>上述代码中，<code v-pre>Person p1 | Person p2</code>、<code v-pre>18 | 24 | w | s</code>在栈中，属于栈的引用reference,以及本地变量</li>
<li><code v-pre> new Person() |  new Person()</code>保存在堆中，开辟内存空间保存对象信息。</li>
<li>而new Person() 、new Person()会在方法区开辟<strong>一块空间</strong>，保证Person这个类的结构信息</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"></span>
<span class="line"><span class="token keyword">package</span> <span class="token namespace">com<span class="token punctuation">.</span>test</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token keyword">class</span> <span class="token class-name">Person</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">private</span> <span class="token class-name">String</span> name<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">setName</span><span class="token punctuation">(</span><span class="token class-name">String</span> name<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span>name <span class="token operator">=</span> name<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token class-name">String</span> <span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token keyword">return</span> name<span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">TestValue</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">getVal1</span><span class="token punctuation">(</span><span class="token keyword">int</span> age<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        age <span class="token operator">=</span> <span class="token number">30</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">getVal2</span><span class="token punctuation">(</span><span class="token class-name">Person</span> person<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        person<span class="token punctuation">.</span><span class="token function">setName</span><span class="token punctuation">(</span><span class="token string">"xxx"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">void</span>  <span class="token function">getVal3</span><span class="token punctuation">(</span><span class="token class-name">String</span> s<span class="token punctuation">)</span><span class="token punctuation">{</span></span>
<span class="line">        s <span class="token operator">=</span> <span class="token string">"456"</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">TestValue</span> value <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">TestValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">int</span> age <span class="token operator">=</span> <span class="token number">20</span><span class="token punctuation">;</span></span>
<span class="line">        value<span class="token punctuation">.</span><span class="token function">getVal1</span><span class="token punctuation">(</span>age<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>age<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">Person</span> person <span class="token operator">=</span><span class="token keyword">new</span> <span class="token class-name">Person</span><span class="token punctuation">(</span><span class="token string">"abc"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        value<span class="token punctuation">.</span><span class="token function">getVal2</span><span class="token punctuation">(</span>person<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>person<span class="token punctuation">.</span><span class="token function">getName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token class-name">String</span> x <span class="token operator">=</span> <span class="token string">"123"</span><span class="token punctuation">;</span></span>
<span class="line">        value<span class="token punctuation">.</span><span class="token function">getVal3</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span>x<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>第一个打印，age数据保存在栈中的，虽然第一个getVal1方法中，修改了age，里面变的是栈中getVal1方法的变量，而出栈以后 回到main方法，这时候打印的还是mian这个栈里面的age值20</li>
<li>第二个打印，是引用类型，getVal2中修改了堆空间中Person这个对象的名字，这时候再打印就是修改过后的xxx</li>
<li>第三个打印，String字符串堆中常量池开辟空间创建了空间保存了'123'，getVal3方法，再堆中创建了一个内存空间'456'，指针指向了新的地址456，但是字符串x指向还是123</li>
</ul>
</div></template>


