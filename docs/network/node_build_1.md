## DNS 原理
## TLS
## 协议
### shadowsocks
### trojan
### vemess
### vless

## 加密访问面板
### 端口转发登陆
````sh
ssh -L 20000:127.0.0.1:20000 ubuntu@47.130.15.132-p 22 -i /home/wangs/Documents/LightsailDefaultKey-ap-southeast-1.pem
localhost:20000
````
#### 加密https访问
+ 申请ip
+ ca认证
+ xui配置认证


## build step
+ buy vps and setup static ip
+ test ip if allow gw
+ buy ip and setup DNS
````sh
namesilo 

options-> manager DNS ,

| HOSTNAME	| TYPE	| ADDRESS / VALUE	| DISTANCE/PRIO	|TTL	| SERVICE	| EDIT	| DELETE
| :-----| :---- | :---- |
|    |A	|47.130.15.132	|0	|7207 |*	|3rd-party		
|*	 |A	|47.130.15.132	|0	|3603  |*	|3rd-party		
````
+ download pem and ssh logon
+ install xui
+ install nginx
+ install 