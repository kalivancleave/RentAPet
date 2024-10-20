import { useSelector, useDispatch } from "react-redux";
import { useState } from "react";
import { useModal } from "../../context/Modal";

import { updateAnimal } from "../../store/animals";
import { fetchOneAnimal } from "../../store/animals";
import { createImage } from "../../store/images";

const UpdateAnimalModal = (props) => {
  const animalId = props.animalId
  const dispatch = useDispatch();
  const currentAnimal = useSelector(state => state.animals.animalDetails)

  const [uName, setName] = useState(currentAnimal?.name);
  const [uBirthday, setBirthday] = useState(currentAnimal?.birthday);
  const [uType, setType] = useState(currentAnimal?.type);
  const [uPrice, setPrice] = useState(currentAnimal?.price)

  const [imageSelected, setImageSelected] = useState("");
  // const [readyToSubmit, setReadyToSubmit] = useState(false);
  // const [uploadPhoto, setUploadPhoto] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  const [imageToUpload, setImageToUpload] = useState('');

  const { closeModal } = useModal();

  //photo upload code
  let imageURL;
  const uploadImage = async (e) => {
    e.preventDefault();
    // setIsLoading(true);
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
    

    // setUploadPhoto(true) //validation
    // setReadyToSubmit(true)
    // setIsLoading(false)
  } 

  async function wait() {
    await new Promise((resolve) => setTimeout(resolve))
  }

  const handleUpdate = async (e) => {
    e.preventDefault();

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
    <>
      <h1>Update Animal Modal</h1>
      {console.log(currentAnimal.price)}
      {console.log(imageToUpload)}
      <form onSubmit={handleUpdate}>

        <img src={currentAnimal?.animalImage} />
        <label>
          <input 
            type='file'
            accept='.jpeg, .png, .jpg'
            className='blackBorder'
            required='required'
            onInput={(e) => {setImageSelected(e.target.files[0])}}
            onChange={uploadImage}
            />
        </label>


      <label>
          Name
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="name"
            required='required'
            value={uName}
          />
        </label>

        <label>
          Birthday
          <input
            onChange={(e) => setBirthday(e.target.value)}
            type="date"      
            value={uBirthday}
            min='1980-01-01'
          />
        </label>

        <label>
          Type
          <select value={uType} onChange={handleChange}>
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
          <p className="visibilityHidden">Selected Type: {uType}</p>
        </label>

        <label>
          Price
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="text"      
            value={uPrice}
            required='required'
            placeholder="Price per night (USD)"
          />
        </label>

        <button type="submit">Update</button>

      </form>
    </>
  )
}

export default UpdateAnimalModal;