---
layout : post
title : Zend Framework 2 安装使用Firephp
category : zf2
---
##Zend framework 2 配置firephp
------
方法一（全局使用）
===
 1. 下载firephp：（http://www.firephp.org/DownloadRelease/FirePHPLibrary-FirePHPCore-0.3.2）
 2. 我的放置位置并加上namespace如同：

    ![project_tree][1]  
    
    图中文件名要改掉:FirePHP.class.php ->FirePHP.php
 3. 修改public 目录下index.php 为: 
 >     chdir(dirname(__DIR__));  
        define("PROJECT_PATH", getcwd().DIRECTORY_SEPARATOR);  
        include   'system/Zend/Loader/AutoloaderFactory.php';  
        Zend\Loader\AutoloaderFactory::factory(array(  
        'Zend\Loader\StandardAutoloader' => array(  
            'autoregister_zf' => true,  
            'namespaces'=>array(  
                'Library'=>PROJECT_PATH.'system\Library'
            )
        )
>       ));  

4. 更改ZF2对于firephp的默认namespace(路径：zend/Log/Writer)，如图：
![enter image description here][2]  
5. module/Module.php 文件中增加：  
>    use Zend\Log\Logger;  
     use Zend\Log\Writer\FirePhp\FirePhpBridge;  
     use Zend\Log\Writer\FirePhp; 
     use Library\FirePHPCore\FirePHP as FirephpCore;  
     **注意大小写，引入了两个firephp**
>

然后在getServiceConfig()return 的数组中添加：  
>     'log' => function (\$sm){  
         \$log = new Logger();  
         \$writer = new FirePhp(new FirePhpBridge(new FirephpCore()));  
         \$log->addWriter(\$writer);  
         return \$log;  
     }  

###大功告成：在controller 测试：  
>$this->getServiceLocator()->get('log')->info('It works ssss');  
方法二：每个模块里面都需要引入firephp 文件
===

1. 从方法一种2开始，但是不要更改任何东西，不要加namespace,可以改文件名，后面autoload的时候根据文件名就可以了。
2. 方法一中3，中不要把library 加入到自动加载中  
3. 也不要更改zend库中任何东西，方法一中4  
4. module/Module.php 文件中增加：  
>    use Zend\Log\Logger;  
     use Zend\Log\Writer\FirePhp;  

然后在getServiceConfig()return 的数组中添加：  

>       'log' => function ($sm){
            $log = new Logger();
            $writer = new FirePhp();
            $log->addWriter($writer);
            return $log;
        }
5. module/autoload_classmap.php中添加：  
>        
    return array(  
            'FirePHP' => 'system/Library/FirePHPCore/FirePHP.php',  
    );
OK 完成！
测试同方法一一样！
  [1]: http://akulubala.github.io/public/images/2013/project_tree.jpg
  [2]: http://akulubala.github.io/public/images/2013/firephp_namespace.jpg
