import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { TextField, Stack, Button, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { useState, useEffect } from 'react';

export default function Home() {
  const [klasa, setKlasa] = useState("");
  const [uczniowie, setUczniowie] = useState([]);
  const [klasy, setKlasy] = useState([]);
  useEffect(() => {
    fetch(`http://localhost:5000/klasy`,{
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
  .then((data) => {setKlasy(data.klasy); });
  }, []);

  const pobierz = () => {
    fetch(`http://localhost:5000/uczniowie?klasa=${klasa}`,{
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
  .then((data) => {setUczniowie(data);});
  }

  useEffect(() => {
    console.log(klasa, "klasa")
  }, [klasa]);
  return (
    <>
      
      <Stack spacing={2} direction="row">
      <FormControl fullWidth>
        <InputLabel id="klasa-label">Klasa</InputLabel>
        <Select
          labelId="klasa-label"
          value={klasa}
          label="Klasa"
          onChange={(e)=>{setKlasa(e.target.value)}}
        >
          {klasy &&
            klasy.map((i)=>{
              return <MenuItem value={i}>{i}</MenuItem>
            })
          }
        </Select>
      </FormControl>

        <Button style={{background:"#609966"}}variant="contained" onClick={pobierz}>Wybierz klase</Button>
        
      </Stack>
      {uczniowie.map((uczen)=>{
        return <>
          <p>id: {uczen[0]} {uczen[1]} {uczen[2]}<Button variant="contained" style={{background:"#609966"}}href={`/zarzadzanie?id=${uczen[0]}`}>Przejdź do ocen ucznia</Button></p>
        </>
      })}
    </>
  )
}
