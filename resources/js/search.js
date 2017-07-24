import lunr from 'lunr';
import tpl from './template';

function displaySearchResults(results, store) {
      $('#content').children('.default-contents')
                   .addClass('hide')
      if (results.length) { // Are there any results?
        var contents = [];
        for (let i = 0; i < results.length; i++) {  // Iterate over the results
          let item = store[results[i].ref];
          let index = _.indexOf(store, item)
          contents.push(item);
        }
        let compiled = _.template(tpl);
        let html = compiled({"posts" : contents});
        $('#search-result').next('div').addClass('hide')
        $('#content').append(html);
      } else {
        $('#content').children('.search-contents')
                     .remove()
        $('#search-result').next('div').removeClass('hide')
      }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split('&');

    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=');

      if (pair[0] === variable) {
        return decodeURIComponent(pair[1].replace(/\+/g, '%20'));
      }
    }
}

$('#search').keyup(function() {
    let query = $(this).val()
    if (query) {
        $('#search-result').removeClass('hide')
                           .find('.search-key')
                           .text('“' + query + '”');
        // Initalize lunr with the fields it will be searching on. I've given title
        // a boost of 10 to indicate matches on this field are more important.
        var idx = lunr(function () {
            this.field('id');
            this.field('title', { boost: 10 });
            this.field('author');
            this.field('category');
            this.field('content');
            for (let key in window.store) { // Add the data to lunr
                  this.add({
                    'id': key,
                    'title': window.store[key].title,
                    'author': window.store[key].author,
                    'category': window.store[key].category,
                    'content': window.store[key].content
                });
            }
        });      
        let results = idx.search(query); // Get lunr to perform a search
        displaySearchResults(results, window.store); // We'll write this in the next section
    } else {
      $('#search-result').addClass('hide')
                         .next('div')
                         .addClass('hide')
    }
});


  
