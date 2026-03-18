from moviepy.editor import VideoFileClip, concatenate_videoclips
import numpy as np

def remove_silences(input_path: str, output_path: str, threshold_db: float = -40.0, min_silence_duration: float = 0.5):
    clip = VideoFileClip(input_path)
    audio = clip.audio

    if audio is None:
        clip.write_videofile(output_path, codec="libx264", audio_codec="aac", logger=None)
        return output_path

    fps = 44100
    chunk_duration = 0.1
    chunk_frames = int(fps * chunk_duration)
    audio_array = audio.to_soundarray(fps=fps)

    if len(audio_array.shape) > 1:
        audio_mono = audio_array.mean(axis=1)
    else:
        audio_mono = audio_array

    keep_segments = []
    i = 0
    total_samples = len(audio_mono)

    while i < total_samples:
        chunk = audio_mono[i:i + chunk_frames]
        rms = np.sqrt(np.mean(chunk ** 2))
        db = 20 * np.log10(rms + 1e-10)

        if db > threshold_db:
            start_time = i / fps
            end_time = min((i + chunk_frames) / fps, clip.duration)
            keep_segments.append((start_time, end_time))

        i += chunk_frames

    if not keep_segments:
        clip.write_videofile(output_path, codec="libx264", audio_codec="aac", logger=None)
        return output_path

    # Merge nearby segments
    merged = [keep_segments[0]]
    for seg in keep_segments[1:]:
        if seg[0] - merged[-1][1] < min_silence_duration:
            merged[-1] = (merged[-1][0], seg[1])
        else:
            merged.append(seg)

    subclips = [clip.subclip(s, min(e, clip.duration)) for s, e in merged]
    final = concatenate_videoclips(subclips)
    final.write_videofile(output_path, codec="libx264", audio_codec="aac", logger=None)
    clip.close()
    return output_path


def speed_up_video(input_path: str, output_path: str, factor: float = 1.5):
    clip = VideoFileClip(input_path)
    fast = clip.speedx(factor)
    fast.write_videofile(output_path, codec="libx264", audio_codec="aac", logger=None)
    clip.close()
    return output_path


def trim_video(input_path: str, output_path: str, start: float = 0, end: float = None):
    clip = VideoFileClip(input_path)
    end = end or clip.duration
    trimmed = clip.subclip(start, end)
    trimmed.write_videofile(output_path, codec="libx264", audio_codec="aac", logger=None)
    clip.close()
    return output_path
