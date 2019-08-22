## BigDecimal 源码分析 JDK8

### 概述
+ `float`和`double`类型的主要设计目标是为了科学计算和工程计算。他们执行二进制浮点运算，这是为了在广域数值范围上提供较为精确的快速近似计算而精心设计的。它们没有提供完全精确的结果，所以不应该被用于要求精确结果的场合。商业计算往往要求结果精确，这时候需要用到`BigDecimal`

+ `BigDecimal`继承 `Number`抽象类, 实现`Comparable`接口。`Number`提供了把对象转为int long byte float double的方法。`Comparable`实现了BigDecimal间比较的方法。

### 变量
````java
//整数域（超过 18 位时使用）
private final BigInteger intVal;

//整数域long型表示，整数域在 long 能够表示的范围内使用，超出能表示范围会被赋为 Long.MIN_VALUE，
//代表整数域此时使用intVal 来表示
private final transient long intCompact;

//表示小数位数
private final int scale; 

//值的有效位数，不包含正负符号
private transient int precision;

//表示的缓存。该值只赋值一次。
private transient String stringCache;

static final long INFLATED = Long.MIN_VALUE;

private static final BigInteger INFLATED_BIGINT = BigInteger.valueOf(INFLATED);


private static final int MAX_COMPACT_DIGITS = 18;

private static final ThreadLocal<StringBuilderHelper>
    threadLocalStringBuilderHelper = new ThreadLocal<StringBuilderHelper>() {
    @Override
    protected StringBuilderHelper initialValue() {
        return new StringBuilderHelper();
    }
};
````
+ 从变量来看，BigDecimal 是用两个变量来表示整数与小数的。这种方法避免了float 和 double小数精度问题


### 重要相关类

#### **RoundingMode**
+ 该类是一个枚举类，枚举了 8 种舍入类型：
  - `CEILING` 向正无穷舍入
  - `FLOOR` 向负无穷舍入
  - `DOWN` 向 0 舍入
  - `UP` 与 DOWN 相反
  - `HALF_UP` 五入
  - `HALF_DOWN` 五舍
  - `HALF_EVEN` 五向偶数方向舍入
  - `UNNECESSARY` 表示一定会得到精确结果，得不到时抛异常

<img :src="$withBase('/javaweb/rounding-mode-table.png')" alt="dock">


#### **MathContext**
+ 封装了精度及舍入规则，用于算数运算,预定义的一些规则：
````java
//精度为 0，相当于没有配置
public static final MathContext UNLIMITED =
                new MathContext(0, RoundingMode.HALF_UP);

// 精度为 7，舍入策略为 HALF_EVEN
public static final MathContext DECIMAL32 =
                new MathContext(7, RoundingMode.HALF_EVEN);

// 精度为 16，舍入策略为 HALF_EVEN
public static final MathContext DECIMAL64 =
                new MathContext(16, RoundingMode.HALF_EVEN);

// 精度为 34，舍入策略为 HALF_EVEN
public static final MathContext DECIMAL128 =
                new MathContext(34, RoundingMode.HALF_EVEN);
````
+ 精度7 表示123.4567，后面的舍弃。

#### **BigInteger**

+ 任意精度的整数。底层存储方式也是 bits 位，与基本类型的区别在于，基本类型 `int` 固定 32bits，`BigInteger` 的 bits 存储在一个 `int[]` 中，所以他可以表示很大的整数。比如 2^128 的二进制表示是 100...000(1+128个0) 一共 129 位，存放在长度为 `Math.ceil(129.0/32)` 的数组中。

### 构造器
````java
/**
*BigDecimal(String val) 最终实现是
*public BigDecimal(char[] in, int offset, int len, MathContext mc){}构造器
*/

public BigDecimal(String val) {
    this(val.toCharArray(), 0, val.length());
}
public BigDecimal(String val, MathContext mc) {
    this(val.toCharArray(), 0, val.length(), mc);
}

public BigDecimal(char[] in, int offset, int len) {
    this(in,offset,len,MathContext.UNLIMITED);
}

