var consoleEl = document.getElementById("console");

var txt = [
  "",
  "",
  "",
  "",
  "Netwatch Secure Shell (SSHv9.4-quantum) netwatch-9472",
  "Kernel: NTR 7.7.12-axiom ARM128",
  "Uptime: 3173 days, 22 hours, 08 minutes",
  "System load: 0.42 0.77 0.91",
  "generic@netwatch-9472:~$ login auth --keyring /dev/op0/keyring.sha256",
  "User keyring was successfully imported.",
  "generic@netwatch-9472:~$ soulkiller build \\",
  "--scan=/dev/op0/5n0hw/scan.sk \\",
  "--paramters=rw,nc,ggiop \\",
  "--upload=yes \\",
  "--network=2001:db8:3a::/64",
  "[soulkiller_v0.98.1] BUILD STARTED",
  "[soulkiller_v0.98.1] PRELOADING CACHE...",
  "[soulkiller_v0.98.1] RESOLVING DEPENDENCIES...",
  "[soulkiller_v0.98.1] LINKING MEMORY SEGMENTS...",
  "[soulkiller_v0.98.1] ALLOCATING BUFFER...",
  "[soulkiller_v0.98.1] INITIALIZING CORE THREADS...",
  "[soulkiller_v0.98.1] HOST FOUND @ 2001:db8:3a::190...",
  "[soulkiller_v0.98.1] VALIDATING HOST INTEGRITY...",
  "[soulkiller_v0.98.1] INJECTING BASE KERNEL...",
  "[soulkiller_v0.98.1] WRITING EXECUTION MAP...",
  "[soulkiller_v0.98.1] SYNCING CLOCK SIGNAL...",
  "[soulkiller_v0.98.1] CALIBRATING NEURAL PATHWAYS...",
  "[soulkiller_v0.98.1] ESTABLISHING CONTROL CHANNEL...",
  "[soulkiller_v0.98.1] ENCRYPTING PAYLOAD...",
  "[soulkiller_v0.98.1] VERIFYING HASH SIGNATURE...",
  "[soulkiller_v0.98.1] DEPLOYING RUNTIME ENVIRONMENT...",
  "[soulkiller_v0.98.1] REROUTING SIGNAL PATHS...",
  "[soulkiller_v0.98.1] SIGNAL STABILIZED",
  "[soulkiller_v0.98.1] COMPILING NEURAL FRAMEWORK...",
  "[soulkiller_v0.98.1] HOST FOUND @ 2001:db8:3a::190...",
  "[soulkiller_v0.98.1] BUILDING HOST...",
  "[soulkiller_v0.98.1 [WARN]] CORRUPTION DETECTED...",
  "^C",
  "generic@netwatch-9472:~$ sudo blackwall purge --force",
  "Blackwall purge in progress...",
  "ERROR: Cannot purge running process",
  "generic@netwatch-9472:~$ logout",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
];

let currentIndex = 0;

// Typewriter effect for ONE line
function typeLine(text, element, speed = 20) {
  return new Promise(resolve => {
    let i = 0;

    function typeChar() {
      if (i < text.length) {
        element.textContent += text[i];
        i++;
        setTimeout(typeChar, speed);
      } else {
        resolve();
      }
    }

    typeChar(); 
  });
}

// Add a new line (scrolling)
async function addLine() {
  // If more than 4 lines -> remove top
  if (consoleEl.children.length >= 4) {
    consoleEl.removeChild(consoleEl.firstChild);
  }

  // Create new line
  const p = document.createElement("p");
  consoleEl.appendChild(p);

  // Type ONLY this new line
  await typeLine(txt[currentIndex], p);

  // Move forward
  currentIndex = (currentIndex + 1) % txt.length;

  // Small pause before next line
  setTimeout(addLine, 200);
}

// Start by filling initial 4 lines instantly (no typing)
function init() {
  for (let i = 0; i < 4; i++) {
    const p = document.createElement("p");
    p.textContent = txt[currentIndex];
    consoleEl.appendChild(p);
    currentIndex++;
  }

  // Then start typing new lines
  setTimeout(addLine, 500);
}

init();