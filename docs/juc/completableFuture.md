## CompletableFuture 异步回调
+ 该类实现了Future和CompletionStage两个接口，该类作为一个异步任务，可以在自己异步执行完成以后触发其它的异步任务，从而达到异步回调的效果。
  - `Future`接口提供方法来检测任务是否被执行完，等待任务执行完获得结果
  - `CompletionStage`定义了一组接口用于在一个阶段执行结束之后，要么继续执行下一个阶段，要么对结果进行转换产生新的结果等等

### 代码演示
#### 模拟一段进饭店点菜场景，点完饭，开启线程饭店做饭，客户线程打游戏。等饭店线程做好了，进入主线程。

+ 第一种，炒菜和 打饭在一个线程中
````java
/**
*第一种supplyAsync开启异步，并且cf1.join 可以获取异步结果
*/
public class CompletableDemo {

    static void sleep(Long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    static void printTimeAndThread(String s) {
        String result = new StringBuffer("").append(System.currentTimeMillis()).append(" | \t").
                append(Thread.currentThread().getName()).append(" | \t")
                .append(s).toString();
        System.out.println(result);
    }

    public static void main(String[] args) {
        printTimeAndThread("小白进入饭店，点饭菜");
        CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
            printTimeAndThread("厨师炒菜");
            sleep(200L);

            printTimeAndThread("服务员打饭");
            return "番茄鸡蛋 + 米饭";
        });
        printTimeAndThread("小白打王者");
        printTimeAndThread(String.format("%s,小白开吃", cf1.join()));
    }

}
````
+ 输出结果
````sh
1629603444962 | 	main | 	小白进入饭店，点饭菜
1629603444997 | 	main | 	小白打王者 //主线程
1629603444997 | 	ForkJoinPool.commonPool-worker-1 | 	厨师炒菜 //子线程
1629603445202 | 	ForkJoinPool.commonPool-worker-1 | 	服务员打饭
1629603445212 | 	main | 	番茄鸡蛋 + 米饭,小白开吃
````
+ 第二种场景，厨师炒完菜，开启另一个线程，服务员打饭

````java
/**
* supplyAsync开启异步后，打王者和厨师炒菜同时进行，
* thenCompose服务员打饭必须等待厨师炒菜完成以后拿到结果，属于两个结果的合并
* 厨师炒菜和服务员打饭是两个线程，但是服务员打饭线程开启的条件是厨师线程完成
* 如果thenCompose换成 thenApply,就开启一个线程
*/
public class CompletableDemo {

    public static void main(String[] args) {
        printTimeAndThread("小白进入饭店，点饭菜");
        CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
            printTimeAndThread("厨师炒菜");
            sleep(200L);
            return "番茄鸡蛋";
        }).thenCompose(di -> CompletableFuture.supplyAsync(() -> {
            printTimeAndThread("服务员打饭");
            sleep(200L);
            return di + " + 米饭";
        }));
        printTimeAndThread("小白打王者");
        printTimeAndThread(String.format("%s,小白开吃", cf1.join()));
    }

}
````

+ 输出结果

````sh
1629603323169 | 	main | 	小白进入饭店，点饭菜
1629603323201 | 	ForkJoinPool.commonPool-worker-1 | 	厨师炒菜 //线程1
1629603323201 | 	main | 	小白打王者 //主线程
1629603323410 | 	ForkJoinPool.commonPool-worker-1 | 	服务员打饭 //线程2
1629603323625 | 	main | 	番茄鸡蛋 + 米饭,小白开吃
````
#### 模拟小白进入之前，米饭也没做好
````java
/**
* 跟上一个场景相比，把thenCompose换成了thenCombine
* 这时候 厨师炒菜线程和服务员蒸饭线程是同时开启
* 最后得到两个线程的结果（dish rice）合并
*/
public static void main(String[] args) {
    printTimeAndThread("小白进入饭店，点饭菜");
    CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
        printTimeAndThread("厨师炒菜");
        sleep(200L);
        return "番茄鸡蛋";
    }).thenCombine(CompletableFuture.supplyAsync(() -> {
        printTimeAndThread("服务员蒸饭");
        sleep(200L);
        return " + 米饭";
    }), (dish, rice) -> {
        return String.format("%s,%s 好了", dish, rice);
    });
    printTimeAndThread("小白打王者");
    printTimeAndThread(String.format("%s,小白开吃", cf1.join()));
}
````
+ 执行结果
````sh
1629604126405 | 	main | 	小白进入饭店，点饭菜
1629604126439 | 	ForkJoinPool.commonPool-worker-1 | 	厨师炒菜
1629604126439 | 	ForkJoinPool.commonPool-worker-2 | 	服务员蒸饭
1629604126440 | 	main | 	小白打王者
1629604126661 | 	main | 	番茄鸡蛋, + 米饭 好了,小白开吃
````

