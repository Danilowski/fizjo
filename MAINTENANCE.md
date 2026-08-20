# M.Therapy Website - Maintenance Workflow

Ten plik opisuje prosty workflow utrzymania strony po wykonanych optymalizacjach.

## 1. Zasady edycji

- Wspolne sekcje podstron edytuj tylko w:
  - `partials/subpage-header.html`
  - `partials/subpage-footer.html`
- Nie edytuj recznie blokow miedzy markerami `SHARED_SUBPAGE_*` w podstronach, bo i tak zostana nadpisane przez synchronizacje.
- Logika front-end i tracking:
  - zrodlo: `script.js`
  - produkcja: `script.min.js`
- Style:
  - zrodlo: `style.css`
  - produkcja: `style.min.css`

## 2. Standardowy proces zmian

1. Wprowadz zmiane w plikach zrodlowych.
2. Jesli zmiana dotyczy wspolnego naglowka/stopki podstron, uruchom:

```bash
npm run sync:subpages
```

3. Po zmianach CSS/JS uruchom build:

```bash
npm run build
```

4. Szybka walidacja:

```bash
grep -R -n "SHARED_SUBPAGE_HEADER_START\|SHARED_SUBPAGE_FOOTER_START" fizjoterapia-ortopedyczna-bydgoszcz/index.html fizjoterapia-stomatologiczna-bydgoszcz/index.html kontakt-i-dojazd/index.html pierwsza-wizyta/index.html rehabilitacja-pooperacyjna-bydgoszcz/index.html terapia-bruksizmu-bydgoszcz/index.html
```

## 3. Checklista regresji

Po kazdej zmianie sprawdz minimum:

- 6 podstron na mobile i tablet.
- Brak poziomego overflow.
- Dzialanie menu (otwieranie/zamykanie, submenu, ESC).
- Widocznosc mobile action bar na mobile/tablet i brak na desktop.
- Linki stopki i nawigacji.

## 4. Co oznacza opcjonalny punkt 1 (content/SEO)

Punkt 1 to uzupelnienie opisow tresciowych w kartach "Metody pracy", gdzie obecnie sa same naglowki technik bez krotkiego opisu korzysci lub zastosowania.

Przyklady miejsc:

- `fizjoterapia-ortopedyczna-bydgoszcz/index.html`
- `fizjoterapia-stomatologiczna-bydgoszcz/index.html`
- `pierwsza-wizyta/index.html`
- `rehabilitacja-pooperacyjna-bydgoszcz/index.html`
- `terapia-bruksizmu-bydgoszcz/index.html`

Przyklad formatu karty:

```html
<article class="help-card">
  <h4>Mobilizacja stawow skroniowo-zuchwowych</h4>
  <p>Delikatna praca na stawie pomaga zmniejszyc bol i poprawic zakres ruchu zuchwy.</p>
</article>
```

To nie jest bug techniczny. To ulepszenie merytoryczne, ktore zwykle poprawia:

- jakosc tresci dla uzytkownika,
- czytelnosc sekcji,
- sygnaly SEO (bardziej kompletna zawartosc strony).
