<template><div><h2 id="vuepress-搭建自己的博客" tabindex="-1"><a class="header-anchor" href="#vuepress-搭建自己的博客"><span>vuepress 搭建自己的博客</span></a></h2>
<ul>
<li>VuePress 是什么：
VuePress是以Vue驱动的静态网站生成器，是一个由Vue、Vue Router和webpack驱动的单页应用。在VuePress中，你可以使用Markdown编写文档，然后生成网页，每一个由VuePress生成的页面都带有预渲染好的HTML，也因此具有非常好的加载性能和搜索引擎优化。同时，一旦页面被加载，Vue将接管这些静态内容，并将其转换成一个完整的单页应用，其他的页面则会只在用户浏览到的时候才按需加载。</li>
</ul>
<h4 id="环境搭建" tabindex="-1"><a class="header-anchor" href="#环境搭建"><span>环境搭建</span></a></h4>
<ul>
<li>VuePress支持使用Yarn和npm来安装，Node.js版本需要&gt;=8才可以。</li>
</ul>
<h4 id="全局安装vuepress" tabindex="-1"><a class="header-anchor" href="#全局安装vuepress"><span>全局安装VuePress</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">yarn global add vuepress # 或者：npm install -g vuepress</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="创建项目-myblog" tabindex="-1"><a class="header-anchor" href="#创建项目-myblog"><span>创建项目 myblog</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">mkdir myblog</span>
<span class="line">cd myblog</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="初始化项目" tabindex="-1"><a class="header-anchor" href="#初始化项目"><span>初始化项目</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">yarn init -y # 或者 npm init -y</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="构建基本项目目录" tabindex="-1"><a class="header-anchor" href="#构建基本项目目录"><span>构建基本项目目录</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">project</span>
<span class="line">├─── docs</span>
<span class="line">│   ├── README.md</span>
<span class="line">│   └── .vuepress</span>
<span class="line">│       ├── public</span>
<span class="line">│       └── config.js</span>
<span class="line">└── package.json</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="readme-md-加入如下内容" tabindex="-1"><a class="header-anchor" href="#readme-md-加入如下内容"><span>README.md 加入如下内容</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">---</span>
<span class="line">home: true</span>
<span class="line">actionText: 前往 →</span>
<span class="line">actionLink: /guide/</span>
<span class="line">features:</span>
<span class="line">- title: 布局类组件</span>
<span class="line">  details: 基本组件，为常用组件提供快速，可用的组件</span>
<span class="line">- title: 可视化组件</span>
<span class="line">  details: 积累将数据可视化的业务组件</span>
<span class="line">- title: 知识库</span>
<span class="line">  details: 积累前端相关的知识，涵盖 vue、react、koa2、nodejs 相关的知识点</span>
<span class="line">---</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<pre><code>config.js主要是配置包括网站的标题、描述等基本信息，以及主题的配置

title博客主题

description 描述

base 对应github项目名

官方解释：- 如果你打算发布到 https://&lt;USERNAME&gt;.github.io/，则可以省略这一步，
         因为 base 默认即是 &quot;/&quot;。
         - 如果你打算发布到 https://&lt;USERNAME&gt;.github.io/&lt;REPO&gt;/（也就是说你的
         仓库在 https://github.com/&lt;USERNAME&gt;/&lt;REPO&gt;），则将 base 设置为 &quot;/&lt;REPO&gt;/&quot;。    

themeConfig 主题配置

    nav：导航条
    sidebar：侧边栏

    侧边栏children对应的是自己编辑文章的目录。此项目docs同级别的有个guide文件夹，
    里面vue文件夹下包含三个.md文件（vue1、vue2、vue3）
