# HotelDesk - UI/UX Design Specifications

## 1. DESIGN SYSTEM

### Color Palette
```
Primary Brand Colors:
- Primary Blue:     #2563EB (Primary actions, headers)
- Secondary Teal:   #14B8A6 (Accent, success states)
- Neutral Gray:     #6B7280 (Secondary text, borders)
- White:            #FFFFFF (Backgrounds, cards)

Status Colors:
- Success Green:    #10B981 (Available, Confirmed)
- Warning Orange:   #F59E0B (Pending, Maintenance)
- Danger Red:       #EF4444 (Occupied, Cancelled)
- Info Blue:        #3B82F6 (Information, Alerts)

Grayscale:
- Dark Text:        #1F2937 (Primary text)
- Light Text:       #9CA3AF (Secondary text)
- Light Gray:       #F3F4F6 (Backgrounds)
- Border:           #E5E7EB (Dividers)
```

### Typography
- **Headings (H1-H3)**: Inter Bold, 24px-32px, line-height 1.2
- **Body Text**: Inter Regular, 14px-16px, line-height 1.5
- **Labels**: Inter Medium, 12px-14px, line-height 1.4
- **Monospace**: IBM Plex Mono, 12px-14px (for codes, IDs)

### Spacing System
- **xs**: 4px   (Tight spacing)
- **sm**: 8px   (Compact)
- **md**: 12px  (Default)
- **lg**: 16px  (Comfortable)
- **xl**: 24px  (Generous)
- **2xl**: 32px (Section separation)

### Component Design Principles
- **Accessibility**: WCAG 2.1 AA compliant, keyboard navigation
- **Consistency**: Unified component library across all screens
- **Feedback**: Clear visual feedback for all interactions
- **Simplicity**: Minimal cognitive load, focused workflows
- **Density**: Appropriate information density for desktop

---

## 2. SCREEN DESIGNS

### Screen 1: Login Page

#### Wireframe
```
┌─────────────────────────────────────┐
│     HotelDesk                       │
│                                     │
│  Welcome to Hotel Management        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ Username                    │   │
│  │ [________________]          │   │
│  │                             │   │
│  │ Password                    │   │
│  │ [________________]          │   │
│  │                             │   │
│  │ ☑ Remember me               │   │
│  │                             │   │
│  │  [  LOGIN  ]  [  EXIT  ]    │   │
│  │                             │   │
│  │ ? Forgot password?          │   │
│  └─────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

#### Hi-Fi Design Specifications
- **Layout**: Centered card on dark background gradient
- **Background**: Linear gradient (Blue #2563EB → Teal #14B8A6)
- **Card**: White shadow, rounded corners (12px), padding 40px
- **Logo**: HotelDesk brand, 40px height, center-aligned
- **Title**: "Welcome to Hotel Management", 24px, dark gray
- **Input Fields**: 
  - 100% width, 44px height
  - Border: 1px #E5E7EB, rounded 6px
  - Focus: Blue border, shadow highlight
  - Placeholder: Light gray text
- **Buttons**:
  - Login: Blue background, white text, 44px height, full width
  - Exit: Gray outline, 44px height
  - Hover: Darker shade, shadow elevation
- **Remember Me**: Checkbox + label, 14px font
- **Forgot Password**: Link, blue color, underline on hover

#### Tailwind Classes
```html
<div class="min-h-screen bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-2xl p-10 w-full max-w-md">
    <h1 class="text-3xl font-bold text-center text-gray-800 mb-8">HotelDesk</h1>
    <p class="text-center text-gray-600 mb-8">Hotel Management System</p>
    
    <form class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Username</label>
        <input type="text" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input type="password" class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
      </div>
      
      <div class="flex items-center">
        <input type="checkbox" class="rounded" id="remember">
        <label for="remember" class="ml-2 text-sm text-gray-600">Remember me</label>
      </div>
      
      <div class="flex gap-3 pt-4">
        <button type="submit" class="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700">Login</button>
        <button type="button" class="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50">Exit</button>
      </div>
      
      <a href="#" class="block text-center text-sm text-blue-600 hover:underline mt-4">Forgot password?</a>
    </form>
  </div>
