import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import "./Calendar.css"

function Calendar() {
  let date = new Date();

  //last day of the month
  const lastDay = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDate();

  //last day of the prev month
  const prevLastDay = new Date(
    date.getFullYear(),
    date.getMonth(),
    0
  ).getDate();

  //sets the day of the week for the first day of the month (0=sun, 1=mon, etc.)
  const firstDayIndex = date.getDay();

  //gets the day of the week for the last day of the month (0=sun, etc.)
  const lastDayIndex = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    0
  ).getDay();

  //how many days into the next month to complete the week
  const nextDays = 7 - lastDayIndex - 1;

  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  let days = [];
    //last few days of prevous month
    for (let x = firstDayIndex; x > 0; x--) {
        days.push(<div className='prev-date'>{prevLastDay - x + 1}</div>);
    }

    //current month
    for (let i = 1; i <= lastDay; i++) {
      if (
        i === new Date().getDate() &&
        date.getMonth() === new Date().getMonth()
      ) {
        days.push(<div className='today'>{i}</div>);
      } else {
        days.push(<div>{i}</div>);
      }
    }

    for (let j = 1; j <= nextDays; j++) {
      days.push(<div className='next-date'>{j}</div>);
    }

    const backArrow = () => {
      date.setMonth(date.getMonth() - 1);
      Calendar()
      {console.log(date)}
    };

    const forwardArrow = () => {
      date.setMonth(date.getMonth() + 1);
      Calendar()
      {console.log(date)}
    };

  return (
    <>
      <div id="calendar">
        <div id="calendar-header">
          <span id="month-prev" className="change-month" onClick={backArrow}><IoIosArrowBack /></span>
          <h1 id="month">{`${months[date.getMonth()]} ${date.getFullYear()}`}</h1>
          <span id="month-next" className="change-month" onClick={forwardArrow}><IoIosArrowForward /></span>
        </div>
      
        <div id="calendar-body">{days.map((day, index) => (
          <div key={index} className="">
            <div className={day.props?.className}>{day.props?.children}</div>
          </div>
        ))}</div>
      </div>
      
    </>
  )
}

export default Calendar;