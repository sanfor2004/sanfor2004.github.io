// The "Your team still does ___ by hand" word: scrambles, then decodes into the next task.
// Stand-in for React Bits Decrypted Text with Sanfor2004 timing; swap in theirs if you prefer.
import { useEffect, useRef, useState } from 'react';

const GLYPHS = 'abcdefghijklmnopqrstuvwxyz#%&*+=<>/';

interface Props {
  words: string[];
  interval?: number;
}

export default function DecryptedWord({ words, interval = 3000 }: Props) {
  const [text, setText] = useState(words[0]);
  const index = useRef(0);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let scramble: number | undefined;
    const cycle = window.setInterval(() => {
      index.current = (index.current + 1) % words.length;
      const target = words[index.current];
      let frame = 0;
      window.clearInterval(scramble);
      scramble = window.setInterval(() => {
        frame += 1;
        const revealed = Math.floor(frame / 2);
        let out = '';
        for (let i = 0; i < target.length; i += 1) {
          if (target[i] === ' ') out += ' ';
          else out += i < revealed ? target[i] : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        setText(out);
        if (revealed >= target.length) window.clearInterval(scramble);
      }, 35);
    }, interval);
    return () => {
      window.clearInterval(cycle);
      window.clearInterval(scramble);
    };
  }, [words, interval]);

  return (
    <span className="decrypted">
      {/* Screen readers get the full list once, not a stream of random letters. */}
      <span className="sr-only">{words.join(', ')}</span>
      <span aria-hidden="true" className="font-body font-medium text-primary-text">{text}</span>
      <span aria-hidden="true" className="caret" />
    </span>
  );
}
