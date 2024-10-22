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

  const [imageSelected, setImageSelected] = useState("");
  const [imageToUpload, setImageToUpload] = useState('');

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

  const handleUpdate = async (e) => {
    e.preventDefault();

    setErrors({})

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

    await dispatch(createImage(newImage))
    .then(async function refreshAnimalInformation() {
      dispatch(updateAnimal(updatedAnimal))
      await wait();
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

        <form className='displayFlex flexColumn littleMoreTopPadding' onSubmit={handleUpdate}>

          <div className='displayFlex justifyContentCenter topPadding fullWidth spaceBetween'>
            <img className="largeImageShape" src={currentAnimal?.animalImage} />
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
            {errors.price && <p>{errors.price}</p>}
          </div>

          <p className="visibilityHidden">Selected Type: {uType}</p>

          <div className="fullWidth textCenter">
            <button type="submit">Update</button>
          </div>

        </form>
    </div>
  )
}

export default UpdateAnimalModal;