import type { ToolContent } from './types';

// pdf-to-image. German content (competitor-grounded, not a literal translation).

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'PDF in Bild umwandeln — Seiten im Browser als PNG oder JPG rendern | runlocally',
    description:
      'Wandle PDF-Seiten direkt im Browser in PNG- oder JPG-Bilder um. Wähle Seiten, Format, Qualität und Auflösung. Die Datei wird auf deinem Gerät gelesen und nie hochgeladen. Open Source (MIT), funktioniert offline.',
    ogTitle: 'PDF in Bild umwandeln — Seiten im Browser als PNG oder JPG rendern',
    ogDescription: 'PDF-Seiten im Browser in PNG- oder JPG-Bilder umwandeln. Nichts wird hochgeladen. Open Source, funktioniert offline.',
  },

  hero: {
    h1: 'PDF in Bild umwandeln',
    tagline: 'PDF-Seiten als PNG oder JPG rendern — im Browser. Es wird nichts hochgeladen.',
  },

  intro: {
    h2: 'Ein PDF im Browser in Bilder umwandeln',
    paras: [
      'Lege ein PDF ab, und das Tool öffnet es und zeigt eine Vorschau jeder Seite. Wähle die gewünschten Seiten, entscheide dich für PNG oder JPG, eine Qualitätsstufe und eine Auflösung, und lade das Ergebnis herunter. Eine einzelne Seite lädt als Bild herunter, mehrere als .zip.',
      'Die Seiten werden tatsächlich gerendert — derselbe Inhalt, den auch ein PDF-Betrachter zeichnen würde, wird auf ein Canvas gemalt und als Bild kodiert, nicht bloß extrahiert oder neu verpackt. Das Ergebnis sieht deshalb genauso aus wie die Seite selbst, in der gewählten Auflösung — egal ob Text, ein gescanntes Foto oder Vektorgrafik.',
    ],
  },

  privacy: {
    h2: 'Warum deine Datei auf deinem Gerät bleibt',
    lead: 'Privatsphäre ist hier strukturell verankert, kein Versprechen. Es gibt keinen Upload-Schritt, weil es keinen Server gibt, an den hochgeladen werden könnte:',
    points: [
      'Das Rendern läuft vollständig in deinem Browser.',
      'Die Seite wird als statische Dateien ausgeliefert und sendet dein PDF mit keiner Anfrage mit.',
      'Der Quellcode ist offen und für jeden einsehbar (MIT).',
      'Es funktioniert offline — nur möglich, weil nichts das Gerät verlässt.',
    ],
    note: 'Wer es selbst prüfen möchte: Öffne beim Rendern das Network-Panel deines Browsers — keine Anfrage enthält deine Datei.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So funktioniert es',
    steps: [
      {
        h3: 'PDF auswählen',
        p: 'Klicke, um ein PDF auszuwählen, oder lege es irgendwo auf der Seite ab. Nach dem Laden erscheint eine Vorschau jeder Seite.',
      },
      {
        h3: 'Seiten, Format und Auflösung wählen',
        p: 'Klicke auf Vorschaubilder, um Seiten zum Rendern auszuwählen (anfangs sind alle ausgewählt). Wähle in den Einstellungen PNG oder JPG, eine JPG-Qualitätsstufe und eine Auflösung in DPI — eine höhere DPI-Zahl ergibt ein größeres, schärferes Bild.',
      },
      {
        h3: 'Herunterladen',
        p: 'Eine ausgewählte Seite lädt als einzelnes Bild herunter. Bei mehreren Seiten entsteht ein .zip mit einer Datei pro Seite.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Wird mein PDF irgendwohin hochgeladen?',
      a: 'Nein. Das Rendern läuft vollständig im Browser. Es gibt keine Serverkomponente, deine Datei hat also keinen Weg, dein Gerät zu verlassen. Der Quellcode ist offen, das lässt sich im Network-Panel des Browsers nachprüfen.',
    },
    {
      q: 'Welche Auflösung sollte ich wählen?',
      a: 'Für die Ansicht am Bildschirm reichen etwa 150–200 DPI. Zum Drucken, oder um beim Scannen eines Dokuments kleine Schrift und feine Details lesbar zu halten, eignen sich 300 DPI oder mehr. Eine höhere DPI-Zahl bedeutet eine größere Datei und etwas längeres Rendern.',
    },
    {
      q: 'Kann ich nur bestimmte Seiten auswählen?',
      a: 'Ja. Klicke auf ein Seiten-Vorschaubild, um es aus- oder abzuwählen, oder nutze Alle auswählen / Umkehren / Leeren. Bei genau einer ausgewählten Seite entsteht ein einzelnes Bild, bei mehreren ein .zip mit einem Bild pro Seite.',
    },
    {
      q: 'PNG oder JPG — was ist besser?',
      a: 'PNG ist verlustfrei und meist schärfer bei Text und Strichzeichnungen, erzeugt aber größere Dateien. JPG ist kleiner, mit einstellbarer Qualität, und eignet sich gut für Seiten, die überwiegend aus Fotos oder gescannten Bildern bestehen.',
    },
    {
      q: 'Kann es ein passwortgeschütztes PDF öffnen?',
      a: 'Nein. Verschlüsselte (passwortgeschützte) PDFs lassen sich nicht öffnen, du erhältst dazu eine klare Meldung. Entferne das Passwort zuerst in einem vertrauenswürdigen Programm und rendere die Datei dann hier.',
    },
    {
      q: 'Funktioniert es offline?',
      a: 'Ja. Es ist eine PWA. Nach dem ersten Besuch wird sie zwischengespeichert, sodass das Rendern auch ohne Netzwerkverbindung funktioniert. Du kannst sie außerdem auf deinem Startbildschirm installieren.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon: 'Entwickelt und gepflegt von Geppetto. Ein Teil des Codes entsteht mit KI-Unterstützung; Prüfung und Entscheidungen liegen stets beim Maintainer.',
    securityText: 'Sicherheit',
  },
};
