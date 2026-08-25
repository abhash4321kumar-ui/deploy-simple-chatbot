import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import useChathook from '../hooks/useChathook'
import { setCurrentChatId, setallmessages } from '../store/features/chatslice'
 
const Sidebar = () => {
    let dispatch = useDispatch()
    let { mainusermessagefnc, maindeletefnc } = useChathook()
 
    let allchats = useSelector((state) => state.userchats.allchats)
    let currentChatId = useSelector((state) => state.userchats.currentChatId)
 
    const handleNewChat = () => {
        dispatch(setCurrentChatId(null));
        dispatch(setallmessages([]));
    }
 
    return (
        <div className="w-[280px] md:w-1/5 h-screen bg-[#0A0F0C] border-r border-[#D9B45C]/10 flex flex-col gap-3 p-3">
 
            <button
                onClick={handleNewChat}
                className="w-full bg-gradient-to-br from-[#E8C468] to-[#B8860B] hover:brightness-110 text-[#1B2417] p-3 rounded-xl font-semibold cursor-pointer flex items-center justify-center gap-2 transition-all shadow-md shadow-black/40">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
                New Chat
            </button>
 
            <div className="flex flex-col gap-1 overflow-y-auto sidebar-scroll mt-1 pr-1">
                <p className="text-[11px] uppercase tracking-wider text-[#6E7B70] font-medium px-2 pt-2 pb-1">Recent</p>
 
                {allchats && allchats.length === 0 && (
                    <p className="text-[#4A5750] text-sm px-2 py-3">Koi chat nahi hai abhi</p>
                )}
 
                {allchats && allchats.map((val, index) => {
                    const isActive = val._id === currentChatId
                    return (
                        <div
                            key={index}
                            className={`group relative flex items-center rounded-lg transition-colors cursor-pointer border-l-2 ${isActive ? 'bg-[#161F19] border-[#D9B45C]' : 'border-transparent hover:bg-[#12180F]'}`}
                        >
                            <h2
                                className={`flex-1 text-sm truncate px-3 py-2.5 ${isActive ? 'text-[#F3EFE4]' : 'text-[#B8C2B4]'}`}
                                onClick={async () => {
                                    dispatch(setCurrentChatId(val._id));
                                    await mainusermessagefnc(val._id);
                                }}
                            >
                                {val.title}
                            </h2>
                            <button
                                className="shrink-0 mr-1 w-7 h-7 flex items-center justify-center rounded-md text-[#6E7B70] opacity-0 group-hover:opacity-100 hover:text-[#E15252] hover:bg-[#E15252]/10 transition-all"
                                onClick={async () => {
                                    await maindeletefnc(val._id);
                                }}
                            >
                                <i className="ri-delete-bin-line"></i>
                            </button>
                        </div>
                    )
                })}
            </div>
 
            <style>{`
                .sidebar-scroll::-webkit-scrollbar { width: 6px; }
                .sidebar-scroll::-webkit-scrollbar-track { background: transparent; }
                .sidebar-scroll::-webkit-scrollbar-thumb { background: rgba(217,180,92,0.15); border-radius: 8px; }
            `}</style>
        </div>
    )
}

export default Sidebar