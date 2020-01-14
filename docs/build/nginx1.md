## nginx 安装、常用命令和配置文件

### **nginx centOS中的安装**

#### 环境配置
+ 检查安装 **gcc**
````sh
# 检查是否安装
gcc -v
# centos安装
yum install gcc-c++ 
````

+ **安装PCRE pcre-devel：**
 Nginx的Rewrite模块和HTTP核心模块会使用到PCRE正则表达式语法。这里需要安装两个安装包pcre和pcre-devel。第一个安装包提供编译版本的库，而第二个提供开发阶段的头文件和编译项目的源代码。安装指令如下：
````sh
yum install -y pcre pcre-devel
````

+ 安装**zlib：**,zlib库提供了开发人员的压缩算法，在Nginx的各种模块中需要使用gzip压缩。安装指令如下:
````sh
yum install -y zlib zlib-devel
````

+ 安装**Open SSL：**，nginx不仅支持 http协议，还支持 https（即在 ssl 协议上传输 http），如果使用了 https，需要安装 OpenSSL 库。安装指令如下：
````sh
yum install -y openssl openssl-devel
````

#### 安装nginx

+ wget命令下载
````sh
wget -c https://nginx.org/download/nginx-1.11.6.tar.gz
````

+ 解压文件到/usr/local/nginx目录下
````sh
sudo tar -zxvf /压缩包路径/nginx-1.11.6.tar.gz /usr/local/nginx
````

+ 进入安装的目录,进行默认配置
````sh
cd /usr/local/nginx
./configure
````

+ 编译安装nginx
````sh
# /usr/local/nginx目录下
make
````

+ 安装
````sh
# /usr/local/nginx目录下
make install
````

+ 配置nginx.conf（不修改默认访问地址localhost:80）
````sh
cd /usr/local/nginx/conf
vim nginx.conf
````

+ 启动
````sh
cd /usr/local/nginx/sbin
./nginx
````

### **nginx 常用命令**

+ nginx的命令，都需要进入到nginx安装目录下的/sbin下执行
````sh
# 查看版本
./nginx -v
# 查看版本详细参数
./nginx -V
# 查看帮助
./nginx -h
# 检查nginx配置文件
./nginx -t
# 指定配置文件
./nginx -c filename

# 启动
./nginx
# 优雅停机
./nginx -s quit  
# 优雅重启
./nginx -s reload
# 重新打开日志文件，一半用于切割日志
./nginx -s reopen
````


### **nginx.conf 配置文件**

#### 以下是默认的配置：
````sh
#user  nobody;
worker_processes  1;

#error_log  logs/error.log;
#error_log  logs/error.log  notice;
#error_log  logs/error.log  info;

#pid        logs/nginx.pid;


events {
    worker_connections  1024;
}


http {
    include       mime.types;
    default_type  application/octet-stream;

    #log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
    #                  '$status $body_bytes_sent "$http_referer" '
    #                  '"$http_user_agent" "$http_x_forwarded_for"';

    #access_log  logs/access.log  main;

    sendfile        on;
    #tcp_nopush     on;

    #keepalive_timeout  0;
    keepalive_timeout  65;

    #gzip  on;

    server {
        listen       80;
        server_name  localhost;

        #charset koi8-r;

        #access_log  logs/host.access.log  main;

        location / {
            root   html;
            index  index.html index.htm;
        }

        #error_page  404              /404.html;

        # redirect server error pages to the static page /50x.html
        #
        error_page   500 502 503 504  /50x.html;
        location = /50x.html {
            root   html;
        }

        # proxy the PHP scripts to Apache listening on 127.0.0.1:80
        #
        #location ~ \.php$ {
        #    proxy_pass   http://127.0.0.1;
        #}

        # pass the PHP scripts to FastCGI server listening on 127.0.0.1:9000
        #
        #location ~ \.php$ {
        #    root           html;
        #    fastcgi_pass   127.0.0.1:9000;
        #    fastcgi_index  index.php;
        #    fastcgi_param  SCRIPT_FILENAME  /scripts$fastcgi_script_name;
        #    include        fastcgi_params;
        #}

        # deny access to .htaccess files, if Apache's document root
        # concurs with nginx's one
        #
        #location ~ /\.ht {
        #    deny  all;
        #}
    }


    # another virtual host using mix of IP-, name-, and port-based configuration
    #
    #server {
    #    listen       8000;
    #    listen       somename:8080;
    #    server_name  somename  alias  another.alias;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}


    # HTTPS server
    #
    #server {
    #    listen       443 ssl;
    #    server_name  localhost;

    #    ssl_certificate      cert.pem;
    #    ssl_certificate_key  cert.key;

    #    ssl_session_cache    shared:SSL:1m;
    #    ssl_session_timeout  5m;

    #    ssl_ciphers  HIGH:!aNULL:!MD5;
    #    ssl_prefer_server_ciphers  on;

    #    location / {
    #        root   html;
    #        index  index.html index.htm;
    #    }
    #}

}
````
#### nginx 主要分为以下几部分：

