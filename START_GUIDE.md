# 🚀 Quick Start Guide

Two scripts to start SkillBond fully automatically.

---

## Option 1: Batch File (Easiest for Windows)

### How to Use

**Method A: Double-click**
```
1. Open File Explorer
2. Navigate to: D:\Projects and codes\Athernex_hackathon\Ath\
3. Find: START_SKILLBOND.bat
4. Double-click it
```

**Method B: Command Prompt**
```powershell
# Navigate to project root
cd D:\Projects and codes\Athernex_hackathon\Ath

# Run the script
START_SKILLBOND.bat
```

### What It Does

1. ✅ Checks for Node.js and npm
2. ✅ Kills any existing services (ports 3000/3001)
3. ✅ Installs missing dependencies (if needed)
4. ✅ Starts Backend on port 3001 (new window)
5. ✅ Starts Frontend on port 3000 (new window)
6. ✅ Opens browser to http://localhost:3000
7. ✅ Shows status summary
8. ✅ Saves logs to `logs/` folder

### Output Example

```
╔════════════════════════════════════════════════════════════╗
║                  🚀 SKILLBOND STARTUP                      ║
║         Starting Backend and Frontend Services             ║
╚════════════════════════════════════════════════════════════╝

[CHECKING] Node.js installation...
[OK] v20.10.0 found

[CHECKING] npm installation...
[OK] npm 10.2.3 found

[CLEANUP] Checking for running services...
[OK] Killed existing Node.js processes

[STARTING] Backend Service on port 3001...
[OK] Backend service started (check console window)

[STARTING] Frontend Service on port 3000...
[OK] Frontend service started (check console window)

[WAITING] Allowing services to initialize...

╔════════════════════════════════════════════════════════════╗
║                    ✅ STARTUP COMPLETE                     ║
╠════════════════════════════════════════════════════════════╣
║  Backend:  http://localhost:3001                          ║
║  Frontend: http://localhost:3000                          ║
║                                                            ║
║  Test Accounts:                                           ║
║  • alice.eth (95% reputation)                             ║
║  • bob.eth   (72% reputation)                             ║
║  • carol.eth (40% reputation)                             ║
╚════════════════════════════════════════════════════════════╝
```

---

## Option 2: PowerShell Script (More Reliable)

### How to Use

**Step 1: Enable PowerShell Execution Policy**

```powershell
# Open PowerShell as Administrator
# Then run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
# Type: Y and press Enter
```

**Step 2: Run the Script**

**Method A: PowerShell**
```powershell
# Navigate to project root
cd D:\Projects and codes\Athernex_hackathon\Ath

# Run the script
.\START_SKILLBOND.ps1
```

**Method B: Right-click in File Explorer**
```
1. Hold Shift
2. Right-click empty space in folder
3. Select "Open PowerShell window here"
4. Type: .\START_SKILLBOND.ps1
5. Press Enter
```

### Output Example

Same as batch file but with **colored output** (prettier! 🎨)

---

## ⚡ Quick Troubleshooting

### "Node.js not found"
```
Solution: Install Node.js from https://nodejs.org/
Make sure to add to PATH during installation
Then close and re-open terminal
```

### "Port 3000/3001 already in use"
```
The script automatically kills existing processes
If it still fails, manually close:
- Any browser showing localhost:3000
- Any terminal windows running Node
Then try again
```

### "npm: command not found"
```
Solution: npm comes with Node.js
Re-install Node.js and ensure PATH is set correctly
Or open a new terminal window after installation
```

### "Permission denied" (PowerShell)
```
Solution: Run:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Then try again
```

---

## 📁 What Happens

After running the script:

```
Your Computer
├── Terminal 1: Backend Server
│   ├── Port: 3001
│   ├── Shows: Logs from npm start
│   └── Status: ✅ Connected to Polygon Amoy
│
├── Terminal 2: Frontend Server
│   ├── Port: 3000
│   ├── Shows: Logs from npm run dev
│   └── Status: ✅ Hot reload enabled
│
└── Browser Window
    ├── Opens: http://localhost:3000
    └── Shows: SkillBond landing page
```

---

## 🧪 Test It

Once started, test the services:

```bash
# In a new terminal:

# Test Backend
curl http://localhost:3001/api/health

# Test Frontend
curl http://localhost:3000

# Search for Alice
# Open: http://localhost:3000/search
# Search: alice.eth
# Result: 95% reputation ✅
```

---

## 🛑 Stop Services

### Option 1: Close terminal windows
```
Click the X button on either:
- Backend terminal
- Frontend terminal
```

### Option 2: Ctrl+C
```
In each terminal, press: Ctrl+C
Confirm: Y and Enter
```

### Option 3: Task Manager
```
Press: Ctrl+Shift+Esc
Find: node.exe
Right-click → End Task
```

---

## 📝 Logs

All logs saved to `logs/` folder:

```
logs/
├── backend.log   - Backend server logs
└── frontend.log  - Frontend server logs
```

View logs:
```powershell
# View backend logs
Get-Content logs/backend.log -Tail 20

# View frontend logs
Get-Content logs/frontend.log -Tail 20
```

---

## 💡 Pro Tips

### Tip 1: Create Desktop Shortcut (Batch only)
```
1. Right-click START_SKILLBOND.bat
2. Send to → Desktop (create shortcut)
3. Now can double-click from desktop to start!
```

### Tip 2: Run in Background
```powershell
# PowerShell: Start services without blocking
$null = Start-Process powershell -ArgumentList "-NoExit", "-File", "START_SKILLBOND.ps1"
```

### Tip 3: Check Ports Before Starting
```powershell
# See what's using port 3000
Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue

# See what's using port 3001
Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue
```

---

## 🎯 Expected Behavior

✅ **Should see:**
- ✅ Two new terminal windows appear
- ✅ Both show "running on localhost" messages
- ✅ Browser opens to http://localhost:3000
- ✅ Status summary shows success

❌ **If something fails:**
- ❌ One terminal closes immediately → Check npm install
- ❌ Browser doesn't open → Manually open http://localhost:3000
- ❌ Pages show "Cannot GET /" → Services didn't start, check error messages

---

## 📚 Documentation

After services start, visit these:

- **Main Site:** http://localhost:3000
- **Search:** http://localhost:3000/search
- **API:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

---

**That's it! Now you can start SkillBond with one click! 🚀**
