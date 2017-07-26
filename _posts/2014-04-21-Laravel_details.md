---
title : Laravel 框架开发配置概述
layout : post
category : php
---
使用框架的好处简直太多了，便于管理，加速开发，使用新理念新技术。Laravel 4基于PHP 5.3以上开始的。

###1.命名空间:namespace

        <?php
        namespace Stark;
        class Test{
        }
        
        其他文件（首先需要加载进来）：
        use Stark\Test;
        $eddard = new Test();
        
        或者不引入直接(全局引用方式):
        $eddard = new Stark\Test();
    
文件目录结构，如：library/Stark
一般都会有自动加载将library下面的所有文件加载  

###2.Closures
    $x = "a";
    
    $y = "b";
    
    $z = "c";
    
     $greet = function($params) use($x,$y,$z)
     {
         echo  $params;
         return $x.$y.$z;
         
     };
     
    $greet("abc");
    
    function x($a){
        var_dump($a);
    }
	function y($x)
	{
		$w = $x("xyz");
		var_dump($w);
	}
    x($greet);
	y($greet);

匿名函数第一个括号是调用时传的参，第二个是创建是传的参，运行上面的小例子，结果：

	abc

	object(Closure)[1]

	xyz

	string 'abc' (length=3)

	

###3.composer 使用
 
 安装过程就不说了，直接看官方文档.https://getcomposer.org/book.pdf
 composer配置文件是基于json的，例如我要安装一个monolog(手册上例子)：
 在根目录monolog-demo下面建立一个composer.josn文件，内容：
 
     {
    	"require" : {
    		"monolog/monolog": "1.2.*"
    	}
    }
    然后使用命令：composer install，就可以完成下载及安装了

 下载完成后会多了一个vendor目录，里面有个monolog 目录了。
 composer的配置项有很多，但最重要的就是 这个require和autoload配置了。
 composer的自动加载机制基于 PSR-0/4 也就是说在
 
    "autoload": {
		"classmap": [
		],
        "psr-4": {
                "": ["app/module/","app/library"]
         },
        "psr-0": {
        },
        "psr-1":{
        },
        "psr-2":{
        },
        "psr-3":{
        }
    }

 关于psr具体介绍看这里：http://www.php-fig.org/faq/
 注：我自己添加了psr-4将app/module/ 和app/library加入了自动加载中。psr-0的namespace和目录是对应的,psr-4不需要对应namaspace
 例如：
 
        " Monolog \\": "src /",//psr-0对应的目录是src/Monolog,psr-4对应src
        " Vendor \\ Namespace \\": "src /",//psr-0对应的目录是src/Vendor/namespace,psr-4对应src
        " Vendor_Namespace_ ": "src /"//psr-0对应的目录是src/Vendor_Namespace_,psr-4对应src
  classmap是机制会自动搜索.inc和.php文件或者搜索特定文件：
  
          " classmap ": [" src /", "lib /", " Something .php "]


###4.安装Laravel（其实现在大多数框架的安装方式都是类似的）
 
        composer create-project laravel/laravel laravel-demo-name//这一步仅仅是下载了laravel应用程序包
        composer install//这一步是根据composer 下载依赖包

 上面两部完成之后就有了个vendor目录这个就是composer 包管理的所有文件。还有两个命令
 
    composer self-update //更新依赖包
    composer dump-autoload //更改过composer.json 配置文件后需要执行这个,重新生成autolod文件
        
 接下来配置 rewrite（下面是个标准的nginx配置，框架自带的有apache配置）：
 
    server {
    
    # Port that the web server will listen on.
    listen 80
    
    # Host that will serve this project.
    server_name app.dev
    
    # Useful logs for debug.
    access_log /path/to/access.log;
    error_log /path/to/error.log;
    rewrite_log on;
    
    # The location of our projects public directory.
    root /path/to/our/public;
    
    # Point index to the Laravel front controller.
    index index.php;
    
    location / {
    # URLs to attempt, including pretty ones.
    #按顺序检查文件是否存在，返回第一个找到的文件
    #结尾的斜线表示为文件夹-$uri/。如果所有的文件都找不到，会进行一个内部重定向到最后一个参数
    
    #例如try_files /app/cache/ $uri @fallback;
    
    #它将检测$document_root/app/cache/index.php,$document_root/app/cache/index.html
    #和$document_root$uri是否存在，如果不存在着内部重定向到 @fallback
            
        try_files $uri $uri/ /index.php?$query_string;

    }
    
    # Remove trailing slash to please routing system.
    if (!-d $request_filename) {
     rewrite ^/(.+)/$ /$1 permanent;
    }
    
    # PHP FPM configuration.
    location ~* \.php$ {
    fastcgi_pass unix:/var/run/php5-fpm.sock;
    fastcgi_index index.php;
    fastcgi_split_path_info ^(.+\.php)(.*)$;
    include /etc/nginx/fastcgi_params;Getting Started 46
    fastcgi_param SCRIPT_FILENAME $document_root$\
    fastcgi_script_name;
    }
    
    # We don't need .ht files with nginx.
    location ~ /\.ht {
    deny all;
    }
    
    }
 

