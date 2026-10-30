import './styles/App.css'
import MainPage from './components/mainPage/mainPage'
import TaskPanel from './components/task_panel/taskPanel'
import BackgroundScene from './components/backgroundScene/backgroundScene'
import Header from './components/header/header'
import CustomCursor from './components/customCursor/customCursor'
import { useState } from 'react'

export type HeaderItemId =
  | 'experience'
  | 'projects'
  | 'education'
  | 'skills'
  | 'contacts'

function App() {
  const [headerItemToOpen, setHeaderItemToOpen] = useState<HeaderItemId | null>(null)
  return (
    <div className='portfolio-container'>
      <Header onItemClick={setHeaderItemToOpen} />
      <BackgroundScene />
      <main>
        < MainPage headerItemToOpen={headerItemToOpen} onHeaderItemHandled = {()=> setHeaderItemToOpen(null)} />
        < TaskPanel />
      </main>
      <CustomCursor />
    </div>
  )
}

export default App
