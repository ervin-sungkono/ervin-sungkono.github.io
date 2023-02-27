function _id(id){
    return document.getElementById(id);
}

function _class(className){
    return document.getElementsByClassName(className);
}

function _query(query){
    return document.querySelector(query);
}

function _queryAll(query){
    return document.querySelectorAll(query);
}

// Dribbble API fetch to get shot lists for authenticated user
const accessToken = '273d8e87548ed5a17b05187f3969a76791322220257baa82c2e204b53ec1ad73';
fetch(`https://api.dribbble.com/v2/user/shots?access_token=${accessToken}`)
    .then((response) => response.json())
    .then((shots) => {
        const shotsArray = shots.slice(0,5);
        _query('#dribbble-section .container .dribbble-shots').innerHTML = shotsArray.reduce(function(html, shot) {
            return html + (`
            <div class="shot fade">
                <a href="${shot.html_url}" target="_blank">
                    <img src="${shot.images.normal}">
                    <div class="overlay">
                    <h3>${shot.title}</h3>
                    </div>
                </a>
            </div>`);
        }, "");
    })
    .catch((error) => console.log(error));

// Github API fetch starred repos for selected username
const githubUsername = 'ervin-sungkono';
fetch(`https://api.github.com/users/${githubUsername}/starred`)
    .then((response) => response.json())
    .then((projects) => {
        const filteredProjects = projects.filter((project) => project.owner.login === githubUsername && project.forks_count >= 0);
        _query('#github-section .container .github-projects').innerHTML = filteredProjects.reduce(function(html, project) {
            return html + (`
            <div class="project fade">
                    <div class="project-image">
                    <img 
                        src="https://raw.githubusercontent.com/${githubUsername}/web-assets/master/images/${project.id}.png"
                        onerror="this.onerror=null;this.src='https://raw.githubusercontent.com/${githubUsername}/web-assets/master/images/no-image.png'"
                        alt="Preview Image">
                    </div>
                    <div class="project-content">
                        <h3>${project.name.split('-').join(' ')}</h3>
                        <p>${project.description}</p>
                    </div>
                    <div class="button-wrapper">
                        <a href="${project.homepage}" class="secondary-btn website-btn" target="_blank">
                            <p>Website</p>
                            <img src="./assets/web-icon.svg" alt="Website Icon">
                        </a>
                        <a href="${project.html_url}" class="primary-btn github-btn" target="_blank">
                            <p>Github</p>
                            <img src="./assets/github-icon.svg" alt="GitHub Icon">
                        </a>
                    </div>
                </div>
            `);

        }, "");
    })
    .catch((error) => console.log(error));

//Fade In Animation on Scroll
let scrollElements = _queryAll('.fade');
let displayScrollElement = function(element){
    element.classList.add("fade-in");
};

let hideScrollElement = (element) => {
    element.classList.remove("fade-in");
  };

let elementInView = function(el, dividend = 1){
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <=
      (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
};

let elementOutofView = function(el){
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop > (window.innerHeight || document.documentElement.clientHeight)
    );
  };

let handleScrollAnimation = function(){
    scrollElements.forEach((el) => {
      if (elementInView(el, 1.25)) {
        displayScrollElement(el);
      }else if (elementOutofView(el)) {
        hideScrollElement(el)
      }
    });
};

//Navbar Effect
const navbar = _id('navbar');
const heroSection = _id('hero-section');
const aboutSection = _id('about-section');
const dribbbleSection = _id('dribbble-section');
let currActive = 0;
let prevActive = 0;
const navLinks = _class('nav-link');
    
let updateActive = function(){
    if(currActive != prevActive){
        navLinks[prevActive].classList.remove('active');
        navLinks[currActive].classList.add('active');
        prevActive = currActive;
    }
}

let checkScrollPos = function(scrollY){
    if(scrollY < (heroSection.offsetHeight)){
        currActive = 0;
    }else if(scrollY < (heroSection.offsetHeight + aboutSection.offsetHeight)){
        currActive = 1;
    }else if(scrollY < (heroSection.offsetHeight + aboutSection.offsetHeight + dribbbleSection.offsetHeight)){
        currActive = 2;
    }else{
        currActive = 3;
    }
    updateActive();
}

