export const classNames = (...args: (string | boolean)[]) => {
  return args.filter(Boolean).join(' ');
};

export function convertTime(seconds: string | number) {
  seconds = seconds.toString();
  let minutes = Math.floor(Number(seconds) / 60).toString();
  let hours = '';

  if (Number(minutes) > 59) {
    hours = Math.floor(Number(minutes) / 60).toString();
    hours = Number(hours) >= 10 ? hours : `0${hours}`;
    minutes = (Number(minutes) - Number(hours) * 60).toString();
    minutes = Number(minutes) >= 10 ? minutes : `0${minutes}`;
  }

  seconds = Math.floor(Number(seconds) % 60).toString();
  seconds = Number(seconds) >= 10 ? seconds : '0' + seconds;

  if (hours) {
    return `${hours}:${minutes}:${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

// parse number from string
export function parseNumberFromString(str: string) {
  return Number(str.replace(/[^0-9]/g, ''));
}

export function isObject<T>(item: T) {
  return item && typeof item === 'object' && !Array.isArray(item);
}

// @ts-ignore
export function mergeDeep(target, ...sources) {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
}

// https://stackoverflow.com/questions/6860853/generate-random-string-for-div-id
export const randomString = (length: number) => {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghiklmnopqrstuvwxyz'.split('');

  if (!length) {
    length = Math.floor(Math.random() * chars.length);
  }

  let str = '';

  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
};

export const stringInterpolate = (str: string, data: Record<string, any>) => {
  Object.entries(data).forEach(([key, value]) => {
    str = str.replace(`{{${key}}}`, value);
  });

  return str;
};

export const isValidUrl = (url: string) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator

  return !!pattern.test(url);
};

export const isInArray = <T>(value: T, array: T[]) => {
  return array.indexOf(value) > -1;
};

export const getHeightAndWidthFromDataUrl = (dataURL: string) =>
  new Promise<{ width: number; height: number }>((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width,
      });
    };
    img.src = dataURL;
  });

export function download(url: string, name: string) {
  const elink = document.createElement('a');
  elink.style.display = 'none';
  elink.href = url;
  elink.download = name;
  document.body.appendChild(elink);
  elink.click();
  document.body.removeChild(elink);
}
