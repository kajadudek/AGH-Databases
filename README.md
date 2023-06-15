# AGH-Databases-TicketReservationProject
## Autorzy

Kaja Dudek kwdudek@student.agh.edu.pl<br />
Natalia Adamiak nadamiak@student.agh.edu.pl<br />
Izabella Rosikoń rosikon@student.agh.edu.pl<br />

Technologies: Next.js, Express.js, MongoDB

ToDo:

1. Checking train connections
2. Buying, returning, exchanging tickets
3. Sending confirmation and ticket
4. Discounts
5. Customer Service Emails
6. Searching train station
7. List of example connections
8. Seat reservation


# System zamawiania biletów kolejowych

## Spis treści
- [Opis](#opis)
- [Technologie](#technologie)
- [Model danych](#model-danych)
- [Transakcje bazodanowe - endpointy](#transakcje-bazodanowe---endpointy)
- [Widoki strony](#widoki-strony)
- [Uruchomienie projektu](#uruchomienie-projektu)
- [Autorzy](#autorzy)

## Opis

Celem tego projektu jest stworzenie systemu umożliwiającego zamawianie biletów kolejowych dla pasażerów. System pozwala na zakup biletów na połączenia kolejowe między określonymi stacjami, zwracanie biletów oraz wymianę biletów na te same połączenia, ale z innym terminem podróży. Użytkownicy mogą wyszukiwać połączenia kolejowe między dwiema stacjami, uwzględniając możliwość przesiadek, oraz rezerwować miejsca w pociągu. System uwzględnia również zniżki dla określonych grup osób, takich jak studenci. Po zamówieniu biletu użytkownik otrzymuje potwierdzenie zakupu wraz z ważnym biletem uprawniającym do podróży.

## Technologie

- MongoDB: do przechowywania informacji o obiektach w systemie. Elastyczność tej bazy danych pozwala na tworzenie zagnieżdżonych kolekcji.
- Prisma: do prostego definiowania modeli danych, wykonywania zapytań bazodanowych i komunikacji z MongoDB.
- Framework Express: do obsługi routingu i zapytań HTTP w systemie.
- Next.js oraz Tailwind CSS: pomocne przy tworzeniu frontendowej części projektu.

## Model danych

### Modele Prisma

- `User`: reprezentuje użytkownika systemu, zawiera informacje o adresie e-mail użytkownika oraz przypisane bilety.
- `Ticket`: reprezentuje bilet, zawiera informacje o pasażerach przypisanych do biletu, połączeniu, cenie i osobie, która dokonała zakupu biletu.
- `Connection`: reprezentuje połączenie kolejowe (pociąg) między dwiema stacjami. Zawiera informacje o liczbie miejsc, czasie odjazdu i przyjazdu, stacjach oraz cenie.
- `Station`: reprezentuje informacje o stacji, takie jak nazwa, miasto i kraj.

Więcej szczegółów na temat modeli danych można znaleźć w pliku `schema.prisma`.

## Transakcje bazodanowe - endpointy

### `connections.ts`

- Endpoint GET: zwraca połączenie na podstawie przekazanego ID połączenia.
- Endpoint POST: tworzy nowe połączenie i zapisuje je w bazie danych.

### `tickets.ts`

- Endpoint GET: zwraca bilet na podstawie przekazanego ID.
- Endpoint POST: tworzy nowy bilet na podstawie przekazanych danych.
- Endpoint DELETE: usuwa bilet na podstawie przekazanego ID.
- Funkcja PUT: aktualizuje istniejący bilet na podstawie przekazanych danych.

### `users.ts`

- Endpoint GET: zwraca użytkownika na podstawie podanego adresu e-mail.
- Endpoint POST: tworzy nowego użytkownika na podstawie przekazanych danych.

## Widoki strony

Projekt zawiera widoki umożliwiające:
- Wyszukiwanie połączeń kolejowych między stacjami.
- Wyświetlanie biletów przypisanych do użytkownika.
- Logowanie użytkownika.

Pliki związane z widokami można znaleźć w folderze `views`.

## Uruchomienie projektu



