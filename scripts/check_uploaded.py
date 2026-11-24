import cv2
import numpy as np
from PIL import Image

# Read the two images passed in the latest prompt
# In the prompt:
# [Attachment: image/png (...)]
# Let's inspect the latest image files in .user_uploaded

import glob
import os

user_dir = r"C:\Users\BaBaPuson\.gemini\antigravity\brain\e2462338-4198-4743-9c8b-18c8557d4321\.user_uploaded"
files = sorted(glob.glob(os.path.join(user_dir, "*")), key=os.path.getmtime)
print("Latest 5 files in .user_uploaded:")
for f in files[-5:]:
    print(" ", os.path.basename(f), os.path.getsize(f), "bytes")
