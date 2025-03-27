## Solidity 基础
### Solidity编译器 Remix
+ Solidity编译器是向前兼容的，即新版本兼容旧版本，反之不一定。
    - 用于把人类编程语言转成机器语言 
+ EVM版本以城市命名
    - 类似java的JVM,运行代码的虚拟机

### 开源协议
+ 合约需要定义适用的开源协议,不同的开源协议对应不同SPDX license,需要定义在.sol文件的第一行
+ spdx.org/licenses/中有不同协议的具体说明

```sh
// SPDX-License-Identifier: MIT
```
### 编译器版本
````sh
# 所有高于这个版本的编译器都可以编译
pragma solidity ^0.8.24;
````

### Solidity基础数据类型
+ 布尔
````py
    bool boolVal_1 = true;
    bool boolVal_2 = false;
````

+ uint 无符号整数
````py
    
    #uint8 可以存储 0 - （2^8-1） 即 0-255以内的数
    uint8 uintVar = 255;

    #uint256 即 0 - (2^256 -1)
    uint256 uintVal_1 = 255555555;

````

+ int 
````py
    int256 intVar = -1;
````

+ bytes
````py
    #最大可以到32
    bytes32 byteVal = "hello world";

    # string某种意义上动态分配的bytes，会根据字符串自动分配空间
    string strVar = "hello world";
````
+ address
````py
    # 区块链上比较特殊的基础数据类型,账户或者合约地址
    address addrVar = 0x6565A7f3D446AF85aC74eD687E0f75869a56Cd59
````

### Solidity 函数
+ 一段业务逻辑，用于对合约中的数据进行计算处理 ,关键字 function
+ 函数拥有访问修饰符，分别是`public`、`privete`、`internal`、`external`

| Visibility | Within contract | Outside Contracts | Child Contract | External Accounts
| :----------- | :-----------: | :-----------: | :-----------: | :-----------: |
| Public      | Y    | Y     | Y      |  Y       |
| Private      |  Y       | N      | N      | N       |
| Internal      |  Y       | N        | Y        | N       |
| External      | N       | Y       | N       | Y       |


+ view关键字
    - 对函数只会读取，不会修改其中逻辑以及变量
+ pure关键字
    - 只运算，不会修改变量值    

+ 返回值 returns
    - 并且会定义返回的数据类型



+ 示例
````py
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloWorld{
    # 合约中变量strVal是storage类型，不需要显式声明
    string strVal = "hello world";

    function sayHello() public view returns (string memory){
            return setInfo(strVal);
    }

    function setHelloWorld(string memory newStr) public {
        strVal = newStr;
    }
    function setInfo(string memory helloworldStr) internal pure returns (string memory){
        return string.concat(helloworldStr," from Jason‘s contract");
    }
}
````

### solidity存储模式
+ solidity存储模式有以下6种
    - storage : 永久性存储
    - memory : 暂时性存储,变量运行时可以被修改
    - calldata : 暂时性存储,变量运行时无法被修改
    - stack :
    - codes :
    - logs :
+ 合约所有的声明、定义，都会落在这6种存储模式中的一种    
+ 存储可分为**暂时性存储**、**永久性存储**


> 💡 **Tip:**     <br>
>   1. 声明在合约中的数据类型，会判定为stroage <br>
>   2. 声明在变量中的数据类型，会判定为memory <br>
>   3. 传参的string需要显式声明memory，因为string是bytes构造的复杂数据结构，需要告诉编译器使用哪种存储模式


### 数据、映射、结构体

#### struct 结构体
````py
# 构造结构体
 struct Info {
        string phrase;
        uint256 id;
        address addr;
    }

# 初始化
Info memory info = Info(newStr,_id,msg.sender);
````
#### array 数组
````py
Info[] infos;

infos.push(info);
````
#### mapping 映射
````py
mapping (uint256 => Info) infoMapping;

infoMapping[_id].phrase;
````


### 智能合约工厂模式
+ 工厂模式的想法是拥有一个合约(工厂)，该合约将承担创建其他合约的任务。在基于类的编程中，此模式的主要动机来自单一职责原则(一个类不需要知道如何创建其他类的实例)，并且该模式为构造函数提供了一种抽象。
+ 为什么要在 Solidity 中使用工厂模式
    - 如果要创建同一合约的多个实例，并且正在寻找一种跟踪它们并简化管理的方法。
    ````py
    contract Factory {
      Child[] children;
      function createChild(uint data){
         Child child = new Child(data);
         children.push(child);
      }
    }
    contract Child{
         uint data;
        constructor(uint _data){
            data = _data;
        }
    }
    ````
    - 节省部署成本：你可以先部署工厂，之后在使用时再来部署其他合约。
    - 提高合约安全性: <https://learnblockchain.cn/article/2297>

### hello world工厂合约
+ 创建一个工厂合约
+ 引入需要管理的合约
    - 引入本地的合约
    ````py
    # 引入同级目录下test.sol文件的HelloWorld合约
    import { HelloWorld } from "./test.sol";
    ````
    - 引入github合约
    - 引入合约包

+ 示例
````py
# 工厂
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;
import { HelloWorld } from "./test.sol";

contract HelloWorldFactory{
    HelloWorld hw;

    HelloWorld[] hws;
    function creatHelloWorld() public {
        hw = new HelloWorld();
        hws.push(hw);
    }

    function getHelloWorldByIndex(uint256 _index) public view returns (HelloWorld){
        return hws[_index];
    } 

    function callHelloWorldFromFactory(uint256 _index,uint _id) public view returns (string memory){
        return hws[_index].sayHello(_id);
    }

    function callSetHelloWorldFactory(uint256 _index,string memory newStr,uint256 _id) public {
        hws[_index].setHelloWorld(newStr,_id);
    }
}
````

````py
# Hello World合约
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract HelloWorld{
    string strVal = "hello world";
    
    struct Info {
        string phrase;
        uint256 id;
        address addr;
    }

    Info[] infos;

    mapping (uint256 => Info) infoMapping;

    function sayHello(uint256 _id) public view returns (string memory){
            
            if (infoMapping[_id].addr == address(0x0)){
                return setInfo(strVal);
            }

            return infoMapping[_id].phrase;
    }

    function setHelloWorld(string memory newStr,uint256 _id) public {
        Info memory info = Info(newStr,_id,msg.sender);
        infoMapping[_id] = info;
        infos.push(info);
    }
    function setInfo(string memory helloworldStr) internal pure returns (string memory){
        return string.concat(helloworldStr," from Frank");
    }
}
````