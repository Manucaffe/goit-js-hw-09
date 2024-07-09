import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix, { Notify } from 'notiflix';

const dateTimePicker = document.querySelector('#datetime-picker');
const dataStart = document.querySelector('[data-start]');
const dataDays = document.querySelector('[data-days]');
const dataHours = document.querySelector('[data-hours]');
const dataMinutes = document.querySelector('[data-minutes]');
const dataSeconds = document.querySelector('[data-seconds]');

let countDown = null;

dataStart.setAttribute('disabled', true);

function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);
  
    return { days, hours, minutes, seconds };
}

const addZero = value => String(value).padStart(2, '0');

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0] < new Date()) {
            Notify.failure('Please choose a date in the future');
            return;
        }
        dataStart.removeAttribute('disabled');

        const showTimer = () => {
            const now = new Date();
            const selectData = new Date(localStorage.getItem('selectedData'));
            if (!selectData) return;

            const diff = selectData - now;
            const { days, hours, minutes, seconds } = convertMs(diff);
            dataDays.textContent = days;
            dataHours.textContent = addZero(hours);
            dataMinutes.textContent = addZero(minutes);
            dataSeconds.textContent = addZero(seconds);

            if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
                clearInterval(countDown);
            }
        };

        const onClick = () => {
            localStorage.setItem('selectedData', selectedDates[0]);
            if (countDown) {
                clearInterval(countDown);
            }
            showTimer();
            countDown = setInterval(showTimer, 1000);
        };

        dataStart.addEventListener('click', onClick);
    },
};

flatpickr(dateTimePicker, options);
