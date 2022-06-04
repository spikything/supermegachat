from random import randint
from dotenv import load_dotenv
from pathlib import Path
import os
import time
import unittest
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.service import Service

# To run WebDriver automated E2E testing:
# Ensure python in installed
# Ensure WebDriver is installed
# Ensure the test setup in your .env is correct
# Run the Firebase Auth and Firestore emulators
# Ensure the dev server is running (npm start)
# Run this test script with: python ./TestSuperMegaChat.py

env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)

class SuperMegaChatTest(unittest.TestCase):

    def setUp(self):
        ser = Service("C:/Dev/Tools/webdriver/chromedriver.exe")
        op = webdriver.ChromeOptions()
        self.driver = webdriver.Chrome(service=ser, options=op)

    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True

    def test_open_supermegachat(self):
        driver = self.driver
        driver.get(os.getenv("APP_URL"))
        
        # Check we have a title and sign in button
        assert "MegaChat" in driver.title
        self.assertTrue(self.is_element_present(By.CLASS_NAME, "sign-in"))
        assert "Sign into MegaChat with Google" in driver.page_source

        # Keep a reference to the original browser window
        originalWindow = driver.window_handles[0]

        # Click the sign in button
        time.sleep(1)
        signinbutton = driver.find_element_by_class_name('sign-in')
        signinbutton.click()
        time.sleep(1)

        # Switch to the top-most window (the auth popup)
        for winHandle in driver.window_handles:
            driver.switch_to.window(winHandle)
        
        # The 'add new account' button in the firebase auth emulator does not have an id
        driver.find_element_by_class_name('mdc-button__ripple').click()

        # Auto-generate new account info
        time.sleep(1)
        driver.find_element_by_id('autogen-button').click()
        
        # Sign in with new account info
        time.sleep(1)
        driver.find_element_by_id('sign-in').click()

        # Switch to the original browser window
        time.sleep(1)
        driver.switch_to.window(originalWindow)

        # Check we have a sign out button
        assert "Sign out" in driver.page_source

        # Type in a random message
        elem = driver.find_element_by_xpath("//input")
        randomMessage = "Test message " + str(randint(100000, 999999))
        elem.send_keys(randomMessage)
        elem.send_keys(Keys.RETURN)

        # Check this message appears
        time.sleep(1)
        assert randomMessage in driver.page_source

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()