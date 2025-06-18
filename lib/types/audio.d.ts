type AudioSingle = {
  url: string;
  name: string;
  artist?: string;
  album?: string;
  cover?: string;
};

type AudioBuffered = {
  start: number;
  end: number;
};
