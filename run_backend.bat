@echo off
cd /d "%~dp0"
echo ============================================================
echo Starting EcoRoute AI - Backend API (FastAPI)
echo ============================================================
python -m pip install --no-cache-dir -r requirements.txt
echo.
echo Starting Uvicorn Server on http://127.0.0.1:8000 ...
python -m uvicorn backend.app.main:app --reload --port 8000
pause