::: tip
+ 第二个，第三个代码其实都能用第一个这种解决，但是不容易看出来线程之间的关系，即它们之间的并发、依赖、互斥。代码量大的话，就容易出错
+ 方法
  - supplyAsync 开启 （一个异步）
  - thenCompose 连接多个任务（结果由第最后一个返回）
  - thenCombine 合并多个任务 （结果由合并函数BiFunction返回）
:::


#### 模拟小白回家，可以坐600路和700路，哪个先来坐哪个
````java
/**
* applyToEither 二选一，两个线程一起运行，哪个先返回就把结果返回
*/
 public static void main(String[] args) {
        printTimeAndThread("小白等车");
        CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
            sleep(new Double(Math.random()).longValue());
            return "600路来了";
        }).applyToEither(CompletableFuture.supplyAsync(() -> {
            sleep(new Double(Math.random()).longValue());
            return "700路来了";
        }), firstComeBus -> firstComeBus);

        printTimeAndThread(String.format("%s,小白坐上车", cf1.join()));
    }
````

#### 模拟一个分支出问题了，需要异常处理 
````java
/**
exceptionally 处理异常
*/
public static void main(String[] args) {
    printTimeAndThread("小白等车");
    CompletableFuture<String> cf1 = CompletableFuture.supplyAsync(() -> {
        sleep(100L);
        return "600路来了";
    }).applyToEither(CompletableFuture.supplyAsync(() -> {
        sleep(50L);
        if (1 + 1 == 2) {
            printTimeAndThread("撞树了");
            throw new RuntimeException("撞树了");
        }
        return "700路来了";
    }), firstComeBus -> firstComeBus).exceptionally(e -> {
        printTimeAndThread("叫出租车");
        return "出租车，到了";
    });

    printTimeAndThread(String.format("%s,小白坐上车", cf1.join()));
}
````

### 最后模拟一个场景，三个线程，m1 和 m2有依赖关系，需要m1执行完m2执行，然后线程池操作
````java
@Data
class SourceMet {
    private String m1;

    private String m2;

    private String m3;
    
}


class Method1 {

    public SourceMet call(SourceMet m1) {
        m1.setM1("a结果获取了");
        return m1;
    }
}

/**
 * 依赖 Method1
 */
class Method2 {
    public SourceMet call(SourceMet m) {
        if (!Objects.isNull(m.getM1())){
            m.setM2("b结果获取了");
        }
        return m;
    }
}


class Method3 {
    public SourceMet call(SourceMet m) {
        m.setM3("c结果获取了");
        return m;
    }
}

public class CompletableDemo {

    static void sleep(Long millis) {
        try {
            TimeUnit.MILLISECONDS.sleep(millis);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    static void printTimeAndThread(String s) {
        String result = new StringBuffer("").append(System.currentTimeMillis()).append(" | \t").
                append(Thread.currentThread().getName()).append(" | \t")
                .append(s).toString();
        System.out.println(result);
    }

    /**
     * 三个线程同时执行，
     * Method2依赖Method1的结果
     *
     * @param args
     */
    public static void main(String[] args) {
        ThreadPoolExecutor executor = new ThreadPoolExecutor(3, 6, 1L, TimeUnit.SECONDS, new ArrayBlockingQueue<>(10));
        SourceMet met = new SourceMet();

        Method1 m1 = new Method1();
        Method2 m2 = new Method2();
        Method3 m3 = new Method3();
        executor.execute(() -> {
            m3.call(met);
        });
        CompletableFuture cf1 = CompletableFuture.supplyAsync(new Supplier<SourceMet>() {
            @Override
            public SourceMet get() {
                return m1.call(met);
            }
        }, executor).thenCompose(a -> CompletableFuture.supplyAsync(new Supplier<SourceMet>() {
            @Override
            public SourceMet get() {
                return m2.call(met);
            }
        }, executor));

        System.out.println(met.toString());
        
    }
}
````

