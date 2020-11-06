/* $('#buten').click(function(){
    //event.preventDefault(); // Prevent page refresh.
    console.log("This is working.");
    var queryStr = $('#search').val()
    console.log(queryStr);
    $.ajax({
        type: "GET",
        url : "/results",
        data: {
            queryStr : queryStr
        },
        success : function(result)
        {
            console.log("OK");
            artName = result['name'];
            imageUrl = result['image_url'];
            artID = result['id'];
            gameID = result['game_id'];
            aritstID = result['artist_id'];
        }
    });
});
 */