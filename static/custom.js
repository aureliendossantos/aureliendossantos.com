/*
Tabs
*/

function changeTab(evt, tabset, tabName) {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.querySelectorAll('.tabcontent[data-tabset="' + tabset + '"]');
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.querySelectorAll('.tablinks[data-tabset="' + tabset + '"]');
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
} 

// Auto-runs on load and clicks the first tab
(function() {
    let tabsetset = [];

    document.querySelectorAll('.tablinks').forEach((el) => {
        let attr = el.attributes['data-tabset'].value;
        if (!tabsetset.includes(attr)) {
            tabsetset.push(attr);
            el.click();
        }
    })
})();
