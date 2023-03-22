@echo off
IF "%~3"=="1080" goto 1080
IF "%~2"=="" goto error

:normal
echo.
echo Downloading at highest quality available...
echo NOTE: Use "yt url 1080" to download at 1080p max.
echo.
youtube-dl %1=%2
goto end

:1080
echo.
echo Downloading at 1080p...
echo.
youtube-dl -f "bestvideo[height<=1080]+bestaudio/best[height<=1080]" %1=%2
goto end

:error
echo This isn't a YouTube link. Please use youtube-dl directly.

:end