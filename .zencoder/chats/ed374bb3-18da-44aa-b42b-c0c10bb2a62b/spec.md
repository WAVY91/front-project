# Technical Specification - Navbar Layout Correction

## Technical Context
- Language: JavaScript (React)
- Styling: CSS
- Router: react-router-dom
- State Management: Redux (for user auth)

## Implementation Approach
The goal is to rearrange the Navbar items into two distinct groups: left and right.

### Layout Changes:
1.  **Left Group**: Logo, Home, Campaigns, About, Impact.
2.  **Right Group**: Contact, Sign In, Sign Up.

### Component Changes (`src/components/Navbar.jsx`):
- Move the "Contact" link from the `.nav-menu` div to a new position within the right-side container (or grouped with buttons).
- Ensure the logical grouping matches the visual requirement.

### Style Changes (`src/styles/Navbar.css`):
- Adjust `.nav-container` to maintain `justify-content: space-between`.
- Remove `flex: 1` and `justify-content: center` from `.nav-menu` to allow it to sit next to the logo.
- Wrap the left items (Logo + Menu) in a container if needed, or simply adjust the menu to not take up all available space.
- Alternatively, keep Logo separate and let the menu and buttons handle the spacing.
- Best approach:
    - `.nav-container` stays `display: flex; justify-content: space-between;`.
    - Create a wrapper for the left items: `<div className="nav-left">Logo + Menu</div>`.
    - Create a wrapper for the right items: `<div className="nav-right">Contact + Buttons</div>`.
    - Update CSS to handle these new wrappers.

## Source Code Structure Changes
- `src/components/Navbar.jsx`: Rearrange JSX elements and add wrapper classes.
- `src/styles/Navbar.css`: Add styles for `.nav-left`, `.nav-right` and update existing ones.

## Data Model / API / Interface Changes
- None.

## Verification Approach
- Manual code review of the layout structure.
- Run `npm run lint` (if available) to ensure no regressions.
