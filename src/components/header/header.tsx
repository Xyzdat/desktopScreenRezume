import styles from './header.module.scss'


type HeaderProps = {
  onItemClick: (id: string) => void;
};

const items = [
    { id: "experience", title: "Опыт работы" },
    { id: "projects", title: "Пет проекты" },
    { id: "education", title: "Образование" },
    { id: "skills", title: "Технический стэк" },
    { id: "contacts", title: "Контакты" },
]


const Header = ({onItemClick}: HeaderProps) => {
    return (
        <div className={styles.header}>
            {items.map((item) => (
                <button className={styles.header__item} key={item.id} onClick={() => onItemClick(item.id)}>{item.title}</button>
            )) }
        </div>
    )
}

export default Header;