</div>
```

---

### Screen 2: Dashboard

#### Wireframe
```
┌──────────────────────────────────────────────────────────────────────┐
│ ≡ HotelDesk  Home        │ ⟳ Refresh  👤 User  ⚙ Settings  ⏻ Logout │
├────────────────────────────────────────────────────────────────────────┤
│ SIDEBAR               │ DASHBOARD CONTENT                              │
│ Home                  │                                                 │
│ Bookings              │ ┌─────────────────┐ ┌──────────────────┐      │
│ Rooms                 │ │ Occupancy Today │ │ Occupancy Trend  │      │
│ Check-in              │ │   18 / 30       │ │ ████░░░░░░       │      │
│ Check-out             │ │   (60%)         │ │ Average: 65%     │      │
│ Guests                │ │                 │ │                  │      │
│ Reports               │ └─────────────────┘ └──────────────────┘      │
│ Settings (Admin)      │                                                 │
│                       │ ┌─────────────────┐ ┌──────────────────┐      │
│                       │ │ Today's Revenue │ │ Revenue (7 days) │      │
│                       │ │ ₫ 45,000,000    │ │ ₫ 280,000,000    │      │
│                       │ │ ↑ 12% vs avg    │ │ Chart: ▂▃▅▆▇▇▆   │      │
│                       │ └─────────────────┘ └──────────────────┘      │
│                       │                                                 │
│                       │ Upcoming Arrivals (Next 3 Days)                │
│                       │ ┌──────────────────────────────────────────┐   │
│                       │ │ Guest Name    │ Room │ Date   │ Status │   │
│                       │ │ Nguyễn Văn A  │ 201  │ Today  │ ✓      │   │
│                       │ │ Trần Thị B    │ 305  │ +1 day │ ⏳     │   │
│                       │ │ Phạm Công C   │ 102  │ +2 day │ ⏳     │   │
│                       │ └──────────────────────────────────────────┘   │
│                       │                                                 │
└──────────────────────────────────────────────────────────────────────────┘
```

#### Hi-Fi Specifications
- **Header**: Dark blue background, white text, icons on right
- **Sidebar**: Light gray background, collapsible menu
- **Cards**: White background, subtle shadow, rounded 8px
- **Charts**: Teal color for primary data, 200px height
- **Table**: Striped rows, hover highlight (light gray)
- **Icons**: 20px size, blue/teal color
- **Metrics**: Large numbers (28px), percentage in smaller gray text

#### Key Components
- **Occupancy Card**: Circular progress + percentage
- **Revenue Card**: Large currency amount + trend indicator
- **Chart**: Line or bar chart visualization
- **Table**: Sortable columns, row actions
- **Quick Actions**: Add booking, check-in, check-out buttons

---

### Screen 3: Room List

#### Wireframe
```
┌──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR       │ Rooms                                                 │
│               │ [Filter] [Search: ________] [+ Add Room]             │
│               │ Floor: [All ▼] Type: [All ▼] Status: [All ▼]        │
│               │                                                       │
│               │ Grid View ■ List View □                              │
│               │                                                       │
│               │ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐    │
│               │ │ Room 201│ │ Room 202│ │ Room 203│ │ Room 204│    │
│               │ │ Double  │ │ Double  │ │ Single  │ │ Suite   │    │
│               │ │ 🟢 FREE │ │ 🔴 BUSY │ │ 🟡 MAINT│ │ 🟢 FREE │    │
│               │ │ ₫350k   │ │ ₫350k   │ │ ₫250k   │ │ ₫800k   │    │
│               │ │ 2 guests│ │ 2 guests│ │ N/A     │ │ 4 guests│    │
│               │ │[📋][✎]  │ │[📋][✎]  │ │[📋][✎]  │ │[📋][✎]  │    │
│               │ └─────────┘ └─────────┘ └─────────┘ └─────────┘    │
│               │                                                       │
│               │ ┌─────────┐ ┌─────────┐ ...                          │
│               │ │ Room 205│ │ Room 206│                              │
│               │ ...                                                   │
│               │                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

