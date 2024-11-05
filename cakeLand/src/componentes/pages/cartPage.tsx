import { useParams } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useContext } from "react";
export default function cartPage() {
  const { userId } = useParams<{ userId: string }>(); // Extract the ID from the URL
  const userContext = useContext(UserContext);
  return (
    <div>
      <h1>{userContext?.user?.id}</h1>
      {userContext?.user?.cart.map((item) => {
        return (
          <ul key={item.product.id}>
            <li>{item.product.name}</li>
            <li>{item.quantity}</li>
          </ul>
        );
      })}
    </div>
  );
}
