# Havaitut virheet — korjauslista Claudelle

Päivitetty 2.10.2026. Nykyinen tarkistettu koodipohja: **11.8.1**, commit `ba4c616`.

Tämä tiedosto dokumentoi havainnot ja korjausten hyväksymiskriteerit. Korjauksia ei ole tehty tämän listan kirjoittamisen yhteydessä. Alkuperäiset selainhavainnot tehtiin versiossa 11.7 erillisessä kirjautumattomassa Edge/Playwright-istunnossa; alla kuvattu aiheuttava koodi tarkistettiin uudelleen versiosta 11.8.1. Rivinumerot ovat tämän version viitteitä ja voivat muuttua; funktion ja CSS-valitsimen nimet ovat ensisijaiset paikannustiedot.

## Tilanne versiossa 11.9

Claude kävi listan läpi 2.10.2026 ja korjasi alla olevat kohdat versioon **11.9**. Alkuperäiset havainnot on jätetty ennalleen tämän osion alle.

| ID | Tila | Mitä tehtiin | Tarkistus |
|---|---|---|---|
| BUG-001 | Korjattu | Sarja on kirjattu vasta, kun siinä on toistoja (`isLogged()`); sama ehto laskurissa, tallennuksessa ja painikkeen tilassa. `finishSession()` torjuu tyhjän treenin. Vanhaa historiaa ei siivottu. | Toisto-ohje ajettu selaimessa: koskematon esitäytetty treeni ei tallennu, ei myöskään painike pakotettuna. |
| BUG-002 | Ei korjata koodiin | RIR-napit poistettiin tarkoituksella versiossa 6.1 (commit `d914f98`). README päivitetty vastaamaan nykytilaa ja käyttämättömät `.rirrow`/`.rirbtn`-tyylit poistettu. Vanhojen kirjausten RIR-arvot säilyvät ja näkyvät edelleen. | – |
| BUG-003 | Korjattu osin | `advice()` on 6.1:n päätöksen mukainen (vain toistot), ei muutettu. `setTargetText()` ehdottaa painonlisäystä enää vain, kun edellisen kerran yhteenveto kehotti siihen. | Funktiot ajettu Nodessa: 12/8, 12/12, vajaa sarjamäärä, RIR 0/3, oma paino. Pysyviä regressiotestejä ei lisätty, koska repossa ei ole testiajoa. |
| BUG-004 | Korjattu | Tehdyn sarjan ✓ käyttää teeman `--on-acc`-väriä. Neon Synth 13,1:1, Tumma 10,8:1. | Lasketut värit luettu selaimesta kaikissa kahdeksassa teemassa. |
| BUG-005 | Korjattu | Koskee kaikkia dialogeja: kohdistus siirtyy dialogiin, Tab kiertää sen sisällä, `aria-modal="true"`, Esc sulkee, kohdistus palaa avaajaan. Teemavalitsin kohdistaa valittuun teemaan. | Teemavalitsin ajettu selaimessa simuloiduilla näppäintapahtumilla; muita dialogeja ei käyty yksitellen läpi. |
| BUG-006 | Korjattu | Art Decon `--up` tummennettu `#89651F` → `#775719`: 5,44:1 taustalla `#F2E8CE`. | Laskettu. |

## Alkuperäinen lista (11.8.1)

| ID | Prioriteetti | Havainto | Varmistus |
|---|---|---|---|
| BUG-001 | P1 | Esitäytetty paino tallentuu suoritetuksi sarjaksi ilman toistoja | Toistettu selaimessa; ehto edelleen koodissa |
| BUG-002 | P2 | Dokumentoitu RIR-kirjaus puuttuu käyttöliittymästä | Selainhavainto ja lähdekoodi |
| BUG-003 | P2 | Progressio ohittaa RIR:n ja sarjakohtainen tavoite voi olla ristiriidassa yhteenvedon kanssa | Lähdekoodi; toista korjauksen yhteydessä |
| BUG-004 | P2 | Tumma- ja Neon-teemojen tehdyn sarjan ✓-merkillä heikko kontrasti | Mitattu selaimessa; CSS edelleen sama |
| BUG-005 | P2 | Teemavalitsimen näppäimistökohdistus ja Esc-sulkeminen puuttuvat | Toistettu selaimessa; käsittely edelleen puuttuu |
| BUG-006 | P3 | Art Decon pienten korostustekstien kontrasti jää alle 4,5:1 | Mitattu selaimessa; värit edelleen samat |