#### Hi-Fi Specifications
- **Header**: "Rooms" title with action buttons
- **Filter Bar**: Dropdowns for floor, type, status + search input
- **View Toggle**: Grid/List view switcher
- **Room Cards** (Grid View):
  - 200px width, 240px height
  - Status badge: Green (Available), Red (Occupied), Orange (Maintenance)
  - Room info: Number, type, price
  - Action buttons: Details, Edit
  - Hover: Shadow elevation, cursor pointer
- **Room List** (List View):
  - Columns: Room #, Type, Floor, Status, Current Guest, Price, Actions
  - Rows: 50px height, striped background
  - Status icon: Color coded (🟢🔴🟡)

---

### Screen 4: Booking Management

#### Wireframe (Booking List)
```
┌──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR       │ Bookings                                              │
│               │ [Search: ________] [+ New Booking]                   │
│               │ Status: [All ▼] Date Range: [From ▼] [To ▼]         │
│               │                                                       │
│               │ ┌─────────────────────────────────────────────────┐  │
│               │ │ Ref │ Guest Name    │ Check-in │ Days │ Total  │  │
│               │ ├─────────────────────────────────────────────────┤  │
│               │ │BK01 │ Nguyễn Văn A  │ 12/15    │  3   │ 1.05M  │  │
│               │ │BK02 │ Trần Thị B    │ 12/16    │  2   │ 700k   │  │
│               │ │BK03 │ Phạm Công C   │ 12/18    │  1   │ 350k   │  │
│               │ │BK04 │ Lê Thu Hương  │ 12/20    │  5   │ 1.75M  │  │
│               │ │BK05 │ Võ Minh Tuấn  │ 01/05    │  2   │ 700k   │  │
│               │ │                                                   │  │
│               │ │ Actions: [View] [Edit] [Cancel]                   │  │
│               │ └─────────────────────────────────────────────────┘  │
│               │ Page 1 of 5 | < [1][2][3]... >                       │
│               │                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

#### Wireframe (Create/Edit Booking)
```
┌──────────────────────────────────────────────────────────────────────┐
│ Create Booking                                         [✕]            │
├──────────────────────────────────────────────────────────────────────┤
│                                                                        │
│ Step 1: Guest Information                                             │
│ ┌────────────────────────────────────┐                               │
│ │ Search Guest: [________________]   │                               │
│ │ ✓ Found: Nguyễn Văn A              │                               │
│ │ Phone: 0901234567                  │                               │
│ │ Email: nguyenvana@email.com         │                               │
│ │ [✓ Use Existing] [New Guest]        │                               │
│ └────────────────────────────────────┘                               │
│                                                                        │
│ Step 2: Booking Details                                               │
│ ┌────────────────────────────────────┐                               │
│ │ Check-in Date: [12/15/2024 ▼]      │                               │
│ │ Check-out Date: [12/18/2024 ▼]     │                               │
│ │ Number of Nights: 3                 │                               │
│ │ Room Type: [Double ▼]               │                               │
│ │ Available Rooms: [201] [202] [203]  │                               │
│ │ Select Room: [201 ▼]                │                               │
│ └────────────────────────────────────┘                               │
│                                                                        │
│ Step 3: Pricing & Confirmation                                        │
│ ┌────────────────────────────────────┐                               │
│ │ Room Rate: ₫350,000/night           │                               │
│ │ Subtotal (3 nights): ₫1,050,000     │                               │
│ │ Discount: ₫0                         │                               │
│ │ Taxes: ₫105,000                     │                               │
│ │ ────────────────────────            │                               │
│ │ TOTAL: ₫1,155,000                   │                               │
│ │ Deposit Required (30%): ₫346,500     │                               │
│ │                                      │                               │
│ │ Special Requests: [_____________]   │                               │
│ │ ☑ Early Check-in Available           │                               │
│ │ ☑ Late Check-out Available           │                               │
│ └────────────────────────────────────┘                               │
│                                                                        │
│                      [< Back] [Create Booking] [Cancel]              │
│                                                                        │
└──────────────────────────────────────────────────────────────────────┘
```

---

### Screen 5: Check-in Page

#### Wireframe
```
┌──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR       │ Check-in                                              │
│               │                                                       │
│               │ Guest Search & Verification                           │
│               │ ┌──────────────────────────────────────────────────┐  │
│               │ │ Search Guest/Booking:                            │  │
│               │ │ [________________________________]              │  │
│               │ │ (Search by name, phone, booking ID)              │  │
│               │ │                                                   │  │
│               │ │ ✓ Found: Nguyễn Văn A (BK-001)                  │  │
│               │ └──────────────────────────────────────────────────┘  │
│               │                                                       │
│               │ Booking Details                                       │
│               │ ┌──────────────────────────────────────────────────┐  │
│               │ │ Guest: Nguyễn Văn A                             │  │
│               │ │ Phone: 0901234567                               │  │
│               │ │ Room: 201 (Double)                              │  │
│               │ │ Check-in: 12/15/2024                            │  │
│               │ │ Check-out: 12/18/2024                           │  │
│               │ │ Nights: 3                                        │  │
│               │ │ Total: ₫1,155,000 | Paid: ₫346,500 (30%)        │  │
│               │ │ Balance Due: ₫808,500                            │  │
│               │ └──────────────────────────────────────────────────┘  │
│               │                                                       │
│               │ Room Assignment                                       │
│               │ ┌──────────────────────────────────────────────────┐  │
│               │ │ Assigned Room: 201 (Double)                     │  │
│               │ │ Status: ✓ Clean & Ready                         │  │
│               │ │ Floor: 2                                         │  │
│               │ │ Amenities: WiFi ✓ AC ✓ TV ✓ Mini Bar ✓         │  │
│               │ │ [Generate Key Card]                              │  │
│               │ │ Key Code: ••••• [Generated]                     │  │
│               │ └──────────────────────────────────────────────────┘  │
│               │                                                       │
│               │ Final Steps                                           │
│               │ ┌──────────────────────────────────────────────────┐  │
│               │ │ ☑ Room is clean                                 │  │
│               │ │ ☑ ID verified                                    │  │
│               │ │ ☑ Balance payment received                       │  │
│               │ │ ☐ Guest signed registration form                │  │
│               │ │                                                   │  │
│               │ │  [<- Back] [Complete Check-in] [Cancel]         │  │
│               │ └──────────────────────────────────────────────────┘  │
│               │                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

