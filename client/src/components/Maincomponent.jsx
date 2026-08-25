import React, { useState } from 'react'
import ReactMarkdown from "react-markdown";
import { useSelector, useDispatch } from 'react-redux';
import remarkGfm from "remark-gfm";
import useChathook from '../hooks/useChathook';
import { setallchats, setallmessages } from '../store/features/chatslice';
import socket from "../services/chat.socket";
import { useEffect } from 'react';
 
const Maincomponent = () => {
    let dispatch = useDispatch()
    let allmessages = useSelector((state) => state.userchats.allmessages)
    let currentChatId = useSelector((state) => state.userchats.currentChatId)
    let chatloading = useSelector((state) => state.userchats.chatloading)
    let allchats = useSelector((state) => state.userchats.allchats)
 
    const [message, setmessage] = useState('')
 
    const [streamingText, setStreamingText] = useState('');
 
    let { mainchatfnc } = useChathook()
 
    useEffect(() => {
        // Jab backend se chunk aaye
        socket.on('ai_chunk', (data) => {
            setStreamingText((prev) => prev + data.chunk); // Text ko jodte jao
        });
 
        // Jab backend bole streaming khatam
        socket.on('ai_stream_end', () => {
            setStreamingText(''); // Temporary text hata do (kyunki Redux wala final text aa jayega)
        });
 
        // Cleanup
        return () => {
            socket.off('ai_chunk');
            socket.off('ai_stream_end');
        };
    }, []);
 
    async function submitform(dets) {
        dets.preventDefault()
        if (!message.trim()) return;
 
        let userMsg = message;
        setmessage('');
 
        if (!currentChatId) {
            dispatch(setallchats([...allchats, { title: userMsg }]))
        }
 
        // Optimistic UI update (User ka message turant dikhao)
        dispatch(setallmessages([...allmessages, { role: 'user', content: userMsg }]));
 
        // Socket ID bhejo
        await mainchatfnc(userMsg, currentChatId, socket.id);
    }
 
    // ---- Markdown ke liye clean, readable styling ----
    const markdownComponents = {
        h1: ({ children }) => <h1 className="text-2xl font-semibold mt-4 mb-2 text-[#F3EFE4]">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-semibold mt-4 mb-2 text-[#F3EFE4]">{children}</h2>,
        h3: ({ children }) => <h3 className="text-lg font-semibold mt-3 mb-1.5 text-[#F3EFE4]">{children}</h3>,
        p: ({ children }) => <p className="leading-relaxed mb-3 last:mb-0 text-[#DCD9CC]">{children}</p>,
        ul: ({ children }) => <ul className="list-disc pl-5 mb-3 space-y-1 text-[#DCD9CC]">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-3 space-y-1 text-[#DCD9CC]">{children}</ol>,
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-[#F3EFE4]">{children}</strong>,
        a: ({ children, href }) => (
            <a href={href} target="_blank" rel="noreferrer" className="text-[#D9B45C] underline decoration-[#D9B45C]/40 underline-offset-2 hover:text-[#EFCB74]">
                {children}
            </a>
        ),
        blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-[#D9B45C]/50 pl-3 my-3 text-[#C7C3B4] italic">{children}</blockquote>
        ),
        table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-[#D9B45C]/15">
                <table className="w-full text-sm border-collapse">{children}</table>
            </div>
        ),
        thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,
        th: ({ children }) => <th className="text-left font-semibold px-3 py-2 border-b border-[#D9B45C]/15 text-[#F3EFE4]">{children}</th>,
        td: ({ children }) => <td className="px-3 py-2 border-b border-white/5 text-[#DCD9CC]">{children}</td>,
        code: ({ inline, className, children, ...props }) => {
            const isBlock = !inline && (className || String(children).includes('\n'));
            if (!isBlock) {
                return (
                    <code className="bg-black/30 text-[#E7C878] px-1.5 py-0.5 rounded text-[0.85em] font-mono" {...props}>
                        {children}
                    </code>
                );
            }
            return (
                <pre className="bg-[#0A0F0C] border border-[#D9B45C]/15 rounded-xl p-3 my-3 overflow-x-auto text-sm">
                    <code className="font-mono text-[#DCD9CC]">{children}</code>
                </pre>
            );
        },
    }
 
    function splitThinking(content) { /* ... tumhara purana code ... */ }
 
    return (
        <div className="w-full md:w-4/5 h-screen flex flex-col bg-[#0E1512] relative">
 
            {/* ===== Messages Area ===== */}
            <div className="chat-scroll flex-1 overflow-y-auto px-4 md:px-10 py-8">
                <div className="max-w-3xl mx-auto flex flex-col">
 
                    {allmessages && allmessages.length === 0 && !streamingText && (
                        <div className="flex flex-col items-center justify-center text-center mt-24 gap-3">
                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#E8C468] to-[#B8860B] flex items-center justify-center shadow-lg shadow-black/40">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L14.2 9.2L21 12L14.2 14.8L12 22L9.8 14.8L3 12L9.8 9.2L12 2Z" fill="#12190F" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-semibold text-[#F3EFE4]">Start a new conversation</h2>
                            <p className="text-[#8FA090] text-sm max-w-sm">Poochho kuch bhi — main yahin hoon madad karne ke liye.</p>
                        </div>
                    )}
 
                    {/* Purane Messages */}
                    {allmessages && allmessages.map((val, index) => {
                        return <div key={index} className="py-2.5 flex flex-col gap-[5px]">
                            {val.role === 'user' ?
                                <div className="self-end bg-gradient-to-br from-[#E8C468] to-[#C79A3C] text-[#1B2417] max-w-[85%] w-fit px-4 py-2.5 mt-10 rounded-2xl rounded-br-md shadow-md shadow-black/30">
                                    <p className="leading-relaxed whitespace-pre-wrap break-words font-medium">{val.content}</p>
                                </div>
                                :
                                <div className="self-start flex items-start gap-3 max-w-[100%] w-full">
                                    <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#2F5233] to-[#14361C] border border-[#D9B45C]/25 flex items-center justify-center mt-1">
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                            <path d="M12 2L14.2 9.2L21 12L14.2 14.8L12 22L9.8 14.8L3 12L9.8 9.2L12 2Z" fill="#E8C468" />
                                        </svg>
                                    </div>
                                    <div className="w-fit max-w-full pt-0.5 text-[#DCD9CC]">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                            {val.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            }
                        </div>
                    })}
 
                    {streamingText && (
                        <div className="py-2.5 self-start flex items-start gap-3 max-w-[100%] w-full">
                            <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#2F5233] to-[#14361C] border border-[#D9B45C]/25 flex items-center justify-center mt-1">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L14.2 9.2L21 12L14.2 14.8L12 22L9.8 14.8L3 12L9.8 9.2L12 2Z" fill="#E8C468" />
                                </svg>
                            </div>
                            <div className="w-fit max-w-full pt-0.5 text-[#DCD9CC]">
                                <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                                    {streamingText}
                                </ReactMarkdown>
                                <span className="inline-block w-1.5 h-4 align-middle bg-[#E8C468] ml-0.5 animate-pulse rounded-sm" />
                            </div>
                        </div>
                    )}
 
                
                    {chatloading && !streamingText && (
                        <div className="py-2.5 self-start flex items-center gap-3">
                            <div className="shrink-0 w-7 h-7 rounded-full bg-gradient-to-br from-[#2F5233] to-[#14361C] border border-[#D9B45C]/25 flex items-center justify-center">
                                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 2L14.2 9.2L21 12L14.2 14.8L12 22L9.8 14.8L3 12L9.8 9.2L12 2Z" fill="#E8C468" />
                                </svg>
                            </div>
                            <div className="flex items-center gap-1.5 pt-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D9B45C] animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D9B45C] animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 rounded-full bg-[#D9B45C] animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
 
            {/* ===== Input Form ===== */}
            <div className="w-full px-4 md:px-10 pb-6 pt-2">
                <form onSubmit={submitform} className="max-w-3xl mx-auto flex items-center gap-2 bg-[#161F19] border border-[#D9B45C]/15 rounded-2xl px-3 py-2 shadow-lg shadow-black/40 focus-within:border-[#D9B45C]/50 transition-colors">
                    <input
                        value={message}
                        onChange={(dets) => setmessage(dets.target.value)}
                        disabled={chatloading}
                        className="flex-1 bg-transparent outline-none text-[#F3EFE4] placeholder:text-[#6E7B70] px-2 py-2 text-[15px] disabled:opacity-50"
                        type="text"
                        placeholder="Message AI..."
                    />
                    <button
                        type="submit"
                        disabled={chatloading || !message.trim()}
                        className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${chatloading || !message.trim() ? 'bg-white/5 text-[#4A5750] cursor-not-allowed' : 'bg-gradient-to-br from-[#E8C468] to-[#B8860B] text-[#1B2417] cursor-pointer hover:brightness-110'}`}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M4 12L20 4L13 20L11 13L4 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" fill="currentColor" />
                        </svg>
                    </button>
                </form>
            </div>
 
            <style>{`
                .chat-scroll::-webkit-scrollbar { width: 8px; }
                .chat-scroll::-webkit-scrollbar-track { background: transparent; }
                .chat-scroll::-webkit-scrollbar-thumb { background: rgba(217,180,92,0.15); border-radius: 8px; }
                .chat-scroll::-webkit-scrollbar-thumb:hover { background: rgba(217,180,92,0.28); }
            `}</style>
        </div>
    )
}

export default Maincomponent