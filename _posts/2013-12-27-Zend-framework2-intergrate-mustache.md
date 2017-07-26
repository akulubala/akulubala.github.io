---
layout: post
title : Zend Framework 2 集成mustache
category : zf2
---
 1. 首先下载mustache 模块，https://github.com/widmogrod/zf2-mustache-module，按照说明可以使用composer安装，但是我喜欢自己定义路径，一步步安装，所以我的目录结构如下：  
![mustcache][1]
  [1]: http://akulubala.github.io/public/images/2013/mustache.jpg  
mustache php源代放在了ThirdPart目录下，  
然后将下载下来的mustache zend模块放到module 里面，和(Application)模块同级目录  
 2. 在public/index.php中添加如下语句：  
     {% highlight php %}
        include 'system/ThirdPart/Mustache/Autoloader.php';  
        Mustache_Autoloader::register();
     {% endhighlight %}

 3. 路径放好之后配置根目录下application.config.php  

        'modules' => array(
            'Mustache',//这里注意顺序，因为所有模块都要使用所以要放在最前面
            'Akulubala',
            'Application'
        )
 
 4.  更改module 目录下 mustache/config/module.config.php  

        'mustache' => array(
                'suffix' => 'mustache',
                'suffixLocked' => true,
                'cache' => PROJECT_PATH. 'data/mustache' // 这个数组里面可以配置mustache，PORJECT_PATH 是项目根路径
        )

 5.  现在更改Application module 里面的application/config/module.config.php  ,添加下面一段到view_manager 数组里面  

        'strategies' => array(
                'Mustache\View\Strategy'
        )

 6.  现在就可以在每个模块的view里面使用mustache了，建立index.mustache 测试，通过..具体原理还是要多读读代码，通过这个配置  
了解了zend framework 2模块的使用，即插即用的使用方式，Application module是必须的作为bootstrap使用