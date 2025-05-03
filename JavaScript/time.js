// Function to update the clock display
function updateClock() {
     // Get clock elements
     const hours = document.getElementById('hours');
     const minutes = document.getElementById('minutes');
     const seconds = document.getElementById('seconds');
     const ampm = document.getElementById('ampm');
 
     const hh = document.getElementById('hh');
     const mm = document.getElementById('mm');
     const ss = document.getElementById('ss');
 
     const hrDot = document.getElementById('hr_dot'); // Assuming these elements exist
     const minDot = document.getElementById('min_dot');
     const secDot = document.getElementById('sec_dot');
 
     // Get current time
     const now = new Date();
     let h = now.getHours();
     let m = now.getMinutes();
     let s = now.getSeconds();
 
     // Determine AM/PM
     const am = h >= 12 ? "PM" : "AM";
 
     // Convert to 12-hour format and add leading zero if needed
     h = h % 12 || 12; // Convert to 12-hour format (1-12)
     h = h < 10 ? "0" + h : h; // Add leading zero if needed
     m = m < 10 ? "0" + m : m; // Add leading zero if needed
     s = s < 10 ? "0" + s : s; // Add leading zero if needed
 
     // Update clock display
     hours.innerHTML = `${h}<br><span>Hr</span>`;
     minutes.innerHTML = `${m}<br><span>Min</span>`;
     seconds.innerHTML = `${s}<br><span>Sec</span>`;
     ampm.innerHTML = am;
 
     // Update stroke dash offsets
     hh.style.strokeDashoffset = 440 - (440 * (h % 12)) / 12;
     mm.style.strokeDashoffset = 440 - (440 * m) / 60;
     ss.style.strokeDashoffset = 440 - (440 * s) / 60;
 
     // Update rotation for dots
     hrDot.style.transform = `rotate(${(h % 12) * 30}deg)`; // 360 / 12 = 30
     minDot.style.transform = `rotate(${m * 6}deg)`; // 360 / 60 = 6
     secDot.style.transform = `rotate(${s * 6}deg)`; // 360 / 60 = 6
 }
 
 // Update clock every second
 setInterval(updateClock, 1000);
 
 // Initial clock update
 updateClock();
 