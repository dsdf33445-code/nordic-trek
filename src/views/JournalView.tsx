import { useState } from 'react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCamera, faTimes, faImage, faHeart, faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { JournalPost } from '../types';

interface JournalViewProps {
  posts: JournalPost[];
  setPosts: (posts: JournalPost[]) => void;
}

export default function JournalView({ posts, setPosts }: JournalViewProps) {
  const [showAddPost, setShowAddPost] = useState(false);
  const [newPostContent, setNewPostContent] = useState("");

  const handleAddPost = () => {
    if (!newPostContent) return;
    const newPost: JournalPost = {
      id: Date.now().toString(),
      content: newPostContent,
      date: format(new Date(), 'yyyy-MM-dd'),
      location: 'New Location',
      imageColor: 'bg-gray-200',
      author: 'Me',
      likes: 0
    };
    setPosts([newPost, ...posts]);
    setShowAddPost(false);
    setNewPostContent("");
  };

  return (
    <div className="space-y-6">
      {posts.map(post => (
        <div key={post.id} className="bg-white rounded-3xl shadow-soft overflow-hidden">
          <div className={`aspect-[4/3] ${post.imageColor} flex items-center justify-center text-white/50 text-4xl`}>
            <FontAwesomeIcon icon={faImage} />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-500">{post.author[0]}</div>
                <span className="font-bold text-sm">{post.author}</span>
              </div>
              <span className="text-xs text-nordic-muted">{post.date}</span>
            </div>
            <p className="text-nordic-text leading-relaxed mb-3">{post.content}</p>
            <div className="flex items-center gap-4 text-sm text-nordic-muted">
              <span className="flex items-center gap-1"><FontAwesomeIcon icon={faHeart} className="text-red-400"/> {post.likes}</span>
              <span className="flex items-center gap-1"><FontAwesomeIcon icon={faMapMarkerAlt}/> {post.location}</span>
            </div>
          </div>
        </div>
      ))}

      <button onClick={() => setShowAddPost(true)} className="fixed bottom-24 right-6 w-14 h-14 bg-gradient-to-tr from-pink-500 to-orange-400 text-white rounded-full shadow-lg flex items-center justify-center text-2xl active:scale-90 transition-transform z-40"><FontAwesomeIcon icon={faCamera} /></button>

      {/* Add Post Modal */}
      {showAddPost && (
        <div className="fixed inset-0 bg-black/80 z-[70] flex items-center justify-center p-6 backdrop-blur-sm fade-in">
           <div className="bg-white rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl">
              <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
                  <h3 className="font-bold">新增貼文</h3>
                  <button onClick={() => setShowAddPost(false)}><FontAwesomeIcon icon={faTimes} className="text-gray-400"/></button>
              </div>
              <div className="aspect-square bg-gray-100 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-200 transition-colors">
                  <FontAwesomeIcon icon={faImage} className="text-4xl mb-2"/>
                  <span className="text-sm font-bold">點擊上傳照片</span>
              </div>
              <div className="p-4">
                  <textarea value={newPostContent} onChange={(e) => setNewPostContent(e.target.value)} placeholder="寫下你的心情..." className="w-full h-24 resize-none outline-none text-nordic-text placeholder-gray-300"></textarea>
                  <button onClick={handleAddPost} className="w-full bg-nordic-primary text-white py-3 rounded-xl font-bold mt-2 shadow-lg shadow-blue-200">發佈</button>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}