Prioriteetit ovat tämän korjauslistan työjärjestys: P1 = tallennetun datan oikeellisuus, P2 = toiminta tai käytettävyys, P3 = pienempi visuaalinen puute. Aloita BUG-001:stä ja käsittele BUG-002 sekä BUG-003 yhdessä.

## BUG-001 — Esitäytetty paino muodostaa valetreenejä

**Koodikohdat:** [ensureActive()](index.html#L3387), [countLogged()](index.html#L5188), [finishSession()](index.html#L5195). GitHubin riviviitteiden sijasta etsi paikallisesti nämä funktionimet.

`ensureActive()` esitäyttää edellisen treenin painot mutta jättää toistot tyhjiksi ja `done`-tilan epätodeksi. Sekä `countLogged()` että `finishSession()` hyväksyvät kuitenkin sarjan ehdolla:

```js
num(s.reps) > 0 || num(s.kg) > 0
```

Siksi pelkkä esitäyttö avaa tallennuksen ja muuttuu historiassa suoritetuiksi sarjoiksi.

**Toisto-ohje:**

1. Käytä erillistä testiselainprofiilia ja kirjautumatonta paikallista sovellusta.
2. Avaa Iidiksen Ylävartalo A. Kirjaa ensimmäiseen liikkeeseen yksi sarja: 40 kg ja 10 toistoa. Päätä treeni.
3. Avaa Ohjelmat-näkymästä sama Ylävartalo A uudelleen.
4. Älä kirjoita mitään äläkä merkitse yhtään sarjaa tehdyksi.
5. Paina Päätä treeni. Se on virheellisesti käytettävissä.

**Havaittu tulos:** historiaan tallentui uusi treeni, jossa `chestpress` sisältää kaksi `{kg: 40, reps: 0, rir: ""}` -sarjaa. Tämä vääristää sarjamääriä ja voi siirtää toteutuneisiin treeneihin perustuvaa kiertoa.

**Korjauksen hyväksymiskriteerit:**

- Esitäytetty paino ilman kirjattuja toistoja ei kasvata kirjattujen sarjojen laskuria eikä avaa tallennusta.
- Pelkkä paino tai ✓-kuittaus ilman toistoja ei synnytä historiallista työsarjaa.
- Sama sarjan kelpoisuusehto on käytössä laskurissa, tallennuksessa ja tallennuspainikkeen tilassa. `finishSession()` torjuu myös suoran kutsun, jos kelvollisia sarjoja ei ole.
- Oman painon liike, jossa paino on 0 tai tyhjä mutta toistoja on kirjattu, toimii edelleen.
- Säilytä tarkoitettu mahdollisuus tallentaa kirjattu paino ja toistot ilman erillistä ✓-kuittausta; koodikommentti huomioi tämän jo nykyisin.
- Älä poista automaattisesti olemassa olevia historiakirjauksia. Mahdollinen vanhan datan siivous on erillinen päätös.

## BUG-002 — RIR:ää ei voi kirjata

**Koodikohdat:** `index.html`, `drawSets()` noin rivillä 3545; `README.md` rivit 14–17; `index.html` `.rirrow` ja `.rirbtn` -tyylit noin rivillä 405.

README lupaa painon, toistojen ja varaston eli RIR:n kirjauksen. Sarjan nykyinen DOM rakentaa vain painokentän, toistokentän ja ✓-painikkeen. RIR-tyylejä ja tietomallin `rir`-kenttä on jäljellä, mutta kirjauskontrollia ei rakenneta.

**Toisto-ohje:** avaa mikä tahansa treeni ja sarja. Yritä syöttää sarjalle RIR-arvo. Paino ja toistot ovat muokattavissa, RIR-kontrollia ei ole.

**Vaikutus:** uudet sarjat jäävät ilman RIR-tietoa; progressio-ohjeen dokumentoitu ehto ja RIR:ää käyttävä AI-vienti eivät saa sitä käyttöliittymästä.

**Korjauksen hyväksymiskriteerit:**

- Palauta saavutettava sarjakohtainen RIR-valinta dokumentoidun toiminnan mukaisesti.
- Valinta tallentuu kesken olevaan treeniin ja valmiiseen historiaan sekä toimii muokatessa aiempaa treeniä ja varmuuskopion kautta.
- RIR 0 on oikea arvo; sitä ei saa muuttaa puuttuvaksi falsy-tarkistuksella. Tarkista myös `rir: s.rir || ''` -tyyppiset tallennus- ja tuontikohdat, jos arvot voivat olla numeroita.
- Puuttuva RIR pysyy puuttuvana; sitä ei oleteta nollaksi eikä vanhoja kirjauksia täydennetä arvauksilla.
- Käyttö onnistuu 320 px:n leveydellä ja näppäimistöllä kaikissa kahdeksassa teemassa.
- README ja sovelluksen ohjeet kuvaavat lopullista toteutettua toimintaa.

## BUG-003 — Progression ehdot eivät vastaa ohjetta

**Koodikohdat:** `index.html`, `advice()` noin rivillä 1969 ja `setTargetText()` noin rivillä 2129; `README.md` rivit 16–17.

Dokumentoitu painonlisäyksen ehto on: kaikki määrätyt sarjat toistoalueen ylärajassa ja varasto merkitty 0–2.

- `advice()` tarkistaa sarjamäärän ja toistot mutta ei lue RIR:ää. Se voi palauttaa painonlisäyksen myös puuttuvalla RIR:llä tai RIR 3:lla.
- `setTargetText()` hyväksyy puuttuvan RIR:n ehdolla `rir === null || rir <= 2` ja päättää painonlisäyksen yhden edellisen sarjan perusteella.
- Sarjakohtainen tavoite voi siksi ehdottaa +2,5 kg, vaikka saman liikkeen yhteenveto kehottaa pitämään painon. Esimerkiksi kahden sarjan liikkeessä, jonka toistoalue on 8–12, edelliset sarjat 40 kg × 12 ja 40 kg × 8 voivat johtaa tähän ristiriitaan.

**Tarkistus korjauksen yhteydessä:** syötä tai tuo testidata, jossa kaikki toistot ovat ylärajassa mutta RIR puuttuu; vertaa sitä tapauksiin RIR 3, RIR 0 ja RIR 2. Tarkista myös yllä kuvattu 12/8-toistojen tapaus sekä vajaaksi jäänyt määrätty sarjamäärä. Tämä havainto perustuu lähdekoodiin, ei kaikki nämä tapaukset kattavaan aiempaan selainajoon.

**Korjauksen hyväksymiskriteerit:**

- Sarjakohtainen tavoite ja yhteenveto käyttävät yhteistä, dokumentoitua progression päätöstä.
- Painonlisäystä ei päätellä puuttuvasta RIR:stä, jos dokumentoitu 0–2-ehto säilyy.
- RIR 0 käsitellään oikein, ja määritelty sarjamäärä sekä kaikkien sarjojen yläraja huomioidaan.
- Yksittäinen ylärajaan yltänyt sarja ei aiheuta liikkeen yhteenvetoon nähden ristiriitaista painonlisäysohjetta.
- Lisää mielekkäät regressiotestit ainakin puuttuvalle RIR:lle, RIR 0/2/3:lle, vajaalle sarjamäärälle ja 12/8-toistojen tapaukselle.

## BUG-004 — Tehdyn sarjan ✓ häviää vaaleaan vihreään

**Koodikohdat:** `index.html` noin rivi 877, `.donebtn[aria-pressed="true"]`; `themes.css`, `dark`- ja `neon`-paletit. Nordic Rune- ja Viking Berserk -teemoille on jo erillinen `color: var(--on-acc)` -korjaus, mutta se ei kata näitä kahta teemaa.

**Toisto-ohje:** valitse Tumma tai Neon Synth, avaa treeni, syötä sarja ja paina ✓. Tarkastele tehdyn sarjan merkkiä.

**Mitattu tulos:** valkoinen merkki vihreällä taustalla:

| Teema | Teksti | Tausta | Kontrasti |
|---|---|---|---|
| Neon Synth | `#FFFFFF` | `#5BEA97` | 1,54:1 |
| Tumma | `#FFFFFF` | `#A5D4B2` | 1,66:1 |

**Korjauksen hyväksymiskriteerit:**

- Tehdyn sarjan merkki erottuu selvästi. Käytä näissä teemoissa sopivaa tummaa väriä; `--on-acc` on mahdollinen lähtökohta.
- Merkin ja taustan kontrasti on vähintään 3:1; tavoittele 4,5:1, jos merkkiä käsitellään tavallisena tekstinä.
- Tarkista tekemättömän, tehdyn ja kohdistetun painikkeen tila kaikissa teemoissa. Muutos ei saa heikentää vaaleiden teemojen nykyistä kontrastia.

## BUG-005 — Teemadialogin näppäimistökäyttö on puutteellinen

**Koodikohdat:** `index.html`, `showSkins()` noin rivillä 5074; `keydown`-käsittelijät noin riveillä 3307 ja 6742; `[data-setskin]`- ja `[data-close]`-käsittely noin rivillä 6686.

**Toisto-ohje:**

1. Kohdista näppäimistöllä yläpalkin Väriteema-painikkeeseen ja avaa valitsin Enterillä.
2. Tarkista aktiivinen elementti: kohdistus jää avaajaan dialogin taakse.
3. Paina Tab: taustan kontrollit ovat edelleen kohdistettavissa.
4. Paina Escape: teemavalitsin ei sulkeudu.

Dialogilla on `role="dialog"`, mutta `aria-modal` puuttuu eikä taustaa rajata inertiksi. Huomio: teeman vaihtamisen jälkeen nykyinen koodi jo kohdistaa valittuun teemapainikkeeseen. Säilytä tämä toimiva osa; puute koskee erityisesti avaamista, kohdistuksen rajausta ja sulkemista.

**Korjauksen hyväksymiskriteerit:**

- Avaaminen siirtää kohdistuksen valittuun teemaan tai muuhun tarkoituksenmukaiseen dialogin kontrolliin.
- Tab ja Shift+Tab pysyvät dialogissa eikä taustan kontrolleihin voi vahingossa siirtyä.
- Dialogi ilmoitetaan modaaliseksi myös saavutettavuuspuulle.
- Escape ja Valmis sulkevat dialogin ja palauttavat kohdistuksen avaajaan.
- Teeman vaihdon ja laitteen väriasetuksen muutoksen aiheuttama uudelleenrenderöinti ei pudota kohdistusta taustalle.
- Tarkista myös, että pienessä näytössä valittu teema on vieritettävissä näkyviin sticky-painikkeen yläpuolelle.

## BUG-006 — Art Decon pienet kultaiset tekstit ovat hieman liian vaaleita

**Koodikohdat:** `themes.css`, `deco`-paletti noin rivillä 36; `index.html`, `.chip.shared` noin rivillä 231 ja `.wklegend .lg.done` noin rivillä 796.

**Toisto-ohje:** valitse Art Deco. Avaa treeni, jossa on `Yhteinen · Matti`-merkintä. Tarkista myös etusivun viikkonäkymän Tehty-selitteen ✓.

**Mitattu tulos:** `--up: #89651F` tekstinä `--up-soft: #F2E8CE` -taustalla tuottaa noin **4,36:1** kontrastin. Yhteinen-merkinnän tekstikoko on 11 px.

**Korjauksen hyväksymiskriteerit:**

- Pienen tekstin kontrasti on vähintään 4,5:1, mieluiten selkeällä marginaalilla.
- Tummenna sopivaa tekstiväriä tai säädä pehmeää taustaa ja varmista kaikki samoja muuttujia käyttävät kontrollit, esikatselut ja kohdistusrenkaat.
- Säilytä Art Decon norsunluu- ja messinkityyli.

## Jo korjattu — ei avoin tehtävä

**FIXED-001: Viking Berserkin kuvassa tangon pää tuli painolevyn läpi väärästä kohdasta.** Käyttäjän pyynnöstä tangon ulkoneva pää ja kiinnityskaulus poistettiin ImageGenillä. Nykyinen `assets/hero-berserk.webp` näyttää yhtenäisen etupinnan ja punahehkuisen uhrimerkin. Korjaus sisältyy versioon **11.8.1**; kuvan lataus tarkistettiin 390 ja 1280 px:n leveyksillä sekä offline-tilassa. Muokkauksen kehote: [images/nordic-viking-prompts.md](images/nordic-viking-prompts.md).

## Varmennetut asiat ja tarkistuksen rajat

- Alkuperäisten kuuden teeman vaihtaminen, valinnan säilyminen ja Laitteen mukaan -tila toimivat aiemmassa selainajossa. Uusien kahden teeman vastaavat asiat tarkistettiin lisäyksen yhteydessä.
- Etusivulla ei havaittu vaakaylivuotoa 320–1280 px:n tarkistetuilla leveyksillä. Treeninäkymä tarkistettiin myös pienillä puhelinkooilla.
- Ohjelmat-, Kehitys- ja Kalenteri-navigointi sekä kokeiltu tavallinen sarjan tallennus toimivat.
- Kuvataustat ja riimukoristeet olivat offline-välimuistissa; sovellus avautui ilman verkkoa.
- Kokeilluissa käyttöpoluissa ei havaittu JavaScript-poikkeuksia. Tämä ei osoita, että kaikki käyttöpolut olisivat virheettömiä.
- Google Fonts -pyynnöt estyivät testiympäristön verkkorajoituksiin. Tätä ei ole luokiteltu sovelluksen viaksi. Kuvakaappaukset käyttivät varafontteja.
- Firebase-kirjautumista, pilvisynkronointia ja treenikaverijakoa ei testattu kirjautuneena. Niiden toimivuudesta ei tehty päätelmää.
- Kontrastimittaukset koskivat tekstin ja CSS-taustavärien suhdetta. Kuva- ja liukuväritaustat tarkasteltiin lisäksi visuaalisesti; kyseessä ei ollut koko sovelluksen saavutettavuusauditointi.
- Erillistä `Saliohjelma-offline.html`-tiedostoa ei testattu. Pääsovellus on `index.html`, jonka offline-toiminta perustuu `sw.js`:ään.

## Korjausten luovutus

Toista kunkin tehtävän havainto ensin erillisellä testidatalla, toteuta korjaus ja kirjaa tämän tiedoston kyseiseen kohtaan korjauksen versio sekä tehdyt tarkistukset. BUG-001–003 tarvitsevat regressiotestit, koska ne vaikuttavat tallennettuun dataan ja laskentaan. Visuaalisille ja kohdistuskorjauksille riittää kohdennettu selaintarkistus, jos se kattaa kuvatut tilat. Huomioi päivityksessä sovelluksen versionumerot ja service workerin välimuisti, jotta käyttäjä saa korjatut tiedostot.
