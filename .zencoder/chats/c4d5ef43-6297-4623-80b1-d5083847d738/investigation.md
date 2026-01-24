# Bug Investigation - TypeError: Cannot read properties of undefined (reading 'charAt')

## Bug Summary
When a user clicks "Donate Now" on the `CampaignDetail` page, the application crashes with a `TypeError` because it tries to call `charAt(0)` on an undefined `ngoName` property of the `campaign` object.

## Root Cause Analysis
In `src/pages/CampaignDetail.jsx`:
```jsx
63: {campaign.ngoName.charAt(0).toUpperCase()}
```
The `campaign` object is found from the Redux store. While the page initially loads, it seems that triggering a state change (like opening the donation modal) causes a re-render where `campaign.ngoName` might be undefined, or it was already undefined but somehow didn't crash initially (though it should have). 

Specifically, if the campaign data from the API is incomplete and lacks the `ngoName` field, this line will always fail. The user reports it happens when clicking "Donate Now", which sets `showDonationModal` to `true`, triggering a re-render.

## Affected Components
- `src/pages/CampaignDetail.jsx`
- Potentially `src/pages/Campaign.jsx` (has a similar risk in search filtering)

## Implementation Notes
- Added optional chaining and fallback to `campaign.ngoName.charAt(0)` in `src/pages/CampaignDetail.jsx:63`.
- Added optional chaining and fallback to search filtering in `src/pages/Campaign.jsx:46` to prevent similar crashes when `ngoName` is missing from some campaigns.

## Test Results
- Ran `npm run lint`: Passed with 0 errors (1 unrelated warning in `AdminDashboard.jsx`).
- The fixes ensure that even if `ngoName` is `undefined` or `null`, the application will display a fallback character ('?') and won't crash when re-rendering (e.g., when opening the donation modal).
