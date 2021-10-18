'use strict';

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabs = document.querySelectorAll('.operations__tab');
const tabContainer = document.querySelector('.operations__tab-container');
const tabsContent = document.querySelectorAll('.operations__content');

const nav = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

const imgTarget = document.querySelectorAll('img[data-src]');

///////////////////////////////////////
// Modal window

const openModal = function (e) {
  e.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));

btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

//////////////////////////////////////////////////////////////////////////////
//Scrolling button

btnScrollTo.addEventListener('click', function (e) {
  //get the edge
  const s1coords = section1.getBoundingClientRect();
  // console.log(s1coords); //DOMrectagle

  //e.target is the one was clicked
  // console.log(e.target.getBoundingClientRect());

  // console.log('current scorll', window.pageXOffset, window.pageYOffset);

  //get the viewport height and width
  // console.log(
  //   'height/ width viewport',
  //   document.documentElement.clientHeight,
  //   document.documentElement.clientWidth
  // );
  section1.scrollIntoView({ behavior: 'smooth' });
});

//////////////////////////////////////////////////////////////////////////////
//page Navigation

//not effective:
// document.querySelectorAll('.nav__link').forEach(function (el) {
//   el.addEventListener('click', function (e) {
//     //prevent from the default behaviour from html(#section--123)
//     e.preventDefault();

//     const id = this.getAttribute('href');
//     document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
//   });
// });

//event delegation:

//1.add eventlistener to common parent element
//2. delermine what element originated the event

//.nav__links is the common parent elements for nav_link(3)
document.querySelector('.nav__links').addEventListener('click', function (e) {
  //
  //e.target can get the event actually happend in which element
  //if click on 'features': e.target = section--1
  //if click on 'Operations': e.target = section--2
  //if click on 'Testimonials': e.target = section--3

  //matching strategy
  //if the target element contains the class that we need:
  //because: the common parent element can contains a lot of elements
  //we dont want to get the target that we dont need to triggle the event:)
  //ignore the clicks that did not happen right on nav__link

  if (e.target.classList.contains('nav__link')) {
    e.preventDefault();
    const id = e.target.getAttribute('href');
    document.querySelector(id).scrollIntoView({ behavior: 'smooth' });
  }
});

///////////////////////////////////////////////////////////////////////////////////////
//tabbed Componet

tabContainer.addEventListener('click', function (e) {
  //this will find the closest parent with the class name: (.operations__tab),
  //if click on the button, the closest parent is themselves
  //if click on span tag, the closest parent is .operations__tab
  const clicked = e.target.closest('.operations__tab');
  // console.log(clicked);

  //guard clause
  //when nothing clicked, nothing gonna excute
  if (!clicked) return;

  tabs.forEach(t => t.classList.remove('operations__tab--active'));
  tabsContent.forEach(c => c.classList.remove('operations__content--active'));

  //active tab
  clicked.classList.add('operations__tab--active');

  //active content area
  document
    .querySelector(`.operations__content--${clicked.dataset.tab}`)
    .classList.add('operations__content--active');
});

//Menu fade animations
const handleHover = function (e) {
  //delete opacity: cus opacity == this
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = this;
    });
    logo.style.opacity = this;
  }
};

//enhanced:
//using bind cus bind will return a new function
//and 'this' variable will be set to the number that passed inside the bind()
//so in the handleHover, opacity can be simple deleted and set as this
//passing 'argument' into handler
nav.addEventListener('mouseover', handleHover.bind(0.5));
nav.addEventListener('mouseout', handleHover.bind(1));

/*
///////////For better understanding////////////

const handleHover = function (e, opacity) {
  //here has no other child element that could cause error
  //so no need to use the closeset
  if (e.target.classList.contains('nav__link')) {
    const link = e.target;
    const siblings = link.closest('.nav').querySelectorAll('.nav__link');

    const logo = link.closest('.nav').querySelector('img');

    siblings.forEach(el => {
      if (el != link) el.style.opacity = opacity;
    });
    logo.style.opacity = opacity;
  }
};
important!
nav.addEventListener('mouseover', handleHover(e,0.5)) will NOT work
because javascript expecting a function, if we add(e,0.5) argument inside
this function is actually a value.

right to do:
1. pass a callback function with e
2. pass the event to the handlhover functions inside the eventListener
nav.addEventListener('mouseover', function (e) {
  handleHover(e, 0.5);
});
*/
//////////////////////////////////////////////////////////

