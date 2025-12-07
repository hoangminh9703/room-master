@echo off
cd /d "d:\projects\room-master"
npm run db:migrate
npm run db:seed
echo.
echo Database initialization complete!
pause
