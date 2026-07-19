# Our Days — code map

The site deliberately uses plain HTML, CSS and JavaScript. The numbered section comments are stable reference points for future changes.

## Files

- `index.html` contains the page structure, navigation and forms.
- `styles.css` contains layout, colours and responsive behaviour.
- `firebase-app.js` contains the data, Firebase connection and all behaviour.

## JavaScript sections

| Section | Purpose | Typical reason to edit it |
|---|---|---|
| 01 | Firebase connection and shared helpers | Firebase project or administrator changes |
| 02 | People, baseline tasks and outings | Add or alter the standard tasks shown each day |
| 03 | Three-level wheel activity library | Add areas, subjects or individual activities |
| 04–06 | Runtime state, saving and page setup | Usually leave alone |
| 07 | Today page | Change how baseline tasks and their notes appear |
| 08 | Personal activity wheels | Change wheel stages, spins or task selection |
| 09 | Baseline completion handling | Change points or choice behaviour |
| 10 | Outings wheel | Change filters or spin behaviour |
| 12 | Editing and deletion | Change entry controls |
| 13 | Activity journal | Change the rolling completed-task display |
| 14 | New things tried | Change the clustered circle map |
| 15 | Points and rewards | Change milestones or cash conversion |
| 16 | Scrapbook | Change memories or photo handling |
| 17 | Admin tables | Change the editable management screen |

## Adding content

- A normal recurring task belongs in the `tasks` array in section 02.
- A place to visit belongs in the `outings` array or `outingExpansion` in section 02.
- A Hunter wheel branch uses `addLearning(area, subject, activities)` in section 03.
- An adult wheel branch uses `addPersonal(person, area, subject, activities)` in section 03.

Entries created while using the site—completion notes, new things, memories and manually added daily tasks—are stored in Firebase and do not need to be hardcoded here.
