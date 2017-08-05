---
layout : post
title : A Nicely Vue Component For Cropping Image
category : Vuejs
---

When developing a website.Crop image with specific height and width is an common requirement.
Today, I'm gonna show you a vue package for crop image and get base64 datas.



This package [Image Croppie](https://github.com/akulubala/vue-image-upload-croppie) is not aim to upload image. It's only get cropped base64 datas of image, after get the datas of an image we can do whatever with the datas.

Follow the Steps with Readme from github.

## Install 
{% highlight php %}
``` npm i vue-image-upload-croppie --save ```
{% endhighlight %}
## Import
{% highlight php %}
`import VueImageUploadCroppi from 'vue-image-upload-croppie'` 
{% endhighlight %}
## Usage Example
{% highlight php %}
```
<template>
  <div id="app" style="text-align: center">
    <img :src="defaultImage" style="width: 100px;height: 100px">
    <VueImageUploadCroppie :defaultImage.sync="defaultImage" :height="100" :width="100" :circle="true" :trans="trans"></VueImageUploadCroppie>
  </div>
</template>

<script>
import VueImageUploadCroppie from './components/VueImageUploadCroppie'
export default {
  name: 'app',
  data() {
    return {
      'defaultImage': '',
      'trans': { 
          'cropImage': '裁剪图片', 
          'chooseImage':'选择图片', 
          'confirmCutting': '确认裁剪'
      }
    }
  },
  watch: {
      'defaultImage': function(value) {
          if (value) {
            // do whatever you want with image value,(upload ..)
          }
      }
  },
  components: {
    VueImageUploadCroppie
  }
}
</script>
```
{% endhighlight %}

> in function watch. after cropped the image the value will auto updated.
> we can put the value somewhere else. for example, if this component is imported
> from a form. then set datas to form input. After the form posted to server
> save cropped image to server disk

## Server code example (laravel):

{% highlight php %}
```
$avatar = $request->get('avatar');
if ($avatar) {
    $image = Image::make($avatar);
    $mime = $image->mime();
    $extension = explode('/', $mime)[1];
    $path = "user_avatar/".$userId ;
    if (!is_writable(storage_path('public/'.$path))) {
        Storage::makeDirectory('public/'.$path, true);
    }
    $name = "avatar_picture_user_".substr(time(), 5) . "." . $extension;
    $image->save(storage_path('app/public/'.$path. "/" .$name));
    $inputs['photo_url'] = $path. "/" .$name;
}
```
{% endhighlight %}

> props: height, width, circle, trans all optional
> default value of them are 

{% highlight php %}
```
props: {
  'height': {
      type: Number,
      default: 200
  },
  'circle': { // crop circle or square image
      type: Boolean,
      default: false
  },
  'width': {
      type: Number,
      default: 200
  },
  'trans': { // button text translation
      type: Object,
      default: function() {
        return  { 
          'cropImage': 'Crop Image', 
          'chooseImage':'Choose Image', 
          'confirmCutting': 'Confirm Cutting'
        }
      }
  }
}
```
{% endhighlight %}

These props can be changed with you needed.
Happy cropping!