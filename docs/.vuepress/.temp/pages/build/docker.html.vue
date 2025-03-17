<template><div><h2 id="应用容器引擎-docker" tabindex="-1"><a class="header-anchor" href="#应用容器引擎-docker"><span>应用容器引擎-Docker</span></a></h2>
<h3 id="docker-概述" tabindex="-1"><a class="header-anchor" href="#docker-概述"><span>Docker 概述</span></a></h3>
<h4 id="docker是什么" tabindex="-1"><a class="header-anchor" href="#docker是什么"><span>docker是什么</span></a></h4>
<ul>
<li>
<p>Docker作为一个软件集装箱化平台，可以让开发者构建应用程序时，将它与其依赖环境一起打包到一个容器中，然后很容易地发布和应用到任意平台中。在操作系统上，提供一个额外的软件抽象层，以及操作系统层虚拟化的自动管理机制。</p>
</li>
<li>
<p>上面说的比较官方，简单来说，docker是一个能让应用运行的容器，类似虚拟机。</p>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p><strong>Docker与传统虚拟机比较</strong></p>
<ul>
<li>docker 启动快速属于秒级别。虚拟机通常需要几分钟去启动</li>
<li>docker 需要的资源更少， docker 在操作系统级别进行虚拟化， docker 容器和内核交互，几乎没有性能损耗，性能优于通过 Hypervisor 层与内核层的虚拟化</li>
<li>docker 更轻量， docker 的架构可以共用一个内核与共享应用程序库，所占内存极小。同样的硬件环境， Docker 运行的镜像数远多于虚拟机数量，对系统的利用率非常高</li>
<li>与虚拟机相比， docker 隔离性更弱， docker 属于进程之间的隔离，虚拟机可实现系统级别隔离</li>
<li>安全性： docker 的安全性也更弱。 Docker 的租户 root 和宿主机 root 等同，一旦容器内的用户从普通用户权限提升为root权限，它就直接具备了宿主机的root权限，进而可进行无限制的操作。虚拟机租户 root 权限和宿主机的 root 虚拟机权限是分离的，并且虚拟机利用如 Intel 的 VT-d 和 VT-x 的 ring-1 硬件隔离技术，这种隔离技术可以防止虚拟机突破和彼此交互，而容器至今还没有任何形式的硬件隔离，这使得容器容易受到攻击</li>
<li>可管理性： docker 的集中化管理工具还不算成熟。各种虚拟化技术都有成熟的管理工具，例如 VMware vCenter 提供完备的虚拟机管理能力
高可用和可恢复性： docker 对业务的高可用支持是通过快速重新部署实现的。虚拟化具备负载均衡，高可用，容错，迁移和数据保护等经过生产实践检验的成熟保障机制， VMware 可承诺虚拟机 99.999% 高可用，保证业务连续性</li>
<li>快速创建、删除：虚拟化创建是分钟级别的， Docker 容器创建是秒级别的， Docker 的快速迭代性，决定了无论是开发、测试、部署都可以节约大量时间</li>
<li>交付、部署：虚拟机可以通过镜像实现环境交付的一致性，但镜像分发无法体系化。 Docker 在 Dockerfile 中记录了容器构建过程，可在集群中实现快速分发和快速部署</li>
</ul>
</div>
<h3 id="docker-核心" tabindex="-1"><a class="header-anchor" href="#docker-核心"><span>Docker 核心</span></a></h3>
<h4 id="docker-三个基本概念" tabindex="-1"><a class="header-anchor" href="#docker-三个基本概念"><span>docker 三个基本概念:</span></a></h4>
<ul>
<li>
<p><strong>Images (镜像)</strong> : 镜像可以看作一个文件系统，除了提供容器运行时所需的程序、库、资源、配置等文件外，还包含了一些为运行时准备的一些配置参数（如匿名卷、环境变量、用户等）。镜像不包含任何动态数据，其内容在构建之后也不会被改变。</p>
</li>
<li>
<p><strong>Container (容器)</strong> : 容器是放置，运行镜像的地方，里面运行着我们指定的应用。</p>
</li>
<li>
<p><strong>Repository (仓库)</strong> : 仓库可以看作存放镜像的地方，当镜像构建完成后，我们需要一个集中存储，分发管理的服务。仓库类似于我们之前常用的代码仓库。</p>
</li>
</ul>
<h3 id="docker-的优势" tabindex="-1"><a class="header-anchor" href="#docker-的优势"><span>Docker 的优势</span></a></h3>
<ul>
<li>
<p>容器就可以实现方便快速并且与平台解耦的自动化部署方式，无论你部署时的环境如何，容器中的应用程序都会运行在同一种环境下,简单来说，docker的标准化让快速扩展，弹性伸缩变得简单。</p>
</li>
<li>
<p>举个例子：小明写了一个系统，该系统的技术栈非常广，需要依赖于各种开源库和中间件。如果按照纯手动的部署方式，小明需要安装各种开源软件，还需要写好每个开源软件的配置文件。如果只是部署一次，这点时间开销还是可以接受的，但如果小明每隔几天就需要换个服务器去部署他的程序，那么这些繁琐的重复工作无疑是会令人发狂的。这时候，Docker的用处就派上场了，小明只需要根据应用程序的部署步骤编写一份Dockerfile文件（将安装、配置等操作交由Docker自动化处理），然后构建并发布他的镜像，这样，不管在什么机器上，小明都只需要拉取他需要的镜像，然后就可以直接部署运行了，这正是Docker的魅力所在。</p>
</li>
</ul>
<h3 id="docker-生命周期" tabindex="-1"><a class="header-anchor" href="#docker-生命周期"><span>docker 生命周期</span></a></h3>
<h3 id="docker安装" tabindex="-1"><a class="header-anchor" href="#docker安装"><span>docker安装</span></a></h3>
<ul>
<li>
<p>根据自己的系统下载安装docker</p>
</li>
<li>
<p>登陆 <code v-pre>https://cr.console.aliyun.com/</code>，按照操作文档配置阿里云镜像</p>
</li>
</ul>
<h3 id="docker命令" tabindex="-1"><a class="header-anchor" href="#docker命令"><span>docker命令</span></a></h3>
<h4 id="镜像命令" tabindex="-1"><a class="header-anchor" href="#镜像命令"><span>镜像命令</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#拉取一个 docker 镜像,不指定版本默认最新:latest</span></span>
<span class="line"><span class="token function">docker</span> pull <span class="token function">java</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># 拉取一个指定版本</span></span>
<span class="line"><span class="token function">docker</span> pull java:8</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 查看镜像</span></span>
<span class="line"><span class="token function">docker</span> images</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="容器命令" tabindex="-1"><a class="header-anchor" href="#容器命令"><span>容器命令</span></a></h4>
<ul>
<li>启动容器</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#启动容器</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token punctuation">[</span>OPTION<span class="token punctuation">]</span>  IMAGE <span class="token punctuation">[</span>COMMAND<span class="token punctuation">]</span> <span class="token punctuation">[</span>ARG<span class="token punctuation">..</span>.<span class="token punctuation">]</span></span>
<span class="line"><span class="token comment"># OPTION 说明</span></span>
<span class="line"><span class="token operator">&lt;</span><span class="token operator">!</span>--</span>
<span class="line">    <span class="token parameter variable">--name</span> 为容器起一个新名称</span>
<span class="line">    <span class="token parameter variable">-d</span> 后台启动容器，守护线程的方式，返回id</span>
<span class="line">    <span class="token parameter variable">-i</span>  交互式模式启动容器，通常与-t一起使用</span>
<span class="line">    <span class="token parameter variable">-t</span>  为容器重新分配一个伪输入终端</span>
<span class="line">    <span class="token parameter variable">-P</span> 随即端口启动</span>
<span class="line">    <span class="token parameter variable">-p</span> 指定端口映射，有以下四种格式：</span>
<span class="line">      ip:hostPort:containerPort</span>
<span class="line">      ip::containerPort</span>
<span class="line">      hostPort:containerPort</span>
<span class="line">      containerPort</span>
<span class="line"> --<span class="token operator">></span></span>
<span class="line"><span class="token comment"># 运行一个镜像，并对其指定端口映射(springboot_web的 8080端口映射为80)</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">80</span>:8080 springboot_web</span>
<span class="line"><span class="token comment"># 运行这个容器中的镜像的话，并且调用镜像里面的 bash</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> container_name/container_id /bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>退出容器</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token builtin class-name">exit</span> 停止容器</span>
<span class="line">ctrl+p+q 不停止容器退出容器终端</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>列出所以正在运行的容器</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"></span>
<span class="line"><span class="token comment"># 查看哪些容器运行</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">ps</span>  <span class="token punctuation">[</span>OPTION<span class="token punctuation">]</span></span>
<span class="line"></span>
<span class="line"><span class="token comment"># OPTION说明</span></span>
<span class="line"><span class="token operator">&lt;</span><span class="token operator">!</span>--</span>
<span class="line"><span class="token parameter variable">-a</span> 正在运行和历史运行的容器</span>
<span class="line"><span class="token parameter variable">-l</span>  显示最近创建的容器</span>
<span class="line"><span class="token parameter variable">-n</span> 显示最近n个创建的容器</span>
<span class="line"><span class="token parameter variable">-q</span>  静默模式，只显示容器id</span>
<span class="line">--no-trunc 不截断输出 </span>
<span class="line">--<span class="token operator">></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>启动容器、 重启、停止容器</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"></span>
<span class="line"><span class="token comment"># 启动、重启、停止容器</span></span>
<span class="line"><span class="token function">docker</span> start container_name/container_id</span>
<span class="line"><span class="token function">docker</span> restart container_name/container_id</span>
<span class="line"><span class="token function">docker</span> stop container_name/container_id</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 如果我们需要删除某个镜像，需要先停止容器，然后删除容器，最后删除镜像</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">ps</span></span>
<span class="line"><span class="token function">docker</span> stop container_name/container_id</span>
<span class="line"><span class="token function">docker</span> <span class="token function">rm</span> container_name/container_id</span>
<span class="line"><span class="token function">docker</span> rmi image_name</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 强制停止容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">kill</span> container_name/container_id</span>
<span class="line"></span>
<span class="line"><span class="token comment">#删除多个容器</span></span>
<span class="line"><span class="token function">docker</span> <span class="token function">rm</span> <span class="token variable"><span class="token variable">$(</span><span class="token function">docker</span> <span class="token function">ps</span> <span class="token parameter variable">-a</span> <span class="token parameter variable">-q</span><span class="token variable">)</span></span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="容器重要命令" tabindex="-1"><a class="header-anchor" href="#容器重要命令"><span>容器重要命令</span></a></h4>
<ul>
<li>启动守护式容器</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> container_name/container_id</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>查看容器日志</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># -t 加入时间戳  -f不停的追加（动态） -tail linux命令 尾巴</span></span>
<span class="line"><span class="token function">docker</span> logs <span class="token parameter variable">-f</span> <span class="token parameter variable">-t</span> <span class="token parameter variable">--tail</span> container_id</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>查看容器运行的线程</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token function">top</span> container_id</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>查看容器内部细节</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> inspect container_id</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>进入正在运行的容器并以命令交互</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 对容器进行bashShell操作，得到结果回到宿主机</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> <span class="token parameter variable">-t</span> container_id bashShell </span>
<span class="line"></span>
<span class="line"><span class="token comment"># 直接进入容器并启动终端</span></span>
<span class="line"><span class="token function">docker</span> attach container_id</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>从容器内拷贝数据到主机</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token function">cp</span> container_id:容器内路径 目的主机路径</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>这里罗列是常用命令，更多命令参照:</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token parameter variable">--help</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="镜像原理" tabindex="-1"><a class="header-anchor" href="#镜像原理"><span>镜像原理</span></a></h3>
<ul>
<li>镜像就像一层层的嵌套，比如一个tomcat,它下面依赖jdk,jdk又依赖centos。层都是只读的，只有最上面一层是可写。</li>
</ul>
<h3 id="容器数据卷" tabindex="-1"><a class="header-anchor" href="#容器数据卷"><span>容器数据卷</span></a></h3>
<p><strong>容器卷能干什么：</strong></p>
<ul>
<li>
<p>用来持久花容器中运行产生的数据。</p>
</li>
<li>
<p>容器之间希望可以共享数据（一边修改另一边也改变）</p>
</li>
<li>
<p>容器和宿主机之间共享数据（一边修改另一边也改变）</p>
</li>
</ul>
<p><strong>容器卷的特点：</strong></p>
<ul>
<li>
<p>数据卷可以在容器之间共享或者重用数据</p>
</li>
<li>
<p>卷中的更改可以直接生效</p>
</li>
<li>
<p>数据卷的更改不会包含在镜像的更新中</p>
</li>
<li>
<p>数据卷的生命周期一直持续到没有容器使用它为止</p>
</li>
</ul>
<p><strong>容器中添加容器卷</strong></p>
<ul>
<li><strong>直接命令添加</strong></li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">-v</span> /宿主机绝对路径:/容器内目录    镜像名</span>
<span class="line"><span class="token comment"># centos 宿主机/media/ws/disk1/下生成myVolume，镜像中根目录生成volume目录</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">-v</span> /media/ws/disk1/myVolume:/volume centos</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 只允许宿主机单项写入，容器内只读</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> <span class="token parameter variable">-v</span> /media/ws/disk1/volume:/volume:ro centos</span>
<span class="line"></span>
<span class="line"><span class="token comment">#  tips 容器停止后，主机修改数据，容器重启仍然会同步</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p><strong>Dockerfile添加</strong></p>
</li>
<li>
<p>Dockerfile 简单来说是构建镜像内容的一组命令。通过Dockerfile我们可以自定义镜像，让其能够运行在容器中。</p>
</li>
<li>
<p>比喻：</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">Hello.java <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">=</span><span class="token operator">></span> Hello.class</span>
<span class="line"></span>
<span class="line">Docker images <span class="token operator">==</span><span class="token operator">==</span><span class="token operator">==</span><span class="token operator">></span> Dockerfile</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>步骤
<ul>
<li>目录下新建Dockerfile
<ul>
<li>Dockerfile新建VOLUME来个容器创建一个或多个容器卷</li>
</ul>
</li>
<li>File构建</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># mkdir一个mydocker文件夹</span></span>
<span class="line"><span class="token comment"># touch一个Dockerfile</span></span>
<span class="line"><span class="token comment"># vi 编辑以下内容:wq!</span></span>
<span class="line"><span class="token comment"># 创建两个容器卷dataVolumeContainer1 dataVolumeContainer2</span></span>
<span class="line">FROM centos</span>
<span class="line">VOLUME <span class="token punctuation">[</span><span class="token string">"/dataVolumeContainer1"</span>,<span class="token string">"/dataVolumeContainer2"</span><span class="token punctuation">]</span></span>
<span class="line">CMD <span class="token builtin class-name">echo</span> <span class="token string">"finished,--------------success"</span></span>
<span class="line">CMD /bin/bash</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>build后生成镜像</li>
</ul>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> build <span class="token parameter variable">-f</span> /mydocker/Dockerfile <span class="token parameter variable">-t</span> ws/mycentos <span class="token builtin class-name">.</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>run容器</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> ws/centos /bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>如何跟宿主机关联？</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 重开终端或者var/bin/docker/volumes中查找</span></span>
<span class="line"><span class="token function">docker</span> inspect ws/centos</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="dockerfile" tabindex="-1"><a class="header-anchor" href="#dockerfile"><span>DOCKERFILE</span></a></h3>
<h4 id="dockerfile是什么" tabindex="-1"><a class="header-anchor" href="#dockerfile是什么"><span>Dockerfile是什么</span></a></h4>
<ul>
<li>
<p>Dockerfile是用来构建docker镜像的构建文件，是由一系列命令和参数构成的脚本</p>
</li>
<li>
<p>构建三步骤:</p>
<ul>
<li>Dockerfile</li>
<li>docker build</li>
<li>docker run</li>
</ul>
</li>
</ul>
<h4 id="dockerfile的构建过程" tabindex="-1"><a class="header-anchor" href="#dockerfile的构建过程"><span>Dockerfile的构建过程</span></a></h4>
<p><strong>Dockerfile内容的基础知识：</strong></p>
<ul>
<li>每条保留指令都必须大写，并且后面必须跟随至少一个参数</li>
<li>指令从上到下顺序执行</li>
<li>#表示注释</li>
<li>每条指令会创建一个新的镜像层，并对镜像进行提交</li>
</ul>
<p><strong>docker执行Dockerfile大致流程：</strong></p>
<ul>
<li>docker从基础镜像运行一个容器</li>
<li>执行一条指令对容器作出修改</li>
<li>执行类似docker commit的命令提交一个新的镜像层</li>
<li>docker再基于刚提交的镜像运行一个新容器</li>
<li>执行Dockerfile中的下一条指令直到所有执行执行完成</li>
</ul>
<h4 id="dockerfile的体系结构-保留字指令" tabindex="-1"><a class="header-anchor" href="#dockerfile的体系结构-保留字指令"><span>Dockerfile的体系结构（保留字指令）</span></a></h4>
<ul>
<li>
<p><strong>FROM</strong></p>
<ul>
<li>当前镜像是基于哪个镜像（scratch是最上层的镜像，类似java中的Object）</li>
</ul>
</li>
<li>
<p><strong>MAINTAINER</strong></p>
<ul>
<li>镜像维护者以及邮箱</li>
</ul>
</li>
<li>
<p><strong>RUN</strong></p>
<ul>
<li>构建时需要运行的命令</li>
</ul>
</li>
<li>
<p><strong>EXPOSE</strong></p>
<ul>
<li>对外暴露的端口</li>
</ul>
</li>
<li>
<p><strong>WORKDIR</strong></p>
<ul>
<li>指定在创建容器后，终端进入(-it)后默认的工作目录</li>
</ul>
</li>
<li>
<p><strong>ENV</strong></p>
<ul>
<li>用来在构建镜像过程中设置环境变量</li>
</ul>
</li>
<li>
<p><strong>ADD</strong></p>
<ul>
<li>将宿主机目录下的文件拷贝进镜像，且命令会自动处理URL和解压tar包</li>
</ul>
</li>
<li>
<p><strong>COPY</strong></p>
<ul>
<li>类似ADD，拷贝文件到镜像，</li>
</ul>
</li>
<li>
<p><strong>VOLUME</strong></p>
<ul>
<li>数据容器卷，用来保存容器数据到宿主机</li>
</ul>
</li>
<li>
<p><strong>CMD</strong></p>
<ul>
<li>指定一个容器运行时要执行的命令</li>
<li>Dockerfile中可以有多个CMD命令，但只有最后一个生效，CMD会被docker run之后的参数替换</li>
</ul>
</li>
<li>
<p><strong>ENTRYPOINT</strong></p>
<ul>
<li>指定一个容器运行时要执行的命令</li>
<li>ENTRYPOINT和CMD一样，都是在指定容器启动程序和参数</li>
</ul>
</li>
<li>
<p><strong>ONBUILD</strong></p>
<ul>
<li>当构建一个被继承的Dockerfile时运行命令，父镜像在被子镜像继承后，父镜像的ONBUILD会被触发</li>
</ul>
</li>
</ul>
<h4 id="案例" tabindex="-1"><a class="header-anchor" href="#案例"><span>案例</span></a></h4>
<ul>
<li>
<p><strong>Base镜像scratch</strong></p>
<ul>
<li>docker hub中99%的镜像都是通过在base镜像中安装和配置需要的软件构建出来的</li>
</ul>
</li>
<li>
<p><strong>自定义镜像mycentos</strong></p>
<ul>
<li>假设我们下载的centos以及不满足使用的，我需要一个能运行vim的centos.</li>
<li>构建Dockerfile</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">FROM centos</span>
<span class="line"><span class="token comment">#定义/tmp别名mypath</span></span>
<span class="line">ENV mypath /tmp</span>
<span class="line"><span class="token comment">#默认工作目录为mypath</span></span>
<span class="line">WORKDIR <span class="token variable">$mypath</span></span>
<span class="line">RUN yum <span class="token parameter variable">-y</span> <span class="token function">install</span> <span class="token function">vim</span></span>
<span class="line"></span>
<span class="line"><span class="token comment">#暴露的端口</span></span>
<span class="line">EXPOSE <span class="token number">80</span></span>
<span class="line">CMD /bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>build</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> build <span class="token parameter variable">-f</span> /media/ws/disk1/docker/mydocker/Dockerfile  <span class="token parameter variable">-t</span> vim/centos <span class="token builtin class-name">.</span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>run</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> vim/centos /bin/bash</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>test</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 可以看到直接进的是/tmp目录</span></span>
<span class="line"><span class="token comment">#目录下 touch 1.md</span></span>
<span class="line"><span class="token comment"># vim 进入测试vim安装是否成功</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li>
<p><strong>CMD/ENTRYPOINT镜像案例</strong></p>
<ul>
<li>假设一个场景，我们做一个镜像，需要crul来获取<code v-pre>https://ip.cn/</code>中的ip信息。首先考虑CMD命令版本的</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">FROM centos</span>
<span class="line"><span class="token comment">#如果centos中没有curl安装一个</span></span>
<span class="line">RUN yum <span class="token function">install</span> <span class="token parameter variable">-y</span> <span class="token function">curl</span></span>
<span class="line"><span class="token comment">#相当于命令 curl -s https://ip.cn</span></span>
<span class="line">CMD <span class="token punctuation">[</span><span class="token string">"curl"</span>,<span class="token string">"-s"</span>,<span class="token string">"https://ip.cn"</span><span class="token punctuation">]</span></span>
<span class="line">```</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<ul>
<li>
<ul>
<li>
<p>之后我们build（myip）镜像然后run（docker run -it myip)，成功返回ip</p>
</li>
<li>
<p>这时我们需要链接返回更多的信息，比如链接的请求头，类似于命令 <code v-pre>curl -s -i https://ip.cn</code>返回报文头加ip，这时候在run上追加 -i</p>
</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-it</span> myip <span class="token parameter variable">-i</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>这时候会报错，相当于后一个-i的CMD命令覆盖了Dockerfile中的CMD命令。这时候需要ENTRYPOINT命令。</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line">FROM centos</span>
<span class="line"><span class="token comment">#如果centos中没有curl安装一个</span></span>
<span class="line">RUN yum <span class="token function">install</span> <span class="token parameter variable">-y</span> <span class="token function">curl</span></span>
<span class="line"><span class="token comment">#相当于命令 curl -s https://ip.cn</span></span>
<span class="line">ENTRYPOINT <span class="token punctuation">[</span><span class="token string">"curl"</span>,<span class="token string">"-s"</span>,<span class="token string">"https://ip.cn"</span><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>之后重复上面步骤，完成！</li>
</ul>
</li>
</ul>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<ul>
<li>CMD 和 ENTRYPOINT都是执行命令，不同点是ENTRYPOINT是追加，CMD是覆盖。类似StringBuilder和String</li>
<li>curl 命令参考文档</li>
</ul>
</div>
<ul>
<li><strong>自定义镜像tomcat9</strong>
<ul>
<li>准备工作：
<ul>
<li>选择一个路径mkdir一个mytomcat9文件夹</li>
<li>文件夹下准备jdk8和tomcat9的tar包</li>
<li>touch一个cp.txt文件</li>
<li>touch一个Dockerfile文件</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#vim进入Dockerfile</span></span>
<span class="line">FROM centos</span>
<span class="line">MAINTAINER gendali<span class="token operator">&lt;</span>wal365@126.com<span class="token operator">></span></span>
<span class="line"><span class="token comment">#copy宿主机的cp.txt到镜像为container.txt</span></span>
<span class="line">COPY cp.txt /usr/local/container.txt</span>
<span class="line"><span class="token comment">#把jdk和tomcat添加容器中</span></span>
<span class="line">ADD jdk-8u221-linux-x64.tar.gz /usr/local/</span>
<span class="line">ADD apache-tomcat-9.0.30.tar.gz /usr/local/</span>
<span class="line"><span class="token comment">#安装VIM</span></span>
<span class="line">RUN yum <span class="token function">install</span> <span class="token parameter variable">-y</span> <span class="token function">vim</span></span>
<span class="line"><span class="token comment">#设置登陆落脚点</span></span>
<span class="line">ENV MYPATH /usr/local</span>
<span class="line">WORKDIR <span class="token variable">$MYPATH</span></span>
<span class="line"><span class="token comment">#配置jdk和tomcat环境变量</span></span>
<span class="line">ENV JAVA_HOME /usr/local/jdk1.8.0_221</span>
<span class="line">ENV CLASSPATH <span class="token variable">$JAVA_HOME</span>/lib/dt.jar:<span class="token variable">$JAVA_HOME</span>/lib/tools.jar</span>
<span class="line">ENV CATALINA_HOME /usr/local/apache-tomcat-9.0.30</span>
<span class="line">ENV CATALIAN_BASE /usr/local/apache-tomcat-9.0.30</span>
<span class="line">ENV <span class="token environment constant">PATH</span> <span class="token environment constant">$PATH</span><span class="token builtin class-name">:</span><span class="token variable">$JAVA_HOME</span>/bin:<span class="token variable">$CATALINA_HOME</span>/lib:<span class="token variable">$CATALINA_HOME</span>/bin</span>
<span class="line"><span class="token comment">#容器运行时的监听端口</span></span>
<span class="line">EXPOSE <span class="token number">8080</span></span>
<span class="line"><span class="token comment">#启动时运行tomcat</span></span>
<span class="line"><span class="token comment">#ENTRYPOINT ["/usr/local/apache-tomcat-9.0.30/bin/startup.sh"]</span></span>
<span class="line"><span class="token comment">#CMD ["/usr/local/apache-tomcat-9.0.30/bin/catanlina.sh","run"]</span></span>
<span class="line">CMD /usr/local/apache-tomcat-9.0.30/bin/startup.sh <span class="token operator">&amp;&amp;</span> <span class="token function">tail</span> <span class="token parameter variable">-F</span> /usr/local/apache-tomcat-9.0.30/bin/logs/catalina.out</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
<ul>
<li>用-v命令run 这个镜像，添加容器卷</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 这个长命令分解来看，-p对外端口映射为8090，--name 名字叫mytom9 </span></span>
<span class="line"><span class="token comment"># -v绑定两个数据卷到宿主机，方便部署项目和看日志</span></span>
<span class="line"><span class="token comment"># --privileged=true 防止写权限不够</span></span>
<span class="line"><span class="token comment"># mytomcat9是镜像名</span></span>
<span class="line"><span class="token function">docker</span> run <span class="token parameter variable">-d</span> <span class="token parameter variable">-p</span> <span class="token number">8090</span>:8080 <span class="token parameter variable">--name</span> mytom9 <span class="token parameter variable">-v</span> /media/ws/disk3/dockersoftware/tomcat9DataVolume:/usr/local/apache-tomcat-9.0.30/webapps/test <span class="token parameter variable">-v</span> /media/ws/disk3/dockersoftware/tocat9logs/:/usr/local/apache-tomcat-9.0.30/logs <span class="token parameter variable">--privileged</span><span class="token operator">=</span>true mytomcat9</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>exec查看</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># docker ps查看id</span></span>
<span class="line"><span class="token comment"># exec查看运行镜像bash</span></span>
<span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> aa241d0d95e5 <span class="token function">ls</span> <span class="token parameter variable">-l</span></span>
<span class="line"><span class="token comment">#访问localhost:8090</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
<li><strong>在宿主机容器卷部署应用，同步到tomcat的webapps/test目录下</strong></li>
</ul>
<ul>
<li>cd进入  tomcat9DataVolume目录 mkdir WEB-INF</li>
<li>cd WEB-INF/</li>
<li>touch web.xml</li>
</ul>
<div class="language-xml line-numbers-mode" data-highlighter="prismjs" data-ext="xml"><pre v-pre><code><span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>web-app</span> <span class="token attr-name">xmlns</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://java.sun.com/xml/ns/j2ee<span class="token punctuation">"</span></span></span>
<span class="line">  <span class="token attr-name"><span class="token namespace">xmlns:</span>xsi</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://www.w3.org/2001/XMLSchema-instance<span class="token punctuation">"</span></span></span>
<span class="line">  <span class="token attr-name"><span class="token namespace">xsi:</span>schemaLocation</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>http://java.sun.com/xml/ns/j2ee/web-app_2_4.xsd<span class="token punctuation">"</span></span></span>
<span class="line">  <span class="token attr-name">version</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>2.4<span class="token punctuation">"</span></span><span class="token punctuation">></span></span></span>
<span class="line">  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>display-name</span><span class="token punctuation">></span></span>test<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>display-name</span><span class="token punctuation">></span></span></span>
<span class="line"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>web-app</span><span class="token punctuation">></span></span></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>cd .. 之后touch 个a.jsp</li>
</ul>
<div class="language-jsp line-numbers-mode" data-highlighter="prismjs" data-ext="jsp"><pre v-pre><code><span class="line">&lt;%@ page language=&quot;java&quot; contentType=&quot;text/html; charset=UTF-8&quot;</span>
<span class="line">  pageEncoding=&quot;UTF-8&quot;%&gt;</span>
<span class="line">&lt;!DOCTYPE html&gt;</span>
<span class="line">&lt;html&gt;</span>
<span class="line">&lt;head&gt;</span>
<span class="line">        &lt;meta http-equiv=&quot;Content-Type&quot; content=&quot;text/html; charset=UTF-8&quot;&gt;</span>
<span class="line">        &lt;title&gt;mytomcat9 index&lt;/title&gt;</span>
<span class="line">    &lt;/head&gt;</span>
<span class="line">    &lt;body&gt;</span>
<span class="line">        &lt;%=&quot;i am docker tomcat self&quot;%&gt;</span>
<span class="line">        &lt;br&gt;</span>
<span class="line">        &lt;br&gt;</span>
<span class="line">        &lt;% System.out.println(&quot;===============docker start!&quot;);%&gt;</span>
<span class="line">    &lt;/body&gt;</span>
<span class="line">&lt;/html&gt;</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>创建完成保存退出，查看运行的tomcat9容器中是否生成文件</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">docker</span> <span class="token builtin class-name">exec</span> aa241d0d95e5 <span class="token function">ls</span> <span class="token parameter variable">-l</span> /usr/local/apache-tomcat-9.0.30/webapps/test</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>访问jsp,<code v-pre>http://localhost:8090/test/a.jsp</code></li>
<li>访问宿主机的/tocat9logs下sudo cat catalina.out 查看jsp中的===============docker start!打印</li>
</ul>
<h3 id="推送镜像到ailiyun" tabindex="-1"><a class="header-anchor" href="#推送镜像到ailiyun"><span>推送镜像到ailiyun</span></a></h3>
<h4 id="创建镜像仓库" tabindex="-1"><a class="header-anchor" href="#创建镜像仓库"><span>创建镜像仓库</span></a></h4>
<ul>
<li><code v-pre>https://cr.console.aliyun.com/cn-hangzhou/instances/repositories</code> 创建镜像仓库</li>
<li>选择本地仓库</li>
<li>点击管理，查看推送命令</li>
</ul>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">docker</span> login <span class="token parameter variable">--username</span><span class="token operator">=</span>xxx@126.com registry.cn-hangzhou.aliyuncs.com</span>
<span class="line"><span class="token function">sudo</span> <span class="token function">docker</span> tag <span class="token punctuation">[</span>ImageId<span class="token punctuation">]</span> registry.cn-hangzhou.aliyuncs.com/gendali/mytomcat:<span class="token punctuation">[</span>镜像版本号<span class="token punctuation">]</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">docker</span> push registry.cn-hangzhou.aliyuncs.com/gendali/mytomcat:<span class="token punctuation">[</span>镜像版本号<span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


