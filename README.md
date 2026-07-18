# Our Days

A mobile-friendly family planner, activity selector, progress tracker and scrapbook. The main title is timeless; the initial season is **Summer 2026**.

## Firebase-connected version

The app is connected to the private `our-days-b22c6` Firebase project. It uses Email/Password Authentication, Firestore for shared data and Firebase Storage for compressed scrapbook photographs.

The included screens are:

- **Today** — individual routines, useful activities and the current plan.
- **Explore** — a conditions-based England/Dieppe outing wheel.
- **Progress** — points and £5-per-100-point milestones.
- **Memories** — the Summer 2026 scrapbook.
- **Manage** — editable task and outing tables.

## Firebase structure

The editable configuration is deliberately kept together in `app/state` so the management screen behaves like one table and tasks are not fiddly to maintain individually. Photographs are stored separately under `memories/` in Firebase Storage.

Do not commit private Firebase service-account keys. The public web configuration is added separately, while Firestore and Storage access is protected with Authentication and Security Rules.

## GitHub Pages

For GitHub user `pelld`, create a repository such as `our-days`, upload these files to its root, and enable Pages from the repository settings. The eventual address will be:

`https://pelld.github.io/our-days/`