### Screen 6: Check-out Page

#### Wireframe
```
┌──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR       │ Check-out                                             │
│               │                                                       │
│               │ Find Guest to Check Out                               │
│               │ ┌──────────────────────────────────────────────────┐  │
│               │ │ Select Guest: [Nguyễn Văn A (Room 201) ▼]      │  │
│               │ │ or Search: [________________________________]   │  │
│               │ └──────────────────────────────────────────────────┘  │
│               │                                                       │
│               │ Guest & Booking Information                           │
│               │ ┌──────────────────────────────────────────────────┐  │
│               │ │ Guest: Nguyễn Văn A                             │  │
│               │ │ Room: 201 (Double)                              │  │
│               │ │ Check-in: 12/15/2024 | Check-out: 12/18/2024   │  │
│               │ │ Stay Duration: 3 nights                          │  │
│               │ │ Status: Currently Occupied                       │  │
│               │ └──────────────────────────────────────────────────┘  │
│               │                                                       │
│               │ Final Bill                                            │
│               │ ┌──────────────────────────────────────────────────┐  │
│               │ │ Room Charge (3 nights @ ₫350k): ₫1,050,000      │  │
│               │ │ Extra Charges:                                  │  │
│               │ │   ☑ Room Service: ₫250,000                      │  │
│               │ │   ☑ Mini Bar: ₫100,000                          │  │
│               │ │   ☑ Laundry: ₫50,000                            │  │
│               │ │ Taxes & Fees: ₫105,000                          │  │
│               │ │ ───────────────────────────                    │  │
│               │ │ SUBTOTAL: ₫1,555,000                            │  │
│               │ │ Already Paid: ₫346,500                          │  │
│               │ │ BALANCE DUE: ₫1,208,500                         │  │
│               │ │ Refund Due: ₫0                                   │  │
│               │ │                                                   │  │
│               │ │ Payment Method: [Cash ▼]                         │  │
│               │ │ [Process Payment]                                │  │
│               │ └──────────────────────────────────────────────────┘  │
│               │                                                       │
│               │ Room Inspection                                       │
│               │ ┌──────────────────────────────────────────────────┐  │
│               │ │ Room Condition:                                  │  │
│               │ │ ☐ Damages found                                 │  │
│               │ │ ☐ Additional charges applied                    │  │
│               │ │ Damage Details: [____________________]           │  │
│               │ │ Estimated Repair: ₫0                            │  │
│               │ │                                                   │  │
│               │ │ [Collected Key] [Generate Receipt]               │  │
│               │ │                                                   │  │
│               │ │  [<- Back] [Complete Check-out] [Cancel]        │  │
│               │ └──────────────────────────────────────────────────┘  │
│               │                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

### Screen 7: Guests Management

#### Wireframe
```
┌──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR       │ Guests                                                │
│               │ [Search: ________] [+ New Guest]                     │
│               │ Country: [All ▼] Status: [All ▼]                    │
│               │                                                       │
│               │ ┌────────────────────────────────────────────────┐   │
│               │ │ Name │ Phone │ Email │ Bookings │ Last Visit │   │
│               │ ├────────────────────────────────────────────────┤   │
│               │ │ Nguyễn Văn A │ 090123... │ nva@... │ 5 │ 12/15 │   │
│               │ │ Trần Thị B   │ 091234... │ ttb@... │ 2 │ 11/20 │   │
│               │ │ Phạm Công C  │ 092345... │ pcc@... │ 1 │ 10/05 │   │
│               │ │ Lê Thu Hương │ 093456... │ lth@... │ 8 │ 12/10 │   │
│               │ │ Võ Minh Tuấn │ 094567... │ vmt@... │ 3 │ 09/22 │   │
│               │ │                                                   │   │
│               │ │ Actions: [View] [Edit] [Delete]                  │   │
│               │ └────────────────────────────────────────────────┘   │
│               │ Page 1 of 10                                         │
│               │                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

