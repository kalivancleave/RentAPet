import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import RentAPetLogo from '../../../../static/rentAPetLogoDark.png';
import ProfileButton from './ProfileButton';
import ProfileButtonLoggedOut from './ProfileButtonLoggedOut';
import './Navigation.css';

function Navigation({ isLoaded }) {
  const sessionUser = useSelector(state => state.session.user);

  const sessionLinks = sessionUser ?
    (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    ):(
      <li>
        <ProfileButtonLoggedOut />
      </li>
    );

  return (
    <>
      <div>
        <li>
          <NavLink to="/">
            <a href=''>
              <img src={RentAPetLogo} />
            </a>
          </NavLink>
        </li>
        <li>
          {isLoaded && sessionLinks}
        </li>
      </div>
    </>
  );
}

export default Navigation;