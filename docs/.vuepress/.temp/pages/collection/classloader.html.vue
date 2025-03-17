<template><div><h2 id="java-类加载" tabindex="-1"><a class="header-anchor" href="#java-类加载"><span>Java 类加载</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>每个编写的<code v-pre>.java</code>文件都存储着需要执行的程序逻辑。这些<code v-pre>.java</code>文件经过编译后变成拓展名为<code v-pre>.class</code>的虚拟机能执行的指令文件。当需要执行某个类时，虚拟机会加载<code v-pre>.calss</code>文件，并创建对应的class对象，将class文件加载进内存中，这个过程称为类加载过程。</li>
</ul>
<h3 id="类加载过程" tabindex="-1"><a class="header-anchor" href="#类加载过程"><span>类加载过程</span></a></h3>
<h4 id="jvm将类加载的过程分为三个步骤-装载-load-链接-link-初始化-initialize" tabindex="-1"><a class="header-anchor" href="#jvm将类加载的过程分为三个步骤-装载-load-链接-link-初始化-initialize"><span>JVM将类加载的过程分为三个步骤：<code v-pre>装载 Load</code> <code v-pre>链接 Link</code> <code v-pre>初始化 Initialize</code></span></a></h4>
<ul>
<li>
<p><strong>装载</strong> :通过一个类的完全限定查找此类字节码文件，并利用字节码文件创建一个Class对象</p>
</li>
<li>
<p><strong>链接</strong> :</p>
<ul>
<li>
<p><code v-pre>验证</code> : 目的在于确保Class文件的字节流中包含信息符合当前虚拟机要求，不会危害虚拟机自身安全。主要包括四种验证，文件格式验证，元数据验证，字节码验证，符号引用验证。</p>
</li>
<li>
<p><code v-pre>准备</code> : 为类变量(即static修饰的字段变量)分配内存并且设置该类变量的初始值即0(如static int i=5;这里只将i初始化为0，至于5的值将在初始化时赋值)，这里不包含用final修饰的static，因为final在编译的时候就会分配了，注意这里不会为实例变量分配初始化，类变量会分配在方法区中，而实例变量是会随着对象一起分配到Java堆中。</p>
</li>
<li>
<p><code v-pre>解析</code> : 主要将常量池中的符号引用替换为直接引用的过程。符号引用就是一组符号来描述目标，可以是任何字面量，而直接引用就是直接指向目标的指针、相对偏移量或一个间接定位到目标的句柄。有类或接口的解析，字段解析，类方法解析，接口方法解析(这里涉及到字节码变量的引用，如需更详细了解，可参考《深入Java虚拟机》)。</p>
</li>
</ul>
</li>
<li>
<p><strong>初始化</strong> :类加载最后阶段，若该类具有超(父)类，则对其进行初始化，执行静态初始化器和静态初始化成员变量(如前面只初始化了默认值的static变量将会在这个阶段赋值，成员变量也将被初始化)。</p>
</li>
</ul>
<h3 id="类的初始化" tabindex="-1"><a class="header-anchor" href="#类的初始化"><span>类的初始化</span></a></h3>
<h4 id="_6种情况下类会被初始化" tabindex="-1"><a class="header-anchor" href="#_6种情况下类会被初始化"><span>6种情况下类会被初始化</span></a></h4>
<ul>
<li>
<p>创建类的实例时。（new 对象）</p>
</li>
<li>
<p>访问某个类或者接口的静态变量，或对静态变量赋值</p>
</li>
<li>
<p>调用类的静态方法</p>
</li>
<li>
<p>反射（Class.forName(com.test.+.ReflectDemo)）</p>
</li>
<li>
<p>初始化一个类的子类</p>
</li>
<li>
<p>JVM启动时标明的启动类，即文件名和类名相同的那个类</p>
</li>
</ul>
</div></template>


