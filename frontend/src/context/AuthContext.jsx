import{createContext,useContext,useEffect,useState} from 'react';
import api from'../api';

const Ctx = createContext(null);

export function AuthProvider({children}){
 const[user,setUser]=useState(null),[loading,setLoading]=useState(true);
 useEffect(()=>{api.get('/auth/me').then(r=>setUser(r.data.user)).catch(()=>setUser(null)).finally(()=>setLoading(false));},[]);
 const logout=async()=>{try{await api.post('/auth/logout')}finally{setUser(null)}};
 return <Ctx.Provider value={{user,setUser,loading,logout}}>{children}</Ctx.Provider>}
export const useAuth=()=>useContext(Ctx);
