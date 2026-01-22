# Manual End-to-End Test Plan for CAG API Integration

## Test Environment Setup

**Prerequisites:**
- Backend API running at `http://localhost:8080`
- Frontend development server running (`npm run dev`)
- Test data available in the backend database

## Test Flow 1: Client → Contract → OU → View Assigned CAGs

### Objective
Verify the complete cascading selection flow and display of assigned CAGs.

### Steps

1. **Navigate to Manage CAGs Page**
   - Open browser to the Manage CAGs page
   - ✅ Verify page title "Manage CAGs" is displayed
   - ✅ Verify "Cancel" button is visible

2. **Select Client**
   - ✅ Verify "Client" dropdown shows loading state initially
   - ✅ Verify loading indicator disappears when clients load
   - Click on "Client" dropdown
   - ✅ Verify list of clients is displayed
   - Select a client (e.g., "Test Client 1")
   - ✅ Verify selected client name appears in dropdown

3. **Select Contract**
   - ✅ Verify "Contract" dropdown is now enabled
   - ✅ Verify "Contract" dropdown shows loading state
   - ✅ Verify loading indicator disappears when contracts load
   - Click on "Contract" dropdown
   - ✅ Verify list of contracts is displayed with format: "CONTRACT-ID (start-date - end-date)"
   - Select a contract
   - ✅ Verify contract status is displayed below dropdown
   - ✅ Verify status shows "Active" or "Inactive" with appropriate color (green for Active, red for Inactive)

4. **Select Operational Unit**
   - ✅ Verify "Operational Unit" dropdown is now enabled
   - ✅ Verify "Operational Unit" dropdown shows loading state
   - ✅ Verify loading indicator disappears when OUs load
   - Click on "Operational Unit" dropdown
   - ✅ Verify list of operational units is displayed with format: "OU-ID - OU Name"
   - Select an operational unit
   - ✅ Verify selected OU appears in dropdown

5. **View Assigned CAGs**
   - ✅ Verify "List of Assigned CAGs" accordion is displayed
   - ✅ Verify accordion shows the selected OU name
   - ✅ Verify loading indicator is displayed while fetching assigned CAGs
   - ✅ Verify loading indicator disappears when data loads
   - ✅ Verify "Number of assigned CAGs: X" is displayed with correct count
   - ✅ Verify assigned CAGs table displays with columns:
     - Carrier Name & ID
     - Account Name & ID
     - Group Name & ID
     - Assignment Status (Active/Inactive chip)
     - Start Date
     - End Date
   - ✅ Verify pagination controls are displayed if more than 10 CAGs
   - ✅ Verify all data fields are populated correctly

### Expected Results
- All loading states display correctly during data fetching
- Cascading dropdowns enable/disable appropriately
- Contract status calculation is correct
- Assigned CAGs display with all required fields
- Pagination works correctly

---

## Test Flow 2: Search → Select → Assign CAGs

### Objective
Verify the complete search and assignment flow for unassigned CAGs.

### Steps

1. **Complete Flow 1 Steps 1-4** (Select Client, Contract, and OU)

2. **Expand Assign CAGs Accordion**
   - Scroll to "Assign CAGs" accordion
   - Click the expand icon
   - ✅ Verify accordion expands showing assignment form

3. **Select Assignment Level**
   - ✅ Verify "Select Assignment Level*" section is displayed
   - ✅ Verify three radio options: "Carrier", "Carrier + Account", "Carrier + Account + group"
   - ✅ Verify "Carrier" is selected by default
   - Select an assignment level (e.g., "Carrier")

4. **Enter Date Range**
   - ✅ Verify "Start Date*" field is displayed with placeholder "MM/DD/YYYY"
   - ✅ Verify "End Date" field is displayed with placeholder "MM/DD/YYYY"
   - Enter start date in format MM/DD/YYYY (e.g., "01/01/2024")
   - ✅ Verify date is accepted
   - Try entering invalid format (e.g., "2024-01-01")
   - ✅ Verify error message "Invalid date format. Use MM/DD/YYYY" is displayed
   - ✅ Verify Search button is disabled when date format is invalid
   - Correct the date format
   - ✅ Verify error message disappears

5. **Enter Search Filters**
   - ✅ Verify "Filter by:" section is displayed
   - ✅ Verify "Carrier Name" and "Carrier ID" fields are displayed
   - Enter carrier name (e.g., "Test Carrier")
   - Enter carrier ID (optional)

6. **Perform Search**
   - Click "Search" button
   - ✅ Verify loading indicator is displayed
   - ✅ Verify loading indicator disappears when search completes
   - ✅ Verify "Number of unassigned CAGs: X" is displayed with correct count
   - ✅ Verify search results table displays with:
     - Checkbox for selection
     - Carrier Name & ID
   - ✅ Verify "Assign (0)" button is displayed and disabled

