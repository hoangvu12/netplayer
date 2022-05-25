import load from 'load-script';

type AllowedAttributes = 'type' | 'charset' | 'async' | 'text';

type Options = Partial<Pick<HTMLScriptElement, AllowedAttributes>> & {
  attrs?: Record<string, string>;
};

const loadedScripts: Record<string, HTMLScriptElement> = {};

const getDefinedScript = (variableName: string) => {
  // @ts-ignore
  if (window[variableName]) {
    // @ts-ignore
    return window[variableName];
  }

  if (window.exports && window.exports[variableName]) {
    return window.exports[variableName];
  }

  if (
    window.module &&
    window.module.exports &&
    window.module.exports[variableName]
  ) {
    return window.module.exports[variableName];
  }

  return null;
};

function loadScript<T>(
  src: HTMLScriptElement['src'],
  variableName: string,
  options: Options = {}
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (loadedScripts[variableName]) {
      resolve(getDefinedScript(variableName));

      return;
    }

    load(src, options, (err, script) => {
      if (err) return reject(err);

      loadedScripts[variableName] = script;

      resolve(getDefinedScript(variableName));
    });
  });
}

export default loadScript;
