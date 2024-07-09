import Notiflix, { Notify } from 'notiflix/build/notiflix-notify-aio';

const formEl = document.querySelector('.form');
let delayId = null;
let stepId = null;
let amountId = null;

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

const submitHandler = e => {
  e.preventDefault();
  if (!e.target.tagName === 'BUTTON') return;

  const {
    elements: { delay, step, amount },
  } = e.currentTarget;

  delayId = Number(delay.value);
  stepId = Number(step.value);
  amountId = Number(amount.value);

  for (let i = 1; i <= amountId; i++) {
    createPromise(i, delayId)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });

    delayId += stepId;
  }

  e.currentTarget.reset();
};
formEl.addEventListener('submit', submitHandler);
