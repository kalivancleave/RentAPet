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
          <label className='largeFont displayFlex spaceAround topPadding font almostBlackFont'>
            Username
            <input
              type="text"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
            />
          </label>
          <label className='largeFont displayFlex topPadding spaceAround font almostBlackFont'>
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
          <div className='textCenter littleMoreTopPadding'>
            <button type="submit"
                    className=''>Log In</button>
          </div>
          <div className='textCenter'>
            <button type='submit'
                    className='alternateButton'
                    onClick={() => demoLogin()}>Demo Login</button>
          </div>
        </form>
    
    </div>
  );
}

export default LoginFormModal;