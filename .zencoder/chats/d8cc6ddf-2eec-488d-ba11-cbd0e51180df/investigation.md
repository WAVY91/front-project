# Investigation Report - Minified React Error #31

## Bug Summary
The application crashes with "Minified React error #31: Objects are not valid as a React child". This occurs because donation objects (with keys `donorId`, `amount`, `donatedAt`, `_id`) are being rendered directly in JSX instead of their properties or a count.

## Root Cause Analysis
The backend appears to be returning an array of donation objects in the `donors` field of a campaign object, whereas the frontend sometimes expects a number. When the frontend renders `{campaign.donors}` and it's an array of objects, React attempts to render each object, leading to the crash.

Specifically:
- `CampaignCard.jsx` renders `donors` which can be `campaign.donors` (the array).
- `NGODashboard.jsx` renders `campaign.donors` directly in the campaign list.
- `NGODashboard.jsx` also uses `campaign.donors` in a `.reduce()` sum, which leads to incorrect data if it's an array.

## Affected Components
- `src/components/CampaignCard.jsx`
- `src/pages/NGODashboard.jsx`
- `src/store/slices/campaignSlice.js` (Logic for updating donor count)

## Implementation Notes
- Updated `src/components/CampaignCard.jsx` to check if `donors` is an array and use its length if so.
- Updated `src/pages/NGODashboard.jsx` to handle both numeric and array types for donor counts.
- Updated `src/store/slices/campaignSlice.js` to prevent numeric increment on array types in `updateCampaignFunding`.
- Verified that other components like `CampaignDetail.jsx` and `DonorDashboard.jsx` use different fields or handle arrays correctly.

## Test Results
- Fixed rendering logic ensures that donation objects are no longer rendered as children.
- Total donor calculations now correctly handle array inputs.
