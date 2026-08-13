Kana v2 layout cleanup

Drop these two files into the root of nayanct/kana-v2:
1. Replace index.html with this index.html.
2. Add kana-layout-cleanup.css next to styles.css.

No app.js changes are required. The override stylesheet:
- removes the desktop sidebar/dashboard chrome and makes navigation compact
- turns the mode menu into a simple single-column choice list
- hides nonessential chrome during an active practice session
- keeps the kana, answer field, feedback, sound, shortcut hint, and lightweight stats above the fold
- moves Practice setup below the drill so the page itself scrolls to it
- removes the nested Stage scrollbar
- preserves the existing settings/theme variables and practice behavior
