function Dice(el) {
    
    if (!(this instanceof Dice)) {
        return new Dice(el);
    }
    
    var spiner = null,
        timer = null,
        SPEED = 30,
        dice = this,
        eye = 0,
        eyes = ['ace', 'two', 'three', 'four', 'five', 'six'],
        degree = 0,
        isHold = false,
        spin = function (deg) {
            
            if (isNaN(eye)) {
                eye = Math.floor(Math.random() * 6);
            }
            
            el.removeClass(eyes.join(' '));
            el.addClass(eyes[eye % 6]);
            el.css('transform', 'rotate(' + (degree = isNaN(deg) ? (degree + 60) % 360 : deg) + 'deg)');
        };
    
    dice.rolling = function (time) {
        
        if (isHold) {
            return;
        }
        
        dice.stop();
        
        spiner = setInterval(spin, SPEED);
        
        if (time > 0) {
            timer = setTimeout(dice.stop, time);
        }
    };
    
    dice.stop = function (rolledEye) {
        spiner && clearInterval(spiner);
        timer && clearTimeout(timer);
        eye = rolledEye;
        spin(0);
    };
    
    dice.toggle = function () {
        isHold = !el.hasClass('hold');
        
        if(isHold) {
           el.addClass('hold');
        } else {
           el.removeClass('hold'); 
        };
    };
    
    dice.isHold = function () {
        return isHold;
    };
    
    dice.get = function () {
        return {
            status : isHold ? 'hold' : 'unhold',
            eye : eye
        }
    };
}