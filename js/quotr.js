$(function(){ 
    $(document).ready(function(){
        var newPostRequest = $.ajax({
            type: "GET",
            url: "https://www.reddit.com/r/quotes/hot.json",
            dataType: 'json'
        });

        newPostRequest.done(function(response){
            var data = response.data.children;
            var min = 0;
            var max = data.length;
            var i = getRandomInt(min, max);
            var quote = data[i].data.title;

            $('p.quote').html('<h2>'+quote+'</h2>');
        });

        newPostRequest.fail(function(jqXHR, textStatus){
            console.log("Request failed: " + textStatus);
        });

        function getRandomInt(min, max) {
            return Math.floor(Math.random() * (max - min) + min);
        }
    });
});