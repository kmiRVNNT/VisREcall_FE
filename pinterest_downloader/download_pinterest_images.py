import os
import time
import requests
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.common.by import By

# === CONFIG ===
BOARD_URL = "https://www.pinterest.com/kmirvnnt/pins/"
OUTPUT_DIR = "pinterest_images"
MAX_IMAGES = 50

# === SETUP CHROME DRIVER ===
options = webdriver.ChromeOptions()
options.add_argument('--headless')  # run without opening window
options.add_argument('--disable-gpu')
options.add_argument('--no-sandbox')

driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

# === LOAD PAGE ===
print("Opening board...")
driver.get(BOARD_URL)
time.sleep(3)

# === SCROLL TO LOAD IMAGES ===
print("Scrolling to load pins...")
image_urls = set()
scrolls = 0
while len(image_urls) < MAX_IMAGES and scrolls < 20:
    driver.execute_script("window.scrollBy(0, 1000);")
    time.sleep(1.5)
    images = driver.find_elements(By.TAG_NAME, "img")
    for img in images:
        src = img.get_attribute("src")
        if src and src.startswith("https://i.pinimg.com/"):
            image_urls.add(src)
    scrolls += 1

driver.quit()

# === DOWNLOAD IMAGES ===
print(f"Found {len(image_urls)} images. Downloading...")
print(f"Collected {len(image_urls)} image URLs:")
for url in image_urls:
    print(url)


os.makedirs(OUTPUT_DIR, exist_ok=True)
for i, url in enumerate(list(image_urls)[:MAX_IMAGES]):
    response = requests.get(url)
    if response.status_code == 200:
      with open(os.path.join(OUTPUT_DIR, f"image_{i+1}.jpg"), 'wb') as f:
        f.write(response.content)
      print(f"Downloaded image {i+1}")
    else:
      print(f"Failed to download {url}")

print("✅ Done.")
