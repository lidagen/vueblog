## nginx基本概念 

### nginx是什么
+ Nginx是一款轻量级的Web 服务器/反向代理服务器及电子邮件（IMAP/POP3）代理服务器。 Nginx 主要提供反向代理、负载均衡、动静分离(静态资源服务)等服务。

### nginx的优点
+ 高并发，高性能
+ 可扩展性好
+ 高可靠性
+ 热部署

### 反向代理
+ 说到反向代理，就要说说正向代理。
  - **正向代理**：某些情况下，代理我们用户去访问服务器，需要用户手动的设置代理服务器的ip和端口号。正向代理比较常见的一个例子就是 VPN了。
  - **反向代理**： 是用来代理服务器的，代理我们要访问的目标服务器。代理服务器接受请求，然后将请求转发给内部网络的服务器，并将从服务器上得到的结果返回给客户端，此时代理服务器对外就表现为一个服务器。

+ 正向代理是为客户端做代理，代替客户端访问服务器。反向代理是为服务器做代理，代替服务器接收客户端请求。   

### 负载均衡 
+ 高并发的情况下，为了减轻单台服务器模式的压力，用多台服务器集群部署共同完成工作，提高了访问吞吐量。nginx可以负责分发请求到不同的服务器。提供负载均衡功能。

+ nginx支持的负载均衡策略有：
  - weigth(权重):通过给每个服务器设置不同的权重，从而达到接收不同的请求量。
  - ip_hash(ip hash分配):通过对ip进行hash,使对应的ip始终落在同一个服务器上（解决分布式session共享问题）。
  - fair(响应时间):让请求落在响应时间最少的服务器上。
  - url_hash(url分配):不同的url落在不同的服务器上。

+ weigth配置nginx
  - 起两个springboot项目，localhost/hi 页面写上对应端口号，端口分别为8989和8990
  - nginx.conf配置如下
    ````sh
    worker_processes  1;

    events {
        worker_connections  1024;
    }


    http {
        include       mime.types;
        default_type  application/octet-stream;

        sendfile        on;
       
        keepalive_timeout  65;

        #增加upstream配置两个服务,名字叫hello,包含两个server
        # 并设置不同的权重
        # 如果不要 weight=5字段，默认轮询的
        upstream hello{
        server 127.0.0.1:8989 weight=5;
        server 127.0.0.1:8990 weight=1;
        }
        server {
            listen       80;
            server_name  localhost;

            location / {
                # 配置 proxy_pass 指向upstream配置的别名hello
                proxy_pass http://hello;
                root   html;
                index  index.html index.htm;
            }

            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   html;
            }

        }

    }

    ````
  - ./nginx -s reload重启后访问`locallost/hi`查看不同端口号的服务器访问的次数是否跟配置的权重一致。

+ ip_hash配置nginx  
  - 起两个项目不变，修改nginx.conf
  - 配置如下
  ````sh
  worker_processes  1;

    events {
        worker_connections  1024;
    }


    http {
        include       mime.types;
        default_type  application/octet-stream;

        sendfile        on;
       
        keepalive_timeout  65;
        upstream hello{
            #加上ip_hash就可以根据ip分配服务器，能解决session共享问题
            ip_hash;
            server 127.0.0.1:8989;
            server 127.0.0.1:8990;
        }
        server {
            listen       80;
            server_name  localhost;

            location / {
                # 配置 proxy_pass 指向upstream配置的别名hello
                proxy_pass http://hello;
                root   html;
                index  index.html index.htm;
            }

            error_page   500 502 503 504  /50x.html;
            location = /50x.html {
                root   html;
            }

        }

    }
  ````


### 动静分离
+ 动静分离是动态网站根据一定规则把不变的资源和经常变的数据分离开，放在不同的服务器上。对静态资源做缓存。使访问服务器的压力降低。


### Nginx + keepalived 高可用

