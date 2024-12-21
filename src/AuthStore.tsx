import {create} from 'zustand'
import { User } from './Types/types';

interface AuthStoreProps{
    token:string;
    user:User|null;
    openLoginDialog: boolean;
    setOpenLoginDialog:()=>void
    setCloseLoginDialog:()=>void;
    setToken:(token:string)=>void;
    setUser:(user:User|null)=>void;
    startSession:(token:string,user:User)=>void;
    removeSession:()=>void

}


export const useAuthStore = create<AuthStoreProps>((set)=>{
    return {
        openLoginDialog: false,
        setOpenLoginDialog: ()=>set({openLoginDialog: true})    ,
        setCloseLoginDialog: ()=>set({openLoginDialog: false})   ,
        token: '',
        user: null,
        setToken: (token)=>set({token:token}),
        setUser: (user:User)=>set({user}),
        startSession: (token,user)=> {
            // Simulate a token storage for demonstration purposes
            localStorage.setItem('ACCESS_TOKEN', token);
            set({token: token, user: user});
        },
        removeSession: ()=> {
            localStorage.removeItem('ACCESS_TOKEN');
            set({token: '', user: null});
        }

    }
})