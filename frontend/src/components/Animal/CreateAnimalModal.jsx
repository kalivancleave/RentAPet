import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";

import { createAnimal } from "../../store/animals";
import { fetchAnimals } from "../../store/animals";
import { createImage } from "../../store/images";

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
    <>
      <h1>Create Animal Modal</h1>
      <form onSubmit={(e) => {e.preventDefault(); animalDetails()}}>

        <label>
          Name
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="name"
            required='required'
            value={name}
          />
        </label>

        <label>
          Birthday
          <input
            onChange={(e) => setBirthday(e.target.value)}
            type="date"      
            value={birthday}
            min='1980-01-01'
          />
        </label>

        <label>
          Type
          <select value={type} onChange={handleChange}>
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
          <p className="visibilityHidden">Selected Type: {type}</p>
        </label>

        <label>
          Price
          <input
            onChange={(e) => setPrice(e.target.value)}
            type="text"      
            value={price}
            required='required'
            placeholder="Price per night (USD)"
          />
        </label>

        <button type="submit">Create Animal</button>

      </form>
    </>
  )
}

export default CreateAnimalModal;