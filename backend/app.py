from flask import Flask, request
from flask_cors import CORS
import sqlite3
import json

app = Flask(__name__)
CORS(app)

# nazwa pliku z bazą danych
DB_NAME = "uczniowie.db"
OCENY_DB_NAME = "oceny.db"


# otwórz połączenie z bazą danych
conn = sqlite3.connect(DB_NAME)
cursor = conn.cursor()
# utwórz tabelę "uczniowie" z polami "imie", "nazwisko" i "klasa"
conn.execute("""CREATE TABLE IF NOT EXISTS uczniowie (
                 id INTEGER PRIMARY KEY,
                 imie TEXT NOT NULL,
                 nazwisko TEXT NOT NULL,
                 klasa TEXT NOT NULL
              );""")

# dodaj przykładowych uczniów jeśli baza danych jest pusta
cursor.execute("SELECT count(*) FROM uczniowie")
result = cursor.fetchone()[0]

uczniowie = [
    ("Jan", "Kowalski", "1A"),
    ("Anna", "Nowak", "1A"),
    ("Tomasz", "Nowicki", "1B"),
    ("Katarzyna", "Kowalczyk", "1B"),
    ("Piotr", "Kozłowski", "2A"),
    ("Aleksandra", "Jankowska", "2A"),
    ("Michał", "Majewski", "2B"),
    ("Monika", "Nowakowska", "2B"),
]

if result == 0:
    # dodaj uczniów do bazy danych
    for imie, nazwisko, klasa in uczniowie:
        conn.execute("INSERT INTO uczniowie (imie, nazwisko, klasa) VALUES (?, ?, ?);", (imie, nazwisko, klasa))

# zapisz zmiany i zamknij połączenie z bazą danych
conn.commit()
conn.close()

# otwórz połączenie z bazą danych ocen
conn = sqlite3.connect(OCENY_DB_NAME)
cursor = conn.cursor()
# utwórz tabelę "oceny" z polami "id_ucznia", "stopien"
conn.execute("""CREATE TABLE IF NOT EXISTS oceny (
                 id INTEGER PRIMARY KEY,
                 id_ucznia INTEGER NOT NULL,
                 stopien INTEGER
              );""")

# zapisz zmiany i zamknij połączenie z bazą danych
conn.commit()
conn.close()

x = [1,2,3,]

@app.route("/usunucznia")
def delete_uczen():
    imie = request.args.get('imie')
    nazwisko = request.args.get('nazwisko')
    klasa = request.args.get('klasa')
    id = request.args.get("id")
    # otwórz połączenie z bazą danych

    conn = sqlite3.connect(DB_NAME)

    if(not id):
        # usuń ucznia z bazy danych
        conn.execute("DELETE FROM uczniowie WHERE imie=? AND nazwisko=? AND klasa=?;", (imie, nazwisko, klasa))
        # zapisz zmiany i zamknij połączenie z bazą danych
        conn.commit()
        conn.close()
    else:
        cursor = conn.cursor()
    
        # usuń rekord z tabeli "uczniowie" o podanym id
        cursor.execute("DELETE FROM uczniowie WHERE id = ?;", (id,))
        conn.commit()
        conn.close()
    return {"success": True, "message": f"Usunięto ucznia."}


@app.route("/klasy")
def get_klasy():
    # otwórz połączenie z bazą danych
    conn = sqlite3.connect(DB_NAME)
    # wykonaj zapytanie SQL pobierające wszystkie klasy z bazy danych
    c = conn.cursor()
    c.execute("SELECT DISTINCT klasa FROM uczniowie")
    klasy = c.fetchall()
    # zamknij połączenie z bazą danych
    conn.close()
    # utwórz listę klas i zwróć ją jako odpowiedź
    klas_list = [klasa[0] for klasa in klasy]
    return {"klasy": klas_list}

@app.route("/uczniowie")
def get_uczniowie():
    klasa = request.args.get('klasa')

    # otwórz połączenie z bazą danych
    conn = sqlite3.connect(DB_NAME)
    print(klasa)
    # wykonaj zapytanie SQL pobierające wszystkich uczniów danej klasy
    c = conn.cursor()
    if klasa:
        c.execute("SELECT * FROM uczniowie WHERE klasa = ?;", (klasa,))
        uczniowie = c.fetchall()
    else:
        c.execute("SELECT * FROM uczniowie")
        uczniowie = c.fetchall()

    # zamknij połączenie z bazą danych
    conn.close()
    # zwróć listę uczniów
    return uczniowie

@app.route('/uczen')
def get_uczen():
    id = request.args.get('id')
    conn = sqlite3.connect(DB_NAME)
    c = conn.cursor()
    c.execute('SELECT * FROM uczniowie WHERE id = ?;',(id,))
    uczen = c.fetchone()
    conn.close()
    print(uczen)
    return json.dumps(uczen)

@app.route('/pobierz_oceny')
def pobierz_oceny():
    id = request.args.get('id')
    conn = sqlite3.connect(OCENY_DB_NAME)
    c = conn.cursor()
    c.execute('SELECT * FROM oceny WHERE id_ucznia = ?;', (id, ))
    oceny = c.fetchall()
    conn.close()
    print(oceny)
    return oceny


@app.route("/dodajucznia")
def add_uczen():
    imie = request.args.get('imie')
    nazwisko = request.args.get('nazwisko')
    klasa = request.args.get('klasa')


    # otwórz połączenie z bazą danych
    conn = sqlite3.connect(DB_NAME)
    # dodaj nowego ucznia do bazy danych
    conn.execute("INSERT INTO uczniowie (imie, nazwisko, klasa) VALUES (?, ?, ?);", (imie, nazwisko, klasa))
    # zapisz zmiany i zamknij połączenie z bazą danych
    conn.commit()
    conn.close()
    print(f"Dodano nowego ucznia: {imie} {nazwisko} ({klasa})")
    return {"success": True, "message": f"Dodano ucznia {imie} {nazwisko} do klasy {klasa}."}



@app.route("/dodaj_ocene", methods=["POST"])
def dodaj_ocene():
    # odbierz dane zapytania POST
    data = request.get_json()
    id_ucznia = data["id_ucznia"]
    stopien = data["stopien"]
    
    # otwórz połączenie z bazą danych ocen
    conn = sqlite3.connect(OCENY_DB_NAME)
    cursor = conn.cursor()
    
    # dodaj nowy rekord do tabeli "oceny"
    cursor.execute("INSERT INTO oceny (id_ucznia, stopien) VALUES (?, ?);", (id_ucznia, stopien))
    
    # zapisz zmiany i zamknij połączenie z bazą danych
    conn.commit()
    conn.close()
    
    # zwróć potwierdzenie dodania oceny w formacie JSON
    return {"success": True, "message": f"Dodano ocenę {stopien} uczniowi o id {id_ucznia}."}


@app.route("/usun_ocene", methods=["POST"])
def usun_ocene():
    # odbierz dane zapytania POST
    data = request.get_json()
    id_oceny = data["id_oceny"]
    
    # otwórz połączenie z bazą danych ocen
    conn = sqlite3.connect(OCENY_DB_NAME)
    cursor = conn.cursor()
    
    # usuń rekord z tabeli "oceny" o podanym id
    cursor.execute("DELETE FROM oceny WHERE id = ?;", (id_oceny,))
    
    # zapisz zmiany i zamknij połączenie z bazą danych
    conn.commit()
    conn.close()