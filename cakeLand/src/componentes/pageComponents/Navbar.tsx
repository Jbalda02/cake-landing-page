import logo from "./../../assets/logo.webp"
import { Link } from "react-router-dom"
import { UserContext } from "../contexts/UserContext"
import { useContext } from "react";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
function NavBar() {
    const userContext = useContext(UserContext);
    const {user, setUser} = userContext || {};
    const handleLogout = () => {
        if(setUser){
        setUser(null);
    }
    };
    return(
        <div className="text-white  bg-purple-900 flex flex-row max-h-30 min-w-full justify-between content-center">
            <Link to={"/"}><img alt="Logo" className=" ml-5 max-h-20 max-w-20  min-h-20 min-w-20 border rounded-full mt-3 mb-3" src={logo}></img>
            </Link>
            <ul className="flex flex-row gap-7 mr-10 items-center">
                
            {user ? (
                    <>
                        <Link to={'/kart'}><FontAwesomeIcon icon={faCartShopping}></FontAwesomeIcon> </Link>
                        <li>{user.firstName + " " + user.lastName}</li>
                        <button className="text-red-500" onClick={handleLogout}>
                            Logout
                        </button>
                    </>
                ) : (
                    <Link to="/login">Login</Link>
                )}
                <Link to={'/products'}>  Menu   </Link>
                <Link to={'/contact'}> Pedidos </Link>
            </ul>
        </div>
    )
}

export default NavBar