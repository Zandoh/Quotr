$(function() { 
    $(document).ready(function() {
        checkLocalstorage();
        getQuote();
        toggleInit();
        loadThemes();

        $('.settings-cog').click(function() {
            setWidth($('.settings-menu'), '250px');
        });

        $('.settings-close').click(function() {
            setWidth($('.settings-menu'), '0px');
        });

        $('#submit').click(function() {
            saveSettings();
        });
    });//document.ready()

    //returns a random integer between the min (inclusive) and the max (exclusive)
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }//getRandomInt()

    //pulls a random hot quote from /r/quotes
    function getQuote() {
        var quoteRequest = $.ajax({
            type: "GET",
            url: "https://www.reddit.com/r/quotes/hot.json",
            dataType: 'json'
        });

        quoteRequest.done(function(response){
            var data = response.data.children;
            var min = 0;
            var max = data.length;
            var i = getRandomInt(min, max);
            var quote = data[i].data.title;

            $('p.quote').html(quote);
        });

        quoteRequest.fail(function(jqXHR, textStatus){
            var errorMessage = '<div class="alert alert-danger data-error"><strong>Error!</strong> Couldn\'t reach data source</div>';
            $('div.container-fluid').html(errorMessage);
        });
    } //getQuote()

    //sets the width of the navigation menu, used to "open" and "close" the side menu
    function setWidth(el, width) {
        el.css('width', width)
    }//setWidth()

    //if data is set upon "save settings" button click then
    //data is grabbed from the toggle button (theme) and select option (backgroundColor)
    //stored in localStorage, closes the navigation, then the page is reloaded to reflect those changes
    function saveSettings() {
        if($("#theme").is(':checked')) {
            localStorage.setItem('theme', 'dark');
        } else {
            localStorage.setItem('theme', 'light');
        }

        if($('#background-select').val()) {
            localStorage.setItem('backgroundColor', $('#background-select').val());
        }

        setWidth($('.settings-menu'), '0px');

        location.reload();
    }//saveSettings()

    //initializes the bootstrapToggle button for the light/dark selector
    function toggleInit() {
        $('#theme').bootstrapToggle();
    }//toggleInit()

    //pull data for available CSS gradients in the themes.json file
    //gradients made possible by: https://webkul.github.io/coolhue/
    function loadThemes(){
        var themes = $.ajax({
            url: "./js/themes.json",
            dataType: "json"
        });

        //Example:  background-image: linear-gradient(135deg, VALUE 0%, PAIR 100%);
        themes.done(function(response){
            $.each(response.themes, function(){
                $('#background-select').append($('<option>', {
                    value: "linear-gradient(135deg, " + this.value + " 0%, " + this.pair + " 100%)",
                    text: this.name
                }));
            });
            if(localStorage.backgroundColor){
                $('#background-select option[value="'+localStorage.backgroundColor+'"]').attr('selected','selected');
            }
        })
    }//loadThemes()

    //checks the browsers localStorage for variables backgroundColor and theme
    //granted they exists sets them as their respective values. Used as a "settings" functionality
    function checkLocalstorage() {
        if(localStorage.theme !== null) {
            switch(localStorage.theme) {
                case "dark":
                    $('.theme-item').addClass("theme-dark");
                    $('#theme').bootstrapToggle('on');
                    break;
                case "light":
                    $('.theme-item').addClass("theme-light");
                    $('#theme').bootstrapToggle('off');
                    break;
                default:
                    $('.theme-item').addClass("theme-dark");
                    $('#theme').bootstrapToggle('on');
                    break;
            }
        }//if theme

        if(localStorage.backgroundColor !== null) {
            $('div.container-fluid').css("background-image", localStorage.backgroundColor);
        }//if background
    }//checkLocalstorage()
});