7. **Select CAGs for Assignment**
   - Click checkbox next to one or more CAGs
   - ✅ Verify checkboxes are checked
   - ✅ Verify "Assign (X)" button updates with count and becomes enabled
   - Click "Select All" checkbox
   - ✅ Verify all CAGs are selected
   - ✅ Verify "Assign (X)" button shows total count

8. **Assign CAGs**
   - Click "Assign (X)" button
   - ✅ Verify confirmation modal appears with title "Confirm CAG Assignment"
   - ✅ Verify modal message shows correct count: "You are about to assign X CAG(s)..."
   - ✅ Verify "Yes, Assign" and "No, Cancel" buttons are displayed
   - Click "Yes, Assign"
   - ✅ Verify modal closes
   - ✅ Verify success message appears: "Successfully assigned X CAG(s)..."
   - ✅ Verify search results are cleared
   - ✅ Verify assigned CAGs list is refreshed automatically
   - ✅ Verify newly assigned CAGs appear in the assigned CAGs table

9. **Clear Search**
   - Enter search criteria again
   - Click "Search" button
   - Wait for results
   - Click "Clear" button
   - ✅ Verify all search fields are cleared
   - ✅ Verify search results are cleared
   - ✅ Verify selected CAGs are cleared

### Expected Results
- Date validation works correctly
- Search displays loading states
- Search results display correctly
- CAG selection works properly
- Assignment confirmation modal appears
- Assignment succeeds and refreshes assigned CAGs list
- Success message is displayed
- Clear functionality resets all search state

---

## Test Flow 3: Select Assigned CAGs → Bulk Status Update

### Objective
Verify bulk status update functionality for assigned CAGs.

### Steps

1. **Complete Flow 1 Steps 1-5** (Navigate to assigned CAGs view)

2. **Select CAGs for Bulk Action**
   - ✅ Verify "Bulk actions" dropdown is disabled initially
   - ✅ Verify "Apply" button is grayed out
   - Click checkbox next to one or more assigned CAGs
   - ✅ Verify checkboxes are checked
   - ✅ Verify "Bulk actions" dropdown becomes enabled
   - ✅ Verify "Apply" button remains grayed out until action is selected

3. **Select Bulk Action**
   - Click "Bulk actions" dropdown
   - ✅ Verify dropdown options are displayed:
     - "Bulk actions" (placeholder)
     - "Set Active"
     - "Set Inactive"
   - Select "Set Active" (or "Set Inactive")
   - ✅ Verify selected action appears in dropdown
   - ✅ Verify "Apply" button becomes blue and clickable

4. **Apply Bulk Action**
   - Click "Apply" button
   - ✅ Verify loading indicator appears briefly
   - ✅ Verify assigned CAGs list is refreshed
   - ✅ Verify status of selected CAGs is updated in the table
   - ✅ Verify status chips show correct color (green for Active, red for Inactive)
   - ✅ Verify checkboxes are cleared after update
   - ✅ Verify "Bulk actions" dropdown is reset to placeholder
   - ✅ Verify "Bulk actions" dropdown is disabled again

5. **Test Select All**
   - Click "Select All" checkbox in table header
   - ✅ Verify all CAGs on current page are selected
   - Select a bulk action
   - Click "Apply"
   - ✅ Verify all selected CAGs are updated

### Expected Results
- Bulk actions dropdown enables/disables based on selection
- Apply button enables only when action is selected
- Status update succeeds
- Assigned CAGs list refreshes automatically
- Status chips display correct colors
- Selection is cleared after update

---

## Test Flow 4: Loading States Verification

### Objective
Verify all loading indicators display correctly during API calls.

### Steps

1. **Client Loading State**
   - Refresh the page
   - ✅ Verify "Loading clients..." message appears in Client dropdown
   - ✅ Verify loading spinner is displayed
   - ✅ Verify loading state disappears when clients load

2. **Contract Loading State**
   - Select a client
   - ✅ Verify "Loading contracts..." message appears in Contract dropdown
   - ✅ Verify loading spinner is displayed
   - ✅ Verify loading state disappears when contracts load

3. **Operational Unit Loading State**
   - Select a contract
   - ✅ Verify "Loading operational units..." message appears in OU dropdown
   - ✅ Verify loading spinner is displayed
   - ✅ Verify loading state disappears when OUs load

4. **Assigned CAGs Loading State**
   - Select an operational unit
   - ✅ Verify circular progress indicator appears in assigned CAGs section
   - ✅ Verify loading state disappears when CAGs load

5. **Search Loading State**
   - Expand Assign CAGs accordion
   - Enter search criteria
   - Click Search
   - ✅ Verify circular progress indicator appears
   - ✅ Verify "Searching..." text appears on button
   - ✅ Verify loading state disappears when search completes

### Expected Results
- All loading states display appropriate indicators
- Loading states clear when data arrives
- UI remains responsive during loading

