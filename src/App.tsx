import { useCallback, useEffect, useState } from 'react';
import { ArrowRight, Disc3, Maximize2, RotateCcw, Trophy, Sparkles, X } from 'lucide-react';
import { Modal } from './components/Modal';
import { BingoBoard } from './components/BingoBoard';
import { MediaPanel } from './components/MediaPanel';
import { useNumberStore } from './utils/numberGenerator';
import './index.css';
export default function App() {
    const { history, draw, reset, storageError } = useNumberStore();
    const [celebration, setCelebration] = useState<'line' | 'bingo' | null>(null);
    const [confirmReset, setConfirmReset] = useState(false);
    const [notice, setNotice] = useState('');
    const current = history[history.length - 1] ?? null;
    const next = useCallback(() => { if (!celebration && !confirmReset)
        draw(); }, [celebration, confirmReset, draw]);
    const celebrate = useCallback((kind: 'line' | 'bingo') => { if (history.length)
        setCelebration(previous => previous === kind ? null : kind); }, [history.length]);
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.repeat || event.ctrlKey || event.metaKey || event.altKey || (event.target instanceof HTMLElement && event.target.closest('button, input, select, textarea, audio, [contenteditable="true"]')))
                return;
            if (event.key === 'Escape') {
                setCelebration(null);
                setConfirmReset(false);
            }
            if (confirmReset)
                return;
            if (event.key === 'Enter') {
                event.preventDefault();
                next();
            }
            if (event.key.toLowerCase() === 'l')
                celebrate('line');
            if (event.key.toLowerCase() === 'q')
                celebrate('bingo');
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [next, celebrate, confirmReset]);
    const fullscreen = async () => {
        try {
            if (document.fullscreenElement)
                await document.exitFullscreen();
            else
                await document.documentElement.requestFullscreen();
        }
        catch {
            setNotice('La pantalla completa no está disponible en este navegador.');
        }
    };
    return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="./" aria-label="Ochentera, inicio"><span className="brand-icon"><Disc3 /></span><span>ochentera<span className="brand-dot">.</span><small>BINGO MUSICAL</small></span></a>
      <div className="header-actions"><span className="session-pill"><i />{history.length === 90 ? 'Partida completa' : 'Todo listo para jugar'}</span><button className="icon-button" onClick={fullscreen} aria-label="Alternar pantalla completa"><Maximize2 size={18}/></button></div>
    </header>
    <main>
      <div className="page-heading"><div><p className="eyebrow">LOS TEMAZOS DE SIEMPRE</p><h1>La música pone el número.</h1><p>Escucha, encuentra y canta. Que empiece la fiesta.</p></div><button className="text-button" onClick={() => setConfirmReset(true)} disabled={!history.length}><RotateCcw size={16}/>Nueva partida</button></div>
      {(notice || storageError) && <p role="status" className="notice">{notice || 'No se puede guardar en este navegador. La partida seguirá funcionando hasta cerrar la página.'}</p>}
      <div className="game-layout">
        <section className="play-column" aria-label="Sorteo y música">
          <div className="draw-card"><div className="card-top"><span className="eyebrow">NÚMERO ACTUAL</span><span className="live-dot">{history.length ? 'EN JUEGO' : 'A TU RITMO'}</span></div><div className="draw-number" key={current} aria-live="polite">{current === null ? '—' : String(current).padStart(2, '0')}</div><p>{history.length === 90 ? '¡Han salido todos los números!' : current ? 'Un número, un temazo.' : 'Tu próximo temazo está a un clic.'}</p><button className="primary-button" onClick={next} disabled={!!celebration || history.length === 90}>{history.length === 90 ? 'Sorteo completado' : history.length ? 'Siguiente número' : 'Empezar partida'}<ArrowRight size={19}/></button><span className="keyboard-hint">También puedes pulsar <kbd>Enter</kbd></span></div>
          <MediaPanel currentNumber={current} paused={!!celebration}/>
        </section>
        <section className="board-card" aria-labelledby="board-heading"><div className="board-heading"><div><p className="eyebrow">SIGUE LA PARTIDA</p><h2 id="board-heading">El tablero</h2></div><div className="count"><strong>{history.length}</strong><span> / 90</span></div></div><progress value={history.length} max={90} aria-label="Números sorteados"/><BingoBoard markedNumbers={history}/><div className="board-legend"><span><i className="legend-current"/>Actual</span><span><i className="legend-marked"/>Ha salido</span><span>{90 - history.length} pendientes</span></div><div className="history"><span className="eyebrow">ÚLTIMOS NÚMEROS</span><div>{history.length > 1 ? history.slice(0, -1).slice(-6).reverse().map(n => <span className="history-number" key={n}>{String(n).padStart(2, '0')}</span>) : <p>Aquí aparecerán los números anteriores.</p>}</div></div></section>
      </div>
      <section className="celebration-bar"><div><Sparkles size={21}/><span><strong>¿Hay premio en la sala?</strong><small>Pausa la música y celebra el momento.</small></span></div><div><button className="secondary-button" disabled={!history.length} onClick={() => celebrate('line')}>¡Línea!<kbd>L</kbd></button><button className="bingo-button" disabled={!history.length} onClick={() => celebrate('bingo')}><Trophy size={17}/>¡Bingo!<kbd>Q</kbd></button></div></section>
    </main>
    <footer><span>90 números. Muchísimos recuerdos.</span><span>Hecho para cantar juntos.</span></footer>
    {celebration && <Modal label="celebration-title" onClose={() => setCelebration(null)}><Trophy className="trophy" size={48}/><p className="eyebrow">QUE SUENE EL APLAUSO</p><h2 id="celebration-title">{celebration === 'line' ? '¡Línea cantada!' : '¡Han cantado bingo!'}</h2><p>La partida está en pausa. Comprueba el cartón antes de continuar.</p><button autoFocus className="primary-button" onClick={() => setCelebration(null)}>Continuar partida<ArrowRight size={18}/></button></Modal>}
    {confirmReset && <Modal label="reset-title" onClose={() => setConfirmReset(false)}><button className="dialog-close icon-button" aria-label="Cerrar" onClick={() => setConfirmReset(false)}><X size={18}/></button><h2 id="reset-title">¿Empezamos de nuevo?</h2><p>Se borrarán los {history.length} números sorteados de esta partida.</p><div className="dialog-actions"><button autoFocus className="secondary-button" onClick={() => setConfirmReset(false)}>Volver a la partida</button><button className="primary-button" onClick={() => { reset(); setCelebration(null); setConfirmReset(false); }}>Nueva partida</button></div></Modal>}
  </div>;
}
