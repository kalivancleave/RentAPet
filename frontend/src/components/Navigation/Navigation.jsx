import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RentAPetLogo from '../../../../static/rentAPetLogoDark.png';
import ProfileButton from './ProfileButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import OpenModalButton from '../OpenModalButton';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ?
    (
      <li className=''>
        <ProfileButton user={sessionUser} />
      </li>
    ):(
      <OpenModalButton
          buttonText="Log In"
          modalComponent={<LoginFormModal />}
        />
    );

  return (
    <>
      <ul className='dropShadow alignTop removeDecorations displayFlex spaceBetween navBar noMargin noPadding offWhite'>
        <li className='' >
          <NavLink to="/">
            <a href=''>
              <img className='logo' src={RentAPetLogo} />
            </a>
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