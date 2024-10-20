import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { FaUserCircle } from 'react-icons/fa';
import * as sessionActions from '../../store/session';
import { NavLink, useNavigate } from 'react-router-dom';

import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal';
import SignupFormModal from '../SignupFormModal';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation(); // Keep from bubbling up to document and triggering closeMenu
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout())
      .then(() => navigate('/'))
    closeMenu();
  };

  function sendAlert() {
    alert("Feature coming soon!")
  }

  return (
    <>
      <div className='userIconFont noPadding rightPageBorder noBackground noBorder darkGreenFont' onClick={toggleMenu}>
        <FaUserCircle />
      </div>
      {showMenu && (
        <ul className='profile-dropdown removeDecorations lotsOfRightPadding dropShadow offWhite' ref={ulRef}>
          {user ? (
            <div className='displayFlex flexColumn alignCenter'>
              <p className='largeFont displayFlex font almostBlackFont'>Hello, {user.firstName}</p>

              <p className='subtleButton' onClick={sendAlert}>
                My Pets
              </p>

              <NavLink 
                className="noDecoration subtleButton"
                to='/reservations'>
                  My Reservations
              </NavLink>

              <p className='subtleButton' onClick={sendAlert}>
                My Reviews
              </p>
              
              <div className='bottomMargin'>
                <button onClick={logout}>Log Out</button>
              </div>
            </div>
          ) : (
            <>
              <OpenModalButton
                buttonText="Log In"
                onButtonClick={closeMenu}
                modalComponent={<LoginFormModal />}
              />
            
              <OpenModalButton
                buttonText="Sign Up"
                onButtonClick={closeMenu}
                modalComponent={<SignupFormModal />}
              /> 
            </>
          )}
        </ul>
      )}
    </>
  );
}

export default ProfileButton;