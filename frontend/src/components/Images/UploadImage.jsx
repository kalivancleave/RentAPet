import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { createImage } from "../../store/images";

const UploadImage = (spotId) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [previewImage, setPreviewImage] = useState('')
  const [imageSelected, setImageSelected] = useState("");
  const [previewStatus, ] = useState(false);
  const [isLoading, setIsLoading] = useState(false)
  const [uploadPhoto, setUploadPhoto] = useState(false);

  const newImage = {}
        
    newImage.url = previewImage
    newImage.preview = previewStatus
  
  let imageURL;
  const uploadImage = async () => {
    
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
    
    setPreviewImage(imageURL) 
    setIsLoading(true);
    setUploadPhoto(true);     
  } 

  const submitNewImage = () => {

    return (dispatch(createImage(newImage, spotId.spotId)))
    .then(setIsLoading(false))
    .then(navigate(`updateSpot/${spotId.spotId}`))
  }
  
  
  
  const hideMeUploadButton = "visibility" + (uploadPhoto === true ? "Hidden" : "")
  const hideMeLoadingText = 'noMargin noPadding visibility' + (isLoading === true ? "" : "Hidden")

  return(
    <>
      <input 
        type='file'
        accept='.jpeg, .png, .jpg'
        className='blackBorder'
        required='required'
        onChange={(e) => {setImageSelected(e.target.files[0])}}
      />
      <p className={hideMeLoadingText}>...Loading</p>
      <button className={hideMeUploadButton} onClick={uploadImage}>Upload</button>
      <button onClick={submitNewImage}>Submit</button>

    </>
  )
}

export default UploadImage;