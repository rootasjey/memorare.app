export const status = {
  completed : 'completed',
  error     : 'error',
  idle      : 'idle',
  loading   : 'loading',
}

export function disableBodyScroll() {
  const body = document.querySelector('body');
  if (!body) { return; }
  body.style.overflow = 'hidden';
}

export function enableBodyScroll() {
  const body = document.querySelector('body');
  if (!body) { return; }
  body.style.overflow = 'auto';
}

export const onEnterNextInput = (event, domElement) => {
  let { target } = event;

  if (!target) {
    target = event && event.detail ? event.detail.target : target;
  }

  const inputs = domElement.querySelectorAll('input');

  let indexMatch;

  Array
    .from(inputs)
    .some((input, index) => {
      if (input === target) {
        indexMatch = index;
        return true;
      }

      return false;
    });

  if (indexMatch >= inputs.length) { return; }

  const nextInput = inputs[indexMatch + 1];
  if (!nextInput || !nextInput.focus) { return; }

  nextInput.focus();
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
