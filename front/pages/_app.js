import '../styles/globals.css'
import Menu from '../components/menu'

function MyApp({ Component, pageProps }) {
  return (
    <div style={{background:"#EDF1D6", height:"100vh"}}>
      <Menu/>
      <div style={{padding:"30px"}}>
        <Component {...pageProps} />

      </div>
    </div>
    )
}

export default MyApp
