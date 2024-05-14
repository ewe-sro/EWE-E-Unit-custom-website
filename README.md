# EWE E-Unit - custom webová stránka

Tato webová stránka slouží jako jednoduchá custom administrace, která běží na nabíjecím kontroleru na portu :81.

## Použité technologie
- **_11ty_** - generátor statických stránek - https://www.11ty.dev/
- **_LESS_** - CSS preprocesor, který dovoluje používat proměnné, nesting atd. - https://lesscss.org/
- **_TailwindCSS_** - CSS framework - https://tailwindcss.com/

## Úprava webové stránky
Pro úpravení webové stránky je potřeba:
- Stáhnout si GitHub repozitář pomocí `git pull`
- Otevřít si stažený repozitář a stáhnout si potřebné balíky pomocí `npm install`
- Spustit lokální server pomoíc `npm start` - webová stránka je poté přístupná na adrese `localhost:8080`

## Nahrání webové stránky na kontroler
Pro nahrání webové stránky na kontroler stačí vygenerovat webovou stránku pomocí příkazu `npm run build` a zkopírovat obsah vytvořené složky **_public_** do kontroleru do složky **_/data/user-app/website_**
