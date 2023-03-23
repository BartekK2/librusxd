import { Button, TextField, FormControl, Select, InputLabel, MenuItem } from '@mui/material';
import React, {useState, useEffect} from 'react';
import { useRouter } from 'next/router'



export default function Menu() {
    const router = useRouter()
    const { id } = router.query
    const [uczen, setUczen] = useState(null);
    const [ocena, setOcena] = useState(1);
    const [oceny, setOceny] = useState([]);

    const dodajOcene = (stopien) => {
        if(uczen){
            fetch('http://localhost:5000/dodaj_ocene', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "id_ucznia": uczen[0], "stopien":stopien })
            }).then(response => response.json())
            .then(response => console.log(JSON.stringify(response)))
            fetch(`http://localhost:5000/pobierz_oceny?id=${id}`,{
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
      .then((data) => {console.log(data);setOceny(data); });
        }
    }

    const usunOcene = (id_oceny) => {
        if(id_oceny){
            fetch('http://localhost:5000/usun_ocene', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ "id_oceny": id_oceny })
            }).then(response => response.json())
            .then(response => console.log(JSON.stringify(response)))
            fetch(`http://localhost:5000/pobierz_oceny?id=${id}`,{
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
      .then((data) => {console.log(data);setOceny(data); });
        }
      }

    useEffect(() => {
        console.log("XD2")
        fetch(`http://localhost:5000/pobierz_oceny?id=${id}`,{
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
      .then((data) => {console.log(data);setOceny(data); });
      }, [uczen]);

    useEffect(() => {
        console.log(id, "id")
        if(id != undefined){
            fetch(`http://localhost:5000/uczen?id=${id}`,{
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
            .then((data) => {console.log(data);setUczen(data); });
        }
      }, [id]);


    return (
        <>
        <div style={{display:'flex', background:"#9DC08B",margin:0, alignItems:"center",padding:"20px",
        justifyContent:"center", gap:"20px", flexGrow:'1', borderRadius:"30px", marginBottom:"2%"}}>
            {(uczen!=null) && `${uczen[1]} ${uczen[2]} ${uczen[3]}`}
        <FormControl fullWidth>
            <InputLabel id="ocena-label">Ocena</InputLabel>
            <Select
            labelId="ocena-label"
            value={ocena}
            label="Ocena"
            onChange={(e)=>{setOcena(e.target.value)}}
            >
                {
                [1,2,3,4,5,6].map((i)=>{
                    return <MenuItem value={i}>{i}</MenuItem>
                })}
            </Select>
        </FormControl>
        <Button style={{background:"#609966"}} variant="contained" onClick={() => dodajOcene(ocena)}>Dodaj ocene</Button>
        </div>
        <div>
            {oceny.map((ocena)=><p>{ocena[2]} <Button variant="contained" style={{background:"#609966"}}onClick={()=>{usunOcene(ocena[0])}}>Usuń ocene</Button></p>)}
        </div>
        </>
    );
}