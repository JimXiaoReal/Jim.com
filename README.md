# Jim.com Portfolio Website

This is a simple static portfolio website that presents your awards, experiences, and activities.

## How it works

- Edit `data.js` to update your profile details.
- `index.html` uses `script.js` to render each section from `portfolioData`.
- `styles.css` contains the page styling.

## Quick start

1. Open `index.html` in your browser.
2. For the best preview in VS Code, use the Live Server extension.
3. Update the arrays in `data.js` for `experiences`, `awards`, and `activities`.

## Editable sections

- `name`
- `title`
- `intro`
- `contactCopy`
- `contact`
- `experiences`
- `awards`
- `activities`

## Example content

Each list entry should use this structure:

```js
{
  title: 'Role or Award',
  organization: 'School or Company',
  date: '2024',
  description: 'Short summary of what you achieved.'
}
```
