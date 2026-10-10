# Review III deck source

`build.js` generates [`../KinSync_Review_III.pptx`](../KinSync_Review_III.pptx), the 14-slide
deck for Review III. The slide text matches [`../review-3-content.txt`](../review-3-content.txt).
When a fact changes (a date, a count, a status), change it in both places.

## Rebuild

Needs Node.js 18 or later.

```bash
cd idp/reviews/review-3-material/deck
npm ci           # installs the pinned versions from package-lock.json
npm run build    # writes ../KinSync_Review_III.pptx
```

`node build.js <file.pptx>` writes the deck somewhere else, for example to check a change
before replacing the committed deck.

## How the script is laid out

- `THEME`: fonts (Cambria headings, Calibri body) and colours. Slides use only theme colours,
  so a colour changed here changes every slide.
- Two slide layouts: `KS_DARK` (title and closing slides) and `KS_CONTENT` (every other slide,
  with the footer and slide number).
- One function per slide, called in order from `main()`. Each slide also has speaker notes.
- Icons come from Font Awesome through `react-icons`, drawn white in a coloured circle.
- `applyThemeColors()` writes the theme colours into the saved file, because `pptxgenjs`
  only writes the theme fonts.

## Checking a rebuilt deck

Open it in PowerPoint or LibreOffice and look at every slide for text that overflows its box
or overlaps another shape. Long slide titles are the usual cause: keep them to one line.
