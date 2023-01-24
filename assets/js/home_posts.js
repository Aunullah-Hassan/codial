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
                    console.log(data);
                    let newPost=newPostDom(data.data.post);
                    $('#posts-list-container>ul').prepend(newPost);

                    deletePost($(' .delete-post-button>a',newPost));

                    new Noty({
                        theme: 'relax',
                        text: 'Post and Published Succesfully! by Async',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();
                    

                },error: function(error){
                    console.log(error.responseText);
                    
                    new Noty({
                        theme: 'relax',
                        text: error,
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                }
            });

        });

    }

    // Method to createa post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
        <p>
            
                <small class="delete-post-button">
                    <a href="/posts/destroy/${post._id}">X</a>
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

    // Method to delete a post from DOM
    let deletePost=function(deleteLink){
            // console.log(deleteLink);
            // console.log($(deleteLink).attr("href"));
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).attr('href'),
                success: function(data){
                    // console.log(data);
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: 'Post and associated comments Deleted Succesfully! by Async',
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                },error: function(error){
                    console.log(error.responseText);

                    new Noty({
                        theme: 'relax',
                        text: 'you cannot delete this post Async',
                        type: 'error',
                        layout: 'topRight',
                        timeout: 1500
                    }).show();

                }
            });

        });

    }

//Method to Add AJAX deletion to all the posts which are already present on the page (before adding a new one)

    $( document ).ready( function(){
        let deleteLinks=$('#posts-list-container li small a');
        
        console.log(deleteLinks);

        for(let i = 0; i <deleteLinks.length; i++){
            
            deletePost(deleteLinks[i]);

        }

    } );

    createPost();


}