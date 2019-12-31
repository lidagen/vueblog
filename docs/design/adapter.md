## 设计模式之适配器模式——Adapter

### 定义
适配器模式把一个类的接口变换成客户端所期待的另一种接口，从而使原本接口不匹配而无法在一起工作的两个类能够在一起工作。 

### 适用场景
+ 您想使用现有的类，但它的接口与您需要的接口不匹配
+ 你想创建一个可重用的类，让它与不相关或不可预见的类（即不一定具有兼容接口的类）协作
+ 你需要使用几个现有的子类，但通过对每个子类进行子类化来调整它们的接口是不切实际的。对象适配器可以调整其父类的接口。
+ 大多数使用第三方库的应用程序使用适配器作为应用程序和第三方库之间的中间层，以将应用程序与库分离。如果必须使用另一个库，则只需要新库的适配器，而无需更改应用程序代码。

### 组件
+ 目标角色（Target）:客户端所期待得到的接口
+ 适配器角色（Adapter）：适配器类是本模式的核心。适配器把源接口转换成目标接口。（这一角色不可以是接口，而必须是具体类）。
+ 源角色被适配者（Adapee）：现在需要被适配的接口

### 优点
+ 一个适配器可以把多种不同的源适配到同一个目标。换言之，同一个适配器可以把源类和它的子类都适配到目标接口。因为对象适配器采用的是对象组合的关系，只要对象类型正确，是不是子类都无所谓。
+ 符合设计原则：多用合成/聚合、少用继承，从而减少类之间的耦合

### 缺点
+ 要重定义Adaptee的行为比较困难，这种情况下，需要定义Adaptee的子类来实现重定义，然后让适配器组合子类。虽然重定义Adaptee的行为比较困难，但是想要增加一些新的行为则方便的很，而且新增加的行为可同时适用于所有的源
+ 需要额外的引用来间接得到Adaptee。

### 构造场景
假设你有一台电脑，能接收5V电压。我国电压220V，日本电压110V,需要适配器支持电脑在两个国家都能用。

+ Adapee
````java
public interface PowerAdaptee {
    /**
     * 输出电压
     * @return
     */
    int output();
}

//不同电压实现
//中国
public class ChinaPowerAdaptee implements PowerAdaptee{
    private int output = 220;

    @Override
    public int output() {
        System.out.println("电源输出电压：" + output);
        return output;
    }
}

//日本
public class JapanPowerAdaptee implements PowerAdaptee {
    private int output = 110;

    @Override
    public int output() {
        System.out.println("电源输出电压：" + output);
        return output;
    }
}
````

+ Target
````java
public interface ComputerTarget {
    /**
     * 220v输出5V电压
     * @return
     */
    int output5V();

}
````

+ Adapter
````java
public class PowerAdapter implements ComputerTarget{

    PowerAdaptee powerAdaptee;

    public PowerAdapter(PowerAdaptee powerAdaptee){
        this.powerAdaptee = powerAdaptee;
    }

    @Override
    public int output5V() {
        return transferOutPut(powerAdaptee);
    }

    /**转换方法*/
    private int transferOutPut(PowerAdaptee adaptee){
        int v ;
        if (adaptee instanceof ChinaPowerAdaptee){
            v = adaptee.output() / 44;
            System.out.println("中国220V电压转化为"+v);
        }else if (adaptee instanceof JapanPowerAdaptee){
            v = adaptee.output() / 22;
            System.out.println("日本110V电压转化为"+v);
        }else {
            throw new IllegalArgumentException("未找到对应适配器");
        }
        return v;
    }

}
````

+  测试方法
````java
public class AdapterMain {
    public static void main(String[] args) {
        ComputerTarget chinaTarget = new PowerAdapter(new ChinaPowerAdaptee()) ;
        ComputerTarget japanTarget = new PowerAdapter(new JapanPowerAdaptee()) ;
        chinaTarget.output5V();
        japanTarget.output5V();
    }
}
/**输出：
电源输出电压：220
中国220V电压转化为5
电源输出电压：110
日本110V电压转化为5
*/
````

例子中看出，客户端所期待的接口Target需要适配器Adapter实现。Adapter中实现转化5V的方法。
接口ComputerTarget中是无参的，PowerAdapter通过构造器把被适配者Adapee注入进去，从而进行转化。

### 适配器模式在spring AOP中的运用
+ 在spring AOP中，使用`Advice`（通知）来增强被代理类的功能。

+ `Advice`的类型有`MethodBeforeAdvice`、`AfterReturningAdvice` 、`ThrowsAdvice`

+ 每个`Advice`实现都有对应的拦截器`MethodBeforeAdviceInterceptor`、`AfterReturningAdviceInterceptor` 、`ThrowsAdviceInterceptor`

+ spring需要将每个 `Advice`封装成对应的拦截器类型，返回给容器。

结合之前的例子，`Advice`实现类就是对应的Adapee(被适配者),而拦截器就是目标角色Target。把Advice转换成对应的拦截器，就需要用适配器Adapter进行转换。