//sticky navigation: Intersection Observer API:

//when target(section1) is intersecting the viewport(root:null) at 10%(threshold:0.1)
//function observerCallback will get called no matter if scrolling up or down
// const obeserverCallback = function (entries, observer) {
//   entries.forEach(entry => console.log(entry));
// };

// const obeserverOptions = {
//   root: null,//nul -> viewport
//   threshold: [0,0.2]],//at the percentage that we want to have visible in our root
// };
// const observer = new IntersectionObserver(obeserverCallback, obeserverOptions);
// observer.observe(section1);

const navHeight = nav.getBoundingClientRect().height;

const stickyNav = function (entries) {
  const [entry] = entries;
  // console.log(entry);
  if (!entry.isIntersecting) nav.classList.add('sticky');
  else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null, //null->viewport
  threshold: 0, // means: when 0 percent of the header are visiable
  rootMargin: `-${navHeight}px`,
});

headerObserver.observe(header);

//sticky navigation: older way

// const initCoords = section1.getBoundingClientRect();
// window.addEventListener('scroll', function () {
//   console.log(window.scrollY);
//   if (window.scrollY > initCoords.top) {
//     nav.classList.add('sticky');
//   } else nav.classList.remove('sticky');
// });

///Reveal Sections

const revealSection = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;

  entry.target.classList.remove('section--hidden');
  observer.unobserve(entry.target);
};
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSections.forEach(function (section) {
  sectionObserver.observe(section);
  // section.classList.add('section--hidden');
});

//Lazy loading images
const loadImg = function (entries, observer) {
  const [entry] = entries;

  //check if the img is intersecting
  //garud clause
  if (!entry.isIntersecting) return;

  entry.target.src = entry.target.dataset.src;

  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  });
};

const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: '10px',
});

imgTarget.forEach(img => imgObserver.observe(img));

