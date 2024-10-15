import { useState } from 'react';
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import Logo from '../../../../static/rentAPetLogoDark.png';

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

  return (
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />
      <p className='header xx-largeFont noMargin almostBlackFont'>Log In</p>
      
        <form className='displayFlex flexColumn littleMoreTopPadding' onSubmit={handleSubmit}>
          <label className='displayFlex spaceAround littleMoreTopPadding font almostBlackFont'>
            Username
            <input
              type="text"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label className='displayFlex littleTopPadding spaceAround font almostBlackFont'>
            Password
            <input
              type="password"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </label>
          {errors.credential && (
            <p>{errors.credential}</p>
          )}
          <button type="submit">Log In</button>
        </form>
    
    </div>
  );
}

export default LoginFormModal;