/**
*这个方法最终目的是区分正负数，给变量 scale intVal intCompact precision赋值
*/
public BigDecimal(char[] in, int offset, int len, MathContext mc) {
    // 判断起始位合理性.
    if (offset + len > in.length || offset < 0)
        throw new NumberFormatException("Bad offset or len arguments for char[] input.");
    int prec = 0;                 // record precision value
    int scl = 0;                  // record scale value
    long rs = 0;                  // the compact value in long
    BigInteger rb = null;         // the inflated value in BigInteger
    try {
        //判断正负+ - 负数isneg为true
        boolean isneg = false;          // assume positive
        if (in[offset] == '-') {
            isneg = true;               // leading minus means negative
            offset++;
            len--;
        } else if (in[offset] == '+') { // leading + allowed
            offset++;
            len--;
        }

        boolean dot = false;             // true when there is a '.'
        long exp = 0;                    // exponent
        char c;                          // current character
        //判断char数组长度是否超过long最大长度
        boolean isCompact = (len <= MAX_COMPACT_DIGITS);
        int idx = 0;
        //char长度在long内
        if (isCompact) {
            //循环
            for (; len > 0; offset++, len--) {
                c = in[offset];
                if ((c == '0')) { // have zero
                    if (prec == 0)
                        prec = 1;
                    else if (rs != 0) {
                        rs *= 10;
                        ++prec;
                    } // else digit is a redundant leading zero
                    if (dot)
                        ++scl;
                } else if ((c >= '1' && c <= '9')) { // have digit
                    int digit = c - '0';
                    if (prec != 1 || rs != 0)
                        ++prec; // prec unchanged if preceded by 0s
                    rs = rs * 10 + digit;
                    if (dot)
                        ++scl;
                } else if (c == '.') {   // have dot
                    // have dot
                    if (dot) // two dots
                        throw new NumberFormatException();
                    dot = true;
                } else if (Character.isDigit(c)) { // slow path
                    int digit = Character.digit(c, 10);
                    if (digit == 0) {
                        if (prec == 0)
                            prec = 1;
                        else if (rs != 0) {
                            rs *= 10;
                            ++prec;
                        } // else digit is a redundant leading zero
                    } else {
                        if (prec != 1 || rs != 0)
                            ++prec; // prec unchanged if preceded by 0s
                        rs = rs * 10 + digit;
                    }
                    if (dot)
                        ++scl;
                } else if ((c == 'e') || (c == 'E')) {
                    exp = parseExp(in, offset, len);
                    // Next test is required for backwards compatibility
                    if ((int) exp != exp) // overflow
                        throw new NumberFormatException();
                    break; // [saves a test]
                } else {
                    throw new NumberFormatException();
                }
            }
            if (prec == 0) // no digits found
                throw new NumberFormatException();
            // Adjust scale if exp is not zero.
            if (exp != 0) { // had significant exponent
                scl = adjustScale(scl, exp);
            }
            rs = isneg ? -rs : rs;
            int mcp = mc.precision;
            int drop = prec - mcp; // prec has range [1, MAX_INT], mcp has range [0, MAX_INT];
                                    // therefore, this subtract cannot overflow
            if (mcp > 0 && drop > 0) {  // do rounding
                while (drop > 0) {
                    scl = checkScaleNonZero((long) scl - drop);
                    rs = divideAndRound(rs, LONG_TEN_POWERS_TABLE[drop], mc.roundingMode.oldMode);
                    prec = longDigitLength(rs);
                    drop = prec - mcp;
                }
            }
        } else {
            //char长度不在long内
            char coeff[] = new char[len];
            for (; len > 0; offset++, len--) {
                c = in[offset];
                // have digit
                if ((c >= '0' && c <= '9') || Character.isDigit(c)) {
                    // First compact case, we need not to preserve the character
                    // and we can just compute the value in place.
                    if (c == '0' || Character.digit(c, 10) == 0) {
                        if (prec == 0) {
                            coeff[idx] = c;
                            prec = 1;
                        } else if (idx != 0) {
                            coeff[idx++] = c;
                            ++prec;
                        } // else c must be a redundant leading zero
                    } else {
                        if (prec != 1 || idx != 0)
                            ++prec; // prec unchanged if preceded by 0s
                        coeff[idx++] = c;
                    }
                    if (dot)
                        ++scl;
                    continue;
                }
                // have dot
                if (c == '.') {
                    // have dot
                    if (dot) // two dots
                        throw new NumberFormatException();
                    dot = true;
                    continue;
                }
                // exponent expected
                if ((c != 'e') && (c != 'E'))
                    throw new NumberFormatException();
                exp = parseExp(in, offset, len);
                // Next test is required for backwards compatibility
                if ((int) exp != exp) // overflow
                    throw new NumberFormatException();
                break; // [saves a test]
            }
            // here when no characters left
            if (prec == 0) // no digits found
                throw new NumberFormatException();
            // Adjust scale if exp is not zero.
            if (exp != 0) { // had significant exponent
                scl = adjustScale(scl, exp);
            }
            // Remove leading zeros from precision (digits count)
            rb = new BigInteger(coeff, isneg ? -1 : 1, prec);
            rs = compactValFor(rb);
            int mcp = mc.precision;
            if (mcp > 0 && (prec > mcp)) {
                if (rs == INFLATED) {
                    int drop = prec - mcp;
                    while (drop > 0) {
                        scl = checkScaleNonZero((long) scl - drop);
                        rb = divideAndRoundByTenPow(rb, drop, mc.roundingMode.oldMode);
                        rs = compactValFor(rb);
                        if (rs != INFLATED) {
                            prec = longDigitLength(rs);
                            break;
                        }
                        prec = bigDigitLength(rb);
                        drop = prec - mcp;
                    }
                }
                if (rs != INFLATED) {
                    int drop = prec - mcp;
                    while (drop > 0) {
                        scl = checkScaleNonZero((long) scl - drop);
                        rs = divideAndRound(rs, LONG_TEN_POWERS_TABLE[drop], mc.roundingMode.oldMode);
                        prec = longDigitLength(rs);
                        drop = prec - mcp;
                    }
                    rb = null;
                }
            }
        }
    } catch (ArrayIndexOutOfBoundsException e) {
        throw new NumberFormatException();
    } catch (NegativeArraySizeException e) {
        throw new NumberFormatException();
    }
    this.scale = scl;
    this.precision = prec;
    this.intCompact = rs;
    this.intVal = rb;
}
````

