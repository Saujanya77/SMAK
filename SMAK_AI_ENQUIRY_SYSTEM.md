# SMAK AI Enquiry System - Implementation Guide

## Overview
The SMAK AI form responses are now automatically saved to Firestore and can be viewed in the Admin Panel. This document outlines the complete implementation.

## Features Implemented

### 1. **Frontend Form Submission (SmakAI.tsx)**
- Form data is captured through a 13-field enquiry form
- On submission, data is saved to Firestore collection `smakAIEnquiries`
- Each submission includes:
  - Full Name
  - Organisation
  - Designation
  - Email
  - Phone
  - Sector
  - Geography
  - Therapy Area
  - Project Type
  - Sample Size
  - Start Date
  - Deliverables
  - Project Objective
  - Submission Timestamp
  - Status (initially set to 'new')

### 2. **Admin Panel Viewing (AdminPanel.tsx)**
- New tab: **"SMAK AI Enquiries"** added to admin panel
- Shows all submitted enquiries in a card-based grid layout
- Each enquiry card displays:
  - Full Name and Email
  - Status badge (new/contacted)
  - Complete enquiry details in organized sections
  - Submission date/time
  - Action buttons (Mark Contacted, Delete)

## Database Structure

### Firestore Collection: `smakAIEnquiries`
```
{
  id: string (auto-generated)
  fullName: string
  organisation: string
  designation: string
  email: string
  phone: string
  sector: string
  geography: string
  therapyArea: string
  projectType: string
  sampleSize: string
  startDate: string
  deliverables: string
  objective: string
  submittedAt: Timestamp
  status: string ('new' | 'contacted')
}
```

## How to Use

### For Users (SMAK AI Page)
1. Navigate to `/smak-ai` route
2. Scroll to the "Start an RWE / AI Project with SMAK" section
3. Fill out the 13-field form with project details
4. Click "Submit Project Enquiry"
5. Confirmation message will appear
6. Form data is automatically saved to admin database

### For Admin (Admin Panel)
1. Log in to Admin Panel
2. Navigate to "SMAK AI Enquiries" tab
3. View all submitted enquiries
4. **Mark Contacted**: Changes status from 'new' to 'contacted'
5. **Delete**: Removes enquiry from database
6. Enquiries are sorted by newest first

## Code Changes Summary

### SmakAI.tsx Changes
- ✅ Added Firebase import: `import { db } from '@/firebase';`
- ✅ Added Firestore import: `import { collection, addDoc } from 'firebase/firestore';`
- ✅ Updated form submission handler to save to Firestore
- ✅ Added loading state (`submitting`) while form is being submitted
- ✅ Updated submit button with loading state and disabled attribute

### AdminPanel.tsx Changes
- ✅ Added `SmakAIEnquiry` interface for TypeScript typing
- ✅ Added new tab to `adminTabs` array: `{ key: 'smakaienquiries', label: 'SMAK AI Enquiries' }`
- ✅ Updated `activeTab` type to include `'smakaienquiries'`
- ✅ Added state for enquiries: `smakAIEnquiries`, `loadingSMakAI`
- ✅ Added `fetchSmakAIEnquiries()` function in useEffect
- ✅ Added complete UI section for displaying enquiries with:
  - Grid layout (1 column on mobile, 2 columns on large screens)
  - Card-based design matching admin panel theme
  - Status badges with color coding
  - Two-column grid for enquiry details
  - Large textarea for viewing objectives
  - Submission timestamp display
  - Action buttons for status management and deletion
- ✅ Updated Card import to include `CardContent`, `CardHeader`, `CardTitle`

## Styling
- **Theme**: Dark theme consistent with admin panel
- **Colors**: 
  - Blue gradient backgrounds for headers
  - Yellow status badge for 'new' enquiries
  - Green button for marking contacted
  - Red button for deletion
- **Responsive**: 
  - 1 column on mobile
  - 2 columns on large screens
  - Full-width display of large details

## API Endpoints
No new API endpoints needed - uses Firebase Firestore directly for data storage and retrieval.

## Environment Setup
Ensure your Firebase configuration in `src/firebase.ts` includes:
- Firestore database enabled
- Proper read/write rules configured

## Status Management
Enquiries have two status states:
- **'new'**: Default status when enquiry is submitted
- **'contacted'**: Admin can mark this when they have reached out to the enquiry

## Future Enhancements
- Add email notifications to admin when new enquiry is submitted
- Add filtering by status, date range, sector, etc.
- Add export to CSV functionality
- Add notes/comments section for each enquiry
- Add assignment to specific team members
- Integrate with email service to auto-reply to enquirers

## Testing
1. Go to `/smak-ai` page
2. Fill and submit the enquiry form
3. Log in to Admin Panel
4. Navigate to "SMAK AI Enquiries" tab
5. Verify the submitted enquiry appears in the list
6. Test status change and delete functionality

---
**Implementation Date**: December 7, 2025
**Status**: ✅ Complete and Tested
