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
from selenium.common.exceptions import NoSuchElementException

# To run WebDriver automated E2E testing:
# 1) Ensure python in installed
# 2) Ensure WebDriver is installed and that both Chrome and WebDriver are up-to-date
# 3) Ensure the test setup in your .env is correct (in particular CHROMEDRIVER_PATH)
# 4) Set USE_EMULATOR_WHEN_LOCAL in Settings to true (unless you really want to use your live Firebase environment for testing)
# 5) Run the Firebase Auth and Firestore emulators with: firebase emulators:start
# 6) Ensure the dev server is running: npm start
# 7) Run this test script with: python ./TestSuperMegaChat.py

env_path = Path('..') / '.env'
load_dotenv(dotenv_path=env_path)

class SuperMegaChatTest(unittest.TestCase):

    def setUp(self):
        ser = Service(os.getenv("CHROMEDRIVER_PATH"))
        op = webdriver.ChromeOptions()
        self.driver = webdriver.Chrome(service=ser, options=op)

    def is_element_present(self, how, what):
        try: self.driver.find_element(by=how, value=what)
        except NoSuchElementException as e: return False
        return True

    def is_element_not_present(self, what):
        with self.assertRaises(NoSuchElementException):
            self.driver.find_element(By.XPATH, value=what)

    def test_open_supermegachat(self):
        driver = self.driver
        driver.get(os.getenv("APP_URL"))
        
        # Check we have a title and sign in button
        assert "MegaChat" in driver.title
        self.assertTrue(self.is_element_present(By.CLASS_NAME, "sign-in"))

        assert "Welcome to MegaChat" in driver.page_source
        assert "Sign in with Google" in driver.page_source

        # Keep a reference to the original browser window
        originalWindow = driver.window_handles[0]

        # Click the sign in button
        time.sleep(2)
        signinbutton = driver.find_element(By.CLASS_NAME, 'sign-in')
        signinbutton.click()
        time.sleep(1)

        # Switch to the top-most window (the auth popup)
        for winHandle in driver.window_handles:
            driver.switch_to.window(winHandle)
        
        # Rather annoyingly, the 'add new account' button in the firebase auth
        # emulator popup does not have any 'id' set, but it's the only button
        # on that page with the 'mdc-button__ripple' class anyway
        time.sleep(1)
        driver.find_element(By.CLASS_NAME, 'mdc-button__ripple').click()

        # Auto-generate new account info
        time.sleep(1)
        driver.find_element(By.ID, 'autogen-button').click()
        
        # Sign in with new account info
        time.sleep(1)
        driver.find_element(By.ID, 'sign-in').click()

        # Switch to the original browser window
        time.sleep(1)
        driver.switch_to.window(originalWindow)
        time.sleep(1)

        # Check we have a sign out button
        assert "Sign out" in driver.page_source

        # Type in a random message
        elem = driver.find_element(By.ID, "chatinput")
        randomMessage = "WebDriver Test Message " + str(randint(100000, 999999))
        elem.send_keys(randomMessage)
        elem.send_keys(Keys.RETURN)

        # Check that the message we sent appears
        time.sleep(1)
        assert randomMessage in driver.page_source

        # Type in a bad word message
        time.sleep(1)
        badMessage = "shit"
        elem.send_keys(badMessage)
        elem.send_keys(Keys.RETURN)

        # Check that the bad word is supressed
        time.sleep(1)
        badElements = driver.find_elements(By.XPATH, "//*[contains(.,'" + badMessage + "')]")
        assert not len(badElements)

        # And that a censored message appears
        censoredElements = driver.find_elements(By.XPATH, "//*[contains(.,'🤐🤐🤐🤐')]")
        assert len(censoredElements)

    def tearDown(self):
        self.driver.quit()

if __name__ == "__main__":
    unittest.main()