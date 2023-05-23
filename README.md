# Kryptowaluty-API
Ten projekt to strona internetowa umożliwiająca wyświetlanie danych dotyczących kryptowalut. Strona korzysta z interfejsu API, aby pobierać informacje o różnych kryptowalutach, takie jak ranking, nazwa, symbol, cena, zmiana wartości, kapitalizacja rynkowa itp.

Projekt składa się z kilku głównych elementów:

Struktura HTML: Zdefiniowana struktura strony internetowej, w tym pasek nawigacyjny, tabela z danymi kryptowalut, modal (okienko) wyświetlające szczegółowe informacje o wybranej kryptowalucie, oraz kilka elementów interaktywnych, takich jak przyciski.

Arkusz stylów CSS: Stylowanie elementów na stronie za pomocą reguł CSS. Wykorzystuje on również bibliotekę Bootstrap do zapewnienia responsywności i podstawowego wyglądu strony.

Skrypty JavaScript: Wykorzystywane są do manipulacji danymi, obsługi interakcji użytkownika i interfejsu strony. Skrypty pobierają dane z API kryptowalut, przetwarzają je i tworzą interfejs użytkownika. W projekcie znajdują się funkcje do sortowania danych, filtrowania tabeli, dodawania i usuwania kryptowalut z listy ulubionych, wyświetlania szczegółowych informacji o kryptowalucie w modalu oraz obsługi kilku innych akcji.

Wykorzystanie API: Projekt korzysta z Coinranking API do pobierania danych kryptowalut. Wykorzystuje zapytania HTTP, wysyła nagłówki z kluczami dostępu (API keys) w celu autoryzacji, a następnie przetwarza otrzymane odpowiedzi w formacie JSON.

Projekt umożliwia użytkownikom przeglądanie danych kryptowalut, sortowanie ich według różnych parametrów, wyszukiwanie kryptowalut po nazwie, dodawanie i usuwanie kryptowalut z listy ulubionych oraz wyświetlanie szczegółowych informacji o poszczególnych kryptowalutach.

## Instalacja

1. Sklonuj repozytorium na swoje urządzenie.
2. Przejdź do katalogu projektu.
3. Otwórz plik `index.html` w przeglądarce.

### Przyszłe zmiany
•	Utworzenie wykresu zmian ceny
•	Stworzenie wirtualnego salda, gdzie użytkownik będzie podawał ilość posiadanej kryptowaluty i na bieżąco śledził wzrosty lub spadki kapitału

