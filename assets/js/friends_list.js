{
// console.log('friendship script loaded');

let addfriendLink = $('#add-friend-btn>a');
// console.log(addfriendLink);
let removeFriendLink = $('#remove-friend-btn>a');

let createFriend = function(){
    // console.log('create friend function called');
       addfriendLink.click(function(e){
        console.log('click event function called');
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: addfriendLink.attr('href')
            })
            .done(function(data){
                // console.log(data);
                let newFriend = newFriendDom(data.data.friendship);
                $('#user-friendships-list-container').prepend(newFriend);
                $('#friendship-btn-container').prepend(`<button id="remove-friend-btn">
                <a href="/friendships/remove/?id=${ data.data.friendship.to_user.id }">Remove</a>
                </button>`);
                $('#add-friend-btn').remove();
                // $('#remove-friend-btn').toggle();
            })
            .fail(function(errData){
                console.log('error in completing the request :',errData);
            });

        });

}

newFriendDom = function(friendship){
  
    return $(`<p>
    <a href="/users/profile/${ friendship.to_user.id }"> ${ friendship.to_user.name } </a>
    </p>`);
    
}

let removeFriend = function(){

    removeFriendLink.click(function(e){
        e.preventDefault();

        $.ajax({
            type: 'get',
            url : removeFriendLink.attr('href')
        })
        .done(function(data){
            
             $(`#friend-${ data.data.id }`).remove();
             $('#friendship-btn-container').prepend(`<button id="add-friend-btn">
             <a href="/friendships/add/?id=${ data.data.removedId }">ADD</a>
            </button>`);
            //  $('#add-friend-btn').toggle();
             $('#remove-friend-btn').remove();
        })
        .fail(function(errData){
            console.log('Error in removing friend :',errData);
        });

    });

}

createFriend();
removeFriend();

}