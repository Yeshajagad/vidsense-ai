import cv2
import numpy as np
from ultralytics import YOLO
import os

def blur_objects(input_path: str, output_path: str, target_class: str = "person"):
    model = YOLO("yolov8n.pt")
    cap = cv2.VideoCapture(input_path)

    width  = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
    height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
    fps    = cap.get(cv2.CAP_PROP_FPS)

    temp_output = output_path.replace(".mp4", "_noaudio.mp4")
    fourcc = cv2.VideoWriter_fourcc(*"mp4v")
    out = cv2.VideoWriter(temp_output, fourcc, fps, (width, height))

    class_map = {
        "person": 0, "face": 0, "car": 2,
        "truck": 7, "bus": 5, "license plate": 0
    }
    target_id = class_map.get(target_class.lower(), 0)

    while True:
        ret, frame = cap.read()
        if not ret:
            break
        results = model(frame, verbose=False)
        for result in results:
            for box in result.boxes:
                if int(box.cls[0]) == target_id:
                    x1, y1, x2, y2 = map(int, box.xyxy[0])
                    roi = frame[y1:y2, x1:x2]
                    blurred = cv2.GaussianBlur(roi, (51, 51), 0)
                    frame[y1:y2, x1:x2] = blurred
        out.write(frame)

    cap.release()
    out.release()

    # Re-attach audio with ffmpeg
    import subprocess
    cmd = [
        "ffmpeg", "-y",
        "-i", temp_output,
        "-i", input_path,
        "-map", "0:v", "-map", "1:a",
        "-c:v", "libx264", "-c:a", "aac",
        output_path
    ]
    subprocess.run(cmd, check=True)
    os.remove(temp_output)
    return output_path
