import './styles/App.css'
import MainPage from './components/mainPage/mainPage'
import TaskPanel from './components/task_panel/taskPanel'
import { useEffect, useRef } from 'react';

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <div className='portfolio-container'>
      <main>
        {/* <video ref={videoRef}
          className="background"
          autoPlay
          loop
          muted
          playsInline
          
          >
          <source src="../dist/background4.mp4" type="video/mp4" />
        </video> */}
        {/* <img src="../dist/background3.jpg" alt="" className="background"/> */}
        < MainPage />
        < TaskPanel />
      </main>
    </div>
  )
}

export default App
