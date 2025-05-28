
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, PlusCircle, Image as ImageIcon, Send, ThumbsUp, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui';
import { Textarea } from '@/components/ui'; 
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Mock Data
const mockChannels = [
  { id: "ch1", name: "General Discussion", icon: <MessageSquare className="h-5 w-5" /> },
  { id: "ch2", name: "SSC CGL Doubts", icon: <Users className="h-5 w-5" /> },
  { id: "ch3", name: "Banking Quant Strategies", icon: <Users className="h-5 w-5" /> },
  { id: "ch4", name: "Daily Targets & Motivation", icon: <Users className="h-5 w-5" /> },
];

const mockMessages = {
  "ch1": [
    { id: "msg1", user: "Amit S.", avatar: "https://randomuser.me/api/portraits/men/32.jpg", text: "Hey everyone! How's the prep going for upcoming exams?", timestamp: "10:30 AM", reactions: { "👍": 5, "🎉": 2 } },
    { id: "msg2", user: "Priya K.", avatar: "https://randomuser.me/api/portraits/women/44.jpg", text: "Feeling a bit overwhelmed with the syllabus. Any tips for time management?", timestamp: "10:32 AM", reactions: { "🤔": 3 } },
  ],
  "ch2": [
    { id: "msg3", user: "Rohan V.", avatar: "https://randomuser.me/api/portraits/men/35.jpg", text: "Can someone explain this algebra problem from SSC CGL 2022 paper? (Image attached)", imageUrl: "https://via.placeholder.com/300x200.png?text=Math+Problem", timestamp: "11:00 AM", reactions: { "💡": 7 } },
  ],
};

const DoubtForumPage = () => {
  const [activeChannel, setActiveChannel] = useState(mockChannels[0].id);
  const [newMessage, setNewMessage] = useState('');
  const [imagePreview, setImagePreview] = useState(null);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() && !imagePreview) return;
    // Placeholder: Add message to mockMessages
    console.log(`Sending to ${activeChannel}: ${newMessage}`, imagePreview);
    setNewMessage('');
    setImagePreview(null);
    // Clear file input if used
    const fileInput = document.getElementById('image-upload');
    if (fileInput) fileInput.value = "";
  };

  const handleImageUpload = (e) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => setImagePreview(event.target.result);
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const handleReaction = (channelId, messageId, emoji) => {
     // Placeholder: Update reaction count in mockMessages
    console.log(`Reacted ${emoji} to message ${messageId} in channel ${channelId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-8 px-2 md:px-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto max-w-6xl h-[calc(100vh-100px)] flex" // Adjust height as needed
      >
        {/* Sidebar - Channels/Groups */}
        <aside className="w-1/4 bg-white/70 backdrop-blur-md p-4 rounded-l-xl shadow-lg border border-gray-200 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-primary">Channels</h2>
            <Button variant="ghost" size="icon" title="Create New Channel">
              <PlusCircle className="h-5 w-5 text-primary" />
            </Button>
          </div>
          <Input type="search" placeholder="Search channels..." className="mb-3 h-9 text-sm"/>
          <nav className="flex-grow space-y-1 overflow-y-auto no-scrollbar">
            {mockChannels.map(channel => (
              <Button
                key={channel.id}
                variant={activeChannel === channel.id ? "secondary" : "ghost"}
                className="w-full justify-start text-sm"
                onClick={() => setActiveChannel(channel.id)}
              >
                {channel.icon && React.cloneElement(channel.icon, { className: "mr-2 h-4 w-4"})}
                {channel.name}
              </Button>
            ))}
          </nav>
        </aside>

        {/* Main Chat Area */}
        <main className="w-3/4 bg-white p-4 rounded-r-xl shadow-lg border border-gray-200 border-l-0 flex flex-col">
          <header className="pb-3 border-b border-gray-200 mb-4">
            <h1 className="text-xl font-semibold text-gray-800">
              {mockChannels.find(ch => ch.id === activeChannel)?.name || "Select a Channel"}
            </h1>
          </header>

          {/* Messages Display */}
          <div className="flex-grow space-y-4 overflow-y-auto mb-4 pr-2 custom-scrollbar">
            {(mockMessages[activeChannel] || []).map(msg => (
              <div key={msg.id} className="flex items-start space-x-3 group">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={msg.avatar} alt={msg.user} />
                  <AvatarFallback>{msg.user.substring(0,1)}</AvatarFallback>
                </Avatar>
                <div className="flex-grow bg-gray-100 p-3 rounded-lg rounded-tl-none">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-primary">{msg.user}</span>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{msg.text}</p>
                  {msg.imageUrl && <img  src={msg.imageUrl} alt="Attached" className="mt-2 rounded-md max-h-48 object-contain" />}
                  {msg.reactions && Object.keys(msg.reactions).length > 0 && (
                    <div className="mt-1.5 flex space-x-1.5">
                      {Object.entries(msg.reactions).map(([emoji, count]) => (
                        <Button key={emoji} variant="outline" size="sm" className="h-6 px-1.5 py-0.5 text-xs rounded-full" onClick={() => handleReaction(activeChannel, msg.id, emoji)}>
                          {emoji} {count}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
                 <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity" title="Add Reaction">
                    <ThumbsUp className="h-4 w-4 text-gray-500" />
                  </Button>
              </div>
            ))}
            {mockMessages[activeChannel]?.length === 0 && (
              <p className="text-center text-gray-500 pt-10">No messages in this channel yet. Start the conversation!</p>
            )}
          </div>

          {/* Message Input Area */}
          <form onSubmit={handleSendMessage} className="mt-auto pt-3 border-t border-gray-200">
            {imagePreview && (
              <div className="mb-2 relative w-32 h-32 p-1 border rounded-md">
                <img  src={imagePreview} alt="Preview" className="w-full h-full object-contain rounded"/>
                <Button variant="destructive" size="icon" className="absolute -top-2 -right-2 h-6 w-6 rounded-full" onClick={() => {setImagePreview(null); document.getElementById('image-upload').value = "";}}>
                  <X className="h-3 w-3"/>
                </Button>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <label htmlFor="image-upload" className="cursor-pointer">
                <Button type="button" variant="ghost" size="icon" asChild>
                  <div><ImageIcon className="h-5 w-5 text-gray-500" /></div>
                </Button>
                <input id="image-upload" type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
              <Textarea 
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message or ask a doubt..."
                className="flex-grow resize-none h-10 min-h-[40px] max-h-24 text-sm p-2"
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(e); }}}
              />
              <Button type="submit" size="icon" disabled={!newMessage.trim() && !imagePreview}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </form>
        </main>
      </motion.div>
    </div>
  );
};

export default DoubtForumPage;
