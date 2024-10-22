import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { createAnimal } from "../../store/animals";
import { fetchAnimals } from "../../store/animals";

import Logo from '../../../../static/rentAPetLogoDark.png';

const CreateAnimalModal = (props) => {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  const [name, setName] = useState("");
  const [birthday, setBirthday] = useState();
  const [type, setType] = useState()
  const [price, setPrice] = useState();

  const [errors, setErrors] = useState({})

  const userId = props.userId
  
  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const animalDetails = async () => {
    setErrors({})

    let newAnimal = {}

      newAnimal.userId = userId,
      newAnimal.name = name,
      newAnimal.birthday = birthday,
      newAnimal.type = type,
      newAnimal.price = price
    
    await dispatch(createAnimal(newAnimal))
    .then(async function refreshAllAnimals() {
      dispatch(fetchAnimals())
      await wait();
    })
    .then(closeModal)
  }

  const handleChange = (event) => {
    setType(event.target.value)
  }

  return (
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />
      <p className='header xx-largeFont noMargin almostBlackFont'>Create A Pet</p>

        <form className='displayFlex flexColumn littleMoreTopPadding' onSubmit={(e) => {e.preventDefault(); animalDetails()}}>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Name
            </label>

            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              required='required'
              value={name}
            />
            {errors.name && <p>{errors.name}</p>}
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Birthday
            </label>

            <input
              onChange={(e) => setBirthday(e.target.value)}
              type="date"  
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'    
              value={birthday}
              min='1980-01-01'
            />
            {errors.birthday && <p>{errors.birthday}</p>}
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Type
            </label>

            <select value={type} onChange={handleChange} className='noBorder dropShadow logInInputSize littleMoreLeftMargin'>
              <option
                value="Dog"
              >Dog</option>
              <option
                value="Cat"
              >Cat</option>
              <option
                value="Bird"
              >Bird</option>
              <option
                value="Horse"
              >Horse</option>
              <option
                value="Reptile"
              >Reptile</option>
              <option
                value="Rodent"
              >Rodent</option>
              <option
                value="Exotic"
              >Exotic</option>
            </select>
            {errors.type && <p>{errors.type}</p>}
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Price
            </label>

            <input
              onChange={(e) => setPrice(e.target.value)}
              type="text" 
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'     
              value={price}
              required='required'
              placeholder="Price per night (USD)"
            />

            {errors.price && <p>{errors.price}</p>}
          </div>

          <p className="visibilityHidden">Selected Type: {type}</p>

          <div className="fullWidth textCenter">
            <button type="submit">Create Pet</button>
          </div>
        </form>
    </div>
  )
}

export default CreateAnimalModal;