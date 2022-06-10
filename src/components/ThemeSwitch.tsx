import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { motion } from "framer-motion";
import '../styles/components/ThemeSwitch.css';

const STYLE = document.documentElement.style;
const THEME = 'theme';

enum Theme {
    light = "light",
    dark = "dark",
}

const CSSVARS = [
    '--bg',
    '--header',
    '--text',
    '--button-text',
    '--button',
    '--image-filter'
];

const ThemeSwitch = ({style} : {style:string}) => {

    // Get the stored theme or use a default
    const [theme, setTheme] = useState( localStorage?.getItem(THEME) as Theme || Theme.light );

    // Update all the CSS variables if theme changes
    useEffect(() => {
        localStorage?.setItem(THEME, theme);
        CSSVARS.forEach((val) => {
            STYLE.setProperty(val, `var(${val}-${theme})`);
        });
    }, [theme]);

    return <>

        <input
            type="checkbox"
            className="checkbox"
            id="checkbox"
            onChange={ (e) => setTheme(theme === Theme.dark ? Theme.light : Theme.dark) }
            checked={ theme === Theme.dark }
        />

        <motion.label
            htmlFor="checkbox"
            className={style}
            initial={{ opacity: 0, x: 150, scale: 1.5 }}
            animate={{ opacity: 1, x: 0, scale: 1.5 }}
            transition={{ delay: 1.3, duration: 0.3 }}
        >
            <FontAwesomeIcon icon={faMoon} />
            <FontAwesomeIcon icon={faSun} />
            <div className='ball' />
        </motion.label>

    </>
}

export default ThemeSwitch;
