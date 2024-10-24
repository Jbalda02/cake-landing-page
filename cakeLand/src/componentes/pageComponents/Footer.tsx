import logoWa from "./../../assets/walogo.png"
import logoig from "./../../assets/iglogo.png"
import logoemail from "./../../assets/emaillogo.png"
import logo from "./../../assets/logo.webp"
import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Link } from "react-router-dom"

export default function Footer(){
    const waurl = "https://www.whatsapp.com/?lang=es_LA"
    const igurl = "https://www.instagram.com/?hl=es"
    const gmail = "https://mail.google.com"
    return(
        <div className="flex flex-col min-h-full bg-purple-900 mt-20 ">
            <div className="mt-8 mb-8 flex flex-row min-w-full min-h-full justify-between">
                    <ul className="flex flex-col justify-around gap-4 text-white">
                        <label className="text-4xl font-playwrite text-left ml-5">Contacta y<br></br> haz tu pedido</label>
                        <Link to={waurl} className="text-left ml-5 font-playwrite flex flex-row justify-between px-2">Whatsapp    <FontAwesomeIcon icon={faArrowRight} ></FontAwesomeIcon>   <img className="max-w-5 max-h-5 mr-16" src={logoWa}></img>     </Link>
                        <Link to={igurl} className="text-left ml-5 font-playwrite flex flex-row justify-between px-2">Instagram   <FontAwesomeIcon icon={faArrowRight} ></FontAwesomeIcon>   <img className="max-w-5 max-h-5 mr-16" src={logoig}></img>     </Link>
                        <Link to={gmail} className="text-left ml-5 font-playwrite flex flex-row justify-between px-2">Correo      <FontAwesomeIcon icon={faArrowRight} ></FontAwesomeIcon>   <img className="max-w-5 max-h-5 mr-16" src={logoemail}></img>  </Link>
                    </ul>
                    <img src={logo} className="max-w-36 max-h-36 rounded-full self-center"></img>
                    <div className="flex flex-col min-h-full gap-2 mt-3">
                        <label className="text-4xl text-white mr-20 font-playwrite text-left ml-5">Direccion</label>
                        <label className=" mt-5 text-xl text-right text-white mr-20 ml-5">Ecuador<br></br> Guayas<br></br> Guayaquil<br></br> Via a la costa<br></br> Puerto Azul</label>

                    </div>
            </div>
        </div>
    )
}