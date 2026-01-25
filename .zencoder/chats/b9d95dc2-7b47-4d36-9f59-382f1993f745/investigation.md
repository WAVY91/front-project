# Investigation Report - Campaign Edit Bug

## Bug Summary
When an NGO user attempts to edit a campaign in the dashboard, the application crashes with an `Uncaught TypeError: Cannot read properties of undefined (reading 'toString')`. This happens specifically after creating a new campaign and then clicking the "Edit" button.

## Root Cause Analysis
The crash occurs in `src/pages/NGODashboard.jsx` within the `initialValues` of the `Formik` component used for editing. 
Specifically:
- `goalAmount: editingCampaign.goalAmount.toString()` (line 190)
- `daysLeft: editingCampaign.daysLeft.toString()` (line 192)

If `editingCampaign.goalAmount` or `editingCampaign.daysLeft` is `undefined` or `null`, calling `.toString()` on them throws a `TypeError`. This can happen if the campaign object returned from the backend after creation or fetched from the list is missing these fields for any reason, or if they are not correctly initialized in the Redux state.

## Affected Components
- `src/pages/NGODashboard.jsx`

## Implementation Notes
- Modified `src/pages/NGODashboard.jsx` to add safety checks when converting `goalAmount` and `daysLeft` to strings in the edit form `initialValues`.
- Used `(editingCampaign.goalAmount || 0).toString()` and `(editingCampaign.daysLeft || 0).toString()` to handle cases where these values might be missing.
- Verified that the file passes linting (no new errors introduced).