### Screen 8: Reports

#### Wireframe
```
┌──────────────────────────────────────────────────────────────────────┐
│ SIDEBAR       │ Reports                                               │
│               │ Report Type: [Revenue ▼]                             │
│               │ Date Range: [From: 12/01 ▼] [To: 12/31 ▼]          │
│               │ [Generate Report] [Export to PDF] [Export to Excel]  │
│               │                                                       │
│               │ Revenue Report - December 2024                        │
│               │ ┌────────────────────────────────────────────────┐   │
│               │ │                                               │   │
│               │ │ Revenue Line Chart                            │   │
│               │ │ ▂▃▅▆▇▇▇▆▅▄▃▂▂▃▄                              │   │
│               │ │ 0  ₫50M ₫100M ₫150M ₫200M ₫250M ₫300M         │   │
│               │ │                                               │   │
│               │ └────────────────────────────────────────────────┘   │
│               │                                                       │
│               │ Summary Statistics                                    │
│               │ ┌──────────────────┐ ┌──────────────────┐           │
│               │ │ Total Revenue    │ │ Avg Per Night    │           │
│               │ │ ₫ 3,500,000,000  │ │ ₫ 1,250,000      │           │
│               │ └──────────────────┘ └──────────────────┘           │
│               │ ┌──────────────────┐ ┌──────────────────┐           │
│               │ │ Bookings         │ │ Occupancy Rate   │           │
│               │ │ 280               │ │ 75%              │           │
│               │ └──────────────────┘ └──────────────────┘           │
│               │                                                       │
│               │ Detailed Breakdown                                    │
│               │ ┌────────────────────────────────────────────────┐   │
│               │ │ Room Type │ Bookings │ Revenue │ Avg Price    │   │
│               │ ├────────────────────────────────────────────────┤   │
│               │ │ Single    │ 120      │ 900M    │ ₫750k        │   │
│               │ │ Double    │ 130      │ 1.82B   │ ₫1.4M        │   │
│               │ │ Suite     │ 30       │ 780M    │ ₫2.6M        │   │
│               │ └────────────────────────────────────────────────┘   │
│               │                                                       │
└──────────────────────────────────────────────────────────────────────┘
```

