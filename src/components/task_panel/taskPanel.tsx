import { useState, type FC } from 'react'
import { personalInfo } from '../../data/resume'
import Modal from '../modalWindow/modal'
import styles from './taskPanel.module.scss'
import {Phone} from "lucide-react"

const TaskPanel: FC = () => {
    const [notesOpen, setNotesOpen] = useState(false)
    const [notes, setNotes] = useState(() => localStorage.getItem('portfolio_notes') ?? '')

    const updateNotes = (value: string) => {
        setNotes(value)
        localStorage.setItem('portfolio_notes', value)
    }

    return (
        <>
            <nav className={styles.taskbar} aria-label="Панель задач">
                <a
                    className={styles.taskbar__item}
                    href={`https://${personalInfo.contacts.github}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="GitHub"
                    title="GitHub"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.56.1.76-.24.76-.54v-2.1c-3.1.67-3.76-1.32-3.76-1.32-.5-1.28-1.23-1.62-1.23-1.62-1.01-.69.08-.68.08-.68 1.12.08 1.7 1.15 1.7 1.15 1 1.7 2.62 1.2 3.26.92.1-.72.4-1.2.71-1.48-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.15-3-.12-.28-.5-1.42.11-2.96 0 0 .94-.3 3.05 1.15A10.6 10.6 0 0 1 12 6.16c.95 0 1.9.13 2.8.38 2.12-1.45 3.05-1.15 3.05-1.15.61 1.54.23 2.68.12 2.96.71.78 1.14 1.78 1.14 3 0 4.3-2.61 5.23-5.1 5.5.4.35.76 1.03.76 2.08v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg>
                </a>
                <a
                    className={styles.taskbar__item}
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r=".7" fill="currentColor" stroke="none" /></svg>
                </a>
                <button
                    className={styles.taskbar__item}
                    type="button"
                    onClick={() => setNotesOpen(true)}
                    aria-label="Открыть заметки"
                    title="Заметки"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h8l6-6V4a2 2 0 0 0-2-2z" /><path d="M14 2v6h6M8 13h8M8 17h4" /></svg>
                </button>
                <a className={styles.taskbar__item}
                    href="+7 (915) 293 29 30"
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Телефон"
                    title="Телефон"
                >
                    <Phone />
                </a>
            </nav>
            <Modal isOpen={notesOpen} title="Заметки" onClose={() => setNotesOpen(false)}>
                <textarea
                    className={styles.notes}
                    value={notes}
                    onChange={(event) => updateNotes(event.target.value)}
                    placeholder="Напишите заметку…"
                    aria-label="Текст заметки"
                />
            </Modal>
        </>
    );
}

export default TaskPanel
