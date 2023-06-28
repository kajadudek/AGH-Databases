# System zamawiania biletów kolejowych
## Autorzy

Kaja Dudek kwdudek@student.agh.edu.pl<br />
Natalia Adamiak nadamiak@student.agh.edu.pl<br />
Izabella Rosikoń rosikon@student.agh.edu.pl<br />


### Spis treści
- [Konfiguracja projektu](#konfiguracja-projektu)
- [Autorzy](#autorzy)
- [Opis](#opis)
- [Technologie](#technologie)
- [Model danych](#model-danych)
- [Transakcje bazodanowe - endpointy](#transakcje-bazodanowe---endpointy-i-funkcje)
- [Widoki strony](#widoki-strony)
- [Baza danych](#baza-danych)

## Konfiguracja projektu

Podane niżej komendy należy wpisać w terminalu na poziomie folderu 'server' i 'client'
1. npm install yarn
2. yarn
3. yarn dev


## Opis

Celem tego projektu jest stworzenie systemu umożliwiającego zamawianie biletów kolejowych dla pasażerów. System pozwala na zakup biletów na połączenia kolejowe między określonymi stacjami, zwracanie biletów oraz wymianę biletów na te same połączenia, ale z innym terminem podróży. Użytkownicy mogą wyszukiwać połączenia kolejowe między dwiema stacjami, uwzględniając możliwość przesiadek, oraz rezerwować miejsca w pociągu*. System uwzględnia również zniżki dla określonych grup osób, takich jak studenci. Po zamówieniu biletu użytkownik otrzymuje potwierdzenie zakupu wraz z ważnym biletem uprawniającym do podróży.

*rezerwacja oznacza gwarancje miejsca siedzącego po zakupie biletu

## Technologie

- MongoDB: do przechowywania informacji o obiektach w systemie. Elastyczność tej bazy danych pozwala na tworzenie zagnieżdżonych kolekcji.
- Prisma: do prostego definiowania modeli danych, wykonywania zapytań bazodanowych i komunikacji z MongoDB.
- Framework Express: do obsługi routingu i zapytań HTTP w systemie.
- Next.js oraz Tailwind CSS: pomocne przy tworzeniu frontendowej części projektu.

## Model danych

### Modele Prisma

- `enum SeatType`: określa typ wagonu w jakim znajduje się miejsce siedzące - może być to miejsce w wagonie otwartym (bezprzedziałowym) lub przedziałowym.
 ```javascript
enum SeatType {
  COMPARTMENT,
  OPEN
}
```
- `enum SeatStatus`: określa, czy dane miejsce jest aktualnie wykupione, czy zostało zwrócone.
 ```javascript
 enum SeatStatus {
  ACTIVE,
  RETURNED
}
```
- `type Seats`: określa liczbę wolnych i zarezerwowanych miejsc dla danego typu przedziału.
 ```javascript
 type Seats {
  available Int
  booked    Int
  type      SeatType @default(OPEN)
}
```
- `enum Discount`: określa rodzaj zniżki przysługujący danej osobie.
 ```javascript
 enum Discount {
  NONE,
  STUDENT,
  SENIOR,
  CHILD
}
```
- `model DiscountValue`: reprezentuje wartość zniżki w postaci zmiennoprzecinkowej (wartość z zakresu 0-1, zniżka 0.4 określa zniżkę o wartości 40%)
 ```javascript
 model DiscountValue {
  id       String   @id @default(auto()) @map("_id") @db.ObjectId
  discount Discount
  value    Float
}
```
- `type Passenger`: reprezentuje pasażera, określa rodzaj zniżki mu przysługującej, typ miejsca i status miejsce. 
 ```javascript
 type Passenger {
  name     String
  discount Discount
  seat     SeatType
  status   SeatStatus
}
```
- `model User`: reprezentuje użytkownika systemu, zawiera informacje o adresie e-mail użytkownika oraz przypisane bilety.
 ```javascript
 model User {
  id      String   @id @default(auto()) @map("_id") @db.ObjectId
  email   String   @unique
  tickets Ticket[]
}
```
- `model Ticket`: reprezentuje bilet, zawiera informacje o pasażerach przypisanych do biletu, połączeniu, cenie i osobie, która dokonała zakupu biletu.
 ```javascript
 model Ticket {
  id           String      @id @default(auto()) @map("_id") @db.ObjectId
  passengers   Passenger[]
  user         User        @relation(fields: [userID], references: [id])
  userID       String      @map("userID") @db.ObjectId
  connection   Connection  @relation(fields: [connectionID], references: [id])
  connectionID String      @map("connectionID") @db.ObjectId
  price        Float
}
```
- `model Connection`: reprezentuje połączenie kolejowe (pociąg) między dwiema stacjami. Zawiera informacje o liczbie miejsc, czasie odjazdu i przyjazdu, stacjach oraz cenie bez uwzględnienia zniżek.
 ```javascript
 model Connection {
  id               String   @id @default(auto()) @map("_id") @db.ObjectId
  name             String
  capacity         Seats[]
  tickets          Ticket[]
  departure        DateTime
  departureStation Station
  arrival          DateTime
  arrivalStation   Station
  price            Float
}
```
- `type Station`: reprezentuje informacje o stacji, takie jak nazwa, miasto i kraj.
 ```javascript
 type Station {
  name    String
  city    String
  country String
}
```
Przykładowy obiekt - User
```
  {
    "_id": {"$oid": "644d8b21ceccb2eb338410f4"},
    "email": "jenna.doe@gee.com"  {
    "_id": {"$oid": "6486439be2e814cf5e793483"},
    "connectionID": {"$oid": "647896d15ac911649cb70068"},
    "passengers": [
      {
        "name": "passenger",
        "discount": "STUDENT",
        "seat": "OPEN",
        "status": "ACTIVE"
      },
      {
        "name": "passenger",
        "discount": "NONE",
        "seat": "OPEN",
        "status": "ACTIVE"
      }
    ],
    "price": 52.15,
    "userID": {"$oid": "6486369f48ebf2f3944237a3"}
  }
  }
```
Przykładowy obiekt - Connection
```
  {
    "_id": {"$oid": "645d7d9fb40f0c56de29092f"},
    "arrival": {
      "$date": "2029-03-01T08:30:00.000Z"
    },
    "arrivalStation": {
      "name": "Tychy",
      "city": "Tychy",
      "country": "Poland"
    },
    "capacity": [
      {
        "available": 2,
        "booked": 15,
        "type": "COMPARTMENT"
      },
      {
        "available": 1,
        "booked": 10,
        "type": "OPEN"
      }
    ],
    "departure": {
      "$date": "2029-03-01T08:00:00.000Z"
    },
    "departureStation": {
      "name": "Katowice",
      "city": "Katowice",
      "country": "Poland"
    },
    "name": "Rocket",
    "price": 8
  }
```
Przykładowy obiekt - Ticket
```
  {
    "_id": {"$oid": "6486439be2e814cf5e793483"},
    "connectionID": {"$oid": "647896d15ac911649cb70068"},
    "passengers": [
      {
        "name": "passenger",
        "discount": "STUDENT",
        "seat": "OPEN",
        "status": "ACTIVE"
      },
      {
        "name": "passenger",
        "discount": "NONE",
        "seat": "OPEN",
        "status": "ACTIVE"
      }
    ],
    "price": 52.15,
    "userID": {"$oid": "6486369f48ebf2f3944237a3"}
  }
```
Dokument Discount
```
[
  {
    "_id": {"$oid": "6486407ae15c5259f5c3a5d4"},
    "discount": "STUDENT",
    "value": 0.51
  },
  {
    "_id": {"$oid": "64864095e15c5259f5c3a5d5"},
    "discount": "CHILD",
    "value": 0.37
  },
  {
    "_id": {"$oid": "648640cae15c5259f5c3a5d6"},
    "discount": "SENIOR",
    "value": 0.4
  }
]
```

Więcej szczegółów na temat modeli danych można znaleźć w pliku [schema.prisma](server/prisma/schema.prisma).

## Transakcje bazodanowe - endpointy i funkcje

### `connections.ts`

- Endpoint GET: zwraca połączenie na podstawie przekazanego ID połączenia.
- Endpoint POST: tworzy nowe połączenie i zapisuje je w bazie danych.
- Funkcja findPaths: zwraca listę możliwych połączeń z punktu A do B; wykorzystuje funkcje rekurencyjną findAllPaths i graf.
- Funckja getConnections: pobiera wszystkie połączenia z bazy danych i mapuje je na obiekty typu Connection.
### `connectionsByDate.ts`

- Endpoint GET: zwraca połączenia mieszczące się w określonych ramach czasowych

### `ticket.ts`

- Endpoint POST:
    pobiera uwierzytelnionego użytkownika
    sprawdza istnienie podanego połączenia kolejowego
    sprawdza liczbę wolnych miejsc w połączeniu i porównuje ją do potrzebnej liczby miejsc do zamówienia: w przypadku braku miejsca zwraca błąd
    aktualizuje liczbę dostępnych miejsc w danym połączeniu
    tworzy bilet.
- Endpoint GET: zwraca bilet o podanym id.
- Funkcja calculateTicketPrice: zwraca łączną wartość biletu na podstawie liczby osób, zniżek i ceny  połączenia

### `tickets.ts`

- Endpoint GET: zwraca bilet na podstawie przekazanego ID.
- Endpoint POST: tworzy nowy bilet na podstawie przekazanych danych.
- Endpoint DELETE (deleteTicket): usuwa bilet na podstawie przekazanego ID.
- Endpoint PUT (updateTicket): aktualizuje istniejący bilet na podstawie przekazanych danych.

### `users.ts`

- Endpoint GET: zwraca użytkownika na podstawie podanego adresu e-mail.
- Endpoint POST: tworzy nowego użytkownika na podstawie przekazanych danych.
- Funkcja getUser: pobieranie danych zalogowanego użytkownika.

## Widoki strony

### Wyszukiwanie połączeń kolejowych między stacjami.

![352446165_1301329084098465_5122955641258742088_n](https://github.com/kajadudek/AGH-Databases/assets/72348810/034496b8-2fa7-418e-b07f-b2c1a9cd4358)

### Wyświetlanie biletów przypisanych do użytkownika.

![351624944_1196264161043918_8898082919172478209_n](https://github.com/kajadudek/AGH-Databases/assets/72348810/032e4c1f-7a14-4404-89c9-ba59d8dab6d4)

### Autentykacja za pomocą auth()

![351529607_813470589941352_1543353196092975388_n](https://github.com/kajadudek/AGH-Databases/assets/72348810/8ded3e0a-7f1b-486d-a996-4a9dfa589e60)


