import Api from './components/Api'
// import './index.css'

export default function App() {
  return (
    <>
      <header className='py-10'>

          <h1 className='font-size font-semibold uppercase text-center text-3xl text-cyan-900	'>Fixat</h1>
        
          <h2 className='text-center text-cyan-900 text-2xl font-semibold'>Taxpayer Registation Form</h2>
        
      </header>
        <main className='bg-gray-100'>
        <Api/>
        </main>
    </>
  )
}