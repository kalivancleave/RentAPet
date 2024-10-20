import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RentAPetLogo from '../../../../static/rentAPetLogoDark.png';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';
import OpenModalButton from '../OpenModalButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ?
    (
      <>
        <ProfileButton user={sessionUser} />
        <NavLink to='/reservations'>My Reservations</NavLink>
      </>
    ):(
      <>
        <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />

        <OpenModalButton
          buttonText="Register"
          modalComponent={<SignupFormModal />}
        />
      
      </>
    );

  return (
    <>
      <ul className='leftPadding rightPadding dropShadow alignCenter removeDecorations displayFlex spaceBetween navBar noMargin noPadding offWhite'>
        <li className='' >
          <NavLink to="/">
            <img className='logo' src={RentAPetLogo} />
          </NavLink>
        </li>
        <li className=''>
          {isLoaded && sessionLinks}
        </li>
      </ul>
    </>
  );
}

export default Navigation;