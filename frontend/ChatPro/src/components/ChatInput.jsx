import React, { useState, useRef, useEffect } from 'react';
import { useChatStore } from '../store/chatStore.js';
import { Image, Send, X } from 'lucide-react';

const ChatInput = () => {
  const [text, setText] = useState(''); // Correct useState syntax
  const [imagePreview, setImagePreview] = useState(''); // Correct state management
  const inputFileRef = useRef(null); // Correct casing for consistency
  const { sendMessage, stickers, getStickers, page, setPage, replyTo, setReplyTo} = useChatStore(); // Assuming these methods are defined
  const [ Selectedsticker , setSticker ] = useState("")

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result); // Set the image preview URL
      };
      reader.readAsDataURL(file);
    }
  };
    const handleSendSticker = async (sticker) => {
      try {
        // Send the sticker directly
        await sendMessage({
          text: "", // No text message
          image: "", // No image
          stickers: sticker, // Sticker URL
          replyTo: replyTo?.text || replyTo?.image || replyTo?.stickers || null, // Safely handle replyTo
        });
        
        setSticker("") // Reset the selected sticker after sending
        setReplyTo("")
        
    
        // Close the modal after sending
        document.getElementById("my_modal_6").checked = false; // Close the modal
      } catch (error) {
        console.error("Failed to send sticker:", error);
      }
    };
    
  
  const handleSendMessage = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
     await sendMessage ({
      text : text.trim(),
      image : imagePreview,
    replyTo : replyTo.text || replyTo.image || replyTo.stickers
  })
      
      setText("")
      setImagePreview("")
      setReplyTo("")

      if (inputFileRef.current) {
        inputFileRef.current.value = "";
        
      }
    } catch (error) {
      console.error('Failed to send message:', error);
      
    }
    };
    const handlePrev = (e) => {
      setPage(Math.max(page - 1, 1))
      e.preventDefault()
     }
     const handleNext = (e) => {
      setPage((page + 1))
      e.preventDefault()
     }

     useEffect(() => {
      getStickers();
    }, [page]);
    
  


  const handleRemoveImage = () => {
    setImagePreview('');
  };

  return (
    <div className="p-4 w-full">

{replyTo && (
  <div className="mb-4 p-3 rounded-xl bg-gradient-to-r from-gray-100 via-white to-gray-200 shadow-lg flex items-center justify-between">
    <div className="flex items-center gap-4">
      {replyTo.text && (
        <p className="text-sm text-gray-800 font-medium">
          <span className="text-blue-600 font-semibold">Replying to:</span> {replyTo.text}
        </p>
      )}
      {replyTo.image && (
        <img
          src={replyTo.image}
          alt="Replying to"
          className="w-16 h-16 object-cover rounded-md border-2 border-gray-300 shadow-sm"
        />
      )}
      {replyTo.stickers && (
        <img
          src={replyTo.stickers}
          alt="Replying to"
          className="w-16 h-16 object-cover rounded-md border-2 border-gray-300 shadow-sm"
        />
      )}
    </div>
    <button
      onClick={() => setReplyTo(null)}
      className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 shadow-md transition-transform transform hover:scale-110"
    >
      <X size={18} />
    </button>
  </div>
)}


      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            <img
              src={imagePreview }
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            <button
              onClick={handleRemoveImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2 items-center">
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={inputFileRef}
            onChange={handleImageChange}
          />
          {/* The button to open modal */}
<label htmlFor="my_modal_6" className="btn"><img className='h-[20px] w-[20px] cursor-pointer rounded-lg' src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAACXBIWXMAAAsTAAALEwEAmpwYAAAC/0lEQVR4nO1ZS2sUQRDuaC7qDxCd2aRrFT169OAhePAYBEFBEr2IqHgQ9Qes2714EUH8GYIgiXl4CqImOyhIFKPiyUcuKgm6XaO4k5TUzE4SJa+enZn4mA8a9jDd/X3dVTU13wpRoECBAn8FdlRoa1njOVB4D7SZlto0QSOlMWS4lpkGjaPdVTzLe6VKvqzwSGsDymUo80HW8HAq5EE1LoMy862FJ0A3+nZX0O2pUGcqGwgheC1eE1SjH7SpR0LMHCi82P7JM3llAqnwgiDqEFmDqAO0f4n3ZBGJb2L7NdoWh01IPmcAi2iFU6KcCBO2FTa5nPzvIOqQynhRkuMZYYuo2nAsNvrEBkFqcyI6RByxnsxXx5M5ucQGYZf2S60y+956clzn06w2tuipUGf8nrCeHNfkTJjlwQP+dQGy6vdIZV5Lbd5CDXuTvGOkMu9A4cty1T+QlIdIOhE0Ti32MvjJqtRWaBNonF2Yr3AydwF8+ou9C84wqXUvfos2S4Vflwh4nrsAqDYOhU2Xwo9Q84/arl/W/nFQ+JnDqLvaOJiUx/+bxHkBCgEbDChuIEM4E7Tf9eiG49Ezx6MZ1yNadkzQn5XEpYe006nTwIqE8xQA2pwCZXyp/GPrWdep0z5nfJXT9nIWIJU5Gb1NzQ+pzenVWgpnjFxnnGatyHtEpaHmVGYCWs9eWWwLjMfeDlz9vse9Tlt4SPVlL2g8744E9uQHm1PcemQqIHy+hr1hZ7qSeXXzmxVxl8dg84Ugix6rHQGxk8E9jtTmNmh8xbkB2iD/7rrTfGMdNpSQfBaflK5Hk+snHzxt2wlJ+6N+1TrvLSE/nAL5UIDG0ajXb/SnIcCt0/yaAu4Gj1PzoMJKEnmU9TQWXUtA13DwJFUDje28OIzY5stSQGkoyMb9Y2M1colNwC51O5u4dZpbgfwjkSXY4o7tdX5Jsd3HjpltdVpOQNdQ8EDkgfAmFsIp2Vim2twXeYJzgl1iUDgcfsxb/sX0K/m5sVzJFyhQoIDICj8BdDK9A9v2+oMAAAAASUVORK5CYII=" alt="sticker-square" /></label>

{/* Put this part before </body> tag */}
<input type="checkbox" id="my_modal_6" className="modal-toggle" />
<div className="modal" role="dialog">
  <div className="modal-box">
    <div className='grid grid-cols-3 grid-rows-3 gap-2'>
    {stickers.map((sticker, index ) => {
     
     return <img loading='lazy' onClick={()=>handleSendSticker(`${'https://full-stack-chat-webapp.onrender.com'}/pics/${sticker}`)} className="h-24 w-24 cursor-pointer" key={`sticker-${index}`} src={`${'https://full-stack-chat-webapp.onrender.com'}/pics/${sticker}`} alt={sticker}/>
    

   })}
    </div>
    <div className="modal-action flex justify-between">

    <div className="join grid grid-cols-2 w-[60%] ">
  <button onClick={handlePrev} className="join-item btn btn-outline">Previous page</button>
  <button onClick={handleNext} className="join-item btn btn-outline">Next</button>
    </div>

      <label htmlFor="my_modal_6" className="btn btn-outline">Close!</label>
  </div>
    </div>
   
</div>

          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? 'text-emerald-500' : 'text-zinc-400'}`}
            onClick={() => inputFileRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview && !Selectedsticker}
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default ChatInput;
