export const sec2time = (seconds: number) => {
  const sec = Math.floor(seconds % 60);
  const min = Math.floor(seconds / 60);
  return `${min < 10 ? "0" : ""}${min}:${sec < 10 ? "0" : ""}${sec}`;
};
