## ERC-20
### 预言机 Oracle
+ 预言机是将链下的内容（例如天气、股票价格、比赛结果等）安全可靠的传递到区块链上的智能合约，让智能合约可以根据这些信息执行预定的逻辑
+ 区块链的局限性：
    - 区块链本质是一个封闭的系统，只能访问链上的内容，智能合约设计之初无法直接访问链下数据，因为这会引入信任问题，破坏区块链去中心化特征
+ 为什么需要预言机：`许多智能合约应用场景都依赖真实世界数据`
    - **去中心化金融DeFi**:需要价格信息进行抵押贷款，交易等操作。
    - **保险**：需要天气数据、航班延误信息进行理赔
    - **预测市场**：需要根据比赛结果、选举情况进行结算
    - **供应链管理**：需要物品物流信息来验证交货情况
+ 预言机工作原理：
    - 智能合约请求数据 ：当智能合约需要外部数据，向预言机请求数据
    - 预言机获取数据： 预言机从外部数据源（API、网站、传感器等）获取相关信息
    - 验证数据以及签名： 为了保证数据可靠，预言机通常会对数据进行验证并使用数字签名
    - 传输数据到链上：预言机将验证并签名的数据传回智能合约
    - 智能合约执行： 智能合约根据获取数据进行相应业务操作
+ 预言机类型：
    - 中心化预言机：由单个实体控制，数据来源和传输都由该实体保证，这种预言机容易受攻击、篡改。与区块链去中心化相悖
    - 去中心化预言机`Decentralized Oracles`：由多个独立节点共同提供数据，采用共识机制验证数据真实性。场景去中心化预言机有Chainlink 和 Band Protocol
    - 硬件预言机: 利用硬件设备直接将数据传输到链上，适用与需要物理世界数据的应用场景
    - 人文预言机：依赖人工验证、判断，适用于需要主观判断的数据，例如内容审核、法律解释等            
+ 预言机的安全问题：
    - 数据源的可靠性：预言机获取的数据必须来自可靠数据源，否则只能合约可能执行错误
    - 预言机的安全性：预言机本身可能会遭受攻击、导致数据被篡改
    - 女巫攻击：攻击者可能创建大量节点，控制去中心化预言机的共识结果

+ chainlink 开发者文档
    - <https://docs.chain.link/>
### 