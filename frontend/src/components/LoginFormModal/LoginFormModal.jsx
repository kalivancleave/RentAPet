import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import Logo from '../../../../static/rentAPetLogoDark.png';

import SignupFormModal from '../SignupFormModal/SignupFormModal';
import SubtleOpenModalButton from '../OpenModalButton/SubtleOpenModalButton';

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoLogin = async () => {
    await dispatch(sessionActions.login({
      credential: "demouser",
      password: "Password"
    }))
      .then(closeModal())
  }

  return (
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />
      <p className='header xx-largeFont noMargin almostBlackFont'>Log In</p>
      
        <form className='displayFlex flexColumn littleMoreTopPadding' onSubmit={handleSubmit}>
          
          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Username
            </label>

            <input
              type="text"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Password
            </label>

            <input
              type="password"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {errors.credential && <p>{errors.credential}</p>}
          </div>
          
          <div className='textCenter littleMoreTopPadding'>
            <button type="submit"
                    className=''>Log In</button>
          </div>
          <div className='textCenter'>
            <button type='submit'
                    className='alternateButton'
                    onClick={() => demoLogin()}>Demo Login</button>
          </div>
          <div className='moreTopPadding '>
            <SubtleOpenModalButton
            buttonText="Click Here to Register"
            modalComponent={<SignupFormModal />}
            />
          </div>  
        </form>
    
    </div>
  );
}

export default LoginFormModal;