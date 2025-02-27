import { useState, useEffect } from 'react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';

type Comment = {
  _id: string;
  author: string;
  content: string;
  likes: number;
  parentId: string | null;
  replies: Comment[];
  createdAt: string;
};

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch comments on component mount
  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/comments');
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      setComments(data.comments);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError('Failed to load comments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (author: string, content: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, content }),
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      const data = await response.json();
      
      // Add the new comment to the comments list
      setComments([data.comment, ...comments]);
    } catch (err) {
      console.error('Error adding comment:', err);
      setError('Failed to add comment. Please try again.');
    }
  };

  const handleAddReply = async (parentId: string, author: string, content: string) => {
    try {
      const response = await fetch('/api/comments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ author, content, parentId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add reply');
      }

      const data = await response.json();
      
      // Find the parent comment and add the reply
      const updatedComments = comments.map(comment => {
        if (comment._id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, data.comment],
          };
        }
        return comment;
      });
      
      setComments(updatedComments);
    } catch (err) {
      console.error('Error adding reply:', err);
      setError('Failed to add reply. Please try again.');
    }
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      const response = await fetch(`/api/comments/${commentId}/like`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to like comment');
      }

      const data = await response.json();
      
      // Update the comment's like count
      const updatedComments = comments.map(comment => {
        if (comment._id === commentId) {
          return {
            ...comment,
            likes: data.comment.likes,
          };
        }
        
        // Check if the comment is in replies
        if (comment.replies) {
          comment.replies = comment.replies.map(reply => {
            if (reply._id === commentId) {
              return {
                ...reply,
                likes: data.comment.likes,
              };
            }
            return reply;
          });
        }
        
        return comment;
      });
      
      setComments(updatedComments);
    } catch (err) {
      console.error('Error liking comment:', err);
      setError('Failed to like comment. Please try again.');
    }
  };

  return (
    <div className="mt-8 pt-8 border-t border-gray-200">
      <h2 className="text-2xl font-bold mb-6">Comments</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <CommentForm onSubmit={handleAddComment} />
      
      <div className="mt-8 space-y-6">
        {loading ? (
          <p className="text-gray-500">Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-gray-500">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map(comment => (
            <CommentItem 
              key={comment._id}
              comment={comment}
              onAddReply={handleAddReply}
              onLike={handleLikeComment}
            />
          ))
        )}
      </div>
    </div>
  );
}