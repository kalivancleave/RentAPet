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

  function displayMonth(number) {
    if(number === "01") return "Jan"
    if(number === "02") return "Feb"
    if(number === "03") return "Mar"
    if(number === "04") return "Apr"
    if(number === "05") return "May"
    if(number === "06") return "Jun"
    if(number === "07") return "Jul"
    if(number === "08") return "Aug"
    if(number === "09") return "Sep"
    if(number === "10") return "Oct"
    if(number === "11") return "Nov"
    if(number === "12") return "Dec"
  }

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

      <div className="displayFlex noPadding flexWrap leftPageBorder rightPageBorder justifyContentCenter">
        {animalsList?.map(({ id, birthday, name, price, type, animalImage, averageRating}) => (
          <div key={id} className="displayFlex flexColumn alignCenter littleMoreMargin dropShadow frontPageCards">
            <NavLink to={`/${id}`} className='noDecoration displayFlex alignCenter fullWidth'>
              <div className="displayFlex flexColumn fullWidth">

                <div className="displayFlex fullWidth alignCenter">
                  <div className="displayFlex threeQuarterWidth">
                    <img className='imageShape' src={animalImage} />
                    <p className="font almostBlackFont xx-largeFont leftPadding">{name}</p>
                  </div>
                  <div className="displayFlex alignBottom quarterWidth">
                    <p className="noMargin header mediumFont almostBlackFont">{typeof averageRating === 'number' ? averageRating.toFixed(1) : "New"}</p>
                    <IoPawSharp className="x-largeFont font darkGreenFont littleLeftMargin"/>
                  </div>
                </div>

                <div className="displayFlex spaceBetween leftPageBorder fullWidth">
                  <div className="displayFlex threeQuarterWidth flexColumn padding">
                    <div className="displayFlex alignBottom spaceBetween">
                      <p className="noMargin font mediumFont almostBlackFont">Birthday</p>
                      <p className="noMargin header mediumFont almostBlackFont">{displayMonth(birthday.slice(5,7))} {birthday.slice(8,10)}, {birthday.slice(0,4)}</p>
                    </div>

                    <div className="displayFlex alignBottom spaceBetween littleTopPadding">
                      <p className="noMargin font mediumFont almostBlackFont">Price</p>
                      <p className="noMargin header mediumFont almostBlackFont">${price.toFixed(2)} per night</p>
                    </div>

                    <div className="displayFlex alignBottom spaceBetween littleTopPadding">
                      <p className="noMargin font mediumFont almostBlackFont">Type</p>
                      <p className="noMargin header mediumFont almostBlackFont">{type}</p>
                    </div>
                  </div>


                  <div className="displayFlex quarterWidth padding">
                    
                  </div>

                </div>

              </div>
            </NavLink>
          </div>
        ))}
      </div>
    
    </>
  )
}


export default HomePage;