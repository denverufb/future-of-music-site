# Program Time Clock & Payroll setup

1. Open the Future of Music Supabase project, then choose **SQL Editor**.
2. Create a new query, paste the complete contents of [program-timeclock-setup.sql](./program-timeclock-setup.sql), and select **Run**.
3. Confirm the green success message, then refresh the Administration Hub.

The time clock now uses each coach’s own account automatically. Coaches cannot view anyone else’s hours or payroll information. The owner’s Time & payroll view provides weekly totals, rate entry, calculated amount owed, approval/paid tracking, and CSV export.

You can run this file again safely. It also removes the former break-time field so hours are a simple clock-in to clock-out total.

This is a private timesheet and payment-tracking tool. Continue to issue payments through your normal payroll or payment process.
