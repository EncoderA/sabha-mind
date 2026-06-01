# Filter & Calendar Usage Guide

## 🎯 Quick Start

The meetings page now has powerful filtering capabilities to help you find exactly what you're looking for.

## 🔍 Search Bar

**Location:** Top left of the page

**How to use:**
- Type keywords to search in:
  - Meeting titles
  - Meeting summaries
  - Topic names
- Results update as you type
- Case-insensitive search

**Example:**
```
Search: "product" → Shows all meetings with "product" in title, summary, or topics
```

---

## 👥 Participant Filter

**Location:** Top right, first dropdown button with Filter icon

**Options:**
1. **All Participants** (default) - Shows all meetings
2. **1-3 People** - Small meetings
3. **4-10 People** - Medium meetings
4. **11+ People** - Large meetings

**How to use:**
1. Click the "Filter" button
2. Select a participant range
3. Meetings list updates instantly

**Use cases:**
- Find one-on-one meetings: Select "1-3 People"
- Find team meetings: Select "4-10 People"
- Find all-hands meetings: Select "11+ People"

---

## 📅 Date Range Calendar

**Location:** Top right, second button with Calendar icon

**Features:**
- **Single Date:** Click one date to see meetings from that day onwards
- **Date Range:** Click start date, then end date to see meetings in that range
- **Two-Month View:** See two months at once for easy range selection
- **Clear Button:** Reset date filter

**How to use:**

### Select Single Date
1. Click "Date Range" button
2. Click a date in the calendar
3. Click outside to close
4. Shows meetings from that date onwards

### Select Date Range
1. Click "Date Range" button
2. Click start date
3. Click end date
4. Click outside to close
5. Shows meetings within that range

### Clear Date Filter
1. Click "Date Range" button
2. Click "Clear" button at bottom
3. Or click the X on the date chip below

**Use cases:**
- Find this week's meetings: Select Monday to Sunday
- Find last month's meetings: Select first to last day of previous month
- Find meetings after a specific date: Select single date

---

## 🏷️ Active Filters Display

**Location:** Below the filter buttons (appears when filters are active)

**Shows:**
- Currently active filters
- Each filter as a chip with icon and value
- X button on each chip to remove that filter
- "Clear all" button to remove all filters

**Example:**
```
Active filters: [👥 4-10 People] [📅 Jan 1 - Jan 31] [Clear all]
```

**How to use:**
- Click X on any chip to remove that specific filter
- Click "Clear all" to remove all filters at once
- Filters update instantly when removed

---

## 🎨 Visual Indicators

### Filter Button States
- **Default:** Gray outline, "Filter" or "Date Range" text
- **Active:** Primary color, shows selected value
- **Hover:** Slightly darker background

### Active Filter Chips
- **Background:** Muted with border
- **Icon:** Matches filter type (Users or Calendar)
- **Text:** Shows filter value
- **X Button:** Hover to see darker color

---

## 💡 Pro Tips

### Combine Filters
All filters work together! For example:
1. Search: "sprint"
2. Participants: "4-10 People"
3. Date: "Last 7 days"
→ Shows sprint meetings with 4-10 people from last week

### Quick Clear
- To start fresh, click "Clear all" instead of removing filters one by one
- Search bar has its own clear (just delete the text)

### Date Range Shortcuts
Common date ranges you might want:
- **This Week:** Monday to Sunday of current week
- **Last Week:** Monday to Sunday of previous week
- **This Month:** 1st to last day of current month
- **Last Month:** 1st to last day of previous month
- **Last 30 Days:** 30 days ago to today

### Empty Results
If you see "No meetings found":
1. Check your filters - they might be too restrictive
2. Try removing one filter at a time
3. Use "Clear all" to reset everything

---

## 🎯 Common Use Cases

### Find Recent Team Meetings
1. Participant Filter: "4-10 People"
2. Date Range: Last 7 days
3. Result: Recent team meetings

### Find One-on-One Meetings with Manager
1. Search: "manager name"
2. Participant Filter: "1-3 People"
3. Result: Your 1:1s with that manager

### Find All-Hands from Last Quarter
1. Participant Filter: "11+ People"
2. Date Range: First to last day of previous quarter
3. Result: Large meetings from last quarter

### Find Meetings About Specific Project
1. Search: "project name"
2. Date Range: Project start to end date
3. Result: All meetings related to that project

---

## 🔧 Troubleshooting

### Filters Not Working?
- Make sure you've installed dependencies (see INSTALL_DEPENDENCIES.md)
- Refresh the page
- Check browser console for errors

### Calendar Not Showing?
- Click the "Date Range" button
- Make sure popover is not blocked by other elements
- Try clicking outside and reopening

### No Results After Filtering?
- Your filters might be too restrictive
- Try removing one filter at a time
- Check if meetings have valid dates

### Date Filter Showing Wrong Dates?
- Check your system timezone
- Dates are compared in local timezone
- Meeting dates must be in valid format

---

## 📱 Mobile Experience

On mobile devices:
- Search bar takes full width
- Filter buttons stack vertically
- Calendar shows one month at a time
- Active filter chips wrap to multiple lines
- All functionality remains the same

---

## ⌨️ Keyboard Shortcuts

- **Tab:** Navigate between filter controls
- **Enter:** Open dropdown/calendar when focused
- **Escape:** Close dropdown/calendar
- **Arrow Keys:** Navigate calendar dates
- **Space:** Select date in calendar

---

## 🎉 Summary

You now have three powerful ways to filter meetings:
1. **🔍 Search** - Find by keywords
2. **👥 Participants** - Filter by meeting size
3. **📅 Date Range** - Filter by time period

All filters work together to help you find exactly what you need!

**Happy filtering! 🚀**
