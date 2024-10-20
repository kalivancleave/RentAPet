import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import * as sessionActions from '../../store/session';
import Logo from '../../../../static/rentAPetLogoDark.png';

import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SubtleOpenModalButton from '../OpenModalButton/SubtleOpenModalButton';

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data?.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <div className='displayFlex flexColumn alignCenter'>
      <img className='smallLogo' src={Logo} />
      <p className='header xx-largeFont noMargin almostBlackFont'>Sign Up</p>

        <form className='displayFlex flexColumn littleMoreTopPadding' onSubmit={handleSubmit}>

        <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
          <label className='largeFont displayFlex font almostBlackFont'>
              Email
            </label>

            <input
              type="text"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            {errors.email && <p>{errors.email}</p>}
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Username
            </label>

            <input
              type="text"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            {errors.username && <p>{errors.username}</p>}
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              First Name
            </label>

            <input
              type="text"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            {errors.firstName && <p>{errors.firstName}</p>}
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Last Name
            </label>

            <input
              type="text"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            {errors.lastName && <p>{errors.lastName}</p>}
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
            
            {errors.password && <p>{errors.password}</p>}
          </div>

          <div className='displayFlex alignCenter topPadding fullWidth spaceBetween'>
            <label className='largeFont displayFlex font almostBlackFont'>
              Confirm Password
            </label>

            <input
              type="password"
              className='noBorder dropShadow logInInputSize littleMoreLeftMargin'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {errors.confirmPassword && <p>{errors.confirmPassword}</p>}
          </div>

          <div className='textCenter littleMoreTopPadding'>
            <button type="submit">Sign Up</button>
          </div>
          <div className='moreTopPadding '>
            <SubtleOpenModalButton
            buttonText="Already have an account? Log In"
            modalComponent={<LoginFormModal />}
            />
          </div> 
        </form>
    </div>
  );
}

export default SignupFormModal;