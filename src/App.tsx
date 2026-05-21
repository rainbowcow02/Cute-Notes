import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ComposerPage } from './pages/ComposerPage'
import { NotePage } from './pages/NotePage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ComposerPage />} />
        <Route path="/n/:id" element={<NotePage />} />
      </Routes>
    </BrowserRouter>
  )
}
