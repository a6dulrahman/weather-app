// script.js

/**
 * https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/sohag?
  unitGroup=us
  &key=VPRE62UPZSRVV36QCVSGYL37B
  &contentType=json
 */

const form = document.querySelector('form');
const usrLocation = document.querySelector('#location');
let dataObj;

usrLocation.addEventListener('input', (event) => {
  usrLocation.setCustomValidity('');
  usrLocation.style.border = '2px solid black';

  const span = document.querySelector('form div + span');

  if (span) {
    span.remove();
  }
});

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (usrLocation.value.trim() !== '') {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/\
services/timeline/${usrLocation.value}?unitGroup=us&key=VPRE62UPZSR\
VV36QCVSGYL37B&contentType=json`,
    );

    if (!response.ok) {
      const span = document.createElement('span');
      span.textContent = `Location: '${usrLocation.value}' not found!`;
      usrLocation.parentElement.parentElement.after(span);
    } else if (response.status === 429) {
      alert('Rate Limit: pls try again later! 😅');
    } else {
      const data = await response.json();
      dataObj = processWeatherData(data);

      for (const key in dataObj) {
        const div = document.createElement('div');
        div.textContent = `${key}: ${dataObj[key]}`;
        usrLocation.parentElement.parentElement.parentElement.append(div);
      }
    }
  } else {
    usrLocation.setCustomValidity("can't be empty");
    usrLocation.reportValidity();
    usrLocation.style.border = '2px solid red';
  }
});

function processWeatherData(data) {
  return {
    location: data.resolvedAddress,
    temp: data.days[0].temp,
    conditions: data.days[0].conditions,
    icon: data.days[0].icon,
  };
}
