import styles from './header.module.scss'
import type { HeaderItemId } from '../../App.tsx';
import { useEffect, useState, useRef, type HtmlHTMLAttributes } from 'react';


type HeaderProps = {
  onItemClick: (id: HeaderItemId) => void;
};

const items: {id: HeaderItemId, title: string}[] = [
    { id: 'experience', title: "Опыт работы" },
    { id: 'projects', title: "Пет проекты" },
    { id: 'education', title: "Образование" },
    { id: 'skills', title: "Технический стэк" },
    { id: 'contacts', title: "Контакты" },
]


const Header = ({onItemClick}: HeaderProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const closeMenu = () => setIsMenuOpen(false);

    const menuRef = useRef<HTMLDivElement>(null);

    const handleItemClick = (id: HeaderItemId) => {
        onItemClick(id);
        closeMenu();
    }

    useEffect(() => {
        const handleClose = (event: PointerEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        }

         window.addEventListener('pointerdown', handleClose);

            return () => {
                window.removeEventListener('pointerdown', handleClose);
            };
    }, [])

    return (
        <div className={styles.header}>

            
            <div className={styles.header__desktop}>
                {items.map((item) => (
                    <button className={styles.header__item} key={item.id} onClick={() => onItemClick(item.id)}>{item.title}</button>
                )) }
            </div>

            <div className={styles.header__mobile}>
                

                <a href="/" className={styles.header__logo} onClick={closeMenu}> Artem.me </a>


                <div className={styles.header__left}>
                    <button
                        type="button"
                        className={`${styles.header__burger} ${
                        isMenuOpen ? styles['header__burger--open'] : ''
                        }`}
                        aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                        aria-expanded={isMenuOpen}
                        aria-controls="header-dropdown"
                        onClick={() => setIsMenuOpen((prev) => !prev)}
                    >
                        <span />
                        <span />
                        <span />
                    </button>
                
                        <>
                        <nav
                            ref = {menuRef}
                            id="header-dropdown"
                            className={`${styles.header__dropdown} ${
                                isMenuOpen ? styles['header__dropdown--open'] : ''
                            }`}
                            aria-label="Навигация по странице"
                        >
                            {items.map((item) => (
                            <button
                                type="button"
                                className={styles.header__item}
                                key={item.id}
                                onClick={() => handleItemClick(item.id)}
                            >
                                {item.title}
                            </button>
                            ))}
                        </nav>
                        </>
                   
                    
                </div>
            </div>            
        
        </div>
    )
}

export default Header;