import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './modal.module.scss';

type WindowPosition = { x: number; y: number };

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  onBringToFront?: () => void;
  isActive?: boolean;
  zIndex?: number;
  initialPosition?: WindowPosition;
  children: React.ReactNode;
  animationOrigin?: { x: number; y: number } | null;
}

const ANIMATION_DURATION = 260;
const VIEWPORT_GAP = 24;

const Modal = ({
  isOpen,
  title,
  onClose,
  onBringToFront = () => {},
  isActive = true,
  zIndex = 1000,
  initialPosition,
  children,
  animationOrigin,
}: ModalProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<WindowPosition>(() => initialPosition ?? {
    x: Math.max(VIEWPORT_GAP, (window.innerWidth - 600) / 2),
    y: Math.max(VIEWPORT_GAP, (window.innerHeight - 400) / 2),
  });
  const modalRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);
  const dragState = useRef<{ pointerId: number; offset: WindowPosition } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    }
  }, [isOpen]);

  useEffect(() => () => {
    if (closeTimer.current !== null) window.clearTimeout(closeTimer.current);
  }, []);

  useLayoutEffect(() => {
    if (!isRendered || !modalRef.current || !animationOrigin) return;

    const modalElement = modalRef.current;
    modalElement.style.animation = 'none';
    void modalElement.offsetWidth;
    const rect = modalElement.getBoundingClientRect();
    modalElement.style.setProperty('--origin-x', `${animationOrigin.x - rect.left}px`);
    modalElement.style.setProperty('--origin-y', `${animationOrigin.y - rect.top}px`);
    modalElement.style.animation = '';
    void modalElement.offsetWidth;
  }, [isRendered, animationOrigin]);

  const handleClose = () => {
    if (isClosing) return;
    setIsClosing(true);
    closeTimer.current = window.setTimeout(() => {
      setIsRendered(false);
      setIsClosing(false);
      closeTimer.current = null;
      onClose();
    }, ANIMATION_DURATION);
  };

  useEffect(() => {
    if (!isOpen || !isRendered || !isActive) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') handleClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRendered, isActive]);

  const handleHeaderPointerDown = (event: React.PointerEvent<HTMLElement>) => {
    if (isMaximized || (event.target as HTMLElement).closest('button') || !modalRef.current) return;

    const rect = modalRef.current.getBoundingClientRect();
    dragState.current = {
      pointerId: event.pointerId,
      offset: { x: event.clientX - rect.left, y: event.clientY - rect.top },
    };
    event.currentTarget.setPointerCapture(event.pointerId);
    setIsDragging(true);
  };

  const handleHeaderPointerMove = (event: React.PointerEvent<HTMLElement>) => {
    const drag = dragState.current;
    const modalElement = modalRef.current;
    if (!drag || drag.pointerId !== event.pointerId || !modalElement) return;

    const rect = modalElement.getBoundingClientRect();
    const maxX = Math.max(VIEWPORT_GAP, window.innerWidth - rect.width - VIEWPORT_GAP);
    const maxY = Math.max(VIEWPORT_GAP, window.innerHeight - rect.height - VIEWPORT_GAP);
    setPosition({
      x: Math.max(VIEWPORT_GAP, Math.min(event.clientX - drag.offset.x, maxX)),
      y: Math.max(VIEWPORT_GAP, Math.min(event.clientY - drag.offset.y, maxY)),
    });
  };

  const handleHeaderPointerUp = (event: React.PointerEvent<HTMLElement>) => {
    if (dragState.current?.pointerId !== event.pointerId) return;
    dragState.current = null;
    setIsDragging(false);
  };

  if (!isRendered) return null;

  return (
    <div className={`${styles.modal_overlay} ${isClosing ? styles.modal_overlay_closing : ''}`} style={{ zIndex }}>
      <section
        ref={modalRef}
        className={`${styles.modal} ${isMaximized ? styles.modal_maximized : ''} ${isMinimized ? styles.modal_minimized : ''} ${isDragging ? styles.modal_dragging : ''} ${isClosing ? styles.modal_closing : styles.modal_enter}`}
        style={{ left: position.x, top: position.y }}
        role="dialog"
        aria-label={title}
        onPointerDown={onBringToFront}
      >
        <header
          className={styles.modal__header}
          onPointerDown={handleHeaderPointerDown}
          onPointerMove={handleHeaderPointerMove}
          onPointerUp={handleHeaderPointerUp}
          onPointerCancel={handleHeaderPointerUp}
        >
          <div className={styles.modal__controls} aria-label="Кнопки управления окном">
            <button className={`${styles.modal__control} ${styles.modal__control_close}`} type="button" aria-label="Закрыть окно" title="Закрыть" onClick={handleClose}>
              <span aria-hidden="true">×</span>
            </button>
            <button className={`${styles.modal__control} ${styles.modal__control_minimize}`} type="button" aria-label={isMinimized ? 'Развернуть окно' : 'Свернуть окно'} title={isMinimized ? 'Развернуть' : 'Свернуть'} onClick={() => setIsMinimized((value) => !value)}>
              <span aria-hidden="true">−</span>
            </button>
            <button className={`${styles.modal__control} ${styles.modal__control_maximize}`} type="button" aria-label={isMaximized ? 'Восстановить размер окна' : 'Развернуть на весь экран'} title={isMaximized ? 'Восстановить' : 'Развернуть'} onClick={() => {
              if (isMinimized) setIsMinimized(false);
              setIsMaximized((value) => !value);
            }}>
              <span aria-hidden="true">{isMaximized ? '↙' : '+'}</span>
            </button>
          </div>
          <h2 className={styles.modal__title}>{title}</h2>
        </header>

        <div className={`${styles.modal__content} ${isMinimized ? styles.modal__content_minimized : ''}`}>
          {children}
        </div>
      </section>
    </div>
  );
};

export default Modal;
