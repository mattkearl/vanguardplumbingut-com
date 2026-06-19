(function () {
  'use strict';

  var ext = (function () {
    try {
      var c = document.createElement('canvas');
      return c.getContext && c.toDataURL('image/webp').indexOf('data:image/webp') === 0
        ? '.webp' : '.jpg';
    } catch (e) { return '.jpg'; }
  })();

  var slides = [
    {
      image: 'assets/images/derek-hero-01' + ext,
      headline: 'No Shortcuts.<br>No Runaround.',
      subtext: 'Licensed plumbing for Southern Utah homeowners and builders — done right the first time.'
    },
    {
      image: 'assets/images/derek-hero-02' + ext,
      headline: 'Your Call.<br>Answered.',
      subtext: 'Real plumbing help from a real person — not a dispatch center. Southern Utah\'s most trusted local pro.'
    },
    {
      image: 'assets/images/derek-hero-03' + ext,
      headline: 'Done Right<br>the First Time.',
      subtext: 'From emergency repairs to full remodels, Derek handles every job himself — on time, on budget.'
    },
    {
      image: 'assets/images/derek-hero-04' + ext,
      headline: 'We Show Up.<br>We Clean Up.',
      subtext: 'Southern Utah homeowners count on Vanguard for work that holds up long after we\'re gone.'
    },
    {
      image: 'assets/images/derek-hero-05' + ext,
      headline: 'No Dispatch.<br>Just Derek.',
      subtext: 'You call, he answers. Serving Washington, St. George, and all of Southern Utah with zero runaround.'
    },
    {
      image: 'assets/images/derek-hero-06' + ext,
      headline: 'Built on Honesty.<br>Backed by Skill.',
      subtext: 'Licensed and insured. Derek Wallace treats your home like his own — every single time.'
    },
    {
      image: 'assets/images/derek-hero-07' + ext,
      headline: 'Emergencies<br>Don\'t Wait.',
      subtext: 'Burst pipe? No hot water? Flooding? Call anytime — Derek answers 24 hours a day, 7 days a week.'
    },
    {
      image: 'assets/images/derek-hero-08' + ext,
      headline: 'Southern Utah\'s<br>Plumber.',
      subtext: 'From Washington to St. George to Hurricane — the call that actually gets the job done right.'
    },
    {
      image: 'assets/images/derek-hero-09' + ext,
      headline: 'Straight Talk.<br>Clean Work.',
      subtext: 'No upsells, no surprises. Honest plumbing from a licensed pro who stands behind every job.'
    },
    {
      image: 'assets/images/derek-hero-10' + ext,
      headline: 'The Right Fix.<br>Not the Easy One.',
      subtext: 'Derek Wallace built Vanguard on doing things properly — even when the shortcut looks tempting.'
    },
    {
      image: 'assets/images/derek-hero-11' + ext,
      headline: 'Trust the Craft.',
      subtext: 'Years of hands-on experience in Southern Utah homes. Every pipe, every fitting, every time.'
    }
  ];

  var INTERVAL     = 11000; // ms between slides
  var FADE_MS      = 1600;  // must match CSS transition duration
  var TEXT_FADE_MS = 600;

  var currentIndex = 0;
  var activeLayer  = 0;

  var layers = [
    document.getElementById('hero-bg-0'),
    document.getElementById('hero-bg-1')
  ];
  var h1   = document.querySelector('.hero h1');
  var lead = document.querySelector('.hero .lead');

  if (!layers[0] || !layers[1] || !h1 || !lead) return;

  // Preload all images
  slides.forEach(function (slide) {
    var img = new Image();
    img.src = slide.image;
  });

  // Set text transition
  h1.style.transition   = 'opacity ' + TEXT_FADE_MS + 'ms ease';
  lead.style.transition = 'opacity ' + TEXT_FADE_MS + 'ms ease';

  // Initialize first slide with the correct image format
  layers[0].style.backgroundImage = "url('assets/images/derek-hero-01" + ext + "')";
  layers[0].classList.add('hero-bg--active');

  function goToSlide(index) {
    var next     = slides[index];
    var incoming = 1 - activeLayer;
    var outgoing = activeLayer;

    // Load next image into inactive layer
    layers[incoming].style.backgroundImage = 'url(\'' + next.image + '\')';

    // Fade text out
    h1.style.opacity   = '0';
    lead.style.opacity = '0';

    // Cross-fade background layers
    requestAnimationFrame(function () {
      layers[incoming].classList.add('hero-bg--active');
      layers[outgoing].classList.remove('hero-bg--active');
    });

    // Swap text at the midpoint of the fade
    setTimeout(function () {
      h1.innerHTML      = next.headline;
      lead.textContent  = next.subtext;
      h1.style.opacity   = '1';
      lead.style.opacity = '1';
    }, TEXT_FADE_MS);

    activeLayer = incoming;
  }

  // Don't auto-play if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  setInterval(function () {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
  }, INTERVAL);
})();
