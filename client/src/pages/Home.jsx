import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import socket from '../services/chat.socket'
import useAuthhook from '../hooks/useAuthhook'
 
import Sidebar from '../components/Sidebar'
import Maincomponent from '../components/Maincomponent'
 
const Home = () => {
    let user = useSelector((state) => state.authuser.user)
    let isloading = useSelector((state) => state.authuser.isloading)
 
    let tonavigate = useNavigate()
    let { userdetailsfnc } = useAuthhook()
 
    useEffect(() => {
        if (!user) {
            userdetailsfnc()
        }
    }, [])
 
    useEffect(() => {
        if (isloading) return;
 
 
        if (user === null) {
            tonavigate('/login')
        } else {
            socket.connect()
        }
    }, [user, isloading, tonavigate])
 
 
    if (isloading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen bg-[#0A0F0C] gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-[#D9B45C] animate-spin" />
                <p className="text-[#8FA090] text-sm">Loading...</p>
            </div>
        )
    }
 
 
 
 
    return (
        <div className="w-full h-screen flex bg-[#0E1512]">
            <Sidebar />
            <Maincomponent />
        </div>
    )
}

export default Home