import time
import csv
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By


target_url = [
    'https://cookpad.com/jo/search/دجاج',
    'https://cookpad.com/jo/search/لحم',
    'https://cookpad.com/jo/search/sea%20food',
    'https://cookpad.com/jo/search/%D8%AD%D9%84%D8%A7',
    'https://cookpad.com/jo/search/%D8%B9%D8%B4%D8%A7%D8%A1',
    'https://cookpad.com/jo/search/%D8%B1%D8%B2'
]

TARGET_PER_PAGE = 1000


def openWebSite(url):
    options = Options()
    # options.add_argument("--headless")  
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-blink-features=AutomationControlled")

    driver = webdriver.Chrome(
        options=options,
        service=Service(ChromeDriverManager().install())
    )

    driver.get(url)
    return driver


def get_links_from_page(driver):

    visited = set()

    # Wait for initial load
    WebDriverWait(driver, 10).until(
        EC.presence_of_all_elements_located(
            (By.XPATH, "//div[@id='search-recipes-list-container']//h2/a")
        )
    )

    last_count = 0
    no_change = 0

    while True:

        # Collect links FIRST (fast approach)
        links = driver.find_elements(
            By.XPATH,
            "//div[@id='search-recipes-list-container']//h2/a"
        )

        for link in links:
            url = link.get_attribute("href")
            if url:
                visited.add(url)

                # HARD LIMIT: stop immediately at 1000
                if len(visited) >= TARGET_PER_PAGE:
                    print("Reached 1000 links ✔️")
                    return list(visited)[:TARGET_PER_PAGE]

        print(f"Collected: {len(visited)}")

        # Stop if no new data
        if len(visited) == last_count:
            no_change += 1
        else:
            no_change = 0

        last_count = len(visited)

        if no_change >= 2:
            print("End of page reached ✔️")
            break

        # Small scroll (fast + lightweight)
        driver.execute_script("window.scrollTo(0, document.body.scrollHeight);")
        
        time.sleep(1)

    return list(visited)[:TARGET_PER_PAGE]



# MAIN RUN


all_results = {}

for url in target_url:
    print(f"\nProcessing: {url}")

    driver = openWebSite(url)

    links = get_links_from_page(driver)

    all_results[url] = links

    driver.quit()
    time.sleep(2)


# SAVE TO CSV


with open("cookpad_links.csv", "w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)

    writer.writerow(["search_url", "recipe_url"])

    for search_url, links in all_results.items():
        for link in links:
            writer.writerow([search_url, link])

print("\nSaved to cookpad_links.csv")