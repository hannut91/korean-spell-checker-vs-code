import axios from 'axios';

const URL = 'https://m.search.naver.com/p/csearch/ocontent/util/' +
  'SpellerProxy?color_blindness=0&q=';
const MAX_TEXT_COUNT = 500;

export const SpellCheck = async (text: string): Promise<any> => {
  const { data } = await axios.get(
    URL + encodeURIComponent(text.slice(0, MAX_TEXT_COUNT))
  );
  return data.message.result;
};
