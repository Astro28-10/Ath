# SkillBond - Safe Startup Guide

## ⚠️ Why the Original Script Crashed Your Computer

The original `START.bat` had these critical issues:

1. **Global Process Kill**: `taskkill /F /IM node.exe` killed ALL Node.js processes on your system, not just SkillBond
   - This could terminate other Node.js applications you had running
   - Could cause data loss or corruption in other applications

2. **No Error Handling**: Script continued even if something failed
   - Services might not start, but script appeared successful
   - Difficult to debug what went wrong

3. **No Dependency Checking**: Assumed npm packages were installed
   - If installation was incomplete, services would crash immediately

4. **No Port Conflict Detection**: Could cause confusing "port already in use" errors
   - No clear error messaging to help troubleshoot

5. **Memory/CPU Spike**: Starting multiple Node.js instances without spacing could overwhelm system resources

---

## ✅ Updated Script Improvements

The new `START.bat` now includes:

- ✓ **Safe Cleanup**: Only closes SkillBond windows, not all Node.js
- ✓ **Prerequisites Check**: Verifies Node.js and npm are installed
- ✓ **Dependency Validation**: Checks and installs missing packages
- ✓ **Port Availability Check**: Warns about port conflicts
- ✓ **Error Handling**: Stops and reports any startup failures
- ✓ **Better Timeouts**: Gives services time to initialize

---

## 🚀 Quick Start (Using Updated Script)

Simply run:
```batch
START.bat
```

The script will:
1. ✓ Check Node.js/npm installation
2. ✓ Install dependencies (if needed)
3. ✓ Clean up previous instances (safely)
4. ✓ Check port availability
5. ✓ Start backend (port 3001)
6. ✓ Start frontend (port 3000)
7. ✓ Open browser

---

## 🔧 Manual Startup (For Troubleshooting)

If you prefer more control, start services manually:

### Terminal 1 - Backend
```bash
cd backend
npm install
npm start
```

Backend will run on: **http://localhost:3001**

### Terminal 2 - Frontend
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
```

Frontend will run on: **http://localhost:3000**

---

## 🛑 How to Stop Services

### Option 1: Close Windows
- Click the X button on either backend or frontend window

### Option 2: Safe Process Kill (PowerShell)
```powershell
# Close all SkillBond windows
Get-Process | Where-Object {$_.ProcessName -eq "node"} | Stop-Process -Force
```

### Option 3: Kill Specific Ports
```powershell
# Kill process on port 3001 (backend)
netstat -ano | findstr :3001 | ForEach-Object {$_.Split()[4]} | ForEach-Object {taskkill /PID $_ /F}

# Kill process on port 3000 (frontend)
netstat -ano | findstr :3000 | ForEach-Object {$_.Split()[4]} | ForEach-Object {taskkill /PID $_ /F}
```

---

## 🐛 Troubleshooting

### "Port already in use"
```bash
# Check what's using port 3001
netstat -ano | findstr :3001

# Check what's using port 3000
netstat -ano | findstr :3000
```

### "npm not found"
- Install Node.js from https://nodejs.org/
- Restart your terminal/command prompt

### Backend won't start
```bash
cd backend
npm install
npm start
# Check console for specific error
```

### Frontend won't start
```bash
cd frontend
npm install --legacy-peer-deps
npm run dev
# Check console for specific error
```

### Services start but site shows "Cannot connect"
- Wait 5-10 seconds for services to fully initialize
- Check browser console (F12) for specific errors
- Try refreshing the page (Ctrl+R)

---

## 📋 Test Accounts

All three accounts are pre-loaded with demo data:

| Account  | Address | Reputation | Status |
|----------|---------|------------|--------|
| alice.eth | 0x72f3... | 95% | High |
| bob.eth | 0x1234... | 72% | Medium |
| carol.eth | 0x0987... | 40% | Low |

---

## 💡 Tips

1. **Resource Hungry**: SkillBond requires ~500MB+ RAM for both services
   - Close other applications if you get out-of-memory errors

2. **First Run**: First startup takes longer due to dependency installation
   - This is normal - subsequent starts are faster

3. **Development**: For hot-reload, use manual startup method
   - Frontend: Changes auto-reload in browser
   - Backend: Requires manual restart

4. **Production Ready**: See [DEPLOYMENT.md](docs/DEPLOYMENT.md) for production setup

---

## 📞 Still Having Issues?

1. Check browser console for errors: **F12**
2. Check each terminal window for error messages
3. Try **manual startup** for more detailed error info
4. Review [docs/TESTING_GUIDE.md](docs/TESTING_GUIDE.md) for additional help
