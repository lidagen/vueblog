<template><div><h2 id="shell解析器" tabindex="-1"><a class="header-anchor" href="#shell解析器"><span>Shell解析器</span></a></h2>
<h3 id="linux-提供的解析器" tabindex="-1"><a class="header-anchor" href="#linux-提供的解析器"><span>Linux 提供的解析器</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">~ cat /etc/shells                              </span>
<span class="line"># /etc/shells: valid login shells</span>
<span class="line">/bin/sh</span>
<span class="line">/bin/bash</span>
<span class="line">/usr/bin/bash</span>
<span class="line">/bin/rbash</span>
<span class="line">/usr/bin/rbash</span>
<span class="line">/usr/bin/sh</span>
<span class="line">/bin/dash</span>
<span class="line">/usr/bin/dash</span>
<span class="line">/bin/zsh</span>
<span class="line">/usr/bin/zsh</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="查询默认解析器" tabindex="-1"><a class="header-anchor" href="#查询默认解析器"><span>查询默认解析器</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">➜  ~ echo $SHELL                                                </span>
<span class="line">/usr/bin/zsh</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="shell入门" tabindex="-1"><a class="header-anchor" href="#shell入门"><span>Shell入门</span></a></h3>
<h4 id="声明-编写helloworld" tabindex="-1"><a class="header-anchor" href="#声明-编写helloworld"><span>声明 编写helloworld</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">echo "hello world"</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="赋权" tabindex="-1"><a class="header-anchor" href="#赋权"><span>赋权</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">chmod +x helloworld.sh </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="执行" tabindex="-1"><a class="header-anchor" href="#执行"><span>执行</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line"># bash 或者sh都性</span>
<span class="line"></span>
<span class="line">bash helloworld.sh #也可绝对路径</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="shell-多命令处理" tabindex="-1"><a class="header-anchor" href="#shell-多命令处理"><span>Shell  多命令处理</span></a></h3>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">touch xx/readme.txt</span>
<span class="line"></span>
<span class="line">echo "create and write txt" >> readme.txt</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="shell中的变量" tabindex="-1"><a class="header-anchor" href="#shell中的变量"><span>Shell中的变量</span></a></h2>
<h3 id="系统变量-环境变量" tabindex="-1"><a class="header-anchor" href="#系统变量-环境变量"><span>系统变量(环境变量)</span></a></h3>
<ul>
<li>作用域是整个操作系统或整个用户</li>
</ul>
<h4 id="常用系统变量" tabindex="-1"><a class="header-anchor" href="#常用系统变量"><span>常用系统变量</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">$HOME 、$PWD 、$SHELL 、$USER 等</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="查看系统变量值" tabindex="-1"><a class="header-anchor" href="#查看系统变量值"><span>查看系统变量值</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">echo $HOME</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="显示当前shell中所有变量-set" tabindex="-1"><a class="header-anchor" href="#显示当前shell中所有变量-set"><span>显示当前Shell中所有变量 set</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">set</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h3 id="自定义变量" tabindex="-1"><a class="header-anchor" href="#自定义变量"><span>自定义变量</span></a></h3>
<ul>
<li>自定义普通变量
<ul>
<li>作用域为当前shell（当前解释器）</li>
</ul>
</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">A=100</span>
<span class="line">B="hello world"</span>
<span class="line"></span>
<span class="line">echo $A</span>
<span class="line">echo $B     </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line"># 命令行</span>
<span class="line">export PATH=${GRADLE_HOME}/bin:${PATH}</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>自定义环境变量</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">vi /etc/profile</span>
<span class="line">export PATH=${GRADLE_HOME}/bin:${PATH}</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="普通变量基本语法" tabindex="-1"><a class="header-anchor" href="#普通变量基本语法"><span>普通变量基本语法</span></a></h4>
<ul>
<li>定义变量： 变量= 值</li>
<li>撤销变量： unset 变量</li>
<li>声明静态变量： readonly变量， 注意不能unset,也不可reset</li>
</ul>
<h4 id="变量定义规则" tabindex="-1"><a class="header-anchor" href="#变量定义规则"><span>变量定义规则</span></a></h4>
<ul>
<li>变量名称可以字母、数字、下划线组成，但不能数字开头，环境变量建议大写</li>
<li>等号两侧不可以有空格</li>
<li>在bash中，变量默认都是字符串类型，不能进行数值运算</li>
<li>变量的值如果有空格，需要用双引号或单引号括起来</li>
</ul>
<h3 id="特殊变量" tabindex="-1"><a class="header-anchor" href="#特殊变量"><span>特殊变量</span></a></h3>
<h4 id="特殊变量-n" tabindex="-1"><a class="header-anchor" href="#特殊变量-n"><span>特殊变量 $n</span></a></h4>
<ul>
<li>基本语法： n为数字，$0代表该脚本名称，$1-$9代表第一到第9个参数，10个以上参数需要用大括号，如${10}</li>
<li>举例</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line"># 给脚本传入三个参数</span>
<span class="line"></span>
<span class="line">echo $1</span>
<span class="line">echo $2</span>
<span class="line">echo $3</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">bash _04_.sh 111 abc AAA</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h4 id="特殊变量-1" tabindex="-1"><a class="header-anchor" href="#特殊变量-1"><span>特殊变量 $#</span></a></h4>
<ul>
<li>基本语法： 获取所有输入参数个数，常用于循环</li>
<li>举例</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line">echo "$0 $1 $2"</span>
<span class="line">echo $#</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">bash _05_.sh 11 aa BB </span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="特殊变量-和" tabindex="-1"><a class="header-anchor" href="#特殊变量-和"><span>特殊变量 $* 和 $@</span></a></h4>
<ul>
<li>基本语法：</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">+  $* 这个变量代表命令行中所有参数，$*把所有参数看称一个整体</span>
<span class="line">+  $@ 这个变量也代表命令行中所有参数，不过$@把每个参数区分对待 </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>举例 for循环中都加了双引号,如果不加，两者一样</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#/bin/bash</span>
<span class="line"></span>
<span class="line"># 测试%*</span>
<span class="line"></span>
<span class="line">for i in "$*";do</span>
<span class="line">        echo "传入参数是：$i"</span>
<span class="line">done</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">echo "----------------------------------------"</span>
<span class="line"># 测试$@</span>
<span class="line"></span>
<span class="line">for j in "$@";do</span>
<span class="line">        echo "传入参数是：$j"</span>
<span class="line">done</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">output</span>
<span class="line">bash _forEach4.sh abc 123</span>
<span class="line">传入参数是：abc 123</span>
<span class="line">----------------------------------------</span>
<span class="line">传入参数是：abc</span>
<span class="line">传入参数是：123</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="特殊变量-2" tabindex="-1"><a class="header-anchor" href="#特殊变量-2"><span>特殊变量 $?</span></a></h4>
<ul>
<li>基本语法： 最后一次执行命令返回状态，如果变量值为0,证明上一个命令正确，如果非0,证明上一个命令执行不正确</li>
</ul>
<h3 id="运算符" tabindex="-1"><a class="header-anchor" href="#运算符"><span>运算符</span></a></h3>
<h4 id="基本语法" tabindex="-1"><a class="header-anchor" href="#基本语法"><span>基本语法</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">+ $((运算式)) 或 $[运算式]</span>
<span class="line">+  expr + 、- 、*、/、%</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>举例</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line"># terminat</span>
<span class="line"># 计算加空格，赋值加反引号</span>
<span class="line">➜  shRepo D=`expr 2 + 8` </span>
<span class="line">➜  shRepo echo $D   </span>
<span class="line">10</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line"># 脚本, 计算有三种写法</span>
<span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">A=100</span>
<span class="line">B=20</span>
<span class="line"></span>
<span class="line">#写法1</span>
<span class="line">C=$((A+B))</span>
<span class="line"></span>
<span class="line">#写法2</span>
<span class="line">C=$[A+B]</span>
<span class="line"></span>
<span class="line">#写法3</span>
<span class="line">C=`expr $A + $B`</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">#综合运算 （2+3）*5</span>
<span class="line"></span>
<span class="line">D=$[(2+3)*5]</span>
<span class="line">echo $C</span>
<span class="line">echo $D       </span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="条件判断" tabindex="-1"><a class="header-anchor" href="#条件判断"><span>条件判断</span></a></h3>
<h4 id="【condition】-condition前后都有空格" tabindex="-1"><a class="header-anchor" href="#【condition】-condition前后都有空格"><span>【condition】 condition前后都有空格</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">+ 整数比较</span>
<span class="line">== 字符串比较</span>
<span class="line">-lt 小于(less than)    -le 小于或等于（less equal）</span>
<span class="line">-eq 等于               -gt 大于</span>
<span class="line">-ge 大于等于            -ne 不等于</span>
<span class="line"></span>
<span class="line">+ 文件权限判断</span>
<span class="line">-r 只读权限  -w写权限</span>
<span class="line">-x 执行权限</span>
<span class="line"></span>
<span class="line">+ 文件类型判断</span>
<span class="line">-f 文件存在且是一个常规文件（file）</span>
<span class="line">-e 文件存在</span>
<span class="line">-d 文件存在并是一个目录（directry）</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="常用判断条件" tabindex="-1"><a class="header-anchor" href="#常用判断条件"><span>常用判断条件</span></a></h4>
<ul>
<li>两个整数比较</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line"></span>
<span class="line">#!/bin/bash</span>
<span class="line"># 传入参数 > 2输出 param gt 2</span>
<span class="line"># &amp;&amp; 逻辑与</span>
<span class="line">[ $# -gt 2 ] &amp;&amp; echo "param gt 2"</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="if判断" tabindex="-1"><a class="header-anchor" href="#if判断"><span>if判断</span></a></h3>
<h4 id="语法" tabindex="-1"><a class="header-anchor" href="#语法"><span>语法</span></a></h4>
<ul>
<li>条件判断式中必须有空格</li>
<li>if后有空格</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">if [ 条件判断式 ]； then</span>
<span class="line">	程序</span>
<span class="line">fi	</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">if [ 条件判断式 ]</span>
<span class="line">	then</span>
<span class="line">		 程序</span>
<span class="line">fi		 </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>举例 （-a 是并且的意思）</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">if [ $1 -lt 18 ];then</span>
<span class="line">       echo "未成年"</span>
<span class="line">elif [ $1 -ge 18 -a $1 -le 35 ];then</span>
<span class="line">       echo "青年"</span>
<span class="line">else</span>
<span class="line">       echo "中老年"   </span>
<span class="line">fi</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="case语句" tabindex="-1"><a class="header-anchor" href="#case语句"><span>case语句</span></a></h3>
<h4 id="语法-1" tabindex="-1"><a class="header-anchor" href="#语法-1"><span>语法</span></a></h4>
<ul>
<li>case行尾必须为单词in，每个模式匹配必须为）结束</li>
<li>双分号；；表示序列结束，相当java的break</li>
<li>*) 相当于java中的daulft</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">case $变量名 in</span>
<span class="line">	"值1"）</span>
<span class="line">	；；</span>
<span class="line">	"值2"）</span>
<span class="line">	；；</span>
<span class="line">esac		</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>举例</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">case $1 in</span>
<span class="line">        "A")</span>
<span class="line">                echo "exec A"</span>
<span class="line">        ;;</span>
<span class="line"></span>
<span class="line">        "B")</span>
<span class="line">                echo "exec B"</span>
<span class="line">        ;;</span>
<span class="line">        *)</span>
<span class="line">                echo "exec other"</span>
<span class="line">        ;;</span>
<span class="line">esac</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="for循环" tabindex="-1"><a class="header-anchor" href="#for循环"><span>for循环</span></a></h3>
<h4 id="语法1" tabindex="-1"><a class="header-anchor" href="#语法1"><span>语法1</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">for((初始值；循环控制条件；变量变化))</span>
<span class="line">do</span>
<span class="line">	程序</span>
<span class="line">done	</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>举例</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">for((i=0;i&lt;=100;i++));do</span>
<span class="line">        s=$[$s+$i]</span>
<span class="line">done</span>
<span class="line"></span>
<span class="line">echo "sum 1..100 = $s"</span>
<span class="line">~                        </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="语法2" tabindex="-1"><a class="header-anchor" href="#语法2"><span>语法2</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">for 变量 in 值1 值2 值3 ...</span>
<span class="line">do</span>
<span class="line">	程序</span>
<span class="line">done	</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>举例 (1..100)代表1-100 ，或者用 seq 1 100</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">#for i in {1..100};do</span>
<span class="line">for i in `seq 1 100`;do</span>
<span class="line">        s=$[$s+$i]</span>
<span class="line">done</span>
<span class="line"></span>
<span class="line">echo "sum 1..100 bash 2 = s"</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>操作文件列表</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">for i in `ls /home/wangs/Documents/shRepo`;do</span>
<span class="line">        echo $i</span>
<span class="line">done</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">target_dir="/home/wangs/Documents/shRepo"</span>
<span class="line">target_file="readme.sh"</span>
<span class="line"></span>
<span class="line">for file in "$target_dir"/*;do</span>
<span class="line">         if [ "$(basename "$file")" = "$target_file" ]; then</span>
<span class="line">                echo "i get the readme file"</span>
<span class="line"></span>
<span class="line">        fi</span>
<span class="line">done</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="while循环" tabindex="-1"><a class="header-anchor" href="#while循环"><span>while循环</span></a></h3>
<h4 id="基本语法-1" tabindex="-1"><a class="header-anchor" href="#基本语法-1"><span>基本语法</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">while [条件判断式]</span>
<span class="line">do</span>
<span class="line">	程序</span>
<span class="line">done	</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>举例</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">i=1</span>
<span class="line">sum=0</span>
<span class="line">while [ $i -le 100 ];do</span>
<span class="line">        let sum=sum+i # 也等于 sum=$[ $sum+$i ]</span>
<span class="line">        let i++</span>
<span class="line">done</span>
<span class="line"></span>
<span class="line">echo "sum = $sum"</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="read读取控制台输入" tabindex="-1"><a class="header-anchor" href="#read读取控制台输入"><span>read读取控制台输入</span></a></h3>
<h4 id="基本语法-2" tabindex="-1"><a class="header-anchor" href="#基本语法-2"><span>基本语法</span></a></h4>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">read(选项)（参数）</span>
<span class="line">选项：</span>
<span class="line">-p : 指定读取值时的提示符</span>
<span class="line">-t : 制定读取值时等待的时间（秒）</span>
<span class="line"></span>
<span class="line">参数</span>
<span class="line">	变量：制定读取值的变量名</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>举例</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">read -t 7 -p "enter input a integer gt 1 within 7 seconds" NUM</span>
<span class="line"></span>
<span class="line">for ((i=1;i&lt;=$NUM;i++));do</span>
<span class="line">        s=$[$s+$i]</span>
<span class="line">done</span>
<span class="line"></span>
<span class="line">echo $s</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="函数" tabindex="-1"><a class="header-anchor" href="#函数"><span>函数</span></a></h3>
<h4 id="系统函数" tabindex="-1"><a class="header-anchor" href="#系统函数"><span>系统函数</span></a></h4>
<h5 id="basename-语法、" tabindex="-1"><a class="header-anchor" href="#basename-语法、"><span>basename 语法、</span></a></h5>
<ul>
<li>basename string/pathname ,该命令会删掉所有的前缀包括最后一个‘/’字符，然后将字符串显示出来</li>
<li>选项：
<ul>
<li>suffix为后缀，如果suffi被制定了，basename将pathname或string中的suffix去掉</li>
</ul>
</li>
<li>举例</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">basename /home/wangs/Documents/shRepo/readme.sh</span>
<span class="line">#输出</span>
<span class="line">readme.sh</span>
<span class="line"></span>
<span class="line">basename /home/wangs/Documents/shRepo/readme.sh .sh </span>
<span class="line">#输出</span>
<span class="line">readme</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="dirname语法" tabindex="-1"><a class="header-anchor" href="#dirname语法"><span>dirname语法</span></a></h5>
<ul>
<li>dirnname文件绝对路径</li>
<li>举例</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">dirname /home/wangs/Documents/shRepo/readme.sh         </span>
<span class="line"># 输出</span>
<span class="line">/home/wangs/Documents/shRepo</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="自定义函数" tabindex="-1"><a class="header-anchor" href="#自定义函数"><span>自定义函数</span></a></h4>
<ul>
<li>必须在调用函数地方之前，先声明函数，shell脚本是逐行运行，不会提前编译</li>
<li>函数返回值，只能通过$?系统变量获取，可以显式加 return返回，如果不加，将以最后一行运行结果作为返回值返回。return后跟数值n（0-255）</li>
<li>可以参用标准输出：echo来作为函数返回值</li>
</ul>
<h5 id="基本语法-3" tabindex="-1"><a class="header-anchor" href="#基本语法-3"><span>基本语法</span></a></h5>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">function functionname(){</span>
<span class="line">	Action;</span>
<span class="line">	[return int;]</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">functionname</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>举例
<ul>
<li>100 + 200 超过255了，下列例子会返回44</li>
</ul>
</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">function sum(){</span>
<span class="line">        let s=$1+$2</span>
<span class="line"></span>
<span class="line">        return $s</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">sum 100 200</span>
<span class="line"></span>
<span class="line">echo "sum= $?"</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>返回300的写法</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#!/bin/bash</span>
<span class="line"></span>
<span class="line">function sum(){</span>
<span class="line">        let s=$1+$2</span>
<span class="line"></span>
<span class="line">        echo $s</span>
<span class="line">}</span>
<span class="line"></span>
<span class="line">result=`sum 100 200`</span>
<span class="line"></span>
<span class="line">echo "sum= $result"</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="shell工具" tabindex="-1"><a class="header-anchor" href="#shell工具"><span>shell工具</span></a></h3>
<h4 id="cut" tabindex="-1"><a class="header-anchor" href="#cut"><span>cut</span></a></h4>
<ul>
<li>cut工作就是“剪”，具体说就是在文件中负责剪切数据用的，cut命令从文件的每一行剪切字节，字符和字段并将其输出</li>
</ul>
<h5 id="基本用法" tabindex="-1"><a class="header-anchor" href="#基本用法"><span>基本用法</span></a></h5>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">cut [选项参数] filename</span>
<span class="line">说明：默认分割符是制表符</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="选项参数说明" tabindex="-1"><a class="header-anchor" href="#选项参数说明"><span>选项参数说明</span></a></h5>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">-f 列号</span>
<span class="line">-d 分割符</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="举例" tabindex="-1"><a class="header-anchor" href="#举例"><span>举例</span></a></h6>
<ul>
<li>准备工作 vim cut.txt</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">dong shen</span>
<span class="line">guan shen</span>
<span class="line">wo wo</span>
<span class="line">lai lai</span>
<span class="line">le le</span>
<span class="line">~       </span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>按列分割
<ul>
<li>&quot;  &quot;按空格分割</li>
<li>-f1指第一列，可以选-f2或 -f1,2</li>
</ul>
</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">cut -d " " -f1 cut.txt</span>
<span class="line"></span>
<span class="line"></span>
<span class="line">#输出</span>
<span class="line">dong</span>
<span class="line">guan</span>
<span class="line">wo</span>
<span class="line">lai</span>
<span class="line">le</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="sed" tabindex="-1"><a class="header-anchor" href="#sed"><span>sed</span></a></h4>
<ul>
<li>sed是一种流编辑器，它一次处理一行内容，处理时，把当前处理的行存储在临时缓冲区，称为“模式空间”，接着用sed命令处理缓冲区的内容，处理完成后，把缓冲区内容送往屏幕，接着处理下一行这样不断重复，直到文件末尾，文件内容并没有改变，除非你使用重定向存储输出</li>
</ul>
<h5 id="基本用法-1" tabindex="-1"><a class="header-anchor" href="#基本用法-1"><span>基本用法</span></a></h5>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">sed [选项参数] ‘command' filename</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h5 id="选项参数说明-1" tabindex="-1"><a class="header-anchor" href="#选项参数说明-1"><span>选项参数说明</span></a></h5>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">-e 直接在指令模式上进行sed的动作编辑</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><h5 id="命令功能描述" tabindex="-1"><a class="header-anchor" href="#命令功能描述"><span>命令功能描述</span></a></h5>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">a 新增， a后面可以接字串，在下一行出现</span>
<span class="line">d 删除</span>
<span class="line">s 查找并替换</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="举例-1" tabindex="-1"><a class="header-anchor" href="#举例-1"><span>举例</span></a></h6>
<ul>
<li>准备工作 vim sed.txt</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">dong shen</span>
<span class="line">guan shen</span>
<span class="line">wo wo</span>
<span class="line">lai lai</span>
<span class="line">le le</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>使用命令</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">#在第一行后面加入hello world</span>
<span class="line">sed '1a hello world' sed.txt</span>
<span class="line"># 删除第一行</span>
<span class="line">sed '1d' sed.txt</span>
<span class="line"># 查找wo并删除</span>
<span class="line">sed '/wo/d' sed.txt</span>
<span class="line"># 替换wo为 AA,只替换第一个</span>
<span class="line">sed 's/wo/AA/' sed.txt</span>
<span class="line"># 替换所有 g=global</span>
<span class="line">sed 's/wo/AA/g' sed.txt</span>
<span class="line"></span>
<span class="line"># 多个操作,删除第一行并把全局wo替换为AA</span>
<span class="line">sed -e '3d' -e 's/wo/AA/g' sed.txt</span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="awk" tabindex="-1"><a class="header-anchor" href="#awk"><span>awk</span></a></h4>
<ul>
<li>一个强大文本分析工具，把文件逐行读入，以空格为默认分割符进行切片，切开部分再进行分析处理</li>
</ul>
<h5 id="基本用法-2" tabindex="-1"><a class="header-anchor" href="#基本用法-2"><span>基本用法</span></a></h5>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">awk [选项参数] `pattern1{action1} pattern2{action2}...` filname</span>
<span class="line"></span>
<span class="line">pattern: 表示awk再数据中查找的内容，就是匹配模式</span>
<span class="line">action: 在找到的匹配内容时所执行的一系列命令</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="参数选项说明" tabindex="-1"><a class="header-anchor" href="#参数选项说明"><span>参数选项说明</span></a></h5>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">-F 指定输入文件拆分分割符</span>
<span class="line">-v 赋值一个用户定义变量</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div></div></div><h6 id="举例-2" tabindex="-1"><a class="header-anchor" href="#举例-2"><span>举例</span></a></h6>
<ul>
<li>准备工作</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line">cp /etc/passwd ~/Docu</span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div></div></div><ul>
<li>使用命令</li>
</ul>
<div class="language-text line-numbers-mode" data-highlighter="prismjs" data-ext="text"><pre v-pre><code><span class="line"># 指定：为分割符，打印passwd 第一列 第二列,用，分割</span>
<span class="line">awk -F: '{print $1,$2}' passwd </span>
<span class="line"></span>
<span class="line"># 查询包含wangs的用户，打印1 7列</span>
<span class="line">awk -F: '/^wangs/ {print $1,$7}' passwd</span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"></span></code></pre>
<div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


