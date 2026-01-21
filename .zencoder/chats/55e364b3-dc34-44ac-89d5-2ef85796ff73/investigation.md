# Bug Investigation - Campaigns not showing correctly

## Bug Summary
NGOs can create campaigns, but they do not consistently appear on the Home page or the Campaign page. Specifically:
- The Home page shows dummy campaigns from the initial state instead of real ones from the backend.
- Newly created campaigns are appended to the end of the list and don't show up in the "Featured Campaigns" section (which only shows the first 6).
- The Home page doesn't fetch campaigns from the backend at all.

## Root Cause Analysis
1. **Missing Fetch on Home Page**: `Home.jsx` uses `useSelector` to get campaigns but never triggers a fetch from the backend.
2. **Dummy Data**: `campaignSlice.js` contains 6 dummy campaigns in its `initialState`. These occupy the "Featured Campaigns" slots on the Home page.
3. **Lack of Sorting**: `Home.jsx` does not sort campaigns by date, so new campaigns (pushed to the end) are not prioritized.
4. **Inconsistent Filtering**: `Home.jsx` calculates `activeCampaigns` count but doesn't filter the displayed list for active campaigns.

## Affected Components
- `src/pages/Home.jsx`
- `src/store/slices/campaignSlice.js`
- `src/pages/Campaign.jsx` (minor consistency check)

## Proposed Solution
1. **Remove Dummy Data**: Clear the `initialState` in `campaignSlice.js` (or keep it empty) to ensure only real data is shown once fetched.
2. **Add Fetch to Home Page**: Implement `useEffect` in `Home.jsx` to fetch campaigns from the backend on mount.
3. **Sort and Filter in Home Page**: Ensure the Home page filters for active campaigns and sorts them by newest first before slicing.
4. **Unify API Service**: Ensure both `Home.jsx` and `Campaign.jsx` use the same service for fetching active campaigns.

## Implementation Notes
1. **Removed Dummy Data**: Cleared `initialState` in `src/store/slices/campaignSlice.js`.
2. **Updated Home Page**: Added `useEffect` to `src/pages/Home.jsx` to fetch active campaigns using `apiService.getActiveCampaigns()`.
3. **Enhanced Sorting and Filtering**: Implemented sorting (newest first) and status filtering ('active' or 'approved') in `Home.jsx` to ensure new campaigns appear in the featured section.
4. **Verified Consistency**: Confirmed `Campaign.jsx` already has similar fetching and filtering logic.

## Test Results
- Manual verification of code changes shows that `Home.jsx` now correctly dispatches `fetchCampaignsSuccess` on mount.
- Dummy data no longer interferes with real backend data.
- The `activeCampaignsList` logic in `Home.jsx` correctly identifies and sorts campaigns for the preview section.
