var pics

function readImage(input) {
    if ( input.files && input.files[0] ) {
        var FR= new FileReader();
        FR.onload = function(e) {
             $('#img').attr( "src", e.target.result );
             var uploadStr = e.target.result
             var uploadName = $("#Artname").val()
             var artistName = $("#Artistname").val()
             var gameName = $("#GameName").val()
             //The important part
             var img = $('<img id="dynamic">'); 
             img.attr('src', e.target.result);
             img.appendTo('#content');
             $.ajax({
                type: "POST",
                url : "/uploaded",
                data: {
                    uploadStr : uploadStr,
                    uploadName : uploadName,
                    artistName : artistName,
                    gameName : gameName
                },
        
             });
             
        };       
        FR.readAsDataURL( input.files[0] );
    }
}

$("#chooseFileBox").change(function(){
    pics = this
    readImage( pics);
});

//$(Work).onClick = function(){
//    event.preventDefault(); // Prevent page refresh
//    console.log("here")
//    readImage(pics);

//};