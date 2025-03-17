<template><div><h3 id="配置docker" tabindex="-1"><a class="header-anchor" href="#配置docker"><span>配置Docker</span></a></h3>
<ul>
<li>登录阿里云找到容器镜像服务</li>
<li>创建命名空间</li>
<li>创建镜像仓库</li>
</ul>
<h3 id="配置阿里云镜像加速器" tabindex="-1"><a class="header-anchor" href="#配置阿里云镜像加速器"><span>配置阿里云镜像加速器</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 宿主机docker修改镜像源</span></span>
<span class="line">$ <span class="token function">sudo</span> <span class="token function">mkdir</span> <span class="token parameter variable">-p</span> /etc/docker</span>
<span class="line">$ <span class="token function">sudo</span> <span class="token function">tee</span> /etc/docker/daemon.json <span class="token operator">&lt;&lt;-</span><span class="token string">'EOF'</span>
<span class="line">{</span>
<span class="line">  "registry-mirrors": ["https://a8qh6yqv.mirror.aliyuncs.com"]</span>
<span class="line">}</span>
<span class="line">EOF</span></span>
<span class="line">$ <span class="token function">sudo</span> systemctl daemon-reload</span>
<span class="line">$ <span class="token function">sudo</span> systemctl restart <span class="token function">docker</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="登录仓库" tabindex="-1"><a class="header-anchor" href="#登录仓库"><span>登录仓库</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> <span class="token function">docker</span> login <span class="token parameter variable">--username</span><span class="token operator">=</span>你的阿里云登录帐号 registry.cn-hangzhou.aliyuncs.com</span>
<span class="line">Password: <span class="token comment"># aliyun访问凭证中设置密码，不是aliyun登录密码</span></span>
<span class="line">Login Succeeded</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="镜像使用" tabindex="-1"><a class="header-anchor" href="#镜像使用"><span>镜像使用</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> <span class="token function">docker</span> pull registry.cn-hangzhou.aliyuncs.com/空间名/仓库</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="提交镜像" tabindex="-1"><a class="header-anchor" href="#提交镜像"><span>提交镜像</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">$ <span class="token function">sudo</span> <span class="token function">docker</span> tag <span class="token operator">&lt;</span>已存在镜像ID或名称<span class="token operator">></span> registry.cn-hangzhou.aliyuncs.com/空间名/仓库</span>
<span class="line">$ <span class="token function">sudo</span> <span class="token function">docker</span> push registry.cn-hangzhou.aliyuncs.com/空间名/仓库</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


