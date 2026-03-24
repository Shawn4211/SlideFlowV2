# Milestone 9: Training Plan & Materials
**Team:** AnalytiQ&Designers
**Project:** SlideFlow Digital Signage CMS
**Date:** March 21, 2026

---

## 1. Training Plan

### Audience and Computer Literacy
The primary audience for this training session includes System Administrators, Content Managers, and Marketing Staff who will be responsible for creating, scheduling, and deploying digital signage content. 
**Computer Literacy Level:** Intermediate. Participants should be comfortable navigating web browsers (Chrome/Edge), managing file uploads, and using common graphical interfaces (like PowerPoint). No coding required.

### Training Method & Schedule
**Method:** Hybrid (Instructor-Led Classroom & Guided Hands-On Sandbox Practice).
*   **Tentative Date:** Thursday, March 26, 2026
*   **Time:** 1:00 PM – 4:30 PM (EST)
*   **Location:** Main Corporate Training Facility

### Issues & Mitigation
*   **Network Loss:** Instructor will have an offline video sandbox prepared.
*   **Browser Incompatibility:** Communicated upfront that modern browsers are strictly required (Internet Explorer is not supported).

---

## 2. Training Materials: The SlideFlow Curriculum

Welcome to the **SlideFlow Administration Curriculum**. This guide is strictly divided into 7 core modules. Complete each module's step-by-step instructions and example tasks to achieve mastery over the digital signage network.

---

### Module 1: System Overview

**Objective:** Understand exactly what SlideFlow does and differentiate between user roles.

**What the system does:** 
SlideFlow is a centralized Content Management System (CMS) designed specifically for digital signage. It allows you to build multimedia "Shows" (presentations) and instantly broadcast them to physical TV screens located anywhere in your building.

**Roles (Admin vs Display):**
*   **Admin:** Users who log into the dashboard (`/dashboard`) to create slides, upload media, and manage schedules.
*   **Display:** The passive physical TVs running the client receiver (`/display`). Displays cannot edit content; they only passively subscribe to the Admin's schedules and instant broadcasts via WebSockets.

**Step-by-step instructions:**
1. Navigate to the SlideFlow URL.
2. Enter your Admin `Username` and `Password` to access the Control Center.
3. Observe the difference between your dashboard view and the TV on the wall running the Display URL.

![System Architecture](/screenshots/system-overview.png)

**Example Task:** 
Log out of your Admin account using the top-right User Avatar, then log back in successfully to initialize your session.

---

### Module 2: Navigation

**Objective:** Memorize the Dashboard interface and correctly map the menu structure.

**Dashboard:** 
The main Overview Dashboard displays three metric cards (**Total Shows**, **Total Duration**, **Scheduled**), an *Active Display* monitor, and an *Up Next* scheduling queue. The top right corner contains a quick link to **Open Display**.

**Menu Structure:**
The persistent left sidebar is your map to the system:
*   *Overview:* Landing page for Dashboard Metrics.
*   *Project:* The library (`/dashboard/screens`) of all saved slide decks.
*   *Templates:* Manage slide templates.
*   *Content:* Media asset management.
*   *Schedules:* Master calendar views.
*   *Display:* A quick link to the receiver client.
*   *Settings:* System configurations.
*   *About:* Information about the AnalytiQ&Designers team.

**Step-by-step instructions:**
1. Locate the left sidebar menu.
2. Click **Project** to view your gallery of presentations.
3. If you prefer a darker aesthetic, ensure you are in the Editor, and click the **Sun/Moon Icon** in the top navigation bar to toggle **Dark Mode**.

![Dashboard Navigation](/screenshots/dashboard-nav.png)

**Example Task:** 
Navigate to the **About** page, verify the development team name, then return to the **Overview** dashboard and explicitly find the *Total Duration* metric card.

---

### Module 3: Screen Menu (Slides)

**Objective:** Learn to create, edit, duplicate, and preview raw signage slides using the Visual Editor.

**Add slide / Edit slide / Preview:**
The Visual Editor contains a top header, a left panel (for Slides, Tools, and Actions), a center canvas, and a right panel labeled "Properties" (for precise styling adjustments).

**Step-by-step instructions:**
1. From the Project page, click the **Add Project** button to create a new show.
2. Inside the editor timeline (in the **Left Panel**, under the "Slides" section), click the **+ Add Slides (Plus Icon)** button to append a blank slide to the timeline.
3. In the Left Panel under "Tools", click the **Add Text (Type Icon)** to drop text onto the canvas. 
4. Move your mouse to the **Right Panel** (Properties) to adjust the **Text Color** and **Font Size**.
5. To preview how your presentation looks, click the **Present (Presentation Icon)** button located in the top header.
6. Click the red **Stop Present** global button (which appears on the Dashboard) to end the preview.

![Editor Screen Management](/screenshots/editor-canvas.png)

**Example Task:** 
Create a new presentation. Add three slides. Put a uniquely colored text block on each slide using the Properties panel. Click **Present** to watch the slides transition.

---

### Module 4: Content Management

**Objective:** Successfully source, upload, and organize multimedia content for signage playback.

**Upload files / Create folders / Search content:**
Content insertion is managed dynamically via the Left Panel's "Tools" section in the Visual Editor. 

