---
title: Python Decorator
layout: post
category : python
---
python decorator 大概是每个pythoner比看到内容吧.对于我这个从PHP 过来的人第一次看，确实也有那么些新鲜难懂。顾名思义：“装饰器”，绝对是把什么什么东西通过另外的东西修饰了一番。

####先来看下最基本的显而易见的例子吧：

    def log(func):
        def wrapper(*args, **kw):
            print 'call %s():' % func.__name__
            func(*args, **kw)---
        return wrapper

    @log
    def now():
        print '2013-12-25'

    now()
    
@log就是所谓的语法糖，从上例最终的表现形式就是：将now()函数传给了方法log..最终调用是 调用了内部函数wrapper..

接下来一步步刨析：  
log函数内部有个wrapper函数，这样就形成了一个闭包wrapper,这个函数对于其他部分是一个独立的模块，但其可以使用log的参数也就是传进来的方法func,func在log内部是相当于warpper是全局变量（log 内部的作用域）经过wrapper的处理后,now函数就不再是单单输出“2013-12-25”了。所以也验证了前面所说的经过某某修饰成为了另外的某某某。相当于`now = log(now())`

**如果前面的例子打印`now.__name__`,结果为：wrapper 而不是now**

为了解决这个问题，需要如下操作：

    from functools import wraps
    def log(func):
    	@wraps(func)
        def wrapper(*args, **kw):
            print 'call %s():' % func.__name__
            func(*args, **kw)---
        return wrapper
**如果now 函数需要传参数的话需要反射来处理，具体可看http://coolshell.cn/articles/11265.html**

####以上是一个最基本的decorator 应用，接下来说明在使用decorator时传参    

    from functools import wraps
    def log(args1,args2):
        def real_decorator(func):
            @wraps(func)
            def wrapper(*args, **kw):
                print 'call %s():' % func.__name__
                func(args1, args1,args)
            return wrapper
        return real_decorator

    @log("log pass paramter1 to log","log pass paramter2 to log")
    def now(*args):
        print args
        print '2013-12-25'

    now("now pass parameter to wrapper")
    print now.__name__
    
result :
>call now():
>('log pass paramter1 to log', 'log pass paramter1 to log', ('now pass parameter to wrapper',))  
>2013-12-25  
>now

说明对于需要使用语法糖 传参的时候需要返回一个函数real_decorator，再在内部定义具体调用的函数wrapper这里相当于：`log("log pass paramter1 to log","log pass paramter2 to log")((now())`

####使用多个decorator:  

    from functools import wraps
    def log(args1,args2):
        def real_decorator(func):
            @wraps(func)
            def wrapper(*args, **kw):
                print 'call %s():' % func.__name__
                func(args1, args1,args)
            return wrapper
        return real_decorator

    def another_log(func):
        def wrapper(pams):
            print "another wrapper of %s():\n" % func.__name__+pams
        return wrapper
    
    @another_log
    @log("log pass paramter1 to log","log pass paramter2 to log")
    def now(*args):
        print args
        print '2013-12-25'

    now("now pass parameter to wrapper")
    print now.__name__
    
results:  
>another wrapper of now():  
>now pass parameter to wrapper  
>wrapper

说明：结果是 输出了 another_log 的内容，那么它是将log decrator 过后的方法再次 decorator，即如下形式：`another_log(log(param1,param2)(now))`,也就是两层包装  

####类式的 Decorator

    class TestDecorator(object):

        def __init__(self,func):
            self.decorator_fn = func
        def __call__(self):
            print self.decorator_fn.__name__
            self.decorator_fn()
            print "inside myDecorator.__call__()"
    @TestDecorator        
    def now():
        print "2014-01-01"

    now()
基本的实例如上，在这个类中必须要有__call__方法，而所有关于修饰的内容都应当从__call__方法里面去定义  

输出：  

>now  
>2014-01-01  
>inside class __call__()  

一个好的完整例子：  

    class MyApp():
        def __init__(self):
            self.func_map = {}

        def register(self, name):
            def func_wrapper(func):
                self.func_map[name] = func
                return func
            return func_wrapper

        def call_method(self, name=None):
            func = self.func_map.get(name, None)
            if func is None:
                raise Exception("No function registered against - " + str(name))
            return func()

    app = MyApp()

    @app.register('/')
    def main_page_func():
        return "This is the main page."

    @app.register('/next_page')
    def next_page_func():
        return "This is the next page."

    print app.call_method('/')
    print app.call_method('/next_page')
    
1）上面这个示例中，用类的实例来做decorator。  
2）decorator类中没有__call__()，但是wrapper返回了原函数。所以，原函数没有发生任何变化。

更多例子：https://wiki.python.org/moin/PythonDecoratorLibrary







