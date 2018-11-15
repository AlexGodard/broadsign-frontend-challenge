// Credit David Walsh (https://davidwalsh.name/javascript-debounce-function)

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
export const debounce = (func, wait, immediate) => {
  var timeout;

  return function executedFunction() {
    var context = this;
    var args = arguments;

    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };

    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

// Credit Jhey Tompkins (https://codeburst.io/throttling-and-debouncing-in-javascript-b01cad5c8edf)
export const throttle = (func, limit) => {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit)
    }
  }
};

export const chunk = (arr, size) =>
  arr.reduce((carry, item, i) => {
    const chunk = Math.floor(i / size);
    carry[chunk] = [].concat((carry[chunk] || []), item);
    return carry;
  }, []);

// Credit Jason Jarrett (https://staxmanade.com/2016/07/easily-simulate-slow-async-calls-using-javascript-async-await/)
export const stall = async (stallTime = 500) => {
  await new Promise(resolve => setTimeout(resolve, stallTime));
};

export const handleErrors = res => {
  if (!res.ok) {
    return Promise.reject((res.statusText || `You have been rate limited. There is a limit of 50 reqs/hour. Please try again later. (Error code ${res.status})`));
  }
  return res.json();
};
