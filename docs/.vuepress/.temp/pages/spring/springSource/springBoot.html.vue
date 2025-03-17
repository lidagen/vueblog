<template><div><h2 id="springboot" tabindex="-1"><a class="header-anchor" href="#springboot"><span>SpringBoot</span></a></h2>
<h3 id="启动流程" tabindex="-1"><a class="header-anchor" href="#启动流程"><span>启动流程</span></a></h3>
<h4 id="springboot主启动类启动流程" tabindex="-1"><a class="header-anchor" href="#springboot主启动类启动流程"><span>SpringBoot主启动类启动流程</span></a></h4>
<img :src="$withBase('/springcloud/spe1.png')" alt="dock">
<ul>
<li>1.调用SpringApplication.run()方法，构造一个spring应用</li>
<li>2.会在构造方法中初始化一些模块
<ul>
<li>配置source</li>
<li>配置环境是否为WEB环境</li>
<li>加载初始化器</li>
<li>加载监听器</li>
<li>设置程序运行主类</li>
</ul>
</li>
<li>3.其中的<code v-pre>加载初始化器</code>和<code v-pre>加载监听器</code>会调用 <strong>getSpringFactoriesInstances()</strong> 方法，根据传入类的集合，通过类加载器读取spring.factory文件获取类全限定名，反射实例化对象</li>
<li>4.执行run()方法，启动应用，里面进行了一系列操作
<ul>
<li>启动应用计时器</li>
<li>启动应用监听器模块</li>
<li>配置环境模块environment</li>
<li>配置Banner打印</li>
<li>配置应用上下文</li>
<li>准备上下文环境
<ul>
<li>监听配置</li>
<li>设置环境变量</li>
<li>初始化操作</li>
<li>load对应资源</li>
</ul>
</li>
<li>调用refresh()方法
<ul>
<li>自动装配</li>
<li>tocat配置</li>
</ul>
</li>
</ul>
</li>
</ul>
<h5 id="refresh-方法" tabindex="-1"><a class="header-anchor" href="#refresh-方法"><span>refresh()方法</span></a></h5>
<ul>
<li>AbstractApplicationContext.refresh() 方法
<ul>
<li>AbstractApplicationContext.refresh() 在上图中，走的是第9步refresh</li>
</ul>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">refresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">BeansException</span><span class="token punctuation">,</span> <span class="token class-name">IllegalStateException</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token keyword">synchronized</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>startupShutdownMonitor<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">        <span class="token class-name">StartupStep</span> contextRefresh <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>applicationStartup<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token string">"spring.context.refresh"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">prepareRefresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//获取当前工厂对象</span></span>
<span class="line">        <span class="token class-name">ConfigurableListableBeanFactory</span> beanFactory <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">obtainFreshBeanFactory</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token comment">//设置工厂属性操作</span></span>
<span class="line">        <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">prepareBeanFactory</span><span class="token punctuation">(</span>beanFactory<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token keyword">try</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment">//设置属性值</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">postProcessBeanFactory</span><span class="token punctuation">(</span>beanFactory<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token class-name">StartupStep</span> beanPostProcess <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>applicationStartup<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token string">"spring.context.beans.post-process"</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token comment">//*BeanFactoryPostProcessor操作,修改bean定义信息</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">invokeBeanFactoryPostProcessors</span><span class="token punctuation">(</span>beanFactory<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">registerBeanPostProcessors</span><span class="token punctuation">(</span>beanFactory<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            beanPostProcess<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">initMessageSource</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">initApplicationEventMulticaster</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onRefresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">registerListeners</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">finishBeanFactoryInitialization</span><span class="token punctuation">(</span>beanFactory<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">finishRefresh</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">BeansException</span> var10<span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>logger<span class="token punctuation">.</span><span class="token function">isWarnEnabled</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">                <span class="token keyword">this</span><span class="token punctuation">.</span>logger<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">"Exception encountered during context initialization - cancelling refresh attempt: "</span> <span class="token operator">+</span> var10<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">destroyBeans</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">cancelRefresh</span><span class="token punctuation">(</span>var10<span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            <span class="token keyword">throw</span> var10<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span></span>
<span class="line">            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">resetCommonCaches</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">            contextRefresh<span class="token punctuation">.</span><span class="token function">end</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span>   </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="自动装配" tabindex="-1"><a class="header-anchor" href="#自动装配"><span>自动装配</span></a></h3>
<img :src="$withBase('/springcloud/spr.png')" alt="dock">
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>BeanFactory 和 FactoryBean
<ul>
<li>BeanFactory:负责生产和管理Bean的一个工厂接口，提供一个Spring Ioc容器规范</li>
<li>FactoryBean: 一种Bean创建的一种方式，对Bean的一种扩展。对于复杂的Bean对象初始化创建使用其可封装对象的创建细节。</li>
</ul>
</li>
</ul>
</div>
<ul>
<li>项目启动run方法时，扫描@Component往上找会找到我们主启动类@SpringBootApplication，</li>
<li>自动装配，实质是启动类注解@EnableAutoConfiguration中的@Import注解去找AutoConfigurationImportSelector</li>
<li>类里面会调用SpringFactoriesLoader.loadFactoryNames方法</li>
<li>去查找META-INF目录下的spring.factorys文件，里面定义了一系列的自动装配类全限定名，之后会把这些自动装配类的bean定义，加载到BeanDefinitionMap中</li>
<li>之后BeanFactory就会从BeanDefinition拿到自动装配的Bean信息，进行实例化</li>
</ul>
</div></template>


