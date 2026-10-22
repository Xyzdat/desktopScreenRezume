import './styles/App.css'
import MainPage from './components/mainPage/mainPage'
import TaskPanel from './components/task_panel/taskPanel'
import BackgroundScene from './components/backgroundScene/backgroundScene'

function App() {
  return (
    <div className='portfolio-container'>
      {/* <BackgroundScene /> */}
      <main>
        < MainPage />
        < TaskPanel />
      </main>
    </div>
  )
}

export default App
