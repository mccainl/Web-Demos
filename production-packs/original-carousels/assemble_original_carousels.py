#!/usr/bin/env python3
"""Reassemble and verify the original 80-slide MCC carousel source ZIP."""
from pathlib import Path
import hashlib
import shutil

FILENAME = "MCC_16_Carousels_80_Slides_And_Captions.zip"
EXPECTED_SHA256 = "c688e2c80a92e03de775ae6dbf5c88ed383f04d185d3139b0596cb5a3101079b"
EXPECTED_BYTES = 28029335
EXPECTED_PARTS = 15

folder = Path(__file__).resolve().parent
parts = [folder / f"{FILENAME}.part{i:02d}" for i in range(1, EXPECTED_PARTS + 1)]
missing = [p.name for p in parts if not p.is_file()]
if missing:
    raise SystemExit("Missing ZIP parts: " + ", ".join(missing))

output = folder / FILENAME
hasher = hashlib.sha256()
length = 0
with output.open("wb") as dst:
    for part in parts:
        with part.open("rb") as src:
            while block := src.read(1024 * 1024):
                dst.write(block)
                hasher.update(block)
                length += len(block)

if length != EXPECTED_BYTES or hasher.hexdigest() != EXPECTED_SHA256:
    output.unlink(missing_ok=True)
    raise SystemExit(f"Integrity check failed. Bytes={length}, SHA256={hasher.hexdigest()}")
print(f"SUCCESS: {output.name} ({length:,} bytes, SHA256 verified)")
