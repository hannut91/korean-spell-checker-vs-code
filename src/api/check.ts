import axios from 'axios';

const MAX_TEXT_COUNT = 500;

const URL = 'http://164.125.7.61/speller/results';

const regex = new RegExp('data = (.+);');

interface Response {
  str: string;
  errInfo: Correction[];
}

interface Correction {
  help: string;
  errorIdx: number;
  correctMethod: number;
  start: number;
  end: number;
  errMsg: string;
  orgStr: string;
  candWord: string;
}

export const check = async (text: string): Promise<Response> => {
  const input = text.slice(0, MAX_TEXT_COUNT).replace(/\n/g, '\r');
  const { data } = await axios.request({
    method: 'post',
    url: URL,
    data: `text1=${encodeURIComponent(input)}`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  try {
    const [, jsonString] = data.match(regex);
    return JSON.parse(jsonString)[0];
  } catch {
    throw new Error('맞춤법과 문법 오류를 찾지 못했습니다.');
  }
};
