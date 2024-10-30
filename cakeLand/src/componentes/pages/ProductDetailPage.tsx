import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Product } from "../../types";
import { getProductsByUID } from "../../services/userQueries";
import NavBar from "../pageComponents/Navbar";
import { Fade } from "react-slideshow-image";
import "react-slideshow-image/dist/styles.css";
import { faCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Footer from "../pageComponents/Footer";
const ProductDetailPage = () => {
  const { productId } = useParams<{ productId: string }>(); // Extract the ID from the URL
  const [product, setProduct] = useState<Product | null>(null); // Product type
  const h1Style:string = "font-playwrite text-center text-xl"; 
  const formatToDollarString = (amount:number) => {
    const formattedDollarString = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + '$';
  
    return formattedDollarString;
  }
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        if (productId) {
          const fetchedProduct = await getProductsByUID(productId);
          setProduct(fetchedProduct as Product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
  }, [productId]);
  0;
  if (!product) return <div>Loading...</div>; // Ensure the product exists before accessing its properties

  return (
    <div>
      <NavBar></NavBar>
      <h1 className="text-4xl  text-center mt-10 font-bold font-playwrite">
        {product.name}
      </h1>
      <div className="flex -mb-64">
        {/**Colummna Izquierda */}
        <div className="flex-1 justify-center align-middle items-center">
          <div className="flex self-center place-self-center justify-self-center justify-center bg-slate-200 rounded-lg max-w-lg mx-10 my-10 flex-col ">
            {/**<img src={product.imgurl[0]} className=""></img>*/}
            {product.imgurl.length > 1? 
            <Fade>
              {product.imgurl.map((img, index) => (
                <div
                  key={index}
                  className="w-full flex justify-center items-center py-4"
                >
                  <div
                    className="w-full h-80 max-h-[500px] bg-no-repeat bg-center bg-contain rounded-lg"
                    style={{ backgroundImage: `url(${img})` }}
                  ></div>
                </div>
              ))}
            </Fade> : <img src={product.imgurl[0]} className=""></img>
            }
            <div className="flex flex-row justify-around content-around min-w-full">
              <div className="cursor-pointer bg-purple-600 text-white py-5 px-4 rounded-lg my-4 hover:bg-purple-800" >Comprar </div>
              <div className="cursor-pointer bg-purple-600 text-white py-5 px-4 rounded-lg my-4 hover:bg-purple-800"> Anadir a Carrito</div>
            </div>
          </div>
        </div>
        {/**Colummna Derecha */}
        <div className="flex-1 min-h-screen">
          <div className="flex flex-col gap-2 mt-10">
          <h1 className="font-playwrite text-center text-xl">Descripcion</h1>
          <p>{product.descripcion}</p>
          <h1 className={h1Style}>Ingredients</h1>
          {product.ingredientes.map((name, index) => (
            <div key={index} className="flex">
              <FontAwesomeIcon icon={faCircle} size="2xs" className="align-bottom text-center py-2 px-4" ></FontAwesomeIcon>
              <p className="text-center align-bottom">{name.charAt(0).toUpperCase() + name.slice(1)}</p>
            </div>
          ) )}
          <h1 className={h1Style}>Alergenos</h1>
          {product.alergenos.map((name, index) => (
            <div key={index} className="flex">
              <FontAwesomeIcon icon={faCircle} size="2xs" className="align-bottom text-center py-2 px-4" ></FontAwesomeIcon>
              <p className="text-center align-bottom">{name.charAt(0).toUpperCase() + name.slice(1)}</p>
            </div>
          ) )}
          <h1 className={h1Style}>Precio</h1>
          <p className="cursor-pointer text-center text-xl">{formatToDollarString(product.precio)}</p>
          <h1 className={h1Style}>Numero de Porciones</h1>
          <p className="cursor-pointer text-center text-xl">{product.numPorciones} </p>
          </div>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
};

export default ProductDetailPage;