---

## Test Flow 5: Error States Verification

### Objective
Verify all error messages display correctly when API calls fail.

### Test Setup
- Temporarily stop the backend API or configure it to return errors

### Steps

1. **Client Fetch Error**
   - Stop backend API
   - Refresh the page
   - ✅ Verify error alert is displayed at top of page
   - ✅ Verify error message contains meaningful text (e.g., "Failed to fetch clients")
   - ✅ Verify Client dropdown shows "No clients available"

2. **Contract Fetch Error**
   - Start backend API
   - Configure backend to return error for contracts endpoint
   - Select a client
   - ✅ Verify error alert is displayed
   - ✅ Verify error message contains meaningful text
   - ✅ Verify Contract dropdown remains disabled or shows error state
   - ✅ Verify client selection is maintained

3. **Operational Unit Fetch Error**
   - Configure backend to return error for OUs endpoint
   - Select a contract
   - ✅ Verify error alert is displayed
   - ✅ Verify error message contains meaningful text
   - ✅ Verify OU dropdown shows error state
   - ✅ Verify client and contract selections are maintained

4. **Assigned CAGs Fetch Error**
   - Configure backend to return error for assigned CAGs endpoint
   - Select an operational unit
   - ✅ Verify error alert is displayed in assigned CAGs section
   - ✅ Verify error message contains meaningful text
   - ✅ Verify previous selections are maintained

5. **Search Error**
   - Configure backend to return error for search endpoint
   - Expand Assign CAGs accordion
   - Enter search criteria and click Search
   - ✅ Verify error alert is displayed
   - ✅ Verify error message contains meaningful text
   - ✅ Verify search form remains populated

6. **Assignment Error**
   - Configure backend to return error for assignment endpoint
   - Perform search successfully
   - Select CAGs and click Assign
   - Confirm in modal
   - ✅ Verify error alert is displayed
   - ✅ Verify error message contains meaningful text
   - ✅ Verify selected CAGs remain selected
   - ✅ Verify search results remain displayed

7. **Status Update Error**
   - Configure backend to return error for status update endpoint
   - Select assigned CAGs
   - Select bulk action and click Apply
   - ✅ Verify error alert is displayed
   - ✅ Verify error message contains meaningful text
   - ✅ Verify CAG selections remain
   - ✅ Verify table data is not modified

### Expected Results
- All error scenarios display user-friendly error messages
- Application state is preserved when errors occur
- No data is lost or corrupted
- User can retry operations after fixing issues

---

## Test Flow 6: Empty States Verification

### Objective
Verify appropriate messages display when no data is available.

### Steps

1. **No Assigned CAGs**
   - Select an OU that has no assigned CAGs
   - ✅ Verify message "No CAGs assigned to this operational unit" is displayed
   - ✅ Verify table is not shown
   - ✅ Verify pagination is not shown

2. **No Search Results**
   - Expand Assign CAGs accordion
   - Enter search criteria that will return no results
   - Click Search
   - ✅ Verify message "No unassigned CAGs found matching your search criteria" is displayed
   - ✅ Verify table is not shown
   - ✅ Verify "Assign" button is not shown

3. **No Clients Available**
   - Configure backend to return empty client list
   - Refresh page
   - ✅ Verify Client dropdown shows "No clients available"
   - ✅ Verify Contract and OU dropdowns remain disabled

### Expected Results
- Empty states display helpful messages
- UI gracefully handles missing data
- No broken layouts or errors

---

## Test Completion Checklist

### All Flows Tested
- ✅ Flow 1: Client → Contract → OU → View Assigned CAGs
- ✅ Flow 2: Search → Select → Assign CAGs
- ✅ Flow 3: Select Assigned CAGs → Bulk Status Update
- ✅ Flow 4: Loading States Verification
- ✅ Flow 5: Error States Verification
- ✅ Flow 6: Empty States Verification

### Cross-Browser Testing
- ✅ Chrome
- ✅ Firefox
- ✅ Edge
- ✅ Safari (if available)

### Responsive Design
- ✅ Desktop (1920x1080)
- ✅ Laptop (1366x768)
- ✅ Tablet (768x1024)

### Performance
- ✅ Page loads within 3 seconds
- ✅ API calls complete within 5 seconds
- ✅ No console errors
- ✅ No memory leaks during extended use

### Accessibility
- ✅ All form fields have labels
- ✅ Error messages are announced
- ✅ Keyboard navigation works
- ✅ Focus indicators are visible

---

## Test Results Summary

**Test Date:** _________________

**Tester:** _________________

**Environment:**
- Frontend URL: _________________
- Backend URL: _________________
- Browser: _________________
- OS: _________________

**Overall Status:** ✅ PASS / ❌ FAIL

**Issues Found:**
1. _________________
2. _________________
3. _________________

**Notes:**
_________________
_________________
_________________

**Sign-off:** _________________