</code></pre>
</div>
<div class="language-JS line-numbers-mode" data-highlighter="prismjs" data-ext="JS"><pre v-pre><code><span class="line">module.exports = {</span>
<span class="line">    title: 'GENDALI',</span>
<span class="line">    description: '编程 学习博客',</span>
<span class="line highlighted">    base: '/lidagen.github.io/',</span>
<span class="line">    themeConfig: {</span>
<span class="line">        nav:[</span>
<span class="line">            { text: '主页', link: '/' }, // 导航条</span>
<span class="line">            { text: 'vuepress', link: '/nav/vuepress' },</span>
<span class="line">            { text: 'link',        // 这里是下拉列表展现形式。</span>
<span class="line">              items: [</span>
<span class="line">                { text: 'github', link: 'https://github.com/lidagen' },</span>
<span class="line">                { text: 'gitee', link: 'https://gitee.com/GENDALI' },</span>
<span class="line">              ]</span>
<span class="line">            }</span>
<span class="line">        ],</span>
<span class="line">        sidebar: [</span>
<span class="line">            {</span>
<span class="line">                title: 'vue', // 侧边栏名称</span>
<span class="line">                collapsable: true, // 可折叠</span>
<span class="line">                children: [</span>
<span class="line">                ['/guide/vue/vue1', 'dialog 弹出框使用'],// 你的md文件地址,后一个为标题</span>
<span class="line">                ['/guide/vue/vue2', 'vue 动态刷新页面'],</span>
<span class="line">                ['/guide/vue/vue3', 'vue 封装分页组件']</span>
<span class="line">                ]</span>
<span class="line">            },</span>
<span class="line">        ]</span>
<span class="line">    }</span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="package-json-修改" tabindex="-1"><a class="header-anchor" href="#package-json-修改"><span>package.json 修改</span></a></h4>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"><span class="token string-property property">"scripts"</span><span class="token operator">:</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token string-property property">"test"</span><span class="token operator">:</span> <span class="token string">"echo \"Error: no test specified\" &amp;&amp; exit 1"</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string-property property">"docs:dev"</span><span class="token operator">:</span> <span class="token string">"vuepress dev docs"</span><span class="token punctuation">,</span></span>
<span class="line highlighted">    <span class="token string-property property">"docs:build"</span><span class="token operator">:</span> <span class="token string">"vuepress build docs"</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="启动" tabindex="-1"><a class="header-anchor" href="#启动"><span>启动</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm run docs:dev</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="打包" tabindex="-1"><a class="header-anchor" href="#打包"><span>打包</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">npm run docs:build</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h2 id="部署博客" tabindex="-1"><a class="header-anchor" href="#部署博客"><span>部署博客</span></a></h2>
<h4 id="在github上创建一个名为-myblog-的仓库-并将你的代码提交到github上" tabindex="-1"><a class="header-anchor" href="#在github上创建一个名为-myblog-的仓库-并将你的代码提交到github上"><span>在github上创建一个名为 myblog 的仓库,并将你的代码提交到github上.</span></a></h4>
<h4 id="在项目根目录中-创建一个如下的-deploy-sh-脚本文件" tabindex="-1"><a class="header-anchor" href="#在项目根目录中-创建一个如下的-deploy-sh-脚本文件"><span>在项目根目录中，创建一个如下的 deploy.sh 脚本文件</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/usr/bin/env sh</span>
<span class="line"></span>
<span class="line"># 确保脚本抛出遇到的错误</span>
<span class="line">set -e</span>
<span class="line"></span>
<span class="line"># 生成静态文件</span>
<span class="line">npm run docs:build</span>
<span class="line"></span>
<span class="line"># 进入生成的文件夹</span>
<span class="line">cd docs/.vuepress/dist</span>
<span class="line"></span>
<span class="line">git init</span>
<span class="line">git add -A</span>
<span class="line">git commit -m 'deploy'</span>
<span class="line"></span>
<span class="line"># 如果发布到 https://&lt;USERNAME>.github.io/&lt;REPO></span>
<span class="line">git push -f git@github.com:&lt;USERNAME>/&lt;REPO>.git master:gh-pages</span>
<span class="line"></span>
<span class="line">cd -</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="运行deploy-sh" tabindex="-1"><a class="header-anchor" href="#运行deploy-sh"><span>运行deploy.sh</span></a></h4>
<p>双击运行 deploy.sh，脚本会自动打包提交github</p>
<h4 id="设置" tabindex="-1"><a class="header-anchor" href="#设置"><span>设置</span></a></h4>
<p>在 GitHub 项目点击 Setting 按钮，找到 GitHub Pages - Source，选择 gh-pages 分支，点击 Save 按钮后，静静地等待它部署完成即可。</p>
<h3 id="安装评论系统-valine" tabindex="-1"><a class="header-anchor" href="#安装评论系统-valine"><span>安装评论系统-Valine</span></a></h3>
<h4 id="注册" tabindex="-1"><a class="header-anchor" href="#注册"><span>注册</span></a></h4>
<ul>
<li><a href="https://valine.js.org/quickstart.html" target="_blank" rel="noopener noreferrer">注册Valine</a></li>
<li>创建应用获取<code v-pre>appID</code> <code v-pre>AppKey</code></li>
</ul>
<h4 id="安装valine" tabindex="-1"><a class="header-anchor" href="#安装valine"><span>安装Valine</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># Install leancloud's js-sdk</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> leancloud-storage <span class="token parameter variable">--save</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># Install valine</span></span>
<span class="line"><span class="token function">npm</span> <span class="token function">install</span> valine <span class="token parameter variable">--save</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="自定义组件" tabindex="-1"><a class="header-anchor" href="#自定义组件"><span>自定义组件</span></a></h4>
<ul>
<li><code v-pre>.vuepress/components</code> 目录中创建文件<code v-pre>Valine.vue</code></li>
</ul>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>template</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>section</span> <span class="token special-attr"><span class="token attr-name">style</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token value css language-css"><span class="token property">border-top</span><span class="token punctuation">:</span> 2px solid #eaecef<span class="token punctuation">;</span><span class="token property">padding-top</span><span class="token punctuation">:</span>1rem<span class="token punctuation">;</span><span class="token property">margin-top</span><span class="token punctuation">:</span>2rem<span class="token punctuation">;</span></span><span class="token punctuation">"</span></span></span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span><span class="token punctuation">></span></span></span>
<span class="line">      <span class="token comment">&lt;!-- id 将作为查询条件 --></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>span</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>leancloud-visitors<span class="token punctuation">"</span></span></span>
<span class="line">            <span class="token attr-name">data-flag-title</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>Your Article Title<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>em</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>post-meta-item-text<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>阅读量： <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>em</span><span class="token punctuation">></span></span></span>
<span class="line">        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>i</span> <span class="token attr-name">class</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>leancloud-visitors-count<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>i</span><span class="token punctuation">></span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>span</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>h3</span><span class="token punctuation">></span></span></span>
<span class="line">      <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>a</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>javascript:;<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>a</span><span class="token punctuation">></span></span></span>
<span class="line">      评 论：</span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>h3</span><span class="token punctuation">></span></span></span>
<span class="line">    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>div</span> <span class="token attr-name">id</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>vcomments<span class="token punctuation">"</span></span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>div</span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>section</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>template</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>script</span><span class="token punctuation">></span></span><span class="token script"><span class="token language-javascript"></span>
<span class="line"><span class="token keyword">export</span> <span class="token keyword">default</span> <span class="token punctuation">{</span></span>
<span class="line">  <span class="token literal-property property">name</span><span class="token operator">:</span> <span class="token string">'Valine'</span><span class="token punctuation">,</span></span>
<span class="line">  <span class="token function-variable function">mounted</span><span class="token operator">:</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token comment">// require window</span></span>
<span class="line">    <span class="token keyword">const</span> Valine <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'valine'</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">typeof</span> window <span class="token operator">!==</span> <span class="token string">'undefined'</span><span class="token punctuation">)</span> <span class="token punctuation">{</span></span>
<span class="line">      document<span class="token punctuation">.</span><span class="token function">getElementsByClassName</span><span class="token punctuation">(</span><span class="token string">'leancloud-visitors'</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">0</span><span class="token punctuation">]</span><span class="token punctuation">.</span>id</span>
<span class="line">        <span class="token operator">=</span> window<span class="token punctuation">.</span>location<span class="token punctuation">.</span>pathname</span>
<span class="line">      <span class="token keyword">this</span><span class="token punctuation">.</span>window <span class="token operator">=</span> window</span>
<span class="line">      window<span class="token punctuation">.</span><span class="token constant">AV</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">'leancloud-storage'</span><span class="token punctuation">)</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token keyword">new</span> <span class="token class-name">Valine</span><span class="token punctuation">(</span><span class="token punctuation">{</span></span>
<span class="line">      <span class="token literal-property property">el</span><span class="token operator">:</span> <span class="token string">'#vcomments'</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">appId</span><span class="token operator">:</span> <span class="token string">'XXXXXXXXXXXXX'</span><span class="token punctuation">,</span><span class="token comment">// your appId</span></span>
<span class="line">      <span class="token literal-property property">appKey</span><span class="token operator">:</span> <span class="token string">'XXXXXXXXXXXXX'</span><span class="token punctuation">,</span> <span class="token comment">// your appKey</span></span>
<span class="line">      <span class="token literal-property property">notify</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">verify</span><span class="token operator">:</span> <span class="token boolean">false</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">path</span><span class="token operator">:</span> window<span class="token punctuation">.</span>location<span class="token punctuation">.</span>pathname<span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">visitor</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">avatar</span><span class="token operator">:</span> <span class="token string">'mm'</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token literal-property property">placeholder</span><span class="token operator">:</span> <span class="token string">'write here'</span></span>
<span class="line">    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>script</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="配置" tabindex="-1"><a class="header-anchor" href="#配置"><span>配置</span></a></h4>
<ul>
<li><code v-pre>.vuepress/config.js</code>配置文件中加入</li>
</ul>
<div class="language-javascript line-numbers-mode" data-highlighter="prismjs" data-ext="js"><pre v-pre><code><span class="line"> <span class="token literal-property property">plugins</span><span class="token operator">:</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token punctuation">[</span></span>
<span class="line">      <span class="token string">'@vuepress/register-components'</span><span class="token punctuation">,</span></span>
<span class="line">      <span class="token punctuation">{</span></span>
<span class="line">        <span class="token literal-property property">componentsDir</span><span class="token operator">:</span> <span class="token string">'./components'</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">    <span class="token punctuation">]</span></span>
<span class="line">  <span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="使用" tabindex="-1"><a class="header-anchor" href="#使用"><span>使用</span></a></h4>
<p>md 文件中最后一行使用这个标签</p>
<div class="language-html line-numbers-mode" data-highlighter="prismjs" data-ext="html"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>Valine</span><span class="token punctuation">></span></span><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Valine</span><span class="token punctuation">></span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></div></template>


