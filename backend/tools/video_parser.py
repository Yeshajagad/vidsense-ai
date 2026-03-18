from tools.audio_tools import transcribe_video

def generate_chapters(input_path: str) -> list:
    result = transcribe_video(input_path)
    segments = result.get("segments", [])

    if not segments:
        return []

    chapters = []
    chunk_duration = 120  # every ~2 minutes
    current_time = 0
    chapter_count = 1

    for seg in segments:
        if seg["start"] >= current_time:
            timestamp = _format_timestamp(seg["start"])
            text = seg["text"].strip()
            title = text[:50] + "..." if len(text) > 50 else text
            chapters.append({
                "timestamp": timestamp,
                "seconds": seg["start"],
                "title": f"Chapter {chapter_count}: {title}"
            })
            current_time += chunk_duration
            chapter_count += 1

    return chapters

def _format_timestamp(seconds: float) -> str:
    m = int(seconds // 60)
    s = int(seconds % 60)
    return f"{m:02}:{s:02}"
