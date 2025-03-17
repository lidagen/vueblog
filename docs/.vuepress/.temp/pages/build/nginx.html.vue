<template><div><h2 id="nginx基本概念" tabindex="-1"><a class="header-anchor" href="#nginx基本概念"><span>nginx基本概念</span></a></h2>
<h3 id="nginx是什么" tabindex="-1"><a class="header-anchor" href="#nginx是什么"><span>nginx是什么</span></a></h3>
<ul>
<li>Nginx是一款轻量级的Web 服务器/反向代理服务器及电子邮件（IMAP/POP3）代理服务器。 Nginx 主要提供反向代理、负载均衡、动静分离(静态资源服务)等服务。</li>
</ul>
<h3 id="nginx的优点" tabindex="-1"><a class="header-anchor" href="#nginx的优点"><span>nginx的优点</span></a></h3>
<ul>
<li>高并发，高性能</li>
<li>可扩展性好</li>
<li>高可靠性</li>
<li>热部署</li>
</ul>
<h3 id="反向代理" tabindex="-1"><a class="header-anchor" href="#反向代理"><span>反向代理</span></a></h3>
<ul>
<li>
<p>说到反向代理，就要说说正向代理。</p>
<ul>
<li><strong>正向代理</strong>：某些情况下，代理我们用户去访问服务器，需要用户手动的设置代理服务器的ip和端口号。正向代理比较常见的一个例子就是 VPN了。</li>
<li><strong>反向代理</strong>： 是用来代理服务器的，代理我们要访问的目标服务器。代理服务器接受请求，然后将请求转发给内部网络的服务器，并将从服务器上得到的结果返回给客户端，此时代理服务器对外就表现为一个服务器。</li>
</ul>
</li>
<li>
<p>正向代理是为客户端做代理，代替客户端访问服务器。反向代理是为服务器做代理，代替服务器接收客户端请求。</p>
</li>
</ul>
<h3 id="负载均衡" tabindex="-1"><a class="header-anchor" href="#负载均衡"><span>负载均衡</span></a></h3>
<ul>
<li>
<p>高并发的情况下，为了减轻单台服务器模式的压力，用多台服务器集群部署共同完成工作，提高了访问吞吐量。nginx可以负责分发请求到不同的服务器。提供负载均衡功能。</p>
</li>
<li>
<p>nginx支持的负载均衡策略有：</p>
<ul>
<li>weigth(权重):通过给每个服务器设置不同的权重，从而达到接收不同的请求量。</li>
<li>ip_hash(ip hash分配):通过对ip进行hash,使对应的ip始终落在同一个服务器上（解决分布式session共享问题）。</li>
<li>fair(响应时间):让请求落在响应时间最少的服务器上。</li>
<li>url_hash(url分配):不同的url落在不同的服务器上。</li>
</ul>
</li>
<li>
<p>weigth配置nginx</p>
<ul>
<li>起两个springboot项目，localhost/hi 页面写上对应端口号，端口分别为8989和8990</li>
<li>nginx.conf配置如下<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">worker_processes  <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">events <span class="token punctuation">{</span></span>
<span class="line">    worker_connections  <span class="token number">1024</span><span class="token punctuation">;</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">http <span class="token punctuation">{</span></span>
<span class="line">    include       mime.types<span class="token punctuation">;</span></span>
<span class="line">    default_type  application/octet-stream<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    sendfile        on<span class="token punctuation">;</span></span>
<span class="line">   </span>
<span class="line">    keepalive_timeout  <span class="token number">65</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">#增加upstream配置两个服务,名字叫hello,包含两个server</span></span>
<span class="line">    <span class="token comment"># 并设置不同的权重</span></span>
<span class="line">    <span class="token comment"># 如果不要 weight=5字段，默认轮询的</span></span>
<span class="line">    upstream hello<span class="token punctuation">{</span></span>
<span class="line">    server <span class="token number">127.0</span>.0.1:8989 <span class="token assign-left variable">weight</span><span class="token operator">=</span><span class="token number">5</span><span class="token punctuation">;</span></span>
<span class="line">    server <span class="token number">127.0</span>.0.1:8990 <span class="token assign-left variable">weight</span><span class="token operator">=</span><span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    server <span class="token punctuation">{</span></span>
<span class="line">        listen       <span class="token number">80</span><span class="token punctuation">;</span></span>
<span class="line">        server_name  localhost<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        location / <span class="token punctuation">{</span></span>
<span class="line">            <span class="token comment"># 配置 proxy_pass 指向upstream配置的别名hello</span></span>
<span class="line">            proxy_pass http://hello<span class="token punctuation">;</span></span>
<span class="line">            root   html<span class="token punctuation">;</span></span>
<span class="line">            index  index.html index.htm<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        error_page   <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span>  /50x.html<span class="token punctuation">;</span></span>
<span class="line">        location <span class="token operator">=</span> /50x.html <span class="token punctuation">{</span></span>
<span class="line">            root   html<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>./nginx -s reload重启后访问<code v-pre>locallost/hi</code>查看不同端口号的服务器访问的次数是否跟配置的权重一致。</li>
</ul>
</li>
<li>
<p>ip_hash配置nginx</p>
<ul>
<li>起两个项目不变，修改nginx.conf</li>
<li>配置如下</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">worker_processes  <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">  events <span class="token punctuation">{</span></span>
<span class="line">      worker_connections  <span class="token number">1024</span><span class="token punctuation">;</span></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">  http <span class="token punctuation">{</span></span>
<span class="line">      include       mime.types<span class="token punctuation">;</span></span>
<span class="line">      default_type  application/octet-stream<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">      sendfile        on<span class="token punctuation">;</span></span>
<span class="line">     </span>
<span class="line">      keepalive_timeout  <span class="token number">65</span><span class="token punctuation">;</span></span>
<span class="line">      upstream hello<span class="token punctuation">{</span></span>
<span class="line">          <span class="token comment">#加上ip_hash就可以根据ip分配服务器，能解决session共享问题</span></span>
<span class="line">          ip_hash<span class="token punctuation">;</span></span>
<span class="line">          server <span class="token number">127.0</span>.0.1:8989<span class="token punctuation">;</span></span>
<span class="line">          server <span class="token number">127.0</span>.0.1:8990<span class="token punctuation">;</span></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line">      server <span class="token punctuation">{</span></span>
<span class="line">          listen       <span class="token number">80</span><span class="token punctuation">;</span></span>
<span class="line">          server_name  localhost<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">          location / <span class="token punctuation">{</span></span>
<span class="line">              <span class="token comment"># 配置 proxy_pass 指向upstream配置的别名hello</span></span>
<span class="line">              proxy_pass http://hello<span class="token punctuation">;</span></span>
<span class="line">              root   html<span class="token punctuation">;</span></span>
<span class="line">              index  index.html index.htm<span class="token punctuation">;</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">          error_page   <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span>  /50x.html<span class="token punctuation">;</span></span>
<span class="line">          location <span class="token operator">=</span> /50x.html <span class="token punctuation">{</span></span>
<span class="line">              root   html<span class="token punctuation">;</span></span>
<span class="line">          <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">      <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">  <span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<h3 id="动静分离" tabindex="-1"><a class="header-anchor" href="#动静分离"><span>动静分离</span></a></h3>
<ul>
<li>动静分离是动态网站根据一定规则把不变的资源和经常变的数据分离开，放在不同的服务器上。对静态资源做缓存。使访问服务器的压力降低。</li>
</ul>
<h3 id="nginx-keepalived-高可用" tabindex="-1"><a class="header-anchor" href="#nginx-keepalived-高可用"><span>Nginx + keepalived 高可用</span></a></h3>
</div></template>


