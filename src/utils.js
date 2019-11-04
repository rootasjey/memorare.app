export const status = {
  completed : 'completed',
  error     : 'error',
  idle      : 'idle',
  loading   : 'loading',
}

export const onEnterNextInput = (event, domElement) => {
  const { target } = event;
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
