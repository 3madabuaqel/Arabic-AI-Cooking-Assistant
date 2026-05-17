from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
import json
import time
import pandas as pd



links = pd.read_csv('cookpad_links.csv')
filename = "recipes_2.json"
batch_size = 50  # Restarts the driver every 50 links to clear memory

csv_links = set(links['recipe_url'].tolist())


def setupDriver():
    driverPath = 'chromedriver-win64/chromedriver.exe'
    options = Options()
    options.add_argument("--headless") 
    options.add_argument("--disable-gpu") 
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--window-size=1920,1080")
    
    driver = webdriver.Chrome(
        options=options,
        service=Service(driverPath)
    )
    return driver


def getDataFromPage(driver):
    try:
        # Wait for the main content container to load
        WebDriverWait(driver, 7).until(
            EC.presence_of_element_located((By.XPATH, "//div[@id='cacheable-recipe-content']"))
        )

        # Scrape basic recipe details
        ingredients = [i.text for i in driver.find_elements(By.XPATH, ".//div[contains(@class, 'ingredient-list')]/ol/li")]
        instructions = [i.text for i in driver.find_elements(By.XPATH, ".//ol[contains(@class, 'list-none ')]/li")]
        title = [i.text for i in driver.find_elements(By.XPATH, ".//h1[contains(@class, 'break-words text-cookpad-body-16')]")]

        return {
            'title': title,
            'ingredients': ingredients,
            'instructions': instructions
        }
    except Exception as e:
        print(f"⚠️ Extraction failed: {e}")
        return None

# --- Resume Logic: Load existing progress ---
if os.path.exists(filename):
    with open(filename, "r", encoding="utf-8") as file:
        try:
            all_data = json.load(file)
        except json.JSONDecodeError:
            all_data = []
else:
    all_data = []

# Identify already processed URLs to avoid duplicates
processed_urls = {item['url'] for item in all_data if 'url' in item}
links_to_process = [l for l in csv_links if l not in processed_urls]

print(f"📊 Total links in CSV: {len(csv_links)}")
print(f"✅ Already processed: {len(processed_urls)}")
print(f"⏳ Remaining to scrape: {len(links_to_process)}")

# --- Main Processing Loop (Batch System) ---
for i in range(0, len(links_to_process), batch_size):
    current_batch = links_to_process[i:i + batch_size]
    print(f"\n🚀 Starting batch: {i+1} to {i + len(current_batch)}...")
    
    driver = setupDriver()
    
    for csv_link in current_batch:
        try:
            driver.get(csv_link)
            data = getDataFromPage(driver)
            
            if data:
                data['url'] = csv_link # Store URL as a reference for resume logic
                all_data.append(data)
                
                # Save immediately after each success to prevent data loss
                with open(filename, "w", encoding="utf-8") as file:
                    json.dump(all_data, file, ensure_ascii=False, indent=4)
                
                print(f"✔️ Done: {data['title'][:30]}...")
            else:
                print(f"❌ Skip: {csv_link}")
                
        except Exception as e:
            print(f"🛑 Error processing {csv_link}: {e}")
            continue
            
    # Close browser after each batch to free up RAM
    driver.quit()
    print(f"🧹 Driver closed. Memory cleared.")

print("\n🎉 Scraping process completed successfully!")