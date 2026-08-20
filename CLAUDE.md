# Project rules

## Dark/light mode styling

Use the `[data-bs-theme="dark"]` / `[data-bs-theme="light"]` attribute selectors for theme-specific CSS, not `@media (prefers-color-scheme: ...)`. The `data-bs-theme` attribute is set on `<html>` by `app/infra/darkTheme.tsx` (from system preference or an explicit user toggle), so attribute selectors correctly follow the in-app toggle while a media query would not.

Example (see `app/japanese/japaneseMusicCovers/styles.css` for more):

```css
[data-bs-theme="dark"] .my-component {
  color: #e9ecef;
}

[data-bs-theme="light"] .my-component {
  color: #343a40;
}
```

## Testing changes

Do not run dev servers (playwright) in order to verify results. For visuals/UI, I will do the check myself.

For non-visual changes, create unit tests to assure functionality and correct implementation.