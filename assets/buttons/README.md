# Fotorealistische Button-Oberflächen

Stand: 18. September 2026

Die beiden PNG-Dateien wurden mit dem eingebauten OpenAI-Bildgenerator erzeugt.
Es wurden keine fremden Bildvorlagen verwendet. Beide Grafiken enthalten
bewusst weder Text noch Logos; Beschriftungen und Bedienzustände bleiben Teil
des HTML- und CSS-Codes.

Seit Version 0.4 nutzt die Website für ihre aktiven Buttons skalierbare
CSS-Metalloberflächen. Die PNG-Dateien bleiben als frühere Designvariante und
als nachvollziehbare Bildquelle im Projekt erhalten, werden aber derzeit nicht
geladen.

## Dateien

| Datei | Verwendung |
|---|---|
| `button-primary.png` | grüne Hauptaktionen |
| `button-secondary.png` | dunkle Nebenaktionen |

## Prompt für `button-primary.png`

```text
Use case: product-mockup
Asset type: reusable website button surface, primary action
Primary request: Create a single photorealistic blank UI button keycap inspired by premium professional spreadsheet software.
Scene/backdrop: genuinely transparent background.
Subject: one wide horizontal rounded-rectangle button, approximately 4:1 aspect ratio, viewed straight-on with only a very subtle top-down perspective.
Style/medium: high-end macro product photography / physically based 3D render.
Lighting/mood: controlled soft studio light, crisp but restrained highlights, convincing depth, immediately readable as clickable.
Color palette: rich Excel-like emerald green with a slightly brighter lime-green light edge.
Materials/textures: enamel-coated metal with very fine realistic microtexture, subtle bevel, shallow inset center, soft contact shadow.
Constraints: transparent background; no text; no letters; no numbers; no icons; no logos; no watermark; centered with generous transparent margins; clean edges; suitable behind live HTML text.
Avoid: exaggerated gloss, plastic toy look, dramatic perspective, hands, desk, background scene.
```

## Prompt für `button-secondary.png`

```text
Use case: product-mockup
Asset type: reusable website button surface, secondary action
Primary request: Create a single photorealistic blank UI button keycap for a refined dark educational web application.
Scene/backdrop: genuinely transparent background.
Subject: one wide horizontal rounded-rectangle button, approximately 4:1 aspect ratio, viewed straight-on with only a very subtle top-down perspective.
Style/medium: high-end macro product photography / physically based 3D render.
Lighting/mood: controlled soft studio light, subtle cool reflections, convincing depth, clearly clickable without appearing flashy.
Color palette: deep graphite and midnight navy with a faint cool blue-green rim light.
Materials/textures: anodized brushed metal under dark smoked glass, subtle bevel, shallow inset center, soft contact shadow.
Constraints: transparent background; no text; no letters; no numbers; no icons; no logos; no watermark; centered with generous transparent margins; clean edges; suitable behind live HTML text.
Avoid: exaggerated gloss, plastic toy look, dramatic perspective, hands, desk, background scene.
```

## Technische Einbindung

Die Dateien wurden in Version 0.3 als Hintergrundbilder eingesetzt. Die
aktuelle CSS-Fassung bildet Material, Fokus-, Hover- und Aktivzustände direkt
im Browser ab und passt sich dadurch sauber an jede Buttonbreite an.
