#!/usr/bin/env bash
set -e

echo "==> Installing FFmpeg system dependencies..."
apt-get update -qq && apt-get install -y -qq ffmpeg libavformat-dev libavcodec-dev libavdevice-dev libavutil-dev libswscale-dev libswresample-dev libavfilter-dev pkg-config

echo "==> Installing Python packages..."
pip install setuptools==69.5.1
pip install -r requirements.txt
