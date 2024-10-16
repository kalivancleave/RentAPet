import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';

import { fetchOneAnimal } from '../../store/animals';

const GetAnimal = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const animalInfo = useSelector(state => state.animals)

  const user = useSelector(state => state.session.user)

  useEffect(() => {
    dispatch(fetchOneAnimal(id))
  }, [dispatch, id])

  return (
    <>
      <h1>Animal #{id}</h1>
      {console.log(animalInfo)}
    </>
  )

}

export default GetAnimal;