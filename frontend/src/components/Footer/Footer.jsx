import Logo from '../../../../static/rentAPetLogoDark.png';

function Footer() {
  return(
    <div className='rightPageBorder leftPageBorder topMargin littleMoreBottomPadding displayFlex spaceBetween alignCenter'>
      <p className='font mediumFont almostBlackFont'>©2024 Rent A Pet. All rights reserved.</p>
      <img className='smallLogo' src={Logo}/>
      <a 
        href='https://github.com/kalivancleave/RentAPet'
        className='noDecoration font mediumFont almostBlackFont'>
          GitHub
      </a>
    </div>
  )
}

export default Footer;