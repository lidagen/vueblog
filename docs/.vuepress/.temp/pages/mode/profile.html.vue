<template><div><h2 id="spring-profile动态加载properties使用" tabindex="-1"><a class="header-anchor" href="#spring-profile动态加载properties使用"><span>Spring - profile动态加载properties使用</span></a></h2>
<ul>
<li>profile可以实现不改动代码的情况下动态加载不同环境参数。</li>
</ul>
<h3 id="sprignboot-配置" tabindex="-1"><a class="header-anchor" href="#sprignboot-配置"><span>sprignboot 配置</span></a></h3>
<ul>
<li>新建两个环境的properties,<code v-pre>application-dev.properties</code>和<code v-pre>application-prd.properties</code>,设置不同端口号</li>
</ul>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties"><pre v-pre><code><span class="line"><span class="token comment">#dev</span></span>
<span class="line"><span class="token key attr-name">server.port</span><span class="token punctuation">=</span><span class="token value attr-value">8787</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties"><pre v-pre><code><span class="line"><span class="token comment">#prd</span></span>
<span class="line"><span class="token key attr-name">server.port</span><span class="token punctuation">=</span><span class="token value attr-value">8778</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>修改pom.xml</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token comment">&lt;!--新增profiles配置--></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>profiles</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>profile</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>id</span><span class="token punctuation">></span></span>dev<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>id</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token comment">&lt;!--默认打包环境--></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>activation</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>activeByDefault</span><span class="token punctuation">></span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>activeByDefault</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>activation</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>properties</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>package.env</span><span class="token punctuation">></span></span>dev<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>package.env</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>properties</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>profile</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>profile</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>id</span><span class="token punctuation">></span></span>prd<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>id</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>properties</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>package.env</span><span class="token punctuation">></span></span>prd<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>package.env</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>properties</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>profile</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>profiles</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"> <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>build</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugins</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>plugin</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>groupId</span><span class="token punctuation">></span></span>org.springframework.boot<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>groupId</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>artifactId</span><span class="token punctuation">></span></span>spring-boot-maven-plugin<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>artifactId</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugin</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>plugins</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token comment">&lt;!--新增resources配置，排除新增的两个properties,根据动态加载--></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>resources</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>resource</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>filtering</span><span class="token punctuation">></span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>filtering</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>directory</span><span class="token punctuation">></span></span>src/main/resources<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>directory</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token comment">&lt;!--打包时，指不要这些文件--></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>excludes</span><span class="token punctuation">></span></span></span>
<span class="line">                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>exclude</span><span class="token punctuation">></span></span>application-dev.properties<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>exclude</span><span class="token punctuation">></span></span></span>
<span class="line">                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>exclude</span><span class="token punctuation">></span></span>application-prd.properties<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>exclude</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>excludes</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>resource</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>resource</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>filtering</span><span class="token punctuation">></span></span>true<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>filtering</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>directory</span><span class="token punctuation">></span></span>src/main/resources<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>directory</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>includes</span><span class="token punctuation">></span></span></span>
<span class="line">                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>include</span><span class="token punctuation">></span></span>application.properties<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>include</span><span class="token punctuation">></span></span></span>
<span class="line">                <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>include</span><span class="token punctuation">></span></span>application-${package.env}.properties<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>include</span><span class="token punctuation">></span></span></span>
<span class="line">            <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>includes</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>resource</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>resources</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>build</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>主 <code v-pre>application.properties</code>配置</li>
</ul>
<div class="language-properties line-numbers-mode" data-highlighter="prismjs" data-ext="properties"><pre v-pre><code><span class="line"><span class="token comment"># package.env 对应pom文件中profile中定义的名称</span></span>
<span class="line"><span class="token key attr-name">spring.profiles.active</span><span class="token punctuation">=</span><span class="token value attr-value">@package.env@</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="maven-打包" tabindex="-1"><a class="header-anchor" href="#maven-打包"><span>maven 打包</span></a></h3>
<ul>
<li>两个不同命令会加载不同配置文件</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">mvn clean install -Pdev</span>
<span class="line">mvn clean install -Pprd</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


