import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAnimals } from "../../store/animals";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IoPawSharp } from "react-icons/io5";

function HomePage() {
  const dispatch = useDispatch();
  const animalsList = useSelector(state => state.animals.animals?.Animals);

  useEffect(() => {
    dispatch(fetchAnimals());
  }, [dispatch])


  return(
    <>
      <h1>Home Page</h1>
      <ol>
        {console.log(animalsList)}
        {animalsList?.map(({ id, birthday, name, price, type, image, averageRating}) => (
          <div key={id}>
            <p>{birthday}</p>
            <p>{name}</p>
            <p>{price}</p>
            <p>{type}</p>
            <p>{averageRating}</p>
            <img src={image} />
          </div>
        ))}
      </ol>
    </>
  )
}


export default HomePage;