// // d) Add/Remove comments dynamically with AJAX

// {
//     // method to submit form data of comments using Ajax

//     let createComment=function(){

//         let newCommentForm=$('.post-comments .new-comment-form').each(function(){

//             $(this).submit(function(e){

//                 e.preventDefault();

//                 // console.log($(this).serialize());
//                 $.ajax({
//                     type: 'post',
//                     url: '/comments/create',
//                     data: $(this).serialize(),
//                     success: function(data){
//                         let newComment=newCommentDom(data.data.data);
//                         $(`#post-comment-${data.data.data.post}`).prepend(newComment);
//                         deleteComment($(` .delete-comment-button>a`,newComment));

//                         // console.log($(` .delete-comment-button>a`,newComment));
//                         new Noty({
//                             theme: 'relax',
//                             text: 'Comment added ! by Async',
//                             type: 'success',
//                             layout: 'topRight',
//                             timeout: 1500
//                         }).show();

//                     },error: function(error){
//                         console.log(error.responseText);
//                         new Noty({
//                             theme: 'relax',
//                             text: error,
//                             type: 'error',
//                             layout: 'topRight',
//                             timeout: 1500
//                         }).show();

//                     }
//                 });

//             });

//         })


//     }

//     // method to create a comments in dom
//     let newCommentDom=function(comment){

//         return $(`<li id="comment-${comment._id}">
//         <p>
            
//                 <small class="delete-comment-button">
//                     <a href="comments/destroy/${comment._id}">X</a>
//                 </small>
           
//             ${comment.content}
//             <br>
//             <small> ${comment.user.name} </small> 
//         </p>
//     </li>`);

//     }

//     // method to delete comments of a post from DOM
    

//     let deleteComment = function(deleteComLink){


//                 $(deleteComLink).on('click',function(event){
                    
//                     event.preventDefault();
                    
                   

//                     $.ajax({
//                         type: 'get',
//                         url: $(deleteComLink).prop('href'),
//                         success: function(data){
//                             // console.log(data.data.data._id);
//                             // console.log($(`#comment-${data.data.data._id}`));
//                             $(`#comment-${data.data.data._id}`).remove();

//                             new Noty({
//                                 theme: 'relax',
//                                 text: 'Comment Deleted ! by Async',
//                                 type: 'success',
//                                 layout: 'topRight',
//                                 timeout: 1500
//                             }).show();

//                         },error: function(error){
//                             console.log(error.responseText);
//                             new Noty({
//                                 theme: 'relax',
//                                 text: error,
//                                 type: 'error',
//                                 layout: 'topRight',
//                                 timeout: 1500
//                             }).show();

//                         }
//                     });

//                 });



//     }


//  //Method to Add AJAX deletion to all the comments already present on the page (before adding a new one)


// //  .post-comments-list li a
// $(document).ready(function(){
//     let deleteComLinks=$('.delete-comment-button>a');


//     for(let i = 0; i < deleteComLinks.length; i++){
//         // console.log('hello');
//         // console.log(deleteComLinks[i]);
//         deleteComment(deleteComLinks[i]);

//     }
// });




//     createComment();



// }


// METHOD ILLUSTRATED IN SOLUTION

// Let's implement this via classes

// this class would be initialized for every post on the page
// 1. When the page loads
// 2. Creation of every post dynamically via AJAX

class PostComments{ 
    // constructor is used to initialize the instance of the class whenever a new instance is created
    constructor(postId){
        // console.log('postComments constructor called');
        this.postId = postId;
        this.postContainer = $(`#post-${postId}`);
        this.newCommentForm = $(`#post-${postId}-comments-form`);

        this.createComment(postId);

        // console.log('this inside cunstructor is ',this);
        let self = this;
        // call for all the existing comments
        $(' .delete-comment-button', this.postContainer).each(function(){
            self.deleteComment($(this));
        });
    }


    createComment(postId){
        let pSelf = this;
        // console.log(' pSelf in createComment is ',pSelf);
        this.newCommentForm.submit(function(e){
            e.preventDefault();
            let self = this;

            // console.log(' self in event listener of createComment is ',self);
            // console.log($(self).serialize());

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: $(self).serialize(),
                success: function(data){
                    // console.log(data);
                    let newComment = pSelf.newCommentDom(data.data.comment);
                    // console.log(newComment);
                    $(`#post-comments-${postId}`).prepend(newComment);
                    // console.log('Prepended sucessfully');
                    pSelf.deleteComment($(' .delete-comment-button', newComment));

                    // CHANGE :: enable the functionality of the toggle like button on the new comment
                    new ToggleLike($(' .toggle-like-button', newComment));

                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                }, error: function(error){
                    console.log(error.responseText);
                }
            });


        });
    }


    newCommentDom(comment){
        // I've added a class 'delete-comment-button' to the delete comment link and also id to the comment's li
        return $(`<li id="comment-${ comment._id }">
                        <p>
                            
                            <small>
                                <a class="delete-comment-button" href="/comments/destroy/${comment._id}">X</a>
                            </small>
                            
                            ${comment.content}
                            <br>
                            <small>
                                ${comment.user.name}
                            </small>

                            <small>
                            
                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                0 Likes
                            </a>
                        
                            </small>
                            
                        </p>    

                </li>`);
    }


    deleteComment(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#comment-${data.data.comment_id}`).remove();

                    new Noty({
                        theme: 'relax',
                        text: "Comment Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });

        });
    }
}