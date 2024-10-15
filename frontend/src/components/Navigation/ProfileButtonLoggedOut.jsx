import { useState, useEffect, useRef } from 'react';
import { FaUserAstronaut } from "react-icons/fa";

import OpenModalButton from '../OpenModalButton';
import LoginFormModal from '../LoginFormModal/LoginFormModal';
import SignupFormModal from '../SignupFormModal/SignupFormModal';

function ProfileButtonLoggedOut() {
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const toggleMenu = (e) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  }

  useEffect(() => {
    if(!showMenu) return;

    const closeMenu = (e) => {
      if(ulRef.current && !ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener('click', closeMenu);
  }, [showMenu]);

  const ulClassName = "profileMenu" + (showMenu ? "" : "Hidden");

  return(
    <>
      <button onClick={toggleMenu}>
        <FaUserAstronaut icon={FaUserAstronaut} />
      </button>
      <ul className={ulClassName} ref={ulRef}>
        <div>
          <li>
            <OpenModalButton 
              buttonText="Log In"
              modalComponent={<LoginFormModal />}
            />
          </li>
          <li>
            <OpenModalButton
              buttonText="Sign Up"
              modalComponent={<SignupFormModal />}
            />
          </li>
        </div>
      </ul>
    </>
  )
}

export default ProfileButtonLoggedOut;