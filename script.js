// https://yihui.org/en/2023/09/dark-mode/
function toggleLightMode(elem) { 
    classes = elem.classList; 
    // getComputedStyle(document.body).getPropertyValue('--light-mode')  // read CSS variable
    if (classes.contains('fa-solid')) { 
        // set dark mode
        classes.replace('fa-solid', 'fa-regular'); 
        // document.body.style.setProperty('--light-mode', 'dark');
    } else { 
        // set light mode
        classes.replace('fa-regular', 'fa-solid'); 
        // document.body.style.setProperty('--light-mode', 'light');
    } 
    document.body.classList.toggle('dark-mode');
}