import React, {useEffect, useState} from "react";
import './Post.css';
import { Avatar, Button } from '@mui/material';

const BASE_URL = process.env.REACT_APP_BASE_URL;
function Post({post, authToken, authTokenType, username}) {

    const [imageUrl, setImageUrl] = useState('');
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');

    useEffect(() => {
        if (post.image_url_type ==='absolute') {
            setImageUrl(post.image_url);
        } else {
            setImageUrl(BASE_URL + post.image_url);
        }
    }, [post.image_url_type, post.image_url]);

    useEffect(() => {
        setComments(post.comments);
    }, [post.comments]);

    const handleDelete = (event) => {
        event?.preventDefault();

        const requestOptions = {
            method: 'DELETE',
            headers: new Headers({
                'Authorization': `${authTokenType} ${authToken}`
            })
        }

        fetch(BASE_URL + 'post/delete/' + post.id, requestOptions)
            .then(response => {
                if (response.ok) {
                    window.location.reload();
                }
                throw response
            })
            .catch(error => {
                console.log(error);
            })
    }

    const postComment = (event) => {
        event?.preventDefault();
        const json_string = JSON.stringify({
            'username': username,
            'text': newComment,
            'post_id': post.id

        })
        
        const requestOptions = {
            method: 'POST',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `${authTokenType} ${authToken}`
            }),
            body: json_string
        }

        fetch(BASE_URL + 'comment/', requestOptions)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response
            }).then(data => {
                fetchComments();
            })
            .catch(error => {
                console.log(error);
            })
            .finally(() => {
                setNewComment('');
            })
    }

    const fetchComments = () => {
        fetch(BASE_URL + 'comment/all/' + post.id)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw response
            }).then(data => {
                setComments(data);
            })
            .catch(error => {
                console.log(error);
            })
    }

    return (
        <div className="post">
            <div className="post_header">
                <Avatar alt="Vic" src="https://robohash.org/victor" />
                <div className="post_headerInfo">
                    <h3>{post.user.username}</h3>
                    {authToken && username === post.user.username ? (
                         <Button className="post_delete" onClick={handleDelete}>Delete</Button>
                    ): (
                        <div></div>
                    )}
                   
                </div>
            </div>
            <img className="post_image" src={imageUrl} alt="Post content"/>
            <h4 className="post_text">{post.caption}</h4>
            <div className="post_comments">
                {comments.map((comment, index) => (
                    <p key={comment.id || index}>
                    <strong>{comment.username}:</strong> {comment.text}</p>
                ))}
            </div>
            
            {authToken ? (
                <form className="post_commentbox">
                    <input
                        className="post_input"
                        type="text"
                        placeholder="Add a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                    />
                    <button
                        className="post_button"
                        type="submit"
                        disabled={!newComment}
                        onClick={postComment}
                        
                    >Post</button>
                </form>
            ) : (
                <h4 className="message">Login to comment</h4>
            )
            }
        </div>
    );
}

export default Post