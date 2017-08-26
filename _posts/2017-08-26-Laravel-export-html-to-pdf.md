---
layout : post
title : Laravel Export Html To PDF
category : php
---
### Export Datas To PDF

There have a package [wkhtmltopdf](https://github.com/wkhtmltopdf/wkhtmltopdf) using webkit(QTwebkit) convert html to pdf or image from commandline.

For Laravel: [laravel-snappy](https://github.com/barryvdh/laravel-snappy)

Installation is same as all other laravel package (can check git repository docs).

After installation, We need config the file `config/snappy.php`.

My configuration:

{% highlight php %}
    return array(


        'pdf' => array(
            'enabled' => true,
            'binary'  => env('WKHTMLTOPDF', storage_path('bin/wkhtmltox/bin/wkhtmltopdf')),
            'timeout' => false,
            'options' => array(),
            'env'     => array(),
        ),
        'image' => array(
            'enabled' => true,
            'binary'  => env('WKHTMLTOIMAGE',storage_path('bin/wkhtmltox/bin/wkhtmltoimage')),
            'timeout' => false,
            'options' => array(),
            'env'     => array(),
        ),

      );
{% endhighlight %}

The parameter 'binary' is the excutable file which download from  https://wkhtmltopdf.org/downloads.html 

There have three version of linux,mac,windows. for mac os it's an installation package， we need install it to mac os.After the bin path is `/usr/local/bin/wkhtmltopdf`.


Finally, the laravel code 

{% highlight php %}

    $pdf = \PDF::loadView('admin.pdf.document', compact('results'));
    return $pdf->download("pdf-".auth()->user()->name.".pdf");
    
{% endhighlight %}

Load view file load the laravel view file, and can pass data to the view.
view file is a html file, we can add *any style to the file*, pdf view export as html file.

Notice PDF won't have much width. so if the cotent is to large. We need use small font-size, otherwise
page will not fully show in PDF