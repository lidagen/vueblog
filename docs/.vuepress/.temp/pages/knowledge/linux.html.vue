<template><div><h3 id="linux常用命令" tabindex="-1"><a class="header-anchor" href="#linux常用命令"><span>Linux常用命令</span></a></h3>
<h4 id="日志查找" tabindex="-1"><a class="header-anchor" href="#日志查找"><span>日志查找</span></a></h4>
<ul>
<li>cat关键字查找</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">cat</span> xxx.log <span class="token operator">|</span><span class="token function">grep</span> <span class="token string">'关键字'</span> <span class="token parameter variable">--color</span></span>
<span class="line"></span>
<span class="line">// <span class="token punctuation">(</span>显示日志里匹配字串那行以及前后5行<span class="token punctuation">)</span></span>
<span class="line"><span class="token function">cat</span> xxx.log <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-C</span> <span class="token number">5</span> <span class="token string">'关键字'</span></span>
<span class="line"></span>
<span class="line">//全局搜索关键字</span>
<span class="line"><span class="token function">find</span> ./ <span class="token operator">!</span> <span class="token parameter variable">-name</span> <span class="token string">"*[0-9]*"</span> <span class="token operator">|</span> <span class="token function">xargs</span> <span class="token function">grep</span> <span class="token parameter variable">--color</span> <span class="token string">'关键字'</span></span>
<span class="line">//去除注释查看redis.conf </span>
<span class="line"><span class="token function">cat</span> redis.conf <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">"#"</span> <span class="token operator">|</span><span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">"^$"</span></span>
<span class="line">//去除注释并复制redis-6379.conf</span>
<span class="line"><span class="token function">cat</span> redis.conf <span class="token operator">|</span> <span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">"#"</span> <span class="token operator">|</span><span class="token function">grep</span> <span class="token parameter variable">-v</span> <span class="token string">"^$"</span> <span class="token operator">></span> redis-6329.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>tail查看日志</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">//查看实时日志</span>
<span class="line">tail -f xxx.log</span>
<span class="line"></span>
<span class="line">//最后20行日志</span>
<span class="line">tail -n 20 xxx.log</span>
<span class="line"></span>
<span class="line">//查看磁盘空间</span>
<span class="line">df -h</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


