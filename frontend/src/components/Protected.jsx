import{Navigate} from'react-router-dom';
import{useAuth}from'../context/AuthContext';
export default function Protected({children}){const{user,loading}=useAuth();if(loading)return <div className="min-h-screen grid place-items-center muted">Loading MONOLOGUE…</div>;return user?children:<Navigate to="/login" replace/>}
