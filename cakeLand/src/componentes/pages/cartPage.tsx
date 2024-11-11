import { UserContext } from "../contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import NavBar from "../pageComponents/Navbar";
import { eraseItemFromCartById, getUserCart } from "../../services/userQueries";
import { CartItem } from "../../types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faFaceFrown, faCake } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const userContext = useContext(UserContext);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  
  const formatToDollarString = (amount: number) => {
    const formattedDollarString =
      new Intl.NumberFormat("en-US", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount) + "$";

    return formattedDollarString;
  };
  
  const loadCart = async () => {
    if (!userContext?.user?.id) {
      console.error("User ID is undefined.");
      setLoading(false);
      return;
    }

    try {
      const userCart = await getUserCart(userContext.user.id);
      setCart(userCart);
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userContext?.user?.id) {
      loadCart();
    }
  }, [userContext?.user?.id]);

  const calcularTotal = (cart: CartItem[]) => {
    let total = 0;
    cart.forEach(element => {
      total = element.product.precio * element.quantity + total
    });
      return formatToDollarString(total)
  }
   // Remove item function
   const removeThis = async (productId: string) => {
    if (!userContext?.user?.id) {
      console.error("User ID is undefined.");
      return;
    }
    const updatedCart = cart.filter((item) => item.product.id !== productId);
    setCart(updatedCart);

    try {
      await eraseItemFromCartById(userContext.user.id, productId);
    } catch (error) {
    console.log(error)}
    loadCart();

    let updatedUser = userContext?.user;
    if(updatedUser !== undefined){ 
      updatedUser.cart = cart;
      userContext?.setUser(updatedUser)
      navigate(`/checkout/${userContext?.user?.id}`)
    }
    
  };

   const toCheckout = (cart:CartItem[]) => {
      let updatedUser = userContext?.user;
      if(updatedUser !== undefined){ 
        updatedUser.cart = cart;
        userContext?.setUser(updatedUser)
        navigate(`/checkout/${userContext?.user?.id}`)
      }
      
   } 

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
        <p className="ml-4 text-xl">Loading...</p>
      </div>
    );
  }
  return (
   cart.length > 0? (
   <div className="flex flex-col">
      <NavBar></NavBar>
      <label className="text-center font-mono text-3xl">
        Bienvenido{" "}
        {`${userContext?.user?.firstName} ${userContext?.user?.lastName}`}
      </label>
      <label className="text-center font-playwrite text-4xl min-w-full">
        Carrito
      </label>
      <div className="flex flex-row my-4">
        <ul className="flex flex-row justify-around min-w-full mb-5 bg-white rounded-xl py-2">
          <li key="index-t"    className="text-center"  >#</li>
          <li key="name-t"     className="text-center min-w-64 ">Nombre</li>
          <li key="quantity-t" className="text-center"  >Cantidad</li>
          <li key="total-t"    className="text-center"  >Total</li>
          <li key="delete-t"   className="text-center"  ></li> {/* Empty space for trash icon */}
        </ul>
      </div>
      {cart.map((item, index) => {
        return (
          <ul
            key={`cart-item-${item.product.id}`} // Unique key for each cart item
            className="flex flex-row justify-around min-w-full my-2"
          >
            <li key={`index-${item.product.id}`} className="text-center">
              {index + 1}
            </li>
            <li key={`name-${item.product.id}`} className="text-center min-w-64">
              {item.product.name}
            </li>
            <li key={`quantity-${item.product.id}`} className="text-center">
              {item.quantity}
            </li>
            <li key={`price-${item.product.id}`} className="text-center">
              {formatToDollarString(item.product.precio * item.quantity)}
            </li>
            <div
              key={`delete-icon-${item.product.id}`} // Unique key for trash icon
              className="cursor-pointer"
              onClick={() => removeThis(item.product.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </div>
          </ul>
        );
      })}
      <div className="self-center my-5">
        <label className="self-center mr-5">Subtotal</label>
        <label>{calcularTotal(userContext?.user?.cart ?? [])}</label>
      </div>
      <div className="cursor-pointer self-center bg-purple-600 hover:bg-purple-800 rounded-xl py-5 px-5 text-white" onClick={() => toCheckout(cart)} >Proceder a Checkout!</div>
    </div>):(
      <div className="flex flex-col">
      <NavBar></NavBar>
      <label className="text-center font-mono text-3xl">
        Bienvenido{" "}
        {`${userContext?.user?.firstName} ${userContext?.user?.lastName}`}

      </label>
      <label className="text-center mt-14">No tienes Items <FontAwesomeIcon icon={faFaceFrown}></FontAwesomeIcon></label>
      <label className=" bg-purple-600 text-white py-5 px-5 rounded-lg hover:bg-purple-800 text-center cursor-pointer max-w-80 self-center mt-10" onClick={() => navigate('/products')}>Mira nuestro menu! <FontAwesomeIcon icon={faCake}></FontAwesomeIcon></label>

      </div>)
  );
}  