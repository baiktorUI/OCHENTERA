import { useCallback, useEffect, useState } from 'react';
import { Maximize2, RotateCcw, Trophy, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Modal } from './components/Modal';
import { BingoBoard } from './components/BingoBoard';
import { MediaPanel } from './components/MediaPanel';
import { useNumberStore } from './utils/numberGenerator';
import './index.css';
export default function App() {
    const { history, draw, reset, storageError } = useNumberStore();
    const [celebration, setCelebration] = useState<'line' | 'quina' | null>(null);
    const [spotlight, setSpotlight] = useState(false);
    const [confirmReset, setConfirmReset] = useState(false);
    const [notice, setNotice] = useState('');
    const current = history[history.length - 1] ?? null;
    const fullscreen = useCallback(async () => {
        try {
            if (document.fullscreenElement)
                await document.exitFullscreen();
            else
                await document.documentElement.requestFullscreen();
        }
        catch {
            setNotice('Aquest navegador no permet la pantalla completa.');
        }
    }, []);
    useEffect(() => {
        const onKey = (event: KeyboardEvent) => {
            if (event.repeat || event.ctrlKey || event.metaKey || event.altKey)
                return;
            if (event.key === 'Escape') {
                if (spotlight) setSpotlight(false);
                else setCelebration(null);
                setConfirmReset(false);
                return;
            }
            if (confirmReset)
                return;
            const key = event.key.toLowerCase();
            if (celebration) {
                if (key === 'l' || key === 'q') {
                    if (spotlight) setSpotlight(false);
                    else setCelebration(null);
                }
                return;
            }
            if (event.target instanceof HTMLElement && event.target.closest('input, select, textarea, [contenteditable="true"]'))
                return;
            if (key === 'enter') {
                // Enter belongs to the draw; dialog buttons keep their native activation.
                event.preventDefault();
                draw();
            }
            if (key === 'l' && history.length)
                setCelebration('line');
            if (key === 'q' && history.length)
                setCelebration('quina');
            if (key === 'f') {
                event.preventDefault();
                void fullscreen();
            }
            if (key === 'n' && history.length)
                setConfirmReset(true);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [draw, celebration, spotlight, confirmReset, history.length, fullscreen]);
    useEffect(() => {
        if (!celebration) { setSpotlight(false); return; }
        setSpotlight(true);
        const timer = window.setTimeout(() => setSpotlight(false), 4000);
        return () => window.clearTimeout(timer);
    }, [celebration]);
    useEffect(() => {
        if (!celebration || !spotlight || window.matchMedia('(prefers-reduced-motion: reduce)').matches)
            return;
        const canvas = document.querySelector<HTMLCanvasElement>('.prize-confetti');
        if (!canvas)
            return;
        const burst = confetti.create(canvas, { resize: true });
        const fire = () => {
            void burst({ particleCount: celebration === 'quina' ? 110 : 65, spread: 100, origin: { x: .2, y: .65 }, colors: ['#f4551d', '#e9e2d3', '#37372f', '#c1b69b'], disableForReducedMotion: true });
            void burst({ particleCount: celebration === 'quina' ? 110 : 65, spread: 100, origin: { x: .8, y: .65 }, colors: ['#f4551d', '#e9e2d3', '#37372f', '#c1b69b'], disableForReducedMotion: true });
        };
        fire();
        const timer = window.setTimeout(fire, 850);
        return () => { window.clearTimeout(timer); burst.reset(); };
    }, [celebration, spotlight]);
    return <div className="app-shell">
    <header className={`topbar ${celebration ? "has-prize" : ""}`}>
      {celebration ? <section className={`prize-banner ${celebration}`} aria-labelledby="celebration-title"><Trophy className="banner-trophy" /><h2 id="celebration-title" role="status">{celebration === 'line' ? 'LÍNIA!' : 'QUINA!'}</h2><span className="banner-help">COMPROVANT EL CARTRÓ<small>Partida en pausa · Reviseu els números del tauler.</small></span><button className="primary-button" onClick={() => setCelebration(null)}>Tornem-hi!<kbd>Esc</kbd></button></section> : <>
      <div className="header-title"><span>LA QUINA QUE ES CANTA</span><h1>Ochentera<span>.</span></h1></div>
      <div className="header-actions"><span className="session-pill"><i />{history.length === 90 ? 'PARTIDA COMPLETA' : 'QUINA MUSICAL'}</span><button className="icon-button" onClick={fullscreen} aria-label="Pantalla completa"><Maximize2 /></button><button className="icon-button" onClick={() => setConfirmReset(true)} disabled={!history.length} aria-label="Nova partida"><RotateCcw /></button></div>
      </>}
    </header>
    <main className={`game-layout ${celebration ? "checking-card" : ""}`}>
      <section className="play-column" aria-label="Número i música">
        <section className="draw-card" aria-label="Número actual"><span className="panel-label">ARA SONA EL NÚMERO</span><div className="draw-number" key={current} aria-live="polite">{current === null ? '—' : String(current).padStart(2, '0')}</div><span className="draw-caption">{history.length === 90 ? 'JA HAN SORTIT TOTS!' : current ? 'ESCOLTA. MARCA. CANTA.' : 'PREM ENTER I QUE COMENCI LA FESTA.'}</span><Zap className="draw-zap" aria-hidden="true"/></section>
        <MediaPanel currentNumber={current} paused={!!celebration || confirmReset}/>
      </section>
      <section className="board-column" aria-label="Seguiment de la partida">
        <section className="history" aria-label="Últims números"><div className="history-title"><span className="panel-label">ÚLTIMS NÚMEROS</span><span>DEL MÉS RECENT A L’ANTERIOR</span></div><div className="history-list">{Array.from({ length: 5 }, (_, i) => <span className="history-number" key={i}>{history[history.length - 2 - i] === undefined ? '—' : String(history[history.length - 2 - i]).padStart(2, '0')}</span>)}</div></section>
        <section className="board-card" aria-labelledby="board-heading"><div className="board-heading"><h2 id="board-heading">El tauler<span> / </span><small>{90 - history.length} pendents</small></h2><span className="count"><strong>{history.length}</strong> / 90</span></div><BingoBoard markedNumbers={history}/><div className="board-legend"><span><i className="legend-current"/>Actual</span><span><i className="legend-marked"/>Ja ha sortit</span><span>90 NÚMEROS · UNA FESTA</span></div></section>
      </section>
    </main>
    <footer className="shortcut-bar" aria-label="Dreceres de teclat"><span className="shortcut-label">TU PORTES<br />EL RITME</span><span><kbd>Enter</kbd>Següent número</span><span><kbd>L</kbd>Línia</span><span><kbd>Q</kbd>Quina</span><span><kbd>P</kbd>Reproduir / Pausa</span><span><kbd>F</kbd>Pantalla completa</span><span><kbd>N</kbd>Nova partida</span><span><kbd>Esc</kbd>Tancar premi</span></footer>
    {(notice || storageError) && <div className="notice" role="status">{notice || 'No es pot desar la partida. Mantén aquesta pàgina oberta.'}<button onClick={() => setNotice('')} aria-label="Tancar avís">×</button></div>}
    {celebration && spotlight && <Modal label="spotlight-title" className={`prize-dialog ${celebration}`} onClose={() => setSpotlight(false)}><canvas className="prize-confetti" aria-hidden="true" /><div className="prize-content"><span className="prize-kicker"><Zap />QUE SE SENTI A TOTA LA SALA<Zap /></span><Trophy className="prize-trophy" /><p className="prize-intro">HAN CANTAT</p><h2 id="spotlight-title">{celebration === 'line' ? 'LÍNIA!' : 'QUINA!'}</h2><p className="prize-tagline">UN APLAUDIMENT PER AQUEST CARTRÓ!</p><p className="prize-help">En 4 segons tornem al tauler per comprovar els números.</p><button autoFocus className="primary-button" onClick={() => setSpotlight(false)}>Veure els números<kbd>Esc</kbd></button></div></Modal>}
    {confirmReset && <Modal label="reset-title" onClose={() => setConfirmReset(false)}><h2 id="reset-title">TORNEM A COMENÇAR?</h2><p>S’esborraran els {history.length} números d’aquesta partida.</p><div className="dialog-actions"><button autoFocus className="secondary-button" onClick={() => setConfirmReset(false)}>Continuar la partida</button><button className="primary-button" onClick={() => { reset(); setConfirmReset(false); }}>Nova partida</button></div></Modal>}
  </div>;
}
