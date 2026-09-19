# Saliohjelma

Iidiksen ja Matin salitreeniohjelmat yhtenä selainsovelluksena. Ei riippuvuuksia, ei palvelinta:
koko sovellus on yhdessä `index.html`-tiedostossa, ja kirjaukset tallentuvat selaimeen.

**Sovellus:** https://hurjamies.github.io/saliohjelma/

## Mitä se tekee

- **Päivän suositus** – kierto Ylä A → Ala A → Ylä B → Ala B jatkuu siitä mihin jäätiin.
  Viikko ei nollaudu maanantaina; saman alueen kovien treenien väliin jää vähintään 2 vrk.
- **Kolme viikkoriviä** – runko (ohjelman perusta), suositus (mukautuu kirjauksiin) ja toteutunut.
- **Sarjakohtainen kirjaus** – paino, toistot ja varasto (RIR) pikapainikkeilla. Jokaisessa sarjassa
  näkyy edellisen kerran tulos ja tavoite, esim. *Viimeksi 80 kg × 12 @1 · tavoite 80 kg × 13*.
- **Progressio-ohje** – painon lisäystä ehdotetaan vasta kun kaikki sarjat ovat toistoalueen
  ylärajassa ja varasto on merkitty 0–2.
- **Ennätykset ja yhteenveto** – kesto, työsarjat, montako liikettä parani, PR:t ja vertailu
  edelliseen samaan treeniin.
- **Kalenteri** – menneitä päiviä voi muokata: vaihtaa ohjelman, siirtää päivää, poistaa tai lisätä
  treenin, cardion (Hyrox / jumppa / juoksu / muu) tai lepopäivän.
- **Kehityskäyrät** – liikkeen paras työsarja ensisijaisena mittarina, kokonaiskuorma sekundäärisenä.
  A- ja B-päivien historia pidetään erillään.
- **Kuusi väriteemaa** – Neon Synth, Art Deco, Mustavalkopunainen, Luonto, Tumma, Vaalea.
- **Varmuuskopio** – vie ja tuo kaikki kirjaukset JSON-tiedostona.

## Asennus puhelimeen

1. Avaa https://hurjamies.github.io/saliohjelma/ Chromessa.
2. Valikko ⋮ → **Lisää aloitusnäyttöön**.
3. Sovellus avautuu omalla kuvakkeella ilman selaimen osoiteriviä ja toimii ilman verkkoa
   ensimmäisen latauksen jälkeen (service worker).

## Tietojen tallennus

Kirjaukset tallentuvat laitteen selaimeen (`localStorage`). Ne eivät siirry laitteiden välillä
automaattisesti – käytä **Ohjeet → Varmuuskopio → Vie data / Tuo data**, jos vaihdat laitetta.
Sovellus ei lähetä tietoja mihinkään.

## Ohjelmien tausta

Liikkeet ja sarjamäärät perustuvat Iidiksen ja Matin omiin ohjelmiin:
neljän treenin viikko, ylä/ala-jako, 2 sarjaa perusannoksena ja 3 prioriteettiliikkeille,
1–2 toistoa varastossa (viimeinen sarja 0–1).

- ACSM:n voimaharjoittelusuositus (2026): https://acsm.org/resistance-training-guidelines-update-2026/
- Aerobisen ja voimaharjoittelun yhdistäminen: https://pubmed.ncbi.nlm.nih.gov/34757594/
