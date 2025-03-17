<template><div><h2 id="dns-原理" tabindex="-1"><a class="header-anchor" href="#dns-原理"><span>DNS 原理</span></a></h2>
<h2 id="tls" tabindex="-1"><a class="header-anchor" href="#tls"><span>TLS</span></a></h2>
<h2 id="协议" tabindex="-1"><a class="header-anchor" href="#协议"><span>协议</span></a></h2>
<h3 id="shadowsocks" tabindex="-1"><a class="header-anchor" href="#shadowsocks"><span>shadowsocks</span></a></h3>
<h3 id="trojan" tabindex="-1"><a class="header-anchor" href="#trojan"><span>trojan</span></a></h3>
<h3 id="vemess" tabindex="-1"><a class="header-anchor" href="#vemess"><span>vemess</span></a></h3>
<h3 id="vless" tabindex="-1"><a class="header-anchor" href="#vless"><span>vless</span></a></h3>
<h2 id="加密访问面板" tabindex="-1"><a class="header-anchor" href="#加密访问面板"><span>加密访问面板</span></a></h2>
<h3 id="端口转发登陆" tabindex="-1"><a class="header-anchor" href="#端口转发登陆"><span>端口转发登陆</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">ssh</span> <span class="token parameter variable">-L</span> <span class="token number">20000</span>:127.0.0.1:20000 ubuntu@47.130.15.132-p <span class="token number">22</span> <span class="token parameter variable">-i</span> /home/wangs/Documents/LightsailDefaultKey-ap-southeast-1.pem</span>
<span class="line">localhost:20000</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="加密https访问" tabindex="-1"><a class="header-anchor" href="#加密https访问"><span>加密https访问</span></a></h4>
<ul>
<li>申请ip</li>
<li>ca认证</li>
<li>xui配置认证</li>
</ul>
<h2 id="build-step" tabindex="-1"><a class="header-anchor" href="#build-step"><span>build step</span></a></h2>
<ul>
<li>buy vps and setup static ip</li>
<li>test ip if allow gw</li>
<li>buy ip and setup DNS</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">namesilo </span>
<span class="line"></span>
<span class="line">options-<span class="token operator">></span> manager DNS </span>
<span class="line"></span>
<span class="line"><span class="token operator">|</span> <span class="token environment constant">HOSTNAME</span>	<span class="token operator">|</span> TYPE	<span class="token operator">|</span> ADDRESS / VALUE	<span class="token operator">|</span> DISTANCE/PRIO	<span class="token operator">|</span>TTL	<span class="token operator">|</span> SERVICE	<span class="token operator">|</span> EDIT	<span class="token operator">|</span> DELETE</span>
<span class="line"><span class="token operator">|</span> :-----<span class="token operator">|</span> :---- <span class="token operator">|</span> :---- <span class="token operator">|</span></span>
<span class="line"><span class="token operator">|</span>    <span class="token operator">|</span>A	<span class="token operator">|</span><span class="token number">47.130</span>.15.132	<span class="token operator">|</span><span class="token number">0</span>	<span class="token operator">|</span><span class="token number">7207</span> <span class="token operator">|</span>*	<span class="token operator">|</span>3rd-party		</span>
<span class="line"><span class="token operator">|</span>*	 <span class="token operator">|</span>A	<span class="token operator">|</span><span class="token number">47.130</span>.15.132	<span class="token operator">|</span><span class="token number">0</span>	<span class="token operator">|</span><span class="token number">3603</span>  <span class="token operator">|</span>*	<span class="token operator">|</span>3rd-party		</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>download pem and ssh logon</li>
<li>install xui</li>
<li>install nginx</li>
<li>install</li>
</ul>
<p>https://x.com/0x_Northland/status/18669589283250011</p>
</div></template>


