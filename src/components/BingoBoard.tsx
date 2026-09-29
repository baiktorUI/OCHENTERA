import { memo } from 'react';
interface Props {
    markedNumbers: number[];
}
const numbers = Array.from({ length: 90 }, (_, i) => i + 1);
export const BingoBoard = memo(({ markedNumbers }: Props) => {
    const marked = new Set(markedNumbers);
    const current = markedNumbers[markedNumbers.length - 1];
    return <div className="bingo-board" aria-label="Tauler de 90 números">{numbers.map(number => <div key={number} aria-label={`${number}${number === current ? ', actual' : marked.has(number) ? ', ja ha sortit' : ', pendent'}`} className={`bingo-number ${marked.has(number) ? 'marked' : ''} ${number === current ? 'current' : ''}`}>
      {String(number).padStart(2, '0')}
    </div>)}</div>;
});
BingoBoard.displayName = 'BingoBoard';
