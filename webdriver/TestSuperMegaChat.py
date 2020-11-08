from dotenv import load_dotenv
from pathlib import Path
import os
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)

class SuperMegaChatTest(unittest.TestCase):

    def setUp(self):
        self.driver = webdriver.Chrome(os.getenv("CHROMEDRIVER_PATH"))

    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True

    def test_open_supermegachat(self):
        driver = self.driver
        driver.get(os.getenv("APP_URL"))
        
        assert "MegaChat" in driver.title
        self.assertTrue(self.is_element_present(By.CLASS_NAME, "sign-in"))
        assert "Sign into MegaChat with Google" in driver.page_source

        originalWindow = driver.window_handles[0]

        signinbutton = driver.find_element_by_class_name('sign-in')
        signinbutton.click()
        time.sleep(3)

        for winHandle in driver.window_handles:
            driver.switch_to.window(winHandle)

        assert "Sign in" in driver.page_source
        elem = driver.find_element_by_xpath("//input")
        elem.send_keys(os.getenv("TEST_EMAIL"))
        elem.send_keys(Keys.RETURN)

        time.sleep(3)
        assert "Couldn't sign you in" in driver.page_source

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()