###5.框架分析与配置

 框架结构目录：
 
        • app/-->所有代码自己的代码都是在这里面的
            • commands/-->自己创建Artisan 命令文件目录
            • config/-->以数组形式存放的一系列配置信息，包括db，router等等
            • controllers/-->controller文件夹
            • database/-->如果使用命令行操作方式，关于数据库建库过程，表关系 等等文件，以备将来使用或者迁库
            • lang/-->国际化配置文件夹，翻译用的
            • models/-->数据模型
            • start/-->应用程序启动配置，区别于bootstap
            • storage/-->本地化存储，包括sesion，view,cache等等
            • tests/-->所有写的基于phpunit的测试文件
            • views/-->模板目录
            • filters.php-->路由过滤控制方法
            • routes.php-->非常重要的,所有框架路由都在这一个文件中
        • bootstrap/-->框架启动的配置都在这个目录里面
        • vendor/-->框架的依赖包以及第三方包
        • public/-->静态文件目录
        • artisan-->可执行的文件，包括一些列laravel框架快捷操作方式
        • composer.json-->composer 配置文件
        • composer.lock
        • phpunit.xml-->phpunit test 的配置文件
        • server.php-->开发中的未来需要的
 
  框架启动，路由(写在routes.php)里,我这里写过几个，过多的还是 去看手册：
  
  
    Route::get('/games/csol', 'Csol\Fight\Controller\IndexController@showWelcome');
    Route::get('/cp', 'Cp\CallBack\Controller\IndexController@showWelcome');
    
    Route::Group(array("namespace"=>"Test\Eloquent\Controller",'prefix' => 'test'),function(){
        Route::resource('curd', "IndexController");
    });
    Route::Group(array("namespace"=>"Test\Wechart\Controller","prefix"=>"wechart"),function(){
        Route::get('/curl',function(){
            $ch = curl_init();
    
            // 设置URL和相应的选项
            curl_setopt($ch, CURLOPT_URL, "http://laravel/wechart/recieve?ss=fdsdf");
            curl_setopt($ch, CURLOPT_HEADER, 0);
            // 抓取URL并把它传递给浏览器
            curl_exec($ch);
    
            // 关闭cURL资源，并且释放系统资源
            curl_close($ch);
        });
        Route::get("/recieve",function(){
            $response = Response::make();
            $response->setContent("<html><body><h1>Hello world a!</h1></body></html>");
            $response->setStatusCode($response::HTTP_OK);
            $response->headers->set('Content-Type', 'text/html');
            return $response;
        });
    });
    -->上面是个例子，curl 会请求recieve route,recieve 返回一个自定义相应
    Route::Group(array("prefix"=>"games/portal"),function(){
        Route::Group(array("namespace"=>"Portal\StewardPoint\Controller"),function(){
            Route::get("/steward_point","IndexController@index");
            Route::get("/steward_point_get","IndexController@getPoint");
        });
    });
        
目前我的项目路径，分层分结构如下：  
    
![enter image description here][1]
    
结构比较清晰，代码部分一般都在module和library Tiancity下面。  
Library下面有个CustomFacade ，说到这个就引出一个Laravel非常重要的东东了。Facade..
    

