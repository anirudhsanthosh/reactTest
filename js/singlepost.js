


$(window).resize(function(){
   let width =  $('#ytplayer').css('width').replace('px','');
   $('#ytplayer').css('height',(width*360/640)+"px")
   console.log((width*360/640)+"px")
})

$(document).ready(function(){
    let width =  $('#ytplayer').css('width').replace('px','');
    $('#ytplayer').css('height',(width*360/640)+"px")
    console.log((width*360/640)+"px");

    var url_string = window.location.href;
    var url = new URL(url_string);
    var pageId = url.searchParams.get("page");
    console.log(pageId);
    
    database.ref('posts/' + pageId).once('value').then(function(snapshot) {
        if(!snapshot.val()) window.location = 'index.html';

        let data = snapshot.val();
        
        $('.postTime').html(data.time);
        $('.postTitle').html(data.title);
        $('.postDescription').html(data.desc);
        $('#ytplayer').attr("src",data.youtubelink);
        let tagstr = data.tags.split(' ');
        tagstr.forEach(function(_v){
          let tag = $('<li><a href="#">'+_v+'</a></li>');
          $('.tags').append(tag);
        })


        


        
        $('#loader').removeClass('show');
      });
      
})




