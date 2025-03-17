<template><div><h2 id="dockercompose-服务编排" tabindex="-1"><a class="header-anchor" href="#dockercompose-服务编排"><span>DockerCompose 服务编排</span></a></h2>
<h3 id="概述" tabindex="-1"><a class="header-anchor" href="#概述"><span>概述</span></a></h3>
<ul>
<li>
<p>使用微服务架构的应用程序一般包含若干个微服务，每个微服务一般都会部署多个实例，如果每个微服务都要手动操作那效率会很低，Docker compose就是用来高效管理容器，提交部署效率。</p>
</li>
<li>
<p>docker-compose 是一个用户定义和运行多个容器的 Docker 应用程序。在 Compose 中你可以使用 .yml 文件来配置你的应用服务。然后，只需要一个简单的命令，就可以创建并启动。</p>
</li>
</ul>
<h3 id="docker-compose-管理容器的结构" tabindex="-1"><a class="header-anchor" href="#docker-compose-管理容器的结构"><span>Docker Compose 管理容器的结构</span></a></h3>
<ul>
<li>
<p>Docker Compose将所管理的容器分为三层，分别是<strong>工程（project）</strong>、<strong>服务（service）</strong>、<strong>容器（container）</strong></p>
</li>
<li>
<p>Docker Compose运行目录下所有的文件（docker-compose-yml、extends文件或者环境变量文件等）组成一个工程，一个工程可包含多个服务，每个服务中定义了容器运行的镜像，参与以及依赖，一个服务可以包含多个容器实例。</p>
</li>
</ul>
<h3 id="docker-compose-yml-常用指令" tabindex="-1"><a class="header-anchor" href="#docker-compose-yml-常用指令"><span>docker-compose.yml 常用指令</span></a></h3>
<ul>
<li>
<p><strong>image</strong></p>
<ul>
<li>指定镜像名称或者镜像id,如果该镜像不存在，会尝试pull</li>
</ul>
</li>
<li>
<p><strong>build</strong></p>
<ul>
<li>指定Dockerfile文件的路径，可以是一个路径。例如：</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">build: ./dir</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>也可以是一个对象，用于指定Dockerfile和参数。例如：</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">build: ./dir</span>
<span class="line">  context: Dockerfile-alternate</span>
<span class="line">  args:</span>
<span class="line">      buildno:1</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><strong>command</strong></p>
<ul>
<li>覆盖容器启动后的默认执行命令：</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">command: bundle <span class="token builtin class-name">exec</span> thin <span class="token parameter variable">-p</span> <span class="token number">3000</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>也可以是个list,类似docker的CMD命令</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">command: <span class="token punctuation">[</span>bundle,exec,thin,-p,3000<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div></li>
<li>
<p><strong>links</strong></p>
<ul>
<li>链接到其它服务中的容器，可以指定服务名称和链接的别名使用SERVICE：ALIAS</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">web:</span>
<span class="line">  links:</span>
<span class="line">      - db</span>
<span class="line">      - db:database</span>
<span class="line">      - redis</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>external_links</strong></p>
<ul>
<li>表示链接到docker-compose.yml外的容器。甚至非Compose管理的容器</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">extenrnal_links:</span>
<span class="line">  - redis_l</span>
<span class="line">  - project_db_1:mysql</span>
<span class="line">  - project_db_2:postgresql</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>ports</strong></p>
<ul>
<li>暴露的端口号，使用 <code v-pre>宿主机：容器端口</code> 的格式,或者仅仅指定容器的端口（此时宿主机会随机是指定，类似docker run -P命令）</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">ports:</span>
<span class="line"> - <span class="token string">"3000"</span></span>
<span class="line"> - <span class="token string">"3000-5000"</span></span>
<span class="line"> - <span class="token string">"8080:8080"</span></span>
<span class="line"> - <span class="token string">"8000-9000"</span><span class="token builtin class-name">:</span><span class="token string">"8000-9000"</span></span>
<span class="line"> - <span class="token string">"49100:22"</span></span>
<span class="line"> - <span class="token string">"127.168.0.0.1:8001:8001"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>expose</strong></p>
<ul>
<li>暴露端口，只将端口暴露给连接的服务，而不暴露给宿主机</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">expose: </span>
<span class="line">  - <span class="token string">"3000"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>volumes</strong></p>
<ul>
<li>卷挂载路径的设置。可以设置宿主机路径或加上访问模式</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">volumes:</span>
<span class="line">  - /var/lib/mysql</span>
<span class="line">  - /opt/data:/var/lib/mysql</span>
<span class="line">  - ~/configs:/etc/configs/:ro</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>volumes_from</strong></p>
<ul>
<li>从另一个服务或者容器挂载卷</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">volumes_from:</span>
<span class="line">  - service_name</span>
<span class="line">  - servie_name:ro</span>
<span class="line">  - container:container_name</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>environment</strong></p>
<ul>
<li>设置环境变量，可以使用数组或者字典两种方式，只有一个key的环境变量可以运行在compose机器上找到对应的</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">environment:</span>
<span class="line">    RACK_ENV: development</span>
<span class="line">    SHOW: <span class="token string">'true'</span></span>
<span class="line">    SESSION_SECRET:</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><strong>env_file</strong>
<ul>
<li>从文件中获取环境变量，可以为单独的文件路径或者列表</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">env_file:</span>
<span class="line">   - ./common.env</span>
<span class="line">   - ./apps/web.env</span>
<span class="line">   _ /opt/secrets.env</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><strong>extends</strong></p>
<ul>
<li>继承另一个服务，基于已有的服务拓展</li>
</ul>
</li>
<li>
<p><strong>net</strong></p>
<ul>
<li>设置网络模式</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">net: <span class="token string">"bridge"</span></span>
<span class="line">net: <span class="token string">"host"</span></span>
<span class="line">net: <span class="token string">"none"</span></span>
<span class="line">net: <span class="token string">"container:[service name or container name/id]"</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</div></template>


