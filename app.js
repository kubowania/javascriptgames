document.addEventListener('DOMContentLoaded', () => {

  var buttons = document.querySelector('.paper-button')

  for (i = buttons.length - 1; i >= 0; i--) {
    var btn = buttons[i];

    btn.addEventListener('click', function(e) {
      var bound = this.getBoundingClientRect();
      var x = e.clientX - bound.left;
      var y = e.clientY - bound.top;
      var ripple = this.querySelector('.ripple');

      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      animate({
        timing: easeOut,
        duration: 500,
        draw: function(progress) {
          ripple.style.transform = `scale(${progress})`;
          ripple.style.opacity = 1 - progress;
        }
      });
    });
  }

  function animate({ timing, draw, duration }) {
    let start = performance.now();

    requestAnimationFrame(function animation(time) {
      let timeFraction = (time - start) / duration;
      if (timeFraction > 1) timeFraction = 1;

      let progress = timing(timeFraction);
      draw(progress);

      if (timeFraction < 1) {
        requestAnimationFrame(animation);
      }
    });
  }

  function bounce(timeFraction) {
    for (let a = 0, b = 1, result; 1; a += b, b /= 2) {
      if (timeFraction >= (7 - 4 * a) / 11) {
        return (
          -Math.pow((11 - 6 * a - 11 * timeFraction) / 4, 2) +
                  Math.pow(b, 2)
        );
      }
    }
  }

  function quad(timeFraction) {
    return Math.pow(timeFraction, 2);
  }

  function easeOut(timeFraction) {
    return 1 - Math.pow(1 - timeFraction, 1.675);
  }

  function makeEaseOut(timing) {
    return function(timeFraction) {
      return 1 - timing(1 - timeFraction);
    };
  }

  function makeEaseInOut(timing) {
    return function(timeFraction) {
      if (timeFraction < 0.5) return timing(2 * timeFraction) / 2;
      else return (2 - timing(2 * (1 - timeFraction))) / 2;
    };
  }



  var TxtType = function(el, toRotate, period) {
    this.toRotate = toRotate;
    this.el = el;
    this.loopNum = 0;
    this.period = parseInt(period, 10) || 2000;
    this.txt = '';
    this.tick();
    this.isDeleting = false;
  };

  TxtType.prototype.tick = function() {
    var i = this.loopNum % this.toRotate.length;
    var fullTxt = this.toRotate[i];

    if (this.isDeleting) {
      this.txt = fullTxt.substring(0, this.txt.length - 1);
    } else {
      this.txt = fullTxt.substring(0, this.txt.length + 1);
    }

    this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

    var that = this;
    var delta = 200 - Math.random() * 100;

    if (this.isDeleting) { delta /= 2; }

    if (!this.isDeleting && this.txt === fullTxt) {
      delta = this.period;
      this.isDeleting = true;
    } else if (this.isDeleting && this.txt === '') {
      this.isDeleting = false;
      this.loopNum++;
      delta = 500;
    }

    setTimeout(function() {
      that.tick();
    }, delta);
  };

  window.onload = function() {
    var elements = document.getElementsByClassName('typewrite');
    for (var i=0; i<elements.length; i++) {
      var toRotate = elements[i].getAttribute('data-type');
      var period = elements[i].getAttribute('data-period');
      if (toRotate) {
        new TxtType(elements[i], JSON.parse(toRotate), period);
      }
    }
    // INJECT CSS
    var css = document.createElement('style');
    css.type = 'text/css';
    css.innerHTML = '.typewrite > .wrap { border-right: 0.08em solid rgb(72, 69, 212)}';
    document.body.appendChild(css)
  };


//build a show more or show less function
  var expandsMore = document.querySelectorAll('[expand-more]');

  	[].forEach.call(expandsMore, function(expandmore) {
  		expandmore.addEventListener("click", function() {

  		    var showContent = document.getElementById(this.dataset.target);

  		    if (showContent.classList.contains("expand-active")) {
  		    	this.innerHTML=this.dataset.showtext;
  		    } else {
  		    	this.innerHTML=this.dataset.hidetext;
  		    }

  		    showContent.classList.toggle('expand-active');
  		});
  	});


})
