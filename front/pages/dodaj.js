import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { TextField, Stack, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';

export default function Dodaj() {
  const [imie, setImie] = useState("");
  
  const [nazwisko, setNazwisko] = useState("");
  const [klasa, setKlasa] = useState("");

  const dodajUcznia = (imie, nazwisko, klasa) => {
    console.log("wywolano funkcje",imie,nazwisko,klasa)
    if(imie && nazwisko && klasa){
      console.log("Zgadza sie")
      fetch(`http://localhost:5000/dodajucznia?imie=${imie}&nazwisko=${nazwisko}&klasa=${klasa.toString().toUpperCase()}`,{
                method: "GET", // *GET, POST, PUT, DELETE, etc.
              mode: "cors", // no-cors, *cors, same-origin
              cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
              credentials: "same-origin", // include, *same-origin, omit
              headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
              },
              })
            .then((response) => response.json())
            .then((data) => {console.log(data);});
    }
  }
  
  return (
    <>
      <TextField label="Imie" onChange={(e)=>setImie(e.target.value)} variant="outlined" />
      <TextField label="Nazwisko" onChange={(e)=>setNazwisko(e.target.value)} variant="outlined" />
      <TextField label="Klasa" onChange={(e)=>setKlasa(e.target.value)} variant="outlined" />
      <Button variant="contained" style={{background:"#609966"}} onClick={()=>dodajUcznia(imie,nazwisko,klasa)}>Dodaj ucznia</Button>

    </>
  )
}
