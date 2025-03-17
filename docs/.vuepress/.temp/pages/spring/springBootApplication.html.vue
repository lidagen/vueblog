<template><div><h2 id="springbootapplication-内部实现与原理" tabindex="-1"><a class="header-anchor" href="#springbootapplication-内部实现与原理"><span>@SpringBootApplication 内部实现与原理</span></a></h2>
<ul>
<li>
<p>@SpringBootApplication是springBoot项目的核心注解，目的是开启自动配置</p>
</li>
<li>
<p><strong>@SpringBootApplication</strong> 注解，其实主要由 <strong>@ComponentScan</strong>、<strong>@EnableAutoConfiguration</strong>、<strong>@SpringBootConfiguration</strong>组成</p>
</li>
</ul>
<div class="language-java line-numbers-mode" data-highlighter="prismjs" data-ext="java"><pre v-pre><code><span class="line"><span class="token annotation punctuation">@Target</span><span class="token punctuation">(</span><span class="token punctuation">{</span><span class="token class-name">ElementType</span><span class="token punctuation">.</span><span class="token constant">TYPE</span><span class="token punctuation">}</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token annotation punctuation">@Retention</span><span class="token punctuation">(</span><span class="token class-name">RetentionPolicy</span><span class="token punctuation">.</span><span class="token constant">RUNTIME</span><span class="token punctuation">)</span></span>
<span class="line"><span class="token annotation punctuation">@Documented</span></span>
<span class="line"><span class="token annotation punctuation">@Inherited</span></span>
<span class="line"><span class="token annotation punctuation">@SpringBootConfiguration</span></span>
<span class="line"><span class="token annotation punctuation">@EnableAutoConfiguration</span></span>
<span class="line"><span class="token annotation punctuation">@ComponentScan</span><span class="token punctuation">(</span></span>
<span class="line">    excludeFilters <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token annotation punctuation">@Filter</span><span class="token punctuation">(</span></span>
<span class="line">    type <span class="token operator">=</span> <span class="token class-name">FilterType</span><span class="token punctuation">.</span><span class="token constant">CUSTOM</span><span class="token punctuation">,</span></span>
<span class="line">    classes <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token class-name">TypeExcludeFilter</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token annotation punctuation">@Filter</span><span class="token punctuation">(</span></span>
<span class="line">    type <span class="token operator">=</span> <span class="token class-name">FilterType</span><span class="token punctuation">.</span><span class="token constant">CUSTOM</span><span class="token punctuation">,</span></span>
<span class="line">    classes <span class="token operator">=</span> <span class="token punctuation">{</span><span class="token class-name">AutoConfigurationExcludeFilter</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">)</span><span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"><span class="token keyword">public</span> <span class="token annotation punctuation">@interface</span> <span class="token class-name">SpringBootApplication</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token annotation punctuation">@AliasFor</span><span class="token punctuation">(</span></span>
<span class="line">        annotation <span class="token operator">=</span> <span class="token class-name">EnableAutoConfiguration</span><span class="token punctuation">.</span><span class="token keyword">class</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">exclude</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@AliasFor</span><span class="token punctuation">(</span></span>
<span class="line">        annotation <span class="token operator">=</span> <span class="token class-name">EnableAutoConfiguration</span><span class="token punctuation">.</span><span class="token keyword">class</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">excludeName</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@AliasFor</span><span class="token punctuation">(</span></span>
<span class="line">        annotation <span class="token operator">=</span> <span class="token class-name">ComponentScan</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span></span>
<span class="line">        attribute <span class="token operator">=</span> <span class="token string">"basePackages"</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    <span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">scanBasePackages</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token annotation punctuation">@AliasFor</span><span class="token punctuation">(</span></span>
<span class="line">        annotation <span class="token operator">=</span> <span class="token class-name">ComponentScan</span><span class="token punctuation">.</span><span class="token keyword">class</span><span class="token punctuation">,</span></span>
<span class="line">        attribute <span class="token operator">=</span> <span class="token string">"basePackageClasses"</span></span>
<span class="line">    <span class="token punctuation">)</span></span>
<span class="line">    <span class="token class-name">Class</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token operator">?</span><span class="token punctuation">></span></span><span class="token punctuation">[</span><span class="token punctuation">]</span> <span class="token function">scanBasePackageClasses</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token keyword">default</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="componentscan" tabindex="-1"><a class="header-anchor" href="#componentscan"><span>@ComponentScan</span></a></h3>
<ul>
<li>@ComponentScan告诉Spring 哪个packages 的用注解标识的类 会被spring自动扫描并且装入bean容器。</li>
<li>spring里有四大注解：@Service,@Repository,@Component,@Controller用来定义一个bean.@ComponentScan注解就是用来自动扫描被这些注解标识的类，最终生成ioc容器里的bean．</li>
<li>可以通过设置@ComponentScan　basePackages，includeFilters，excludeFilters属性来动态确定自动扫描范围，类型已经不扫描的类型．</li>
<li>默认情况下:它扫描所有类型，并且扫描范围是@ComponentScan注解所在配置类包及子包的类</li>
</ul>
<h3 id="springbootconfiguration" tabindex="-1"><a class="header-anchor" href="#springbootconfiguration"><span>@SpringBootConfiguration</span></a></h3>
<ul>
<li>@SpringBootConfiguration继承自@Configuration，二者功能也一致，标注当前类是配置类，并会将当前类内声明的一个或多个以@Bean注解标记的方法的实例纳入到spring容器中，并且实例名就是方法名。</li>
</ul>
<h3 id="enableautoconfiguration" tabindex="-1"><a class="header-anchor" href="#enableautoconfiguration"><span>@EnableAutoConfiguration</span></a></h3>
<ul>
<li>@EnableAutoConfiguration 简单概括一下就是，借助@Import的支持，收集和注册特定场景相关的bean定义。</li>
<li>通过@Import(AutoConfigurationImportSelector.class)，借助AutoConfigurationImportSelector，@EnableAutoConfiguration可以帮助SpringBoot应用将所有符合条件的@Configuration配置都加载到当前SpringBoot创建并使用的IoC容器。</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>@EnableAutoConfiguration自动配置:</p>
<ul>
<li>从classpath中搜寻所有的META-INF/spring.factories配置文件，并将其中org.springframework.boot.autoconfigure.EnableutoConfiguration对应的配置项通过反射（Java Refletion）实例化为对应的标注了@Configuration的JavaConfig形式的IoC容器配置类，然后汇总为一个并加载到IoC容器。</li>
</ul>
</div>
</div></template>


