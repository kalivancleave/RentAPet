import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAnimals } from "../../store/animals";
import { NavLink } from "react-router-dom";
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
      <ol className="displayFlex noPadding flexWrap testBorder leftPageBorder">
        {animalsList?.map(({ id, birthday, name, price, type, animalImage, averageRating}) => (
          <div key={id} className="testBorder displayFlex flexColumn alignCenter frontPageCards">
            <img className='imageShape' src={animalImage} />
            <div className="displayFlex fullWidth spaceEvenly">
              <div>
                <p>{name}</p>
              </div>
              <div className="displayFlex alignCenter">
                <p>{averageRating}</p>
                <IoPawSharp />
              </div>
            </div>
            <p>{birthday}</p>
            <p>{price}</p>
            <p>{type}</p>
          </div>
        ))}
      </ol>
    </>
  )
}


export default HomePage;