+ **全局块：**配置影响nginx全局的指令。一般有运行nginx服务器的用户组，nginx进程pid存放路径，日志存放路径，配置文件引入，允许生成worker process数等。

+ **events块：**配置影响nginx服务器或与用户的网络连接。有每个进程的最大连接数，选取哪种事件驱动模型处理连接请求，是否允许同时接受多个网路连接，开启多个网络连接序列化等。

+ **http块：**可以嵌套多个server，配置代理，缓存，日志定义等绝大多数功能和第三方模块的配置。如文件引入，mime-type定义，日志自定义，是否使用sendfile传输文件，连接超时时间，单连接请求数等。

+ **server块：**配置虚拟主机的相关参数，一个http中可以有多个server。

+ **location块：**配置请求的路由，以及各种页面的处理情况。

````sh
########### 每个指令必须有分号结束。#################
#user administrator administrators;  #配置用户或者组，默认为nobody nobody。
#worker_processes 2;  #允许生成的进程数，默认为1
#pid /nginx/pid/nginx.pid;   #指定nginx进程运行文件存放地址
error_log log/error.log debug;  #制定日志路径，级别。这个设置可以放入全局块，http块，server块，级别以此为：debug|info|notice|warn|error|crit|alert|emerg
events {
    accept_mutex on;   #设置网路连接序列化，防止惊群现象发生，默认为on
    multi_accept on;  #设置一个进程是否同时接受多个网络连接，默认为off
    #use epoll;      #事件驱动模型，select|poll|kqueue|epoll|resig|/dev/poll|eventport
    worker_connections  1024;    #最大连接数，默认为512
}
http {
    include       mime.types;   #文件扩展名与文件类型映射表
    default_type  application/octet-stream; #默认文件类型，默认为text/plain
    #access_log off; #取消服务日志    
    log_format myFormat '$remote_addr–$remote_user [$time_local] $request $status $body_bytes_sent $http_referer $http_user_agent $http_x_forwarded_for'; #自定义格式
    access_log log/access.log myFormat;  #combined为日志格式的默认值
    sendfile on;   #允许sendfile方式传输文件，默认为off，可以在http块，server块，location块。
    sendfile_max_chunk 100k;  #每个进程每次调用传输数量不能大于设定的值，默认为0，即不设上限。
    keepalive_timeout 65;  #连接超时时间，默认为75s，可以在http，server，location块。

    upstream mysvr {   
      server 127.0.0.1:7878;
      server 192.168.10.121:3333 backup;  #热备
    }
    error_page 404 https://www.baidu.com; #错误页
    server {
        keepalive_requests 120; #单连接请求上限次数。
        listen       4545;   #监听端口
        server_name  127.0.0.1;   #监听地址       
        location  ~*^.+$ {       #请求的url过滤，正则匹配，~为区分大小写，~*为不区分大小写。
           #root path;  #根目录
           #index vv.txt;  #设置默认页
           proxy_pass  http://mysvr;  #请求转向mysvr 定义的服务器列表
           deny 127.0.0.1;  #拒绝的ip
           allow 172.18.5.54; #允许的ip           
        } 
    }
}
````

#### 几个常见配置项：
+ $remote_addr 与 $http_x_forwarded_for 用以记录客户端的ip地址；
+ $remote_user ：用来记录客户端用户名称；
+ $time_local ： 用来记录访问时间与时区；
+ $request ： 用来记录请求的url与http协议；
+ $status ： 用来记录请求状态；成功是200；
+ $body_bytes_s ent ：记录发送给客户端文件主体内容大小；
+ $http_referer ：用来记录从那个页面链接访问过来的；
+ $http_user_agent ：记录客户端浏览器的相关信息；
