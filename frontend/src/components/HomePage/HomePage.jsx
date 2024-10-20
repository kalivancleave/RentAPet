import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { fetchAnimals } from "../../store/animals";
import { NavLink } from "react-router-dom";
import { IoPawSharp } from "react-icons/io5";
import { IoAddCircleOutline } from "react-icons/io5";

import IconOpenModalButton from "../OpenModalButton/IconOpenModalButton";
import CreateAnimalModal from "../Animal/CreateAnimalModal";

function HomePage() {
  const dispatch = useDispatch();
  const animalsList = useSelector(state => state.animals.animals?.Animals);
  const sessionUser = useSelector(state => state.session.user);

  useEffect(() => {
    dispatch(fetchAnimals());
  }, [dispatch])

  return(
    <>
      <div className="textRight topMargin rightPageBorder leftPageBorder">
        <div className={!sessionUser ? "visibilityHidden" : ""}>
          <IconOpenModalButton
              buttonText={<IoAddCircleOutline />}
              modalComponent={<CreateAnimalModal userId={sessionUser?.id}/>}
              />
        </div>
        <p className="mediumFont font darkGreenFont noMargin noPadding">Add Animal</p>
      </div>

      <div className="displayFlex noPadding flexWrap leftPageBorder rightPageBorder">
        {animalsList?.map(({ id, birthday, name, price, type, animalImage, averageRating}) => (
          <div key={id} className="displayFlex flexColumn alignCenter littleMoreMargin dropShadow frontPageCards">
            <NavLink to={`/${id}`} className='noDecoration displayFlex flexColumn alignCenter fullWidth'>
              <img className='imageShape' src={animalImage} />
              <div className="displayFlex fullWidth spaceEvenly">
                <div>
                  <p className="font almostBlackFont largeFont">{name}</p>
                </div>
                <div className="displayFlex alignCenter">
                  <p>{averageRating}</p>
                  <IoPawSharp />
                </div>
              </div>
              <p>{birthday}</p>
              <p>{price}</p>
              <p>{type}</p>
            </NavLink>
          </div>
        ))}
      </div>
    </>
  )
}


export default HomePage;