**Step-by-step instructions:**
1. Open a slide in the Visual Editor.
2. Direct your attention to the **Left Panel** under the "Tools" grid.
3. To upload a file from your computer, click the **Upload Image/Video (Upload Icon)** tool. Select a local video (MP4, maximum 50MB) to inject it onto the canvas.
4. To search the internet for content, click the **Stock Images (Image Icon)** tool located right next to the upload button.
5. In the resulting modal, type `Business Team` into the Pexels Search bar to find and inject royalty-free stock imagery.
6. To pull from organized layout layouts, click the **Templates (LayoutTemplate Icon)** tool in the Left Panel and select a predefined visual structure.

![Content Management System](/screenshots/content-manager.png)

**Example Task:** 
Start a blank slide. Under the Left Panel's Tools, use the Upload Image/Video button to upload your company logo (PNG). Use the Stock Images button to find an image of a "Coffee Cup" and place it next to your logo.

---

### Module 5: Scheduling

**Objective:** Understand how to dictate exactly when content plays without manual intervention.

**Create schedule / Set time / Avoid conflicts:**
The calendar system dictates passive automation. When no manual override is active, the system reads the calendar triggers. 

**Step-by-step instructions:**
1. Open a completed presentation in the Visual Editor.
2. Click the **Schedule (CalendarClock Icon)** button in the top header.
3. In the dropdown, configure the **Start Time** input for precisely *Friday at 5:00 PM*.
4. Configure the **Finish Time** input for precisely *Monday at 8:00 AM*.
5. Click **Save Schedule**.
6. **Avoiding conflicts:** If two shows are scheduled overlapping the exact same time window, the system logic gracefully dictates that the screens will simply *loop both shows sequentially*, avoiding a hard conflict error.

![Scheduling Tools](/screenshots/scheduling.png)

**Example Task:** 
Take a presentation and schedule it to run for only the next three hours. Then go to your main Dashboard's *Up Next* panel and click the **Cancel Schedule (StopCircle Icon)** button next to it to abort safely.

---

### Module 6: Display System

**Objective:** Realize how the public views your creations on the physical television hardware.

**How slides appear / What users see:**
The TVs running `/display` have zero administrative UI. They are purely full-screen, silent receivers. When a slide has a duration of 10 seconds, the TV holds the image natively via React DOM manipulation, then crossfades flawlessly to the next.

**Step-by-step instructions:**
1. On your Admin Dashboard, locate the **Open Display (ExternalLink Icon)** button at the top right.
2. Click it. A new browser tab opens mimicking a physical TV screen.
3. Observe that the Display interface is completely locked down. There are no menus, no mouse cursors, and no buttons. It strictly listens for WebSocket commands.
4. Keep the Display tab open. Switch back to your Admin tab and hit the **Present** button on a project card. Switch back to your Display tab to watch the loop get hijacked in real-time.

![Receiver Display System](/screenshots/display-system.png)

**Example Task:** 
Explain to your instructor physically why the Display System requires no login credentials relative to the Admin Control Center.

---

### Module 7: Archiving

**Objective:** Understand data lifecycle management, database cleanliness, and manual deletion protocols.

**What happens to expired content / Why it matters:**
*Why it matters:* Digital signage generates massive amounts of heavy asset data (4K Images, Videos). The server cannot hold infinite videos. 
*Expired Content:* When a show's scheduled "Finish Time" passes, the schedule simply drops off the TV. *However, the show and its heavy media remain in the Project library permanently* until manually archived/deleted by an Admin.

**Step-by-step instructions:**
1. Navigate to the **Project** library.
2. Identify a show that is out-of-date and no longer scheduled.
3. Click the **Three-Dot Options Menu (MoreVertical Icon)** on the right side of the show's list entry (or bottom right of its card).
4. Select **Delete (Trash2 Icon)**.
5. Confirm the deletion. This permanently strips the show's data and media payloads from the server database, freeing up hosting capacity.

![Archiving Projects](/screenshots/archiving.png)

**Example Task:** 
Use the Three-Dot menu to **Duplicate** an existing project. Treat the original as the "Archived Template". Now immediately **Delete** the duplicate copy you just made to practice cleaning out the project workspace safely.

---

### Participant Feedback Form
Thank you for attending the Master Training Course! You have successfully touched every single feature by completing the 7 modules above.

*Please locate the detached feedback form provided by your instructor and rate the clarity, depth, and pacing of today's exhaustive technical walkthrough.*

---

## 3. Training Another Team (Peer Review Reflection)

**Our Impressions & Analysis of Peer Feedback:**
Delivering this granular mock training session to our peer software development team was highly effective. By separating the curriculum into 7 distinct rigid functional modules (Overview, Navigation, Screens, Content, Scheduling, Display, Archiving), trainees progressed logically from Logging In, to Building, to presenting on the Display, to finally Archiving data.

Trainees specifically noted that separating the "Display System" (Module 6) from "Navigation" (Module 2) firmly cemented the architectural concept that Admins exist entirely separate from the TVs on the wall. The inclusion of the "Why it matters" prompt in Archiving helped non-technical users understand database server limits.

**Modifications Implemented:** The peer team initially struggled with finding the media uploads because they assumed it existed in the Properties panel. We modified Module 4 to heavily reinforce that the **Upload Image/Video** and **Stock Images** buttons are located in the **Left Panel** under the "Tools" section, which instantly resolved the UI confusion. We also explicitly replaced ambiguous terms like "Add Media" with the exact system nomenclature: "Upload Image/Video".