let onScroll = function(){
    const scrollPos = window.scrollY;
    if(scrollPos > (heroSection.offsetHeight - 100)){
        navbar.classList.add('navbar-dark');
    }else{
        navbar.classList.remove('navbar-dark');
    }
    checkScrollPos(scrollPos + _id('navbar').offsetHeight);
    handleScrollAnimation();
}

function throttle(fn, wait) {
    let time = Date.now();
    return function() {
      if ((time + wait - Date.now()) < 0) {
        fn();
        time = Date.now();
      }
    }
}

window.addEventListener('scroll', throttle(onScroll,50));
onScroll();

scrollToView = function(id){
    _id(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

//Typewriter Effect
let interval = 60;
const text = "Ervin Cahyadinata/Sungkono";
let i = 0;
let currentText = "";
const headingType = _id('heading-typewriter');

typeWriter = function(){
    if (i < text.length) {    
        if(text.charAt(i) == '/'){
            currentText += '<br>';
        }else{
            currentText += text.charAt(i);
        }
        headingType.innerHTML = currentText + '<span></span>';
        i++;
        setTimeout(typeWriter, interval);
    }
}

setTimeout(()=>{
    typeWriter();
    setTimeout(()=>{
        setInterval(()=>{
            _id('heading-typewriter').innerHTML = "" + '<span aria-hidden="true"></span>';
            currentText = "";
            i = 0;
            typeWriter();
        },5000);
    },interval * text.length);
},1000);

//Direction Aware Hover Effect
let shotList;
const directions  = ['top','right','bottom','left'];
let classNames = ['in', 'out'].map((p) => Object.values(directions).map((d) => p + '-' + d)).reduce((a, b) => a.concat(b));

function closestEdge(x,y,obj) {
    const w = obj.offsetWidth;
    const h = obj.offsetHeight;
    const topEdgeDist = distMetric(x,y,w/2,0);
    const bottomEdgeDist = distMetric(x,y,w/2,h);
    const leftEdgeDist = distMetric(x,y,0,h/2);
    const rightEdgeDist = distMetric(x,y,w,h/2);
    const min = Math.min(topEdgeDist,bottomEdgeDist,leftEdgeDist,rightEdgeDist);
    switch (min) {
        case leftEdgeDist:
            return 'left';
        case rightEdgeDist:
            return 'right';
        case topEdgeDist:
            return 'top';
        case bottomEdgeDist:
            return 'bottom';
    }
}

//Distance Formula
function distMetric(x,y,x2,y2) {
    const xDiff = x - x2;
    const yDiff = y - y2;
    return (xDiff * xDiff) + (yDiff * yDiff);
}

class Item {
    constructor(element) {
        this.element = element; 
        this.element.addEventListener('mouseenter', (ev) => this.update(ev, 'in'));
        this.element.addEventListener('mouseleave', (ev) => this.update(ev, 'out'));
    }
    
    update(ev, prefix) {
        this.element.classList.remove(...classNames);
        var x = ev.pageX - this.element.offsetLeft;
        var y = ev.pageY - this.element.offsetTop;
        this.element.classList.add(prefix + '-' + closestEdge(x,y,this.element));
    }
}

let initializeItem = function(){
    shotList = [].slice.call(_queryAll('#dribbble-section .container .dribbble-shots .shot'))
    shotList.forEach(shot => new Item(shot));
    scrollElements = _queryAll('.fade');
    handleScrollAnimation();
}

//Detect if dribbble shots has been loaded
const observer = new MutationObserver(() => {
    initializeItem();
});

observer.observe(_query('#dribbble-section .container .dribbble-shots'), {
    childList: true
})

//Toggle Hamburger Button
let toggleHamburgerActive = function(){
    _query('#navbar .container .nav-list').classList.toggle('active');
    _id('hamburger-btn').classList.toggle('open');
}

//Toggle Dribbble Shots View
let toggleShotsView = function(el){
    _query('#dribbble-section .container .dribbble-shots').classList.toggle('more');
    el.remove();
}