### 方法
#### <font color=#A23400 >**加 add**</font>
````java
//无精度,结果是4.5585522
BigDecimal add = BigDecimal.valueOf(3.22522).add(BigDecimal.valueOf(1.3333322));
//设置精度和舍入类型，结果是4.5585522，原因是设置精度后生成新的对象，需要BigDecimal接收
BigDecimal add = BigDecimal.valueOf(3.22522).add(BigDecimal.valueOf(1.3333322));
add.setScale(2,RoundingMode.HALF_UP);

//正确方案 1
BigDecimal add = BigDecimal.valueOf(3.22522).add(BigDecimal.valueOf(1.3333322));
BigDecimal addScale = add.setScale(2,RoundingMode.HALF_UP);
//正确方案 2
BigDecimal add = BigDecimal.valueOf(3.22522).add(BigDecimal.valueOf(1.3333322))
                                            .setScale(2,RoundingMode.HALF_UP);
````

#### <font color=#A23400 >**减 subtract**</font>
````java
BigDecimal subtract =BigDecimal.valueOf(3.22522).subtract(BigDecimal.valueOf(5.3333322))
                                           .setScale(2,RoundingMode.HALF_UP);
````

#### <font color=#A23400 >**乘 multiply**</font>
````java
BigDecimal multiply =BigDecimal.valueOf(3.22522).multiply(BigDecimal.valueOf(5.3333322))
                                                    .setScale(2,RoundingMode.HALF_UP);
````

#### <font color=#A23400 >**除 divide**</font>
````java
//这种方式除不尽情况下会报错 ArithmeticException
BigDecimal divide =BigDecimal.valueOf(3.22522).divide(BigDecimal.valueOf(5.3333322))
                                                    .setScale(2,RoundingMode.HALF_UP);
//正确写法
BigDecimal divide =BigDecimal.valueOf(9.22522).divide(BigDecimal.valueOf(5.3333322),2,RoundingMode.HALF_UP);                                         
````

:::warning
除法在计算之前就要设置精度和舍入类型，不能等计算完成以后设置。因为在设置精度之前存在无法除尽的情况
:::


#### <font color=#A23400 >**绝对值 abs**</font>
````java
//绝对值也可设置精度和舍入类型
BigDecimal abs = BigDecimal.valueOf(-9.22522).abs().setScale(2,RoundingMode.HALF_UP);
````


### 总结
+ 商业计算使用BigDecimal。
+ 总是使用compareTo()比较两个BigDecimal的值，不要使用equals()
+ 尽量使用参数类型为String的构造函数,避免精度问题。
+ BigDecimal都是不可变的（immutable）的，在进行每一步运算时，都会产生一个新的对象，所以在做加减乘除运算时千万要保存操作后的值。
+ 除法使用时，要加上精度和舍入类型入参，避免除不尽报ArithmeticException异常


