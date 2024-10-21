import logo from "./../../assets/logo.webp"
import { Link } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import { useContext } from "react";
function NavBar() {
    const userContext = useContext(UserContext);
    const {user, setUser} = userContext || {};
    const handleLogout = () => {
        if(setUser){
        setUser(null);
    }
    };
    return(
        <div className="flex flex-row max-h-20 min-w-full justify-between content-center">
            <img alt="Logo" className=" ml-5 max-h-20 max-w-20" src={logo}></img>
            <ul className="flex flex-row gap-7 mr-10 items-center">
            {user ? (
                    <>
                        <li>{user.firstName + " " + user.lastName}</li>
                        <button className="text-red-500" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
                <Link to={'/products'}> Menu   </Link>
                <Link to={'/contact'}> Pedidos </Link>
            </ul>
        </div>
    )
}

export default NavBar