#### 三个Adaptee如下
````java
//BeforeAdvice 继承 Advice
public interface MethodBeforeAdvice extends BeforeAdvice {

	void before(Method method, Object[] args, Object target) throws Throwable;

}
//AfterAdvice 继承 Advice
public interface AfterReturningAdvice extends AfterAdvice {

	void afterReturning(Object returnValue, Method method, Object[] args, Object target) throws Throwable;

}

public interface ThrowsAdvice extends AfterAdvice {

}
````

#### 目标接口 Target ,有两个方法，一个判断 Advice 类型是否匹配，一个是工厂方法，创建对应类型的 Advice 对应的拦截器
````java
public interface AdvisorAdapter {
    boolean supportsAdvice(Advice var1);
    //真正需要的方法是获取对应的拦截器
    MethodInterceptor getInterceptor(Advisor var1);
}
````

### 三个Adapter如下:
+ MethodBeforeAdviceAdapter

````java
class MethodBeforeAdviceAdapter implements AdvisorAdapter, Serializable {

	@Override
	public boolean supportsAdvice(Advice advice) {
		return (advice instanceof MethodBeforeAdvice);
	}

	@Override
	public MethodInterceptor getInterceptor(Advisor advisor) {
		MethodBeforeAdvice advice = (MethodBeforeAdvice) advisor.getAdvice();
		return new MethodBeforeAdviceInterceptor(advice);
	}

}
````

+ AfterReturningAdviceAdapter

````java
class AfterReturningAdviceAdapter implements AdvisorAdapter, Serializable {

	@Override
	public boolean supportsAdvice(Advice advice) {
		return (advice instanceof AfterReturningAdvice);
	}

	@Override
	public MethodInterceptor getInterceptor(Advisor advisor) {
		AfterReturningAdvice advice = (AfterReturningAdvice) advisor.getAdvice();
		return new AfterReturningAdviceInterceptor(advice);
	}

}
````


+ ThrowsAdviceAdapter

````java
class ThrowsAdviceAdapter implements AdvisorAdapter, Serializable {

	@Override
	public boolean supportsAdvice(Advice advice) {
		return (advice instanceof ThrowsAdvice);
	}

	@Override
	public MethodInterceptor getInterceptor(Advisor advisor) {
		return new ThrowsAdviceInterceptor(advisor.getAdvice());
	}

}
````

#### 客户端 DefaultAdvisorAdapterRegistry
````java
public class DefaultAdvisorAdapterRegistry implements AdvisorAdapterRegistry, Serializable {

	private final List<AdvisorAdapter> adapters = new ArrayList<AdvisorAdapter>(3);


	/**
	 * Create a new DefaultAdvisorAdapterRegistry, registering well-known adapters.
	 */
	public DefaultAdvisorAdapterRegistry() {
		registerAdvisorAdapter(new MethodBeforeAdviceAdapter());
		registerAdvisorAdapter(new AfterReturningAdviceAdapter());
		registerAdvisorAdapter(new ThrowsAdviceAdapter());
	}


	@Override
	public Advisor wrap(Object adviceObject) throws UnknownAdviceTypeException {
		if (adviceObject instanceof Advisor) {
			return (Advisor) adviceObject;
		}
		if (!(adviceObject instanceof Advice)) {
			throw new UnknownAdviceTypeException(adviceObject);
		}
		Advice advice = (Advice) adviceObject;
		if (advice instanceof MethodInterceptor) {
			// So well-known it doesn't even need an adapter.
			return new DefaultPointcutAdvisor(advice);
		}
		for (AdvisorAdapter adapter : this.adapters) {
			// Check that it is supported.
			if (adapter.supportsAdvice(advice)) {
				return new DefaultPointcutAdvisor(advice);
			}
		}
		throw new UnknownAdviceTypeException(advice);
	}

	@Override
	public MethodInterceptor[] getInterceptors(Advisor advisor) throws UnknownAdviceTypeException {
		List<MethodInterceptor> interceptors = new ArrayList<MethodInterceptor>(3);
		Advice advice = advisor.getAdvice();
		if (advice instanceof MethodInterceptor) {
			interceptors.add((MethodInterceptor) advice);
		}
		for (AdvisorAdapter adapter : this.adapters) {
			if (adapter.supportsAdvice(advice)) { // 这里调用适配器方法是否属于此`Advice`
				interceptors.add(adapter.getInterceptor(advisor)); // 这里调用适配器方法转换对应拦截器
			}
		}
		if (interceptors.isEmpty()) {
			throw new UnknownAdviceTypeException(advisor.getAdvice());
		}
		return interceptors.toArray(new MethodInterceptor[interceptors.size()]);
	}

	@Override
	public void registerAdvisorAdapter(AdvisorAdapter adapter) {
		this.adapters.add(adapter);
	}

}

````

getInterceptors的forEach中，调用 supportsAdvice() 方法来判断 Advice 对应的类型，然后调用 getInterceptor() 创建对应类型的拦截器。