---

## 3. LAYOUT GUIDELINES

### Main Application Layout
- **Sidebar Width**: 250px (collapsible to 60px)
- **Header Height**: 64px
- **Main Content**: Full remaining width
- **Content Padding**: 24px on all sides
- **Max Content Width**: 1400px (for ultra-wide screens)

### Card & Container Spacing
- **Card Gap**: 16px (between cards in grid)
- **Section Gap**: 24px (between sections)
- **Padding**: 16px inside cards, 20px inside containers

### Responsive Breakpoints
- **Desktop**: 1200px+ (Full layout)
- **Laptop**: 992px-1199px (Adjusted sidebar)
- **Tablet**: 768px-991px (Stacked layout)
- **Mobile**: <768px (Full-screen single column)

### Component Sizing
- **Buttons**: 40-44px height, 16px padding sides
- **Input Fields**: 40px height, 12px padding
- **Table Rows**: 48px height
- **Icons**: 20-24px size
- **Spacing Unit**: 4px (4, 8, 12, 16, 20, 24, 32px)

---

## 4. INTERACTION PATTERNS

### Form Submission
1. User fills form with validation feedback
2. Submit button disabled until valid
3. Loading spinner during submission
4. Success toast notification
5. Redirect or close modal

### Table Interactions
- **Sort**: Click header to sort ascending/descending
- **Pagination**: Click page numbers or next/prev
- **Row Actions**: Hover reveals edit/delete buttons
- **Selection**: Checkboxes for bulk operations

### Modals & Dialogs
- **Overlay**: Semi-transparent dark background (40% opacity)
- **Animation**: Slide-up from bottom or zoom from center (200ms)
- **Dismissal**: Close button, click outside, Escape key

### Navigation
- **Active Link**: Blue background highlight
- **Hover**: Light gray background
- **Badge**: Red dot for notifications/alerts
- **Submenu**: Smooth collapse/expand animation

---

## 5. ACCESSIBILITY

### Keyboard Navigation
- **Tab Order**: Logical flow (left-right, top-bottom)
- **Focus Indicator**: Blue outline (3px), 2px offset
- **Shortcuts**: Ctrl+S for save, Alt+D for dashboard
- **Skip Links**: "Skip to main content"

### Color & Contrast
- **WCAG AA**: All text >= 4.5:1 contrast ratio
- **Status Indication**: Not color-only (icons + color)
- **Focus States**: Distinct from hover states

### Screen Reader Support
- **Semantic HTML**: <button>, <nav>, <main>, <form>
- **ARIA Labels**: aria-label, aria-describedby
- **Live Regions**: aria-live="polite" for updates
- **Form Labels**: Associated with inputs via <label>

---

## Summary
HotelDesk UI/UX provides an intuitive, professional desktop application interface optimized for hotel front-desk operations with clear workflows, accessibility, and efficient information presentation.
