<template><div><h3 id="vue-cli搭建项目" tabindex="-1"><a class="header-anchor" href="#vue-cli搭建项目"><span>vue-cli搭建项目</span></a></h3>
<h4 id="安装node-js" tabindex="-1"><a class="header-anchor" href="#安装node-js"><span>安装node.js</span></a></h4>
<p><a href="https://nodejs.org/en/" target="_blank" rel="noopener noreferrer">node官网</a>安装,
安装完成后，cmd输入node -v，如果出现版本号，则安装成功。</p>
<h4 id="切换源" tabindex="-1"><a class="header-anchor" href="#切换源"><span>切换源</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm config set registry https://registry.npm.taobao.org</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="vue-安装" tabindex="-1"><a class="header-anchor" href="#vue-安装"><span>vue 安装</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm i -g vue</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="全局安装-vue-cli" tabindex="-1"><a class="header-anchor" href="#全局安装-vue-cli"><span>全局安装 vue-cli</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm i -g vue-cli</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="基于webpack模板创建项目" tabindex="-1"><a class="header-anchor" href="#基于webpack模板创建项目"><span>基于webpack模板创建项目</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">vue init webpack xxx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>初始化让用户选择几个选项，项目名、描述、vue-router等。</p>
<h4 id="安装依赖" tabindex="-1"><a class="header-anchor" href="#安装依赖"><span>安装依赖</span></a></h4>
<p>模板创建好以后，需要cd 进入xxx项目，然后安装依赖</p>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm i </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="运行项目" tabindex="-1"><a class="header-anchor" href="#运行项目"><span>运行项目</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm run dev</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><p>这时 可以浏览器输入 http://localhost:8080/ 启动项目</p>
</div></template>


