### python + django 创建web应用

#### 安装django
+ 安装好python3.7+以后，cmd下执行命令安装最近稳定版django
````
pip install Django==2.1.5
````
::: tip
判断django安装是否成功：python -m django --version 出现版本号则安装成功
:::

+ 创建项目
  - 进入相要创建项目的目录下，运行命令 django admin startproject myblog  其中myblog 为项目名
  - 启动项目 在项目manage.py同级目录下cmd 输入命令python manage.py runserver 启动服务，复制url访问
  - 创建应用， 在项目manage.py同级目录下cmd 输入命令python manage.py startapp blog  其中blog  为应用名，
    并添加应用在settings.py中INSTALLED_APPS里
```` python{4}
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # bolg 模块添加进来
    'bolg'
]
````

#### 修改数据库mysql

+ setting.py中修改sqllite3数据库连接为mysql
```` python{4}
DATABASES = {
    'default': {
       # 'ENGINE': 'django.db.backends.sqlite3',
       # 'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
        'ENGINE': 'django.db.backends.mysql',   # 数据库引擎
        'NAME': 'djangoweb',         # 你要存储数据的库名，事先要创建之
        'USER': 'root',         # 数据库用户名
        'PASSWORD': 'root',     # 密码
        'HOST': 'localhost',    # 主机
        'PORT': '3306',         # 数据库使用的端口
    }
}
````

+ 安装pymysql, cmd执行命令 pip install pymysql

+ _init_.py导入pymysql
````
import pymysql
pymysql.install_as_MySQLdb()
````
+ Terminal执行数据库迁移
````
python manage.py makemigrations
python manage.py migrate
````

:::: warning
makemigrations 执行语句可能会报错no changes detected，加上子应用名称，比如我app名称叫做spear_web,运行下列语句
python manage.py makemigrations --empty spear_web
::::

#### django admin创建

+ Terminal运行 python manage.py createsuperuser

输入用户名 邮箱 密码 创建成功 ，http://127.0.0.1:8000/admin/   查看

+ 子应用修改 admin.py 文件,admin注册Article类
```` python{4}
from spear_web.models import Article
 
admin.site.register(Article)
````

+ admin管理后台中可以看到Article类的管理

#### bootstrap安装

+ 命令安装
````
pip install django-bootstrap3
````

+ settings.py配置
```` python{4}
INSTALLED_APPS = (
    'django.contrib.staticfiles',
    # 第三方应用程序
    'bootstrap3',
    # 我的应用程序
    'learning_logs',
    'users',
)
````

+ django-bootstrap3包含jQuery，在settings.py末尾加上
````
# django-bootstrap3的设置
BOOTSTRAP3 = {
     'include_jquery': True,
}
````

