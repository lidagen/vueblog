### IOC整体流程
<img :src="$withBase('/springcloud/IOC.png')" alt="dock">

### 手写@Autowired
+ 创建一个注解
````java
import java.lang.annotation.*;

@Documented
@Retention(RetentionPolicy.RUNTIME)
@Inherited
@Target(ElementType.FIELD)
public @interface Autowire {
}
````
+ 创建sevice
````java
public class UserService {
    private int age;
    @Override
    public String toString() {
        return "UserService{" +
                "age=" + age +
                '}';
    }
}
````
+ 创建controller,用手写注解注入
````java
public class Demo {
    public static void main(String[] args) {
        //实例化userController，获取class对象
        UserController userController = new UserController();
        Class<? extends UserController> controllerClass = userController.getClass();
        //获取所有fields
        Field[] fields = controllerClass.getDeclaredFields();
        Stream.of(fields).forEach(field -> {
            //判断是否包含注解
            Autowire annotation = field.getAnnotation(Autowire.class);
            if (annotation != null) {
                //设置私有变量也能访问
                field.setAccessible(true);
                //获取注解对象
                Class<?> type = field.getType();
                try {
                    //获取有注解的对象
                    Object o = type.newInstance();
                    field.set(userController, o);
                    System.out.println(userController.getUserService().toString());
                } catch (InstantiationException e) {
                    e.printStackTrace();
                } catch (IllegalAccessException e) {
                    e.printStackTrace();
                }
            }
        });
    }
}
````
