import React, { useEffect, useRef, useState } from "react";
import { education, experience, projects, skills, personalInfo } from "../../data/resume.ts"
import mainPageStyle from "./mainPage.module.scss"
import Folder from "../folder/folder.tsx";
import Modal from "../modalWindow/modal.tsx";

const FOLDER_WIDTH = 100;
const FOLDER_HEIGHT = 90;
type FolderId = 'experience' | 'projects' | 'education' | 'skills' | 'contacts';
type FolderPosition = { x: number; y: number };
type FolderPositions = Record<FolderId, FolderPosition>;

const defaultPositions: FolderPositions = {
    experience: { x: 40, y: 100 },
    projects: { x: 180, y: 100 },
    education: { x: 320, y: 100 },
    skills: { x: 460, y: 100 },
    contacts: { x: 600, y: 100 },
};


const MainPage: React.FC = () => {

    const [openWindow, setOpenWindow] = useState<FolderId | null>(null);
    const [animationOrigin, setAnimationOrigin] = useState<{ x: number; y: number } | null>(null);

    const desktopRef = useRef<HTMLDivElement>(null);

    const [positions, setPositions] = useState<FolderPositions>(() => {
        try {
            const savedPositions = localStorage.getItem('folder_positions');
            return savedPositions ? { ...defaultPositions, ...JSON.parse(savedPositions) } : defaultPositions;
        } catch {
            return defaultPositions;
        }
    });

    useEffect(() => {
        localStorage.setItem('folder_positions', JSON.stringify(positions));
    }, [positions]);
       

    const dragState = useRef<{
        id: FolderId;
        offset: FolderPosition;
        startPosition: FolderPosition;
        didMove: boolean;
    } | null>(null);
    const suppressClick = useRef<FolderId | null>(null);

    const handlePointerDown = (
        id: FolderId,
        event: React.PointerEvent<HTMLButtonElement>
    ) => {
        if (window.matchMedia('(max-width: 600px)').matches) return;
        if (event.pointerType === "mouse" && event.button !== 0) return 

        const folderRect = event.currentTarget.getBoundingClientRect();

        const offset = {
            x: event.clientX - folderRect.left,
            y: event.clientY - folderRect.top,
        }

        dragState.current = { id, offset, startPosition: positions[id], didMove: false };

        event.currentTarget.setPointerCapture(event.pointerId);
    };

    const handlePointerMove = (
        id: FolderId,
        event: React.PointerEvent<HTMLButtonElement>
    ) => {
        const drag = dragState.current;
        if (!drag || drag.id !== id || !desktopRef.current) return;

        const desktopRect = desktopRef.current.getBoundingClientRect();

        const nextX = event.clientX - desktopRect.left - drag.offset.x;
        const nextY = event.clientY - desktopRect.top - drag.offset.y;

        const maxX = desktopRect.width - FOLDER_WIDTH;
        const maxY = desktopRect.height - FOLDER_HEIGHT;

        const x = Math.max(0, Math.min(nextX, maxX));
        const y = Math.max(0, Math.min(nextY, maxY));

        if (Math.abs(x - drag.startPosition.x) > 3 || Math.abs(y - drag.startPosition.y) > 3) {
            drag.didMove = true;
        }
        setPositions((current) => ({ ...current, [id]: { x, y } }));
    };

    const handlePointerUp = (id: FolderId) => {
        const drag = dragState.current;
        if (!drag || drag.id !== id) return;

        if (drag.didMove) {
            suppressClick.current = id;
        }
        dragState.current = null;
    }

    const handleClick = (id: FolderId, event: React.MouseEvent<HTMLButtonElement>) => {
        if (suppressClick.current === id) {
            suppressClick.current = null;
            return;
        }

        const rect = event.currentTarget.getBoundingClientRect();
        setAnimationOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
        setOpenWindow(id);
    }

    const renderFolder = (id: FolderId, name: string) => (
        <Folder
            key={id}
            name={name}
            style={{
                position: "absolute",
                left: positions[id].x,
                top: positions[id].y,
                touchAction: "none",
                cursor: dragState.current?.id === id ? "grabbing" : "grab",
            }}
            onClick={(event) => handleClick(id, event)}
            onPointerDown={(event) => handlePointerDown(id, event)}
            onPointerMove={(event) => handlePointerMove(id, event)}
            onPointerUp={() => handlePointerUp(id)}
            onPointerCancel={() => handlePointerUp(id)}
        />
    );

    return (
        <div className={mainPageStyle.container} ref={desktopRef}>
            {renderFolder('experience', 'Опыт работы')}
            {renderFolder('projects', 'Пет проекты')}
            {renderFolder('education', 'Образование')}
            {renderFolder('skills', 'Технический стэк')}
            {renderFolder('contacts', 'Контакты')}

            <Modal
                isOpen={openWindow !== null}
                title={openWindow === 'projects' 
                    ? 'Пет проекты' 
                    : openWindow === 'education' 
                        ? 'Образование' 
                        : openWindow === 'experience' 
                            ? 'Опыт работы'
                            : openWindow === 'skills'
                                ? 'Технический стэк'
                                : 'Контакты' 
                }
                animationOrigin={animationOrigin}
                onClose={() => setOpenWindow(null)}
            >
                {openWindow === 'education' ? (
                    <article className={mainPageStyle.experience}>
                        <h3 className={mainPageStyle.experience__role}>{education.university}</h3>
                        <p className={mainPageStyle.experience__company}>{education.faculty}</p>
                        <dl className={mainPageStyle.educationDetails}>
                            <div>
                                <dt>Специальность</dt>
                                <dd>{education.specialization}</dd>
                            </div>
                            <div>
                                <dt>Период обучения</dt>
                                <dd>{education.period}</dd>
                            </div>
                            <div>
                                <dt>Место</dt>
                                <dd>{education.location}</dd>
                            </div>
                            <div>
                                <dt>Степень</dt>
                                <dd>{education.degree}</dd>
                            </div>
                        </dl>
                    </article>
                ) : openWindow === 'projects' ? (
                    <div className={mainPageStyle.experienceList}>
                        {projects.map((project) => (
                            <article className={mainPageStyle.experience} key={project.id}>
                                <div className={mainPageStyle.experience__heading}>
                                    <div>
                                        <h3 className={mainPageStyle.experience__role}>{project.name}</h3>
                                        <p className={mainPageStyle.experience__company}>{project.description}</p>
                                    </div>
                                    <div className={mainPageStyle.experience__meta}>
                                        <span>{project.year}</span>
                                        <span>{project.location}</span>
                                    </div>
                                </div>
                                <p className={mainPageStyle.project__team}>{project.teamInfo}</p>
                                {project.projectLink && (
                                    <a className={mainPageStyle.experience__link} href={project.projectLink} target="_blank" rel="noreferrer">
                                        Открыть проект ↗
                                    </a>
                                )}
                                <h4 className={mainPageStyle.experience__sectionTitle}>Задачи и результаты</h4>
                                <ul className={mainPageStyle.experience__achievements}>
                                    {project.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}
                                </ul>
                                <h4 className={mainPageStyle.experience__sectionTitle}>Технологии</h4>
                                <ul className={mainPageStyle.experience__stack} aria-label="Технологический стек">
                                    {project.techStack.map((technology) => <li key={technology}>{technology}</li>)}
                                </ul>
                            </article>
                        ))}
                    </div>
                ) : openWindow === 'experience' ? (
                <div className={mainPageStyle.experienceList}>
                    {experience.map((item) => (
                        <article className={mainPageStyle.experience} key={item.id}>
                            <div className={mainPageStyle.experience__heading}>
                                <div>
                                    <h3 className={mainPageStyle.experience__role}>{item.role}</h3>
                                    <p className={mainPageStyle.experience__company}>{item.company}</p>
                                </div>
                                <div className={mainPageStyle.experience__meta}>
                                    <span>{item.period}</span>
                                    <span>{item.location}</span>
                                </div>
                            </div>

                            {item.projectLink && (
                                <a className={mainPageStyle.experience__link} href={item.projectLink} target="_blank" rel="noreferrer">
                                    Открыть проект ↗
                                </a>
                            )}

                            <h4 className={mainPageStyle.experience__sectionTitle}>Задачи и результаты</h4>
                            <ul className={mainPageStyle.experience__achievements}>
                                {item.achievements.map((achievement) => <li key={achievement}>{achievement}</li>)}
                            </ul>

                            <h4 className={mainPageStyle.experience__sectionTitle}>Технологии</h4>
                            <ul className={mainPageStyle.experience__stack} aria-label="Технологический стек">
                                {item.techStack.map((technology) => <li key={technology}>{technology}</li>)}
                            </ul>
                        </article>
                    ))}
                </div>
                ) : openWindow === 'contacts' ? (
                    <section className={mainPageStyle.experienceList}>
                        <h3 className={mainPageStyle.experience__role}>{personalInfo.name}</h3>
                        <p className={mainPageStyle.experience__company}>{personalInfo.title}</p>
                        {Object.entries(personalInfo.contacts).map(([label, value]) => {
                            const href = label === 'email' ? `mailto:${value}`
                                : label === 'phone' ? `tel:${value.replace(/[^+\d]/g, '')}`
                                    : `https://${value}`;
                            const displayLabel = label === 'github' ? 'GitHub'
                                : label === 'telegram' ? 'Telegram'
                                    : label === 'email' ? 'Email' : 'Телефон';

                            return (
                                <p className={mainPageStyle.contact} key={label}>
                                    <span>{displayLabel}</span>
                                    <a href={href} target={label === 'email' || label === 'phone' ? undefined : '_blank'} rel="noreferrer">{value}</a>
                                </p>
                            );
                        })}
                    </section>
                ) : openWindow === 'skills' ? (
                    <div className={mainPageStyle.experienceListSkills}>
                        {Object.entries(skills).map(([category, items]) => {
                            const labels: Record<string, string> = {
                                languages: 'Языки программирования',
                                frontendCore: 'Frontend core',
                                tools: 'Инструменты',
                                deploy: 'Развёртывание и инфраструктура',
                                patterns: 'Подходы и архитектура',
                                foreignLanguages: 'Иностранные языки',
                            };

                            return (
                                <section className={mainPageStyle.skillGroup} key={category}>
                                    <h3 className={mainPageStyle.experience__sectionTitle}>{labels[category] ?? category}</h3>
                                    <ul className={mainPageStyle.experience__stack}>
                                        {items.map((item) => <li key={item}>{item}</li>)}
                                    </ul>
                                </section>
                            );
                        })}
                    </div>
                ) : null
                }
            </Modal>
        </div> 
    );

}

export default MainPage
