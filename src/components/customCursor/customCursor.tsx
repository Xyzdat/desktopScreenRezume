import { useEffect, useRef } from 'react';
import styles from './customCursor.module.scss';

const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    const moveCursor = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') return;

      cursor.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursor.style.setProperty('--cursor-y', `${event.clientY}px`);
      cursor.classList.add(styles.visible);

      const isInteractive = (event.target as HTMLElement).closest(
        'a, button, [role="button"], input, textarea, select'
      );
      cursor.classList.toggle(styles.hovering, Boolean(isInteractive));
    };

    const hideCursor = () => cursor.classList.remove(styles.visible);

    window.addEventListener('pointermove', moveCursor);
    document.addEventListener('pointerleave', hideCursor);

    return () => {
      window.removeEventListener('pointermove', moveCursor);
      document.removeEventListener('pointerleave', hideCursor);
    };
  }, []);

  return (
    <div ref={cursorRef} className={styles.cursor} aria-hidden="true">
      <span className={styles.cursor__dot} />
      <span className={styles.cursor__ring} />
    </div>
  );
};

export default CustomCursor;
