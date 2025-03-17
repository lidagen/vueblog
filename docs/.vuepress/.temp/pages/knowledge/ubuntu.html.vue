<template><div><h2 id="ubuntu-下linux-命令" tabindex="-1"><a class="header-anchor" href="#ubuntu-下linux-命令"><span>Ubuntu 下Linux 命令</span></a></h2>
<ul>
<li>
<p><strong>sudo</strong>
允许当前用户以root权限执行</p>
</li>
<li>
<p><strong>apt-get</strong>
Ubuntu从互联网仓库中搜索、安装、升级、卸载软件。（CentOS中用yum）</p>
</li>
</ul>
<h4 id="更新软件仓库源列表" tabindex="-1"><a class="header-anchor" href="#更新软件仓库源列表"><span>更新软件仓库源列表</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> update</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="更新本地已安装的软件" tabindex="-1"><a class="header-anchor" href="#更新本地已安装的软件"><span>更新本地已安装的软件</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">apt-get</span> upgrade</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="查看被占用的端口号以及终止" tabindex="-1"><a class="header-anchor" href="#查看被占用的端口号以及终止"><span>查看被占用的端口号以及终止</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 根据端口号找到进程</span></span>
<span class="line"><span class="token function">sudo</span> losf -i:端口号</span>
<span class="line"></span>
<span class="line"><span class="token comment"># 杀掉进程</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">kill</span> PID号</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="给文件夹读写权限" tabindex="-1"><a class="header-anchor" href="#给文件夹读写权限"><span>给文件夹读写权限</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># zookeeper目录下拥有读写权限</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">chmod</span> <span class="token parameter variable">-R</span> <span class="token number">777</span> /opt/software/zookeeper</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="解压tar-gz包" tabindex="-1"><a class="header-anchor" href="#解压tar-gz包"><span>解压tar.gz包</span></a></h4>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment"># 把xxx.tar.gz 解压到绝对目录/opt/software下</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">tar</span> <span class="token parameter variable">-zxvf</span>  xxx.tar.gz <span class="token parameter variable">-C</span>  /opt/software</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="修改文件" tabindex="-1"><a class="header-anchor" href="#修改文件"><span>修改文件</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#编辑settings.xml文件</span></span>
<span class="line"><span class="token function">sudo</span> gedit /opt/software/maven/conf/settings.xml</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="新建文件" tabindex="-1"><a class="header-anchor" href="#新建文件"><span>新建文件</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token function">sudo</span> <span class="token function">touch</span> /opt/1.md</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="移动、拷贝、删除" tabindex="-1"><a class="header-anchor" href="#移动、拷贝、删除"><span>移动、拷贝、删除</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#移动</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">mv</span> /opt/1.png   media/ws/disk1</span>
<span class="line"><span class="token comment">#拷贝</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">cp</span> /opt/1.png   media/ws/disk1</span>
<span class="line"><span class="token comment"># 删除(-rf 递归强制删除文件及其子目录)</span></span>
<span class="line"><span class="token function">sudo</span> <span class="token function">rm</span> <span class="token parameter variable">-rf</span> /opt/test</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="systemctl" tabindex="-1"><a class="header-anchor" href="#systemctl"><span>systemctl</span></a></h3>
<div class="language-bash line-numbers-mode" data-highlighter="prismjs" data-ext="sh"><pre v-pre><code><span class="line"><span class="token comment">#foobar表示伪变量</span></span>
<span class="line"><span class="token comment">#打开服务:</span></span>
<span class="line"><span class="token function">sudo</span> systemctl start foobar</span>
<span class="line"><span class="token comment">#关闭服务:</span></span>
<span class="line"><span class="token function">sudo</span> systemctl stop foobar</span>
<span class="line"><span class="token comment">#重启服务:</span></span>
<span class="line"><span class="token function">sudo</span> systemctl restart foobar</span>
<span class="line"><span class="token comment">#不中断正常功能下重新加载服务:</span></span>
<span class="line"><span class="token function">sudo</span> systemctl reload foobar</span>
<span class="line"><span class="token comment">#设置服务的开机自启动:</span></span>
<span class="line"><span class="token function">sudo</span> systemctl <span class="token builtin class-name">enable</span> foobar</span>
<span class="line"><span class="token comment">#关闭服务的开机自启动:</span></span>
<span class="line"><span class="token function">sudo</span> systemctl disable foobar</span>
<span class="line"><span class="token comment">#查看活跃的单元:</span></span>
<span class="line">systemctl list-units</span>
<span class="line"><span class="token comment">#查看某个服务的状态:</span></span>
<span class="line">systemctl status foobar</span>
<span class="line"><span class="token comment">#查看已启动的服务列表：</span></span>
<span class="line"> systemctl list-unit-files<span class="token operator">|</span><span class="token function">grep</span> enabled</span>
<span class="line"><span class="token comment">#查看启动失败的服务列表：</span></span>
<span class="line">systemctl <span class="token parameter variable">--failed</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


