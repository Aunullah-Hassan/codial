{
    // console.log('hello check script is loaded on home page');

    // Method to submit the form data for new post using Ajax
    let createPost=function(){

        let newPostForm=$('#new-post-form');
 // whenever this form is submitted I don't want it to be submitted naturally so We do preventDefault
        
        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost=newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);

                    // console.log(data.data.data);
                    // console.log(data);
                },error: function(error){
                    console.log(error.responseText());
                }
            });

        });

    }

    // Method to createa post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <p>
            
                <small class="delete-post-button">
                    <a href="/posts/destroy/${post.id}">X</a>
                </small>
           
    
                ${post.content}
            <br>
            <small>${post.user.name}</small>
        </p>
        <div class="post-comments">
            
                <form action="/comments/create" method="post">
                    <input type="text" name="content" placeholder="Type your comment Here..." required>
                    <input type="hidden" name="post" value="${post._id}">
                    <input type="submit" value="Add Comment">
                </form>
            
            
            <div class="post-comments-list">
                <ul id="post-comment-${post._id}">
                        
                </ul>
            </div>
        </div>
        
    </li>`)

    }


    createPost();


}