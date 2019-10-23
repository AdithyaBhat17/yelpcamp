import React from 'react'

interface Comments {
    comments: Array<Comment>
}

interface Comment {
    _id: string;
    text: string;
    author: string;
}

const Comments: React.FC<Comments> = ({comments}) => {
    return (
        <div>
            <h4>Comments</h4>
            <div className="comments">
                {comments.map((comment: Comment) => (
                    <div className="comment">
                        <div className="comment-text">
                            <span>{comment.text}</span> <br/>
                            <small>{comment.author}</small>
                        </div>
                        <div className="delete-button">
                            <button>
                                <i className="fa fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Comments