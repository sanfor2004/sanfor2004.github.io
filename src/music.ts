export type MusicTrack = {
  title: string;
  artist?: string;
  src: string;
};

export const musicTracks: MusicTrack[] = [
  {
    title: "Étude in A-flat major, Op. 25 No. 1",
    artist: "Frédéric Chopin",
    src: "/audio/chopin-etude-op25-no1.ogg",
  },
  {
    title: "Polonaise in B-flat major, Op. 71 No. 2",
    artist: "Frédéric Chopin",
    src: "/audio/chopin-polonaise-op71-no2.mp3",
  },
];
