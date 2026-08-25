import React, { useEffect, useState } from 'react'
import useAuthhook from '../hooks/useAuthhook'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
 
const Login = () => {
 
    let user = useSelector((state) => state.authuser.user)
    let tonavigate = useNavigate()
 
    useEffect(() => {
 
        if (user) {
            return tonavigate('/')
        }
    }, [user, tonavigate])
 
    const [usermail, setusermail] = useState('')
    const [userpassword, setuserpassword] = useState('')
 
    let { loginfnc } = useAuthhook()
 
    async function submitform(dets) {
        dets.preventDefault();
        let data = await loginfnc(usermail, userpassword)
        console.log('form submit successfully!')
    }
 
    return (
        <div className="w-full min-h-screen flex justify-center items-center bg-[#0A0F0C] px-4">
            <div className="w-full max-w-sm bg-[#131A15] border border-[#D9B45C]/10 rounded-2xl p-8 shadow-2xl shadow-black/50">
 
                <div className="flex flex-col items-center gap-2 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#E8C468] to-[#B8860B] flex items-center justify-center shadow-md shadow-black/40">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                            <path d="M12 2L14.2 9.2L21 12L14.2 14.8L12 22L9.8 14.8L3 12L9.8 9.2L12 2Z" fill="#12190F" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-semibold text-[#F3EFE4]">Welcome back</h2>
                    <p className="text-[#8FA090] text-sm"><span className='capitalize'>login</span> to continue your chats</p>
                </div>
 
                <form onSubmit={submitform} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-[#8FA090] font-medium px-1">Email</label>
                        <input
                            value={usermail}
                            onChange={(dets) => setusermail(dets.target.value)}
                            className="bg-[#0E1512] border border-[#D9B45C]/15 focus:border-[#D9B45C]/60 outline-none text-[#F3EFE4] placeholder:text-[#4A5750] rounded-xl px-4 py-2.5 text-[15px] transition-colors"
                            type="text"
                            placeholder="you@example.com"
                        />
                    </div>
 
                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs text-[#8FA090] font-medium px-1">Password</label>
                        <input
                            value={userpassword}
                            onChange={(dets) => setuserpassword(dets.target.value)}
                            className="bg-[#0E1512] border border-[#D9B45C]/15 focus:border-[#D9B45C]/60 outline-none text-[#F3EFE4] placeholder:text-[#4A5750] rounded-xl px-4 py-2.5 text-[15px] transition-colors"
                            type="password"
                            placeholder="••••••••"
                        />
                    </div>
 
                    <button className="mt-2 bg-gradient-to-br from-[#E8C468] to-[#B8860B] hover:brightness-110 text-[#1B2417] font-semibold rounded-xl py-2.5 transition-all shadow-md shadow-black/40 cursor-pointer">
                        Log in
                    </button>
                </form>

                <p className="text-[#8FA090] text-sm mt-5 text-center"><span className='capitalize'>signup</span> for new <span onClick={()=>{
                    tonavigate('/signup')
                }} className="capitalize text-[#B8860B] underline cursor-pointer">account</span></p>
            </div>
        </div>
    )
}
 

export default Login