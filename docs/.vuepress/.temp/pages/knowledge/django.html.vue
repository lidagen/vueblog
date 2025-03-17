<template><div><h3 id="python-django-创建web应用" tabindex="-1"><a class="header-anchor" href="#python-django-创建web应用"><span>python + django 创建web应用</span></a></h3>
<h4 id="安装django" tabindex="-1"><a class="header-anchor" href="#安装django"><span>安装django</span></a></h4>
<ul>
<li>安装好python3.7+以后，cmd下执行命令安装最近稳定版django</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">pip install Django==2.1.5</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>判断django安装是否成功：python -m django --version 出现版本号则安装成功</p>
</div>
<ul>
<li>创建项目
<ul>
<li>进入相要创建项目的目录下，运行命令 django admin startproject myblog  其中myblog 为项目名</li>
<li>启动项目 在项目manage.py同级目录下cmd 输入命令python manage.py runserver 启动服务，复制url访问</li>
<li>创建应用， 在项目manage.py同级目录下cmd 输入命令python manage.py startapp blog  其中blog  为应用名，
并添加应用在settings.py中INSTALLED_APPS里</li>
</ul>
</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">INSTALLED_APPS <span class="token operator">=</span> <span class="token punctuation">[</span></span>
<span class="line">    <span class="token string">'django.contrib.admin'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">'django.contrib.auth'</span><span class="token punctuation">,</span></span>
<span class="line highlighted">    <span class="token string">'django.contrib.contenttypes'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">'django.contrib.sessions'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">'django.contrib.messages'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">'django.contrib.staticfiles'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment"># bolg 模块添加进来</span></span>
<span class="line">    <span class="token string">'bolg'</span></span>
<span class="line"><span class="token punctuation">]</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="修改数据库mysql" tabindex="-1"><a class="header-anchor" href="#修改数据库mysql"><span>修改数据库mysql</span></a></h4>
<ul>
<li>setting.py中修改sqllite3数据库连接为mysql</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">DATABASES <span class="token operator">=</span> <span class="token punctuation">{</span></span>
<span class="line">    <span class="token string">'default'</span><span class="token punctuation">:</span> <span class="token punctuation">{</span></span>
<span class="line">       <span class="token comment"># 'ENGINE': 'django.db.backends.sqlite3',</span></span>
<span class="line highlighted">       <span class="token comment"># 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),</span></span>
<span class="line">        <span class="token string">'ENGINE'</span><span class="token punctuation">:</span> <span class="token string">'django.db.backends.mysql'</span><span class="token punctuation">,</span>   <span class="token comment"># 数据库引擎</span></span>
<span class="line">        <span class="token string">'NAME'</span><span class="token punctuation">:</span> <span class="token string">'djangoweb'</span><span class="token punctuation">,</span>         <span class="token comment"># 你要存储数据的库名，事先要创建之</span></span>
<span class="line">        <span class="token string">'USER'</span><span class="token punctuation">:</span> <span class="token string">'root'</span><span class="token punctuation">,</span>         <span class="token comment"># 数据库用户名</span></span>
<span class="line">        <span class="token string">'PASSWORD'</span><span class="token punctuation">:</span> <span class="token string">'root'</span><span class="token punctuation">,</span>     <span class="token comment"># 密码</span></span>
<span class="line">        <span class="token string">'HOST'</span><span class="token punctuation">:</span> <span class="token string">'localhost'</span><span class="token punctuation">,</span>    <span class="token comment"># 主机</span></span>
<span class="line">        <span class="token string">'PORT'</span><span class="token punctuation">:</span> <span class="token string">'3306'</span><span class="token punctuation">,</span>         <span class="token comment"># 数据库使用的端口</span></span>
<span class="line">    <span class="token punctuation">}</span></span>
<span class="line"><span class="token punctuation">}</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>安装pymysql, cmd执行命令 pip install pymysql</p>
</li>
<li>
<p><em>init</em>.py导入pymysql</p>
</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">import pymysql</span>
<span class="line">pymysql.install_as_MySQLdb()</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>Terminal执行数据库迁移</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">python manage.py makemigrations</span>
<span class="line">python manage.py migrate</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><div class="hint-container warning">
<p class="hint-container-title">Warning</p>
<p>makemigrations 执行语句可能会报错no changes detected，加上子应用名称，比如我app名称叫做spear_web,运行下列语句
python manage.py makemigrations --empty spear_web</p>
</div>
<h4 id="django-admin创建" tabindex="-1"><a class="header-anchor" href="#django-admin创建"><span>django admin创建</span></a></h4>
<ul>
<li>Terminal运行 python manage.py createsuperuser</li>
</ul>
<p>输入用户名 邮箱 密码 创建成功 ，http://127.0.0.1:8000/admin/   查看</p>
<ul>
<li>子应用修改 admin.py 文件,admin注册Article类</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line"><span class="token keyword">from</span> spear_web<span class="token punctuation">.</span>models <span class="token keyword">import</span> Article</span>
<span class="line"> </span>
<span class="line">admin<span class="token punctuation">.</span>site<span class="token punctuation">.</span>register<span class="token punctuation">(</span>Article<span class="token punctuation">)</span></span>
<span class="line highlighted"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>admin管理后台中可以看到Article类的管理</li>
</ul>
<h4 id="bootstrap安装" tabindex="-1"><a class="header-anchor" href="#bootstrap安装"><span>bootstrap安装</span></a></h4>
<ul>
<li>命令安装</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">pip install django-bootstrap3</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>settings.py配置</li>
</ul>
<div class="language-python line-numbers-mode" data-highlighter="prismjs" data-ext="py"><pre v-pre><code><span class="line">INSTALLED_APPS <span class="token operator">=</span> <span class="token punctuation">(</span></span>
<span class="line">    <span class="token string">'django.contrib.staticfiles'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment"># 第三方应用程序</span></span>
<span class="line highlighted">    <span class="token string">'bootstrap3'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token comment"># 我的应用程序</span></span>
<span class="line">    <span class="token string">'learning_logs'</span><span class="token punctuation">,</span></span>
<span class="line">    <span class="token string">'users'</span><span class="token punctuation">,</span></span>
<span class="line"><span class="token punctuation">)</span></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>django-bootstrap3包含jQuery，在settings.py末尾加上</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line"># django-bootstrap3的设置</span>
<span class="line">BOOTSTRAP3 = {</span>
<span class="line">     'include_jquery': True,</span>
<span class="line">}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