###6.核心理念Facade和IOC

Laravel 里面许多东西都是以Facede形式存在的(外观模式),从Routers.php文件看到rouget::method方式调用方法，如果深入去找这个方法，是找不到具体方法的，最终会找到这个目录：vendor/laravel/framework/src/Illuminate/support/facades/ 

在这个文件夹下所有的文件都是一个假的类用来做外观的。这也是laravel的 所有可以使用facade的类。

知道了Facade这个东西，现在来说说如何使用Facade。
    
首先需要另一个概念：IOC容器，直接把它理解为一个管理类的容器就可以了，现在一个比较好的设计是依赖注入，使用个例子来说明IOC：
    
    class Foo{
        private $string = "i'm foo";
        protected $bar;
    
        public function __construct(Bar $bar) {
            $this->bar = $bar;
        }
    }  
    
    class Bar{
        private $porperty = "i'm bar'";
    
    }
    
    class Ioc{
        
        private static $register = array();
        
        public static function bind($name,  callable $resover)
        {
            static::$register[$name] = $resover;
        }
        
        public function make($name)
        {
            if(isset(static::$register[$name]))
            {
                $resolver = static::$register[$name];
                return $resolver();
            }
            throw new Exception("No class found!");
        }
    }
    
    Ioc::bind("foo", function(){
        return new Foo(new Bar());    
    });
    
    $foo = Ioc::make("foo");
    echo "<pre>";
    var_dump($foo);
    echo "</pre>";
    
上面这个例子说明了一个基本的IOC绑定及使用原理，Laravel使用比这个复杂多的容器，可以去阅读Illuminate\Container\Container类
    
我们在Laravel里使用的时候首先需要注册服务组件里面
    
    namespace TianCity\CustomFacade;
    use Illuminate\Support\ServiceProvider;
    use TianCity\Tools;
    use TianCity\Common;//注意这里，这个文件就是我们可以任意写方法的类，如Common::test(),就会调用该类的方法
    class TiancityServiceProvider extends ServiceProvider {
        //put your code here
            /**
         * Register the binding
         *
         * @return void
         */
        public function register()
        {
            $app = $this->app;
            $app->bind("Common",function(){
                return new Common();
            });
            $app->bind("Tools",function(){
                return new Tools();
            });
        }
    }

还需要到config/app.php里面providers数组里面加入：'TianCity\CustomFacade\TiancityServiceProvider'    
服务组件是框架引导的时候自动加入的，也就是说 框架加载的时候会有个bind动作，不然你需要手动bind  

然后像前面提到的Facade一样：
    
    namespace TianCity\CustomFacade;
    use Illuminate\Support\Facades\Facade;
    use App;
    class Common extends Facade{
        //put your code here
         protected static function getFacadeAccessor() { 
                return App::make('Common'); 
        }
    }
    OK...Facade 搞定
    
###7.Filter
 
 加一个Controller 里使用Filter检查是否开放外服 IP的方法： 
 
     Route::filter("open_ip",function(){
        $args = func_get_args();
        $openIP = array_pop($args);    
        
        $ip = sprintf("%u", ip2long(htmlspecialchars($_SERVER['REMOTE_ADDR'])));
        $net_c = sprintf("%u", ip2long("192.168.255.255")) >> 16;
        $local = sprintf("%u", ip2long("127.0.0.1")) >> 16;
        $intern = false;
        if(($ip >> 16 === $net_c) || ($ip >> 16 === $local))
        {
            $intern = true;
        }
        if(intval($openIP) === 0 && !$intern)
        {
            $response = Response::make();
            $response->setContent("<html><body><h1>对外IP尚未开放！</h1></body></html>");
            $response->setStatusCode($response::HTTP_OK);
            $response->headers->set('Content-Type', 'text/html');
            return $response;
        }
    });

        调用方式：
        //根据传入的$open_ip来决定是否对外开放
        
        $this->beforeFilter("open_ip:$open_ip");
        
就先这些吧...后面空了 再写Model和View..Eloquent active Record 好东东啊...

  [1]: http://192.168.56.101:4000/images/2014/laravel_tutorial_1.jpg