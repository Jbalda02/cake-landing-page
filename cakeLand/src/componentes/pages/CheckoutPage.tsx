import { useContext, useState } from "react";
import NavBar from "../pageComponents/Navbar";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";
import toast, { Toaster } from "react-hot-toast";
import { UserContext } from "../contexts/UserContext";
export default function CheckoutPage() {
  const userContext = useContext(UserContext);
  const [selectedPaymentMethod, setPaymentMethod] = useState("");
  const paymentOptions = [
    { value: "bankTransfer", label: "Transferencia bancaria" },
    { value: "paypal", label: "Paypal" },
    { value: "card", label: "Tarjeta" },
  ];
  const defaultOption = paymentOptions[0];


  const paymentMethodToRender = () => {
    toast.success('Metodo de pago Selecionado ' + selectedPaymentMethod)
    switch (selectedPaymentMethod) {
      case "bankTransfer":
        return(
        <div> 
            <h1>Instrucciones</h1>
            <ol>
                <li>Realizar transferencia a  </li>
                <li>Subir Comprobante</li>
            </ol>


        </div>
        ) 
        break
      case "paypal":
        return(
            <div> 
                <h1>Instrucciones</h1>
                <ol>
                    <li>Ingresar a Paypal </li>
                    <li>Realizar transferencia A </li>
                </ol>
            </div>
            );         
            break
      case "card":
        return(
            <div> 
                <h1>Instrucciones</h1>
                <ol>
                    <li>Ingresar datos de Tarjeta </li>
                </ol>
            </div>
            ) 
        break
    }
    return <div></div>;
  };

  return (
    <div>
        <Toaster></Toaster>
      <NavBar></NavBar>
      <form className="min-w-full flex flex-col">
        <div className="bg-white self-center px-10 min-w-[800px] rounded-xl my-10">
            <h1 className="text-center font-playwrite text-3xl py-5">Datos Personales</h1>
            <div className="flex flex-row justify-between max-w-[700px]">
                <label>Nombre Completo</label>
                <input defaultValue={`${userContext?.user?.firstName} ${userContext?.user?.lastName}`} type="text" className="border-b-2 border-black"></input>
            </div>

            <div className="flex flex-row min-w-[700px] justify-between max-w-[700px]">
                <label>Email </label>
                <input defaultValue={userContext?.user?.email} type="text" className="border-b-2 border-black"></input>
            </div>

            <div className="flex flex-row  justify-between max-w-[700px] ">
                <label>Numero de Telefono </label>
                <input defaultValue={userContext?.user?.phone} type="text" className="border-b-2 border-black"></input>
            </div>
            <h1 className="text-center font-playwrite text-3xl py-5">Direccion</h1>
            <div className="flex flex-row min-w-full justify-between  max-w-[700px]">
                <label>Estado </label>
                <input type="text" className="border-b-2 border-black"></input>
            </div>     
            <div className="flex flex-row min-w-full justify-between  max-w-[700px]">
                <label>Ciudad </label>
                <input type="text" className="border-b-2 border-black "></input>
            </div>
            <div className="flex flex-row min-w-full justify-between  max-w-[700px]">
                <label>Via Principal </label>
                <input type="text" className="border-b-2 border-black "></input>
            </div>
            <div className="flex flex-row min-w-full justify-between  max-w-[700px]">
                <label>Via Secundaria </label>
                <input type="text" className="border-b-2 border-black"></input>
            </div>

            <div className="flex flex-row min-w-full justify-between  max-w-[700px] mb-10">
                <label>Numero </label>
                <input type="text" className="border-b-2 border-black"></input>
            </div>
        </div>
        <div className="bg-white self-center px-10 min-w-[800px] rounded-xl my-10">
        <h1 className="text-center font-playwrite text-3xl py-5">Datos de Pago</h1>
        <Dropdown
          options={paymentOptions}
          onChange={(e) => setPaymentMethod(e.value)}
          value={""}
        ></Dropdown>
        {paymentMethodToRender()}
        </div>
      </form>
    </div>
  );
}
