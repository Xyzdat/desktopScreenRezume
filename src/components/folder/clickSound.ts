const clickSound = new Audio('/audio/click.mp3');
const clickFolderSound = new Audio('/audio/folder.mp3');
clickSound.volume = 0.5;

export function playClickSound() {
    clickSound.currentTime = 0;
    void clickSound.play().catch(() => {});
}

export function playFolderClickSound() {
    clickFolderSound.currentTime = 0;
    void clickFolderSound.play().catch(() => {});
}
