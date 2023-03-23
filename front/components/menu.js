import { Button } from '@mui/material';
import React from 'react';

export default function Menu() {
  return (
    <div style={{display:'flex', background:"#9DC08B",margin:0, alignItems:"center",
     justifyContent:"center", gap:"20px", flexGrow:'1', borderRadius:"0 0 30px 30px", marginBottom:"2%"}}>
        <h2 style={{flex: "1 0 auto", maxWidth:"30%", color:"#40513B"}}>Baza Uczniów</h2>
        <Button variant="contained" href={`/zarzadzanie`} style={{backgroundColor:"#609966",maxHeight:"40px"}}>Zarządzaj uczniem</Button>
        <Button variant="contained" href={`/`}style={{backgroundColor:"#609966",maxHeight:"40px"}}>Lista uczniów</Button>
        <Button variant="contained" href={`/dodaj`} style={{backgroundColor:"#609966",maxHeight:"40px"}}>Dodaj ucznia</Button>
    </div>
  );
}