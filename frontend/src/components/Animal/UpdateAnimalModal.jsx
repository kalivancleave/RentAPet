import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";

import { updateAnimal } from "../../store/animals";
import { fetchOneAnimal } from "../../store/animals";
import { createImage } from "../../store/images";

import Logo from '../../../../static/rentAPetLogoDark.png';

const UpdateAnimalModal = (props) => {
  const animalId = props.animalId
  const dispatch = useDispatch();
  const currentAnimal = useSelector(state => state.animals.animalDetails)

  const [uName, setName] = useState(currentAnimal?.name);
  const [uBirthday, setBirthday] = useState(currentAnimal?.birthday);
  const [uType, setType] = useState(currentAnimal?.type);
  const [uPrice, setPrice] = useState(currentAnimal?.price)

  const [errors, setErrors] = useState({})

  const [imageSelected, setImageSelected] = useState();
  const [imageToUpload, setImageToUpload] = useState();

  const { closeModal } = useModal();

  //photo upload code
  let imageURL;
  const uploadImage = async (e) => {
    e.preventDefault();
    const formData = new FormData()
    formData.append('file', imageSelected)
    formData.append("upload_preset", "rentapet")

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/djnfjzocb/image/upload",
    
      {
        method: "POST",
        body: formData
      }
    )
    const imageData =  await response.json()
    imageURL = imageData.url.toString() //this gets stored to image database
    setImageToUpload(imageURL)
  } 

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const newImage = {
    animalId: animalId,
    url: imageToUpload
  }
  
  const updatedAnimal = {
    id: animalId,
    name: uName,
    birthday: uBirthday,
    type: uType,
    price: uPrice
  }

  const handleUpdate = async () => {
    setErrors({})

    if(uName.length < 2){
      setErrors({
        name: "Name must be longer than 2 characters."
      })
    } else if (uName.length > 30){
      setErrors({
        name: "Name must be shorter than 30 characters."
      })
    } else if (uPrice < 0){
      setErrors({
        price: "Price per night must be a positive number."
      })
      return errors
    }

    dispatch(updateAnimal(updatedAnimal))
    await wait()
    .then(async function uploadImageIfNeeded() {
      if(imageSelected !== undefined){
        dispatch(createImage(newImage))
        await wait();
      }
    })
    .then(async function refreshAnimalDetails() {
      dispatch(fetchOneAnimal(animalId))
      await wait();
    })
    .then(closeModal)
  }

  const handleChange = (event) => {
    setType(event.target.value)
  }

  return(
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />
      <p className='header xx-largeFont noMargin almostBlackFont'>Update Pet</p>
      {console.log(currentAnimal?.animalImages[(currentAnimal?.animalImages.length - 1)]?.url)}

        <form onSubmit={(e) => e.preventDefault()} className='displayFlex flexColumn littleMoreTopPadding'>

          <div className='displayFlex justifyContentCenter topPadding fullWidth spaceBetween'>
            <img className="largeImageShape" src={currentAnimal?.animalImages[(currentAnimal?.animalImages.length -1)]?.url ? currentAnimal?.animalImages[(currentAnimal?.animalImages.length -1)]?.url : "https://res.cloudinary.com/djnfjzocb/image/upload/v1729795034/coming_soon_saglbm.jpg"} />
          </div>

          <div className='displayFlex justifyContentCenter topPadding fullWidth spaceBetween'>
            <input 
              type='file'
              accept='.jpeg, .png, .jpg'
              className='blackBorder'
              onInput={(e) => {setImageSelected(e.target.files[0])}}
              onChange={uploadImage}
              />
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Name
            </label>

            <input
              onChange={(e) => setName(e.target.value)}
              type="text"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin' 
              placeholder="name"
              required='required'
              value={uName}
            />
          </div>
          <div>
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
              value={uBirthday}
              min='1980-01-01'
            />
          </div>
          <div>
            {errors.birthday && <p>{errors.birthday}</p>}
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Type
            </label>

            <select value={uType} onChange={handleChange} className='noBorder dropShadow logInInputSize littleMoreLeftMargin'>
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
              value={uPrice}
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin' 
              required='required'
              placeholder="Price per night (USD)"
            />
          </div>
          <div>
            {errors.price && <p>{errors.price}</p>}
          </div>

          <p className="visibilityHidden">Selected Type: {uType}</p>

          <div className="fullWidth textCenter">
            <button onClick={handleUpdate}>Update</button>
          </div>

        </form>
    </div>
  )
}

export default UpdateAnimalModal;