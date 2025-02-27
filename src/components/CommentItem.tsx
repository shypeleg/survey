import { useState } from 'react';
import CommentForm from './CommentForm';
import { formatDistanceToNow } from 'date-fns';

type Comment = {
  _id: string;
  author: string;
  content: string;
  likes: number;
  parentId: string | null;
  replies: Comment[];
  createdAt: string;
};

type CommentItemProps = {
  comment: Comment;
  onAddReply: (parentId: string, author: string, content: string) => void;
  onLike: (commentId: string) => void;
};

export default function CommentItem({ comment, onAddReply, onLike }: CommentItemProps) {
  const [showReplyForm, setShowReplyForm] = useState(false);

  const handleReply = (author: string, content: string) => {
    onAddReply(comment._id, author, content);
    setShowReplyForm(false);
  };

  const formattedDate = comment.createdAt ? 
    formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true }) : 
    'recently';

  return (
    <div className="comment bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-start">
        <div>
          <h4 className="font-bold">{comment.author}</h4>
          <p className="text-sm text-gray-500">{formattedDate}</p>
        </div>
        <div className="flex items-center">
          <button 
            onClick={() => onLike(comment._id)}
            className="flex items-center text-gray-700 hover:text-blue-600"
          >
            <svg 
              className="w-5 h-5 mr-1" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.386-.54L6 17.172V10a2 2 0 012-2h1.828a2 2 0 001.414-.586l1.172-1.172a2 2 0 012.828 0l1.172 1.172A2 2 0 0016.828 8H18a2 2 0 012 2v0z" 
              />
            </svg>
            <span>{comment.likes}</span>
          </button>
        </div>
      </div>
      
      <p className="my-3">{comment.content}</p>
      
      <div className="mt-3">
        <button 
          onClick={() => setShowReplyForm(!showReplyForm)}
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          {showReplyForm ? 'Cancel Reply' : 'Reply'}
        </button>
      </div>
      
      {showReplyForm && (
        <CommentForm 
          onSubmit={handleReply} 
          placeholder="Write a reply..." 
          buttonText="Post Reply"
          isReply
        />
      )}
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4 ml-6 pl-4 border-l-2 border-gray-200 space-y-4">
          {comment.replies.map(reply => (
            <div key={reply._id} className="comment">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-bold">{reply.author}</h4>
                  <p className="text-sm text-gray-500">
                    {reply.createdAt ? 
                      formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true }) : 
                      'recently'}
                  </p>
                </div>
                <div className="flex items-center">
                  <button 
                    onClick={() => onLike(reply._id)}
                    className="flex items-center text-gray-700 hover:text-blue-600"
                  >
                    <svg 
                      className="w-5 h-5 mr-1" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24" 
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth="2" 
                        d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017a2 2 0 01-1.386-.54L6 17.172V10a2 2 0 012-2h1.828a2 2 0 001.414-.586l1.172-1.172a2 2 0 012.828 0l1.172 1.172A2 2 0 0016.828 8H18a2 2 0 012 2v0z" 
                      />
                    </svg>
                    <span>{reply.likes}</span>
                  </button>
                </div>
              </div>
              <p className="my-2">{reply.content}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}