<template><div><h3 id="如何设计权限管理模块如何设计权限管理模块-转载" tabindex="-1"><a class="header-anchor" href="#如何设计权限管理模块如何设计权限管理模块-转载"><span>如何设计权限管理模块如何设计权限管理模块 -[转载]</span></a></h3>
<p>我们比较常见的就是基于角色的访问控制，用户通过角色与权限进行关联。简单地说，一个用户拥有多个角色，一个角色拥有多个权限。这样，就构造成“用户-角色-权限”的授权模型。在这种模型中，用户与角色之间、角色与权限之间，通常都是多对多的关系。如下图：
<img :src="$withBase('/javaweb/1.png')" alt="dock">
基于这个，得先了解角色到底是什么？我们可以理解它为一定数量的权限的集合，是一个权限的载体。</p>
<p>例如：一个论坛的“管理员”、“版主”，它们都是角色。但是所能做的事情是不完全一样的，版主只能管理版内的贴子，用户等，而这些都是属于权限，如果想要给某个用户授予这些权限，不用直接将权限授予用户，只需将“版主”这个角色赋予该用户即可。</p>
<p>但是通过上面我们也发现问题了，<strong>如果用户的数量非常大的时候，就需要给系统的每一个用户逐一授权</strong>(分配角色)，这是件非常繁琐的事情，这时就可以增加一个用户组，每个用户组内有多个用户，除了给单个用户授权外，还可以给用户组授权，这样一来，通过一次授权，就可以同时给多个用户授予相同的权限，而这时用户的所有权限就是用户个人拥有的权限与该用户所在组所拥有的权限之和。用户组、用户与角色三者的关联关系如下图：
<img :src="$withBase('/javaweb/2.png')" alt="dock">
通常在应用系统里面的权限我们把它表现为菜单的访问(页面级)、功能模块的操作(功能级)、文件上传的删改，甚至页面上某个按钮、图片是否可见等等都属于权限的范畴。有些权限设计，会把功能操作作为一类，而把文件、菜单、页面元素等作为另一类，这样构成“用户-角色-权限-资源”的授权模型。而<strong>在做数据表建模时，可把功能操作和资源统一管理，也就是都直接与权限表进行关联，这样可能更具便捷性和易扩展性</strong>。 如下图：
<img :src="$withBase('/javaweb/3.png')" alt="dock"></p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>这里特别需要注意以下权限表中有一列“PowerType(权限类型)”，我们根据它的取值来区分是哪一类权限，可以把它理解为一个枚举，如“MENU”表示菜单的访问权限、“OPERATION”表示功能模块的操作权限、“FILE”表示文件的修改权限、“ELEMENT”表示页面元素的可见性控制等。</p>
</div>
<p><strong>这样设计的好处有两个：</strong>
一、<strong>不需要区分哪些是权限操作，哪些是资源</strong>，（实际上，有时候也不好区分，如菜单，把它理解为资源呢还是功能模块权限呢？）；<br>
二、<strong>方便扩展</strong>，当系统要对新的东西进行权限控制时，我只需要建立一个新的关联表“权限XX关联表”，并确定这类权限的权限类型字符串即可。</p>
<p>需要注意的是，权限表与权限菜单关联表、权限菜单关联表与菜单表都是一对一的关系。（文件、页面权限点、功能操作等同理）。也就是每添加一个菜单，就得同时往这三个表中各插入一条记录。</p>
<p>这样，可以不需要权限菜单关联表，让权限表与菜单表直接关联，此时，须在权限表中新增一列用来保存菜单的ID，权限表通过“权限类型”和这个ID来区分是种类型下的哪条记录。最后扩展出来的模型完整设计如下图：
<img :src="$withBase('/javaweb/4.png')" alt="dock"></p>
<div class="hint-container tip">
<p class="hint-container-title">Tips</p>
<p>注意上面我额外增加了一个操作日志表；</p>
</div>
<p>随着系统的日益庞大，为了方便管理，如果有需要可引入角色组对角色进行分类管理，跟用户组不同，角色组不参与授权。</p>
<p>例如：当遇到有多个子公司，每个子公司下有多个部门，这是我们就可以把部门理解为角色，子公司理解为角色组，角色组不参于权限分配。另外，为方便上面各主表自身的管理与查找，可采用树型结构，如菜单树、功能树等，当然这些可不需要参于权限分配。</p>
<font color=#900000 >**数据字典:**</font><h4 id="_1-用户表-userinfo" tabindex="-1"><a class="header-anchor" href="#_1-用户表-userinfo"><span>1.用户表：userInfo</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
用户ID | ID | BINGINT | pk not null
用户名 | USER_NAME | VACHAR | not null</li>
</ul>
<h4 id="_2-角色表-role" tabindex="-1"><a class="header-anchor" href="#_2-角色表-role"><span>2.角色表：Role</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
角色ID | ID | BIGINT | pk not null
角色名 | ROLE_NAME | VACHAR | not null</li>
</ul>
<h4 id="_3-用户与角色关联表-user-role" tabindex="-1"><a class="header-anchor" href="#_3-用户与角色关联表-user-role"><span>3.用户与角色关联表 User_Role</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
用户ID | USER_ID | BIGINT | fk not null
角色ID | ROLE_ID | BIGINT | fk not null</li>
</ul>
<h4 id="_4-用户组表-usergroup" tabindex="-1"><a class="header-anchor" href="#_4-用户组表-usergroup"><span>4.用户组表 UserGroup</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
用户组名 | USER_GROUP_NAME | VARCHAR | not null</li>
</ul>
<h4 id="_5-用户组与用户信息关联表-usergroup-userinfo" tabindex="-1"><a class="header-anchor" href="#_5-用户组与用户信息关联表-usergroup-userinfo"><span>5.用户组与用户信息关联表 UserGroup_UserInfo</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
用户组ID | USER_GROUP_ID | BIGINT | fk not null
用户ID | USER_ID | BIGINT | fk not null</li>
</ul>
<h4 id="_6-用户组与角色关联表-usergroup-role" tabindex="-1"><a class="header-anchor" href="#_6-用户组与角色关联表-usergroup-role"><span>6.用户组与角色关联表 UserGroup_Role</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
用户组ID | USER_GROUP_ID | BIGINT | fk not null
角色ID | ROLE_ID | BIGINT | fk not null</li>
</ul>
<h4 id="_7-菜单表-menu" tabindex="-1"><a class="header-anchor" href="#_7-菜单表-menu"><span>7．菜单表 Menu</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
菜单名称 | MENU_NAME | BIGINT | not null
菜单URL | URL | VARCHAR | not null
菜单父ID | PARENT_ID | BIGINT | not null</li>
</ul>
<h4 id="_8-页面元素表-pageelement" tabindex="-1"><a class="header-anchor" href="#_8-页面元素表-pageelement"><span>8.页面元素表 PageElement</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
页面元素名称 | PAGE_ELEMENT_NAME | VARCHAR | not null</li>
</ul>
<h4 id="_9-文件表-file" tabindex="-1"><a class="header-anchor" href="#_9-文件表-file"><span>9.文件表 File</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
文件名称 | FILE_NAME | VARCHAR | not null
文件路径 | FILE_PATH | VARCHAR |  null</li>
</ul>
<h4 id="_10-权限表-permission" tabindex="-1"><a class="header-anchor" href="#_10-权限表-permission"><span>10.权限表 Permission</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
权限类型 | PERMISSION_TYPE | VARCHAR | not null</li>
</ul>
<h4 id="_11-权限与菜单关联表-permission-menu" tabindex="-1"><a class="header-anchor" href="#_11-权限与菜单关联表-permission-menu"><span>11.权限与菜单关联表 Permission_Menu</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
权限ID | PERMISSION_ID | BIGINT | fk not null
菜单ID | MENU_ID | BIGINT | fk not null</li>
</ul>
<h4 id="_12-权限与页面元素关联表-permission-page" tabindex="-1"><a class="header-anchor" href="#_12-权限与页面元素关联表-permission-page"><span>12.权限与页面元素关联表 Permission_Page</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
权限ID | PERMISSION_ID | BIGINT | fk not null
页面元素ID | PAGE_ELEMENT_ID | BIGINT | fk not null</li>
</ul>
<h4 id="_13-权限与文件关联表-permission-file" tabindex="-1"><a class="header-anchor" href="#_13-权限与文件关联表-permission-file"><span>13.权限与文件关联表 Permission_File</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
权限ID | PERMISSION_ID | BIGINT | fk not null
文件ID | FILE_ID | BIGINT | fk not null</li>
</ul>
<h4 id="_14-功能操作表-operation" tabindex="-1"><a class="header-anchor" href="#_14-功能操作表-operation"><span>14.功能操作表 Operation</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
操作名称 | OPERATION_NAME | VARCHAR |  not null
操作编码 | OPERATION_CODE | VARCHAR |   null
拦截URL前缀 | LJ_URL | VARCHAR |   null
操作父ID | PARENT_ID | BIGINT |</li>
</ul>
<h4 id="_15-权限与功能操作关联表-permission-operation" tabindex="-1"><a class="header-anchor" href="#_15-权限与功能操作关联表-permission-operation"><span>15.权限与功能操作关联表 Permission_Operation</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
权限ID | PERMISSION_ID | BIGINT | fk not null
操作ID | OPERATION_ID | BIGINT | fk not null</li>
</ul>
<h4 id="_16-角色与权限关联表-role-permission" tabindex="-1"><a class="header-anchor" href="#_16-角色与权限关联表-role-permission"><span>16.角色与权限关联表 Role_Permission</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
角色ID | ROLE_ID | BIGINT | fk not null
权限ID | PERMISSION_ID | BIGINT | fk not null</li>
</ul>
<h4 id="_17-操作日志表-operation-log" tabindex="-1"><a class="header-anchor" href="#_17-操作日志表-operation-log"><span>17.操作日志表 Operation_Log</span></a></h4>
<p>字段名称 | 字段 |  类型 | 备注</p>
<ul>
<li>| :-: | :-: | :-: | -:
ID | ID | BIGINT | pk not null
操作类型ID | OPERATION_ID | BIGINT | fk not null
操作内容 | OPERATION_CONTENT | VARCHAR |
操作用户ID | USER_ID | BIGINT | fk not null
操作时间 | OPERATION_TIME | TIMESTAMP |</li>
</ul>
</div></template>