// Slider
const sliders = function () {
  const slides = document.querySelectorAll('.slide');

  const btnLeft = document.querySelector('.slider__btn--left');
  const btnRight = document.querySelector('.slider__btn--right');

  const dotContainer = document.querySelector('.dots');

  let currentSlide = 0;

  const maxSlide = slides.length;
  // slider.style.transform = 'scale(0.5) ';
  // slider.style.overflow = 'visible';
  const creatDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        'beforeend',
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activeDot = function (slide) {
    document
      .querySelectorAll('.dots__dot')
      .forEach(dot => dot.classList.remove('dots__dot--active'));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add('dots__dot--active');
  };

  //0 , 100,200,300 %
  const goToSlide = function (slide) {
    slides.forEach(
      //important!
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  //go to next slide
  const nextSlide = function () {
    if (currentSlide === maxSlide - 1) {
      currentSlide = 0;
    } else {
      currentSlide++;
    }
    goToSlide(currentSlide);
    activeDot(currentSlide);
  };

  //go to previous slide
  const preSlide = function () {
    if (currentSlide === 0) {
      currentSlide = maxSlide - 1;
    } else {
      currentSlide--;
    }
    goToSlide(currentSlide);
    activeDot(currentSlide);
  };

  const init = function () {
    goToSlide(0); //same as below
    // slides.forEach((s, i) => (s.style.transform = `translateX(${100 * i}%)`));
    creatDots();
    activeDot(0);
  };
  init();
  //Event Handler
  //button right and left
  btnRight.addEventListener('click', nextSlide);
  btnLeft.addEventListener('click', preSlide);

  //keyboard
  document.addEventListener('keydown', function (e) {
    // if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') preSlide();
    e.key === 'ArrowRight' && nextSlide();
  });

  //dots

  dotContainer.addEventListener('click', function (e) {
    if (e.target.classList.contains('dots__dot')) {
      //below 2 are the same
      const { slide } = e.target.dataset;
      // const slide = e.target.dataset.slide;

      goToSlide(slide);
      activeDot(slide);
    }
  });
};
sliders();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////
//Lecture
/*
console.log(document.documentElement);
console.log(document.head);
console.log(document.body);

//node list wont be changed if DOM is changed
//becasue it will stay same as the time it be created
const theHeader = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');
console.log(allSections);

//below no need selector('.'), just the id or name or tag themselves
document.getElementById('section--1');
document.getElementsByClassName('btn');

//below return the html collection(live html collections)
//if DOM change, this will change
//below no need selector too
const allbutton = document.getElementsByTagName('button');
console.log(allbutton);

/////////////creating and inserting elements
//.insertAdjancentHTML
*/

/////////////////////////////////////////////////////////////////////////

/*
const theHeader = document.querySelector('.header');
//document.createElement('') will create a DOM element and store into message
const message = document.createElement('div');
message.classList.add('cookie-message');

//insert text
// message.textContent='we use cookied for improved functionality and analytics.'

//insert html
message.innerHTML =
  'we use cookied for improved functionality and analytics.<button class="btn btn--close-cookie">Got it!</button>';

//both below code will only create once
//cus message is now a life element living in the DOM, so it cant be at the multiple places at the same time:

//add the element to theHeader as first child(insert)
// theHeader.prepend(message); //it will appear at the top of the header

//add elements to theHeader as last child(since prepend inserted, this append just move it )
theHeader.append(message); //it will appear at the end of the header

//below is to copy the element, so we could have 2 message in both top and bottom
// theHeader.append(message.cloneNode(true));

//insert before theHeader as sibling
// theHeader.before(message);
//insert after theHeader as sibling
// theHeader.after(message)

//DELETE
document
  .querySelector('.btn--close-cookie')
  .addEventListener('click', function () {
    // message.remove(); new

    message.parentElement.removeChild(message); //this is the old way
  });

//styles
//this is inline styles
message.style.backgroundColor = '#37383d';
message.style.width = '120%';

//message.style will only get from the inline style
//so console.log(message.style.height); wont work

//will work, cus we defined it in inline style in line 99
console.log(message.style.backgroundColor);

//below get all the styles that exists in the page
//console.log(getComputedStyle(message));
//even did not do in css file
console.log(getComputedStyle(message).height);
console.log(getComputedStyle(message).color);

//increse the height
message.style.height =
  Number.parseFloat(getComputedStyle(message).height, 10) + 30 + 'px';

//change css styles
document.documentElement.style.setProperty('--color-primary', 'blue');

//attribuites(src, class, alt etc..)
//javascript will read the standard attribues will be worked as below
const logo = document.querySelector('.nav__logo');
console.log(logo.alt);
console.log(logo.src);
console.log(logo.className);

//change the attribuites
logo.alt = 'Beautiful minimalist logo';
logo.setAttribute('company', 'Bankist');

//none- standard(I add by myself)
console.log(logo.designer);
console.log(logo.getAttribute('designer'));

//
console.log(logo.src); //absolut
console.log(logo.getAttribute('src')); //reletive

const link = document.querySelector('.nav__link--btn');
console.log(link.href); //absolut
console.log(link.getAttribute('href')); //reletive

//Data attributes
//store inside the dataset
console.log(logo.dataset.versionNumber);

//classes
logo.classList.add('c', 'j');
logo.classList.remove('c');
logo.classList.toggle('c');
logo.classList.contains('c');

//Dont use, it will override all classes
logo.className ='jonas'
*/

/*
const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

btnScrollTo.addEventListener('click', function (e) {
  //get the edge
  const s1coords = section1.getBoundingClientRect();
  console.log(s1coords); //DOMrectagle

  //e.target is the one was clicked
  console.log(e.target.getBoundingClientRect());

  console.log('current scorll', window.pageXOffset, window.pageYOffset);

  //get the viewport height and width
  console.log(
    'height/ width viewport',
    document.documentElement.clientHeight,
    document.documentElement.clientWidth
  );

  //scrolling:
  //////OLD WAY
  //arguments are the left/top position
  //get the absolute position of where we want to scroll
  // window.scrollTo(
  //   s1coords.left + window.pageXOffset,
  //   s1coords.top + window.pageYOffset
  // );

  // window.scrollTo({
  //   left: s1coords.left + window.pageXOffset,
  //   top: s1coords.top + window.pageYOffset,
  //   behavior: 'smooth',
  // });

  //NEW WAY
  //:take the element that way want to scroll to:
  //(in this case is section1(the section that we want to scroll to))
  //this works for morden browser
  section1.scrollIntoView({ behavior: 'smooth' });
});
*/

/*
////MOUSEENTER
//very similar to mousehover in css
//mouseenter do not bubble
//whenever the mouse hover the selected element, do the function
//nomally only use addEventListener, because:
//1.add multiple event listeners to the same event
//2.can remove( Example below)
const h1 = document.querySelector('h1');

const alertH1 = function (e) {
  alert('addEventListener: You are reading the heading');

  //remove(the remove can be anywhere, no need to be inside here)
  // h1.removeEventListener('mouseenter', alertH1);
};

//remove example2:
setTimeout(() => h1.removeEventListener('mouseenter', alertH1), 5000);

//to remove eventListener, need a named function
h1.addEventListener('mouseenter', alertH1);

// h1.onmouseenter = function (e) {
//   alert('onmouseenter: You are reading the heading');
// };
*/

/*
//Bubbling

//and then
//rgb(255,255,255)
const randomInt = (min, max) =>
  Math.floor(Math.random() * (max - min + 1) + min);
const randomColor = () =>
  `rgb(${randomInt(0, 255)},${randomInt(0, 255)},${randomInt(0, 255)})`;

//event actually happend in the root of the document and then travel down to the target element(.nav__link)
//from .nav__link, it bubbles up:
//means if the event also had happend in all of the parent elements
//so if it happend on .nav__link 's parents(.nav__links),
//when event happend on .nav__link, the parents element .nav__links will also be triggle the event, as same as .nav(the parents of .nav__links)

//target event:
document.querySelector('.nav__link').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  //e.target is where the event actually happend
  //e.currentTarget is the event actually attached to

  //e.target are all the same :nav__link
  //  all the currentTarget == 'this'(in each eventListener)
  console.log('link', e.target, e.currentTarget); //e.currentTarget= nav__link

  //stop propagation
  // e.stopPropagation(); // so the parents element wont happen the event
});

document.querySelector('.nav__links').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();

  console.log('links', e.target, e.currentTarget); //e.currentTarget= nav__links
});

document.querySelector('.nav').addEventListener('click', function (e) {
  this.style.backgroundColor = randomColor();
  console.log('nav', e.target, e.currentTarget); //e.currentTarget= nav
});
//listen in capture phrase, add the third parameter to true/false
//true: eventlistener will:
//no longer listen to bubbling events but listen to capturing events

// document.querySelector('.nav').addEventListener(
//   'click',
//   function (e) {
//     this.style.backgroundColor = randomColor();
//     console.log('nav', e.target, e.currentTarget); //e.currentTarget= nav
//   },
//   true
// );
*/

///////Event delegation

/*
/////////////////DOM Traversing
const h1 = document.querySelector('h1');

//Going downwards: select child elements

//will go down to get children as deep as necessary into the DOM tree:
console.log(h1.querySelectorAll('.highlight'));

//for direct child element:
console.log(h1.childNodes); //every sigle notes,
console.log(h1.children); //live HTML collection

//first/last children
h1.firstElementChild.style.color = 'white'; //only the first child get set to white
h1.lastElementChild.style.color = 'orangered';

//going upwards: select parents element

//for direct parent
console.log(h1.parentNode);
console.log(h1.parentElement);

//closest will select the closest header to h1 element
//recive a query string as input(same as querySelector),
//but closest find the most close parents no matter how up inside the DOM tree
//and querySelector finds the children(no matter how deep inside the DOM tree)
h1.closest('.header').style.background = 'var(--gradient-secondary)';
h1.closest('h1').style.background = 'var(--gradient-primary)';

//going sideways: sibliings
//mostly gonna use with elements:
console.log(h1.previousElementSibling);
console.log(h1.nextElementSibling);

//nodelist (not very common)
console.log(h1.nextSibling);
console.log(h1.previousSibling);

//find all sibilings
//find the parents, and then find all children for the parent element:
console.log(h1.parentElement.children);

//example:
[...h1.parentElement.children].forEach(function (el) {
  if (el !== h1) {
    el.style.transform = 'scale(0.5)';
  }
});

*/

///Lifecycle
document.addEventListener('DOMContentLoaded', function (e) {
  console.log('HTML parsed and DOM tree built!', e);
});

window.addEventListener('load', function (e) {
  console.log('page fully loaded', e);
});

// window.addEventListener('beforeunload', function (e) {
//   console.log(e);
//   e.returnValue = '';
// });
