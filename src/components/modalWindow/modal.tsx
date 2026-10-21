import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styles from './modal.module.scss';

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  animationOrigin?: { x: number; y: number } | null;
}

const ANIMATION_DURATION = 260;

const Modal = ({ isOpen, title, onClose, children, animationOrigin }: ModalProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const modalRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | null>(null);

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
    if (!isOpen || !isRendered) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isRendered, handleClose]);

  if (!isRendered) return null;

  return (
    <div className={`${styles.modal_overlay} ${isClosing ? styles.modal_overlay_closing : ''}`} onClick={handleClose}>
      <section
        ref={modalRef}
        className={`${styles.modal} ${isMaximized ? styles.modal_maximized : ''} ${isMinimized ? styles.modal_minimized : ''} ${isClosing ? styles.modal_closing : styles.modal_enter}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(event) => event.stopPropagation()}
      >
        <header className={styles.modal__header}>
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
