import { check } from '../api/check';

export const SpellCheck = async (text: string): Promise<any> => {
  const { str, errInfo } = await check(text);

  let index = 0;
  return errInfo.reduce((acc: string, { start, end, candWord }) => {
    const left = acc.slice(0, start + index);
    const right = acc.slice(end + index);
    const middle = `<span class="green_text">${candWord}</span>`;
    index += middle.length - (end - start);
    return left + middle + right;
  }, str);
};

export const fix = async (text: string): Promise<any> => {
  const { str, errInfo } = await check(text);

  let index = 0;
  return errInfo.reduce((acc: string, { start, end, candWord }) => {
    const left = acc.slice(0, start + index);
    const right = acc.slice(end + index);
    const [middle] = candWord.split('|');
    index += middle.length - (end - start);
    return left + middle + right;
  }, str);
};
