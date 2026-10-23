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
type DesktopWindow = {
    id: FolderId;
    animationOrigin: FolderPosition;
    initialPosition: FolderPosition;
    zIndex: number;
};

const windowTitles: Record<FolderId, string> = {
    experience: 'Опыт работы',
    projects: 'Пет проекты',
    education: 'Образование',
    skills: 'Технический стэк',
    contacts: 'Контакты',
};

const defaultPositions: FolderPositions = {
    experience: { x: 40, y: 100 },
    projects: { x: 180, y: 100 },
    education: { x: 320, y: 100 },
    skills: { x: 460, y: 100 },
    contacts: { x: 600, y: 100 },
};

type MainPageProps = {
    headerItemToOpen: FolderId | null
    onHeaderItemHandled: ()=> void
}


const MainPage: React.FC<MainPageProps> = ({headerItemToOpen, onHeaderItemHandled}) => {

    const [openWindows, setOpenWindows] = useState<DesktopWindow[]>([]);


    const desktopRef = useRef<HTMLDivElement>(null);
    const nextWindowZIndex = useRef(1000);

    const [positions, setPositions] = useState<FolderPositions>(() => {
        try {
            const savedPositions = localStorage.getItem('folder_positions');
            return savedPositions ? { ...defaultPositions, ...JSON.parse(savedPositions) } : defaultPositions;
        } catch {
            return defaultPositions;
        }
    });

    
    useEffect(() => {
        if (!headerItemToOpen) return

        const id = headerItemToOpen
        const zIndex = ++nextWindowZIndex.current

        setOpenWindows((current) => {
            const existingWindow = current.find((windowData) => windowData.id === id)

            // Если окно уже открыто — поднимаем его поверх остальных
            if (existingWindow) {
            return current.map((windowData) =>
                windowData.id === id
                ? { ...windowData, zIndex }
                : windowData
            )
            }

            // Для окна из хедера берём позицию соответствующей папки
            const folderPosition = positions[id]

            return [
            ...current,
            {
                id,
                zIndex,
                animationOrigin: {
                x: folderPosition.x + FOLDER_WIDTH / 2,
                y: folderPosition.y + FOLDER_HEIGHT / 2,
                },
                initialPosition: {
                x: Math.max(24, Math.min(folderPosition.x + 20, window.innerWidth - 624)),
                y: Math.max(24, Math.min(folderPosition.y + 20, window.innerHeight - 320)),
                },
            },
            ]
        })

        onHeaderItemHandled();
    }, [headerItemToOpen, positions, onHeaderItemHandled])

    useEffect(() => {
        localStorage.setItem('folder_positions', JSON.stringify(positions));
    }, [positions]);
       

    const dragState = useRef<{
        id: FolderId;
        offset: FolderPosition;
    } | null>(null);

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

        dragState.current = { id, offset };

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

        setPositions((current) => ({ ...current, [id]: { x, y } }));
    };

    const handlePointerUp = (id: FolderId) => {
        const drag = dragState.current;
        if (!drag || drag.id !== id) return;

        dragState.current = null;
    }

    const handleDoubleClick = (id: FolderId, event: React.MouseEvent<HTMLButtonElement>) => {
        const rect = event.currentTarget.getBoundingClientRect();
        const zIndex = ++nextWindowZIndex.current;

        setOpenWindows((current) => {
            const alreadyOpen = current.some((windowData) => windowData.id === id);
            if (alreadyOpen) {
                return current.map((windowData) => windowData.id === id ? { ...windowData, zIndex } : windowData);
            }

            const x = Math.max(24, Math.min(rect.left + 20, window.innerWidth - 624));
            const y = Math.max(24, Math.min(rect.top + 20, window.innerHeight - 320));
            return [...current, {
                id,
                zIndex,
                animationOrigin: { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 },
                initialPosition: { x, y },
            }];
        });
    }

    const bringWindowToFront = (id: FolderId) => {
        const zIndex = ++nextWindowZIndex.current;
        setOpenWindows((current) => current.map((windowData) => (
            windowData.id === id ? { ...windowData, zIndex } : windowData
        )));
    };

    const closeWindow = (id: FolderId) => {
        setOpenWindows((current) => current.filter((windowData) => windowData.id !== id));
    };

    const isMobile = window.matchMedia(`(max-width: 700px)`).matches;

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
            onClick={isMobile ? (event) => handleDoubleClick(id, event) : undefined}
            onDoubleClick={!isMobile ? (event) => handleDoubleClick(id, event) : undefined}
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

            {openWindows.map((windowData) => (
            <Modal
                key={windowData.id}
                isOpen
                title={windowTitles[windowData.id]}
                animationOrigin={windowData.animationOrigin}
                initialPosition={windowData.initialPosition}
                zIndex={windowData.zIndex}
                isActive={windowData.zIndex === Math.max(...openWindows.map((item) => item.zIndex))}
                onBringToFront={() => bringWindowToFront(windowData.id)}
                onClose={() => closeWindow(windowData.id)}
            >
                {windowData.id === 'education' ? (
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
                ) : windowData.id === 'projects' ? (
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
                ) : windowData.id === 'experience' ? (
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
                ) : windowData.id === 'contacts' ? (
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
                ) : windowData.id === 'skills' ? (
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
            ))}
        </div> 
    );

}

export default MainPage
