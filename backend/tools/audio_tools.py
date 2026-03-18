import whisper
import os
from moviepy.editor import VideoFileClip, AudioFileClip, CompositeAudioClip
from pydub import AudioSegment, generators

def transcribe_video(input_path: str):
    model = whisper.load_model("base")
    result = model.transcribe(input_path)
    return result

def add_captions(input_path: str, output_path: str):
    import subprocess
    result = transcribe_video(input_path)
    segments = result.get("segments", [])

    srt_path = input_path.replace(".mp4", ".srt").replace(".mov", ".srt")
    with open(srt_path, "w") as f:
        for i, seg in enumerate(segments):
            start = _format_time(seg["start"])
            end = _format_time(seg["end"])
            text = seg["text"].strip()
            f.write(f"{i+1}\n{start} --> {end}\n{text}\n\n")

    cmd = [
        "ffmpeg", "-y", "-i", input_path,
        "-vf", f"subtitles={srt_path}:force_style='FontSize=18,PrimaryColour=&HFFFFFF,OutlineColour=&H000000,Outline=2'",
        "-c:a", "copy", output_path
    ]
    subprocess.run(cmd, check=True)
    return output_path

def censor_word(input_path: str, output_path: str, word: str):
    result = transcribe_video(input_path)
    segments = result.get("segments", [])

    censor_times = []
    for seg in segments:
        for w in seg.get("words", []):
            if word.lower() in w.get("word", "").lower():
                censor_times.append((w["start"], w["end"]))

    if not censor_times:
        import shutil
        shutil.copy(input_path, output_path)
        return output_path

    clip = VideoFileClip(input_path)
    audio = clip.audio
    audio_path = input_path.replace(".mp4", "_audio.wav")
    audio.write_audiofile(audio_path, logger=None)

    sound = AudioSegment.from_wav(audio_path)
    for start, end in censor_times:
        duration_ms = int((end - start) * 1000)
        beep = generators.Sine(1000).to_audio_segment(duration=duration_ms).apply_gain(-10)
        start_ms = int(start * 1000)
        sound = sound[:start_ms] + beep + sound[start_ms + duration_ms:]

    censored_audio_path = input_path.replace(".mp4", "_censored.wav")
    sound.export(censored_audio_path, format="wav")

    new_audio = AudioFileClip(censored_audio_path)
    final = clip.set_audio(new_audio)
    final.write_videofile(output_path, codec="libx264", audio_codec="aac", logger=None)
    clip.close()
    return output_path

def _format_time(seconds: float) -> str:
    h = int(seconds // 3600)
    m = int((seconds % 3600) // 60)
    s = int(seconds % 60)
    ms = int((seconds - int(seconds)) * 1000)
    return f"{h:02}:{m:02}:{s:02},{ms:03}"
