<template><div><h2 id="nginx-安装、常用命令和配置文件" tabindex="-1"><a class="header-anchor" href="#nginx-安装、常用命令和配置文件"><span>nginx 安装、常用命令和配置文件</span></a></h2>
<h3 id="nginx-centos中的安装" tabindex="-1"><a class="header-anchor" href="#nginx-centos中的安装"><span><strong>nginx centOS中的安装</strong></span></a></h3>
<h4 id="环境配置" tabindex="-1"><a class="header-anchor" href="#环境配置"><span>环境配置</span></a></h4>
<ul>
<li>检查安装 <strong>gcc</strong></li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 检查是否安装</span></span>
<span class="line">gcc <span class="token parameter variable">-v</span></span>
<span class="line"><span class="token comment"># centos安装</span></span>
<span class="line">yum <span class="token function">install</span> gcc-c++ </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>安装PCRE pcre-devel：</strong>
Nginx的Rewrite模块和HTTP核心模块会使用到PCRE正则表达式语法。这里需要安装两个安装包pcre和pcre-devel。第一个安装包提供编译版本的库，而第二个提供开发阶段的头文件和编译项目的源代码。安装指令如下：</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> pcre pcre-devel</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>安装<strong>zlib：</strong>,zlib库提供了开发人员的压缩算法，在Nginx的各种模块中需要使用gzip压缩。安装指令如下:</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> zlib zlib-devel</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>安装<strong>Open SSL：</strong>，nginx不仅支持 http协议，还支持 https（即在 ssl 协议上传输 http），如果使用了 https，需要安装 OpenSSL 库。安装指令如下：</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">yum <span class="token function">install</span> <span class="token parameter variable">-y</span> openssl openssl-devel</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="安装nginx" tabindex="-1"><a class="header-anchor" href="#安装nginx"><span>安装nginx</span></a></h4>
<ul>
<li>wget命令下载</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">wget</span> <span class="token parameter variable">-c</span> https://nginx.org/download/nginx-1.11.6.tar.gz</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>解压文件到/usr/local/nginx目录下</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">tar</span> <span class="token parameter variable">-zxvf</span> /压缩包路径/nginx-1.11.6.tar.gz /usr/local/nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>进入安装的目录,进行默认配置</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">cd</span> /usr/local/nginx</span>
<span class="line">./configure</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>编译安装nginx</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># /usr/local/nginx目录下</span></span>
<span class="line"><span class="token function">make</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>安装</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># /usr/local/nginx目录下</span></span>
<span class="line"><span class="token function">make</span> <span class="token function">install</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>配置nginx.conf（不修改默认访问地址localhost:80）</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">cd</span> /usr/local/nginx/conf</span>
<span class="line"><span class="token function">vim</span> nginx.conf</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>启动</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">cd</span> /usr/local/nginx/sbin</span>
<span class="line">./nginx</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-常用命令" tabindex="-1"><a class="header-anchor" href="#nginx-常用命令"><span><strong>nginx 常用命令</strong></span></a></h3>
<ul>
<li>nginx的命令，都需要进入到nginx安装目录下的/sbin下执行</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 查看版本</span></span>
<span class="line">./nginx <span class="token parameter variable">-v</span></span>
<span class="line"><span class="token comment"># 查看版本详细参数</span></span>
<span class="line">./nginx <span class="token parameter variable">-V</span></span>
<span class="line"><span class="token comment"># 查看帮助</span></span>
<span class="line">./nginx <span class="token parameter variable">-h</span></span>
<span class="line"><span class="token comment"># 检查nginx配置文件</span></span>
<span class="line">./nginx <span class="token parameter variable">-t</span></span>
<span class="line"><span class="token comment"># 指定配置文件</span></span>
<span class="line">./nginx <span class="token parameter variable">-c</span> filename</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 启动</span></span>
<span class="line">./nginx</span>
<span class="line"><span class="token comment"># 优雅停机</span></span>
<span class="line">./nginx <span class="token parameter variable">-s</span> quit  </span>
<span class="line"><span class="token comment"># 优雅重启</span></span>
<span class="line">./nginx <span class="token parameter variable">-s</span> reload</span>
<span class="line"><span class="token comment"># 重新打开日志文件，一半用于切割日志</span></span>
<span class="line">./nginx <span class="token parameter variable">-s</span> reopen</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="nginx-conf-配置文件" tabindex="-1"><a class="header-anchor" href="#nginx-conf-配置文件"><span><strong>nginx.conf 配置文件</strong></span></a></h3>
<h4 id="以下是默认的配置" tabindex="-1"><a class="header-anchor" href="#以下是默认的配置"><span>以下是默认的配置：</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#user  nobody;</span></span>
<span class="line">worker_processes  <span class="token number">1</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#error_log  logs/error.log;</span></span>
<span class="line"><span class="token comment">#error_log  logs/error.log  notice;</span></span>
<span class="line"><span class="token comment">#error_log  logs/error.log  info;</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#pid        logs/nginx.pid;</span></span>
<span class="line"></span>
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
<span class="line">    <span class="token comment">#log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '</span></span>
<span class="line">    <span class="token comment">#                  '$status $body_bytes_sent "$http_referer" '</span></span>
<span class="line">    <span class="token comment">#                  '"$http_user_agent" "$http_x_forwarded_for"';</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">#access_log  logs/access.log  main;</span></span>
<span class="line"></span>
<span class="line">    sendfile        on<span class="token punctuation">;</span></span>
<span class="line">    <span class="token comment">#tcp_nopush     on;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">#keepalive_timeout  0;</span></span>
<span class="line">    keepalive_timeout  <span class="token number">65</span><span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">#gzip  on;</span></span>
<span class="line"></span>
<span class="line">    server <span class="token punctuation">{</span></span>
<span class="line">        listen       <span class="token number">80</span><span class="token punctuation">;</span></span>
<span class="line">        server_name  localhost<span class="token punctuation">;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">#charset koi8-r;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">#access_log  logs/host.access.log  main;</span></span>
<span class="line"></span>
<span class="line">        location / <span class="token punctuation">{</span></span>
<span class="line">            root   html<span class="token punctuation">;</span></span>
<span class="line">            index  index.html index.htm<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment">#error_page  404              /404.html;</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment"># redirect server error pages to the static page /50x.html</span></span>
<span class="line">        <span class="token comment">#</span></span>
<span class="line">        error_page   <span class="token number">500</span> <span class="token number">502</span> <span class="token number">503</span> <span class="token number">504</span>  /50x.html<span class="token punctuation">;</span></span>
<span class="line">        location <span class="token operator">=</span> /50x.html <span class="token punctuation">{</span></span>
<span class="line">            root   html<span class="token punctuation">;</span></span>
<span class="line">        <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment"># proxy the PHP scripts to Apache listening on 127.0.0.1:80</span></span>
<span class="line">        <span class="token comment">#</span></span>
<span class="line">        <span class="token comment">#location ~ \.php$ {</span></span>
<span class="line">        <span class="token comment">#    proxy_pass   http://127.0.0.1;</span></span>
<span class="line">        <span class="token comment">#}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment"># pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000</span></span>
<span class="line">        <span class="token comment">#</span></span>
<span class="line">        <span class="token comment">#location ~ \.php$ {</span></span>
<span class="line">        <span class="token comment">#    root           html;</span></span>
<span class="line">        <span class="token comment">#    fastcgi_pass   127.0.0.1:9000;</span></span>
<span class="line">        <span class="token comment">#    fastcgi_index  index.php;</span></span>
<span class="line">        <span class="token comment">#    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;</span></span>
<span class="line">        <span class="token comment">#    include        fastcgi_params;</span></span>
<span class="line">        <span class="token comment">#}</span></span>
<span class="line"></span>
<span class="line">        <span class="token comment"># deny access to .htaccess files, if Apache's document root</span></span>
<span class="line">        <span class="token comment"># concurs with nginx's one</span></span>
<span class="line">        <span class="token comment">#</span></span>
<span class="line">        <span class="token comment">#location ~ /\.ht {</span></span>
<span class="line">        <span class="token comment">#    deny  all;</span></span>
<span class="line">        <span class="token comment">#}</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># another virtual host using mix of IP-, name-, and port-based configuration</span></span>
<span class="line">    <span class="token comment">#</span></span>
<span class="line">    <span class="token comment">#server {</span></span>
<span class="line">    <span class="token comment">#    listen       8000;</span></span>
<span class="line">    <span class="token comment">#    listen       somename:8080;</span></span>
<span class="line">    <span class="token comment">#    server_name  somename  alias  another.alias;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">#    location / {</span></span>
<span class="line">    <span class="token comment">#        root   html;</span></span>
<span class="line">    <span class="token comment">#        index  index.html index.htm;</span></span>
<span class="line">    <span class="token comment">#    }</span></span>
<span class="line">    <span class="token comment">#}</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line">    <span class="token comment"># HTTPS server</span></span>
<span class="line">    <span class="token comment">#</span></span>
<span class="line">    <span class="token comment">#server {</span></span>
<span class="line">    <span class="token comment">#    listen       443 ssl;</span></span>
<span class="line">    <span class="token comment">#    server_name  localhost;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">#    ssl_certificate      cert.pem;</span></span>
<span class="line">    <span class="token comment">#    ssl_certificate_key  cert.key;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">#    ssl_session_cache    shared:SSL:1m;</span></span>
<span class="line">    <span class="token comment">#    ssl_session_timeout  5m;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">#    ssl_ciphers  HIGH:!aNULL:!MD5;</span></span>
<span class="line">    <span class="token comment">#    ssl_prefer_server_ciphers  on;</span></span>
<span class="line"></span>
<span class="line">    <span class="token comment">#    location / {</span></span>
<span class="line">    <span class="token comment">#        root   html;</span></span>
<span class="line">    <span class="token comment">#        index  index.html index.htm;</span></span>
<span class="line">    <span class="token comment">#    }</span></span>
<span class="line">    <span class="token comment">#}</span></span>
<span class="line"></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="nginx-主要分为以下几部分" tabindex="-1"><a class="header-anchor" href="#nginx-主要分为以下几部分"><span>nginx 主要分为以下几部分：</span></a></h4>
<ul>
<li>
<p>**全局块：**配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。</p>
</li>
<li>
<p>**events块：**配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。</p>
</li>
<li>
<p>**http块：**可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。</p>
</li>
<li>
<p>**server块：**配置虚拟主机的相关参数，一个http中可以有多个server。</p>
</li>
<li>
<p>**location块：**配置请求的路由，以及各种页面的处理情况。</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">########### 每个指令必须有分号结束。#################</span></span>
<span class="line"><span class="token comment">#user administrator administrators;  #配置用户或者组，默认为nobody nobody。</span></span>
<span class="line"><span class="token comment">#worker_processes 2;  #允许生成的进程数，默认为1</span></span>
<span class="line"><span class="token comment">#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址</span></span>
<span class="line">error_log log/error.log debug<span class="token punctuation">;</span>  <span class="token comment">#制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg</span></span>
<span class="line">events <span class="token punctuation">{</span></span>
<span class="line">    accept_mutex on<span class="token punctuation">;</span>   <span class="token comment">#设置网路连接序列化，防止惊群现象发生，默认为on</span></span>
<span class="line">    multi_accept on<span class="token punctuation">;</span>  <span class="token comment">#设置一个进程是否同时接受多个网络连接，默认为off</span></span>
<span class="line">    <span class="token comment">#use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport</span></span>
<span class="line">    worker_connections  <span class="token number">1024</span><span class="token punctuation">;</span>    <span class="token comment">#最大连接数，默认为512</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line">http <span class="token punctuation">{</span></span>
<span class="line">    include       mime.types<span class="token punctuation">;</span>   <span class="token comment">#文件扩展名与文件类型映射表</span></span>
<span class="line">    default_type  application/octet-stream<span class="token punctuation">;</span> <span class="token comment">#默认文件类型，默认为text/plain</span></span>
<span class="line">    <span class="token comment">#access_log off; #取消服务日志    </span></span>
<span class="line">    log_format myFormat <span class="token string">'$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'</span><span class="token punctuation">;</span> <span class="token comment">#自定义格式</span></span>
<span class="line">    access_log log/access.log myFormat<span class="token punctuation">;</span>  <span class="token comment">#combined为日志格式的默认值</span></span>
<span class="line">    sendfile on<span class="token punctuation">;</span>   <span class="token comment">#允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。</span></span>
<span class="line">    sendfile_max_chunk 100k<span class="token punctuation">;</span>  <span class="token comment">#每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。</span></span>
<span class="line">    keepalive_timeout <span class="token number">65</span><span class="token punctuation">;</span>  <span class="token comment">#连接超时时间，默认为75s，可以在http，server，location块。</span></span>
<span class="line"></span>
<span class="line">    upstream mysvr <span class="token punctuation">{</span>   </span>
<span class="line">      server <span class="token number">127.0</span>.0.1:7878<span class="token punctuation">;</span></span>
<span class="line">      server <span class="token number">192.168</span>.10.121:3333 backup<span class="token punctuation">;</span>  <span class="token comment">#热备</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line">    error_page <span class="token number">404</span> https://www.baidu.com<span class="token punctuation">;</span> <span class="token comment">#错误页</span></span>
<span class="line">    server <span class="token punctuation">{</span></span>
<span class="line">        keepalive_requests <span class="token number">120</span><span class="token punctuation">;</span> <span class="token comment">#单连接请求上限次数。</span></span>
<span class="line">        listen       <span class="token number">4545</span><span class="token punctuation">;</span>   <span class="token comment">#监听端口</span></span>
<span class="line">        server_name  <span class="token number">127.0</span>.0.1<span class="token punctuation">;</span>   <span class="token comment">#监听地址       </span></span>
<span class="line">        location  ~*^.+$ <span class="token punctuation">{</span>       <span class="token comment">#请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。</span></span>
<span class="line">           <span class="token comment">#root path;  #根目录</span></span>
<span class="line">           <span class="token comment">#index vv.txt;  #设置默认页</span></span>
<span class="line">           proxy_pass  http://mysvr<span class="token punctuation">;</span>  <span class="token comment">#请求转向mysvr 定义的服务器列表</span></span>
<span class="line">           deny <span class="token number">127.0</span>.0.1<span class="token punctuation">;</span>  <span class="token comment">#拒绝的ip</span></span>
<span class="line">           allow <span class="token number">172.18</span>.5.54<span class="token punctuation">;</span> <span class="token comment">#允许的ip           </span></span>
<span class="line">        <span class="token punctuation">}</span> </span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="几个常见配置项" tabindex="-1"><a class="header-anchor" href="#几个常见配置项"><span>几个常见配置项：</span></a></h4>
<ul>
<li>$remote_addr 与 $http_x_forwarded_for 用以记录客户端的ip地址；</li>
<li>$remote_user ：用来记录客户端用户名称；</li>
<li>$time_local ： 用来记录访问时间与时区；</li>
<li>$request ： 用来记录请求的url与http协议；</li>
<li>$status ： 用来记录请求状态；成功是200；</li>
<li>$body_bytes_s ent ：记录发送给客户端文件主体内容大小；</li>
<li>$http_referer ：用来记录从那个页面链接访问过来的；</li>
<li>$http_user_agent ：记录客户端浏览器的相关信息；</li>
</ul>
</div></template>


