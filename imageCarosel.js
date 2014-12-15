document.addEventListener('DOMContentLoaded', function(){
	////console.log('init');
	$('.image-carosel').each(function(index){
		$(this).css({
			'height': '300px',
			'width': '500px',
			'margin': '0 auto',
			'margin-top': '100px',
			'position':'relative',
		});

		var carosel = new ImageCarosel($(this), 
			{
				animate: true,
			}
		);
	});
	
	
	
});
MAX_LEVEL_WIDTH = 100;
MIN_LEVEL_WIDTH = 45;

MAX_LEVEL_HEIGHT = 68;
MIN_LEVEL_HEIGHT = 10;

MAX_IMAGE_WIDTH = 45;
MIN_OPACITY = .03;

LEVEL_OFFSET = 0.05;

function ImageCarosel(element, settings){
	
	this.initImages = function(){
		var images = this.carosel[0].getElementsByTagName('IMG');
		
		for(var i=0; i<images.length; i++){
			images[i].box = function(){
				return this.parentNode;
			}
		}
		
		return images;
	}
	
	this.addAttributes = function(){
		for(var i=0; i<this.boxes.length; i++){
			var next, prev;
			
			prev = this.setPrev(i);
			next = this.setNext(i);
			
			this.boxes[i].setAttribute("index", i);
			this.boxes[i].setAttribute("next", next);
			this.boxes[i].setAttribute("prev", prev);
			this.boxes[i].style.zIndex = (this.boxes.length - i);
			
			this.boxes[i].id = "caroselBox" + i;
			
			this.boxes[i].next = function(){
				return 'caroselBox' + this.getAttribute('next');
			}
			
			this.boxes[i].prev = function(){
				return 'caroselBox' + this.getAttribute('prev');
			}
			
			this.boxes[i].img = function(){
				return this.getElementsByTagName('IMG')[0];
			}
			
			this.boxes[i].level = function(){
				return this.parentNode;
			}

		}
	}
	
	this.setPrev = function(i){
		if(this.images.length % 2 == 0)
			return (i % 2 === 0) ? ( ( (i + 1) === (this.images.length - 1) ) ? (i + 1) : (i + 2) ) :  ((i === 1) ? 0 : (i - 2));
		
		else{
			return (i % 2 === 0) ?  ( (i === (this.images.length - 1)) ? (i - 1) : (i + 2) ) : ( (i === 1) ? 0 : (i - 2) );
		}	
	}
	
	this.setNext = function(i){
		if(this.images.length % 2 == 0)
			return (i % 2 === 0) ? ( (i === 0)  ? (i + 1) : (i - 2) ) :  ( (i === (this.images.length - 1) ) ? (i - 1) : (i + 2) );
		
		else{
			return (i % 2 === 0) ?  ( (i === 0) ? (i + 1) : (i - 2) ) : ( (i === (this.images.length - 2) ) ? (i + 1) : (i + 2) );
		}	
	}
	//set the depths array owned by this ovject
	this.setDepths = function(){
		var imagesRemaining = this.imageCount;
		var depthRemaining = 1;
		var depths = [];
		
		depths[0] = [];
		depths[0][0] = this.images[0];
		imagesRemaining--;

		while(imagesRemaining != 0 && depthRemaining != this.depth){
			depths[depthRemaining] = [];
			while(depths[depthRemaining].length < 2 && imagesRemaining != 0){
				depths[depthRemaining][depths[depthRemaining].length] = this.images[imagesRemaining];
				imagesRemaining--;
			}	
				depthRemaining++;	
		}
		
		return depths;
	}
	
	this.addLevels = function(){
		var levels = []
		for(var i=0; i<this.depth; i++){
			var level = document.createElement("DIV");

			level.className = level.className + "level level"+i;
			
			for(element in this.depths[i]){
				level.appendChild(this.depths[i][element]);
			}
			levels[i] = level;
			this.carosel[0].appendChild(level);
		}
		
		return levels;
	}
	
	this.addBoxes = function(){
		var boxes = [];
		var box; 
		var index;
		var level;
		
		index = 0;	
		for(depth in this.depths){
			for(img in this.depths[depth]){
					box = document.createElement("DIV");
					boxes[index] = box;
					box.className = box.className + "caroselBox";
					//box.id = "caroselBox" + index;
					
					level = this.depths[depth][img].parentNode;
					level.appendChild(box);

					box.appendChild(this.depths[depth][img]);
					index++;	
			}
		}
			
					
		
		
		return boxes;
	}
	
	this.setFrontLevelsSize = function(){
		var mid = Math.ceil(this.levels.length/2) + 1; //mid level
		var levelChange = (MAX_LEVEL_WIDTH - MIN_LEVEL_WIDTH)/(mid - 1); //this is the difference of the width b/w two levels
		var topChange = this.carosel[0].clientHeight 
		for(var i=0; i<mid; i++){
			var width = MIN_LEVEL_WIDTH + (levelChange * i);		
			var height = 100 - ((100*i)/10);
			var marginTop = 10 - ((100 - height)  /5);
			var margin = (100-width)/2;
			
			this.levels[i].style.width = width + '%';
			this.levels[i].style.marginLeft = margin+ '%';
			this.levels[i].style.marginRight = margin+ '%';
		}
	}
	
	this.setBackLevelsSize = function(){
		var mid = Math.ceil(this.levels.length/2) + 1;
		var levelChange = parseFloat((MAX_LEVEL_WIDTH - MIN_LEVEL_WIDTH)/(this.levels.length - mid)); //this is the difference of the width b/w two levels
		
		//width of the back levels is influenced by the level the precedes it.
		//simply subtract the levelChange, SUBTRACT IT, to the preceding level's width
		for(var i=mid; i<this.levels.length; i++){
			var width = parseFloat(this.levels[i-1].style.width) - levelChange;
			var height = 100 - ((this.levels.length - i) * 10);
			var marginTop = 10 - ((100 - height)  /5);
			var margin = (100-width)/2;
			
			this.levels[i].style.width = width + '%';
			
			this.levels[i].style.marginLeft = margin+ '%';
			this.levels[i].style.marginRight = margin+ '%';
		}
	}
	
	this.setCommonAttributes = function(){
		//common attributes
		var heightChange = (MAX_LEVEL_HEIGHT - MIN_LEVEL_HEIGHT) / (this.levels.length - 1);	
		var topChange;
		
		////console.log("topChange: " + topChange);
		for(var i=0; i<this.levels.length; i++){
			var zindex = this.levels.length - i;
			var opacityChange = (1 - MIN_OPACITY) / this.levels.length;
			var height = MAX_LEVEL_HEIGHT - (heightChange * i);
			
			this.levels[i].boxes = function(){
				return this.getElementsByClassName('caroselBox');
			}
			
			this.levels[i].style.zIndex = zindex;
			this.levels[i].style.position = 'absolute';
			
			for(var j=0; j<this.levels[i].boxes().length; j++){
				this.levels[i].boxes()[j].style.opacity = 1 - (opacityChange * i);
			}
			
			this.levels[i].style.textAlign = 'center';
			this.levels[i].style.height = height + '%';
			this.levels[i].style.pointerEvents = 'none';
			
			//top has to go down ehre because it relies on evaulating a level's pixel height not percentage
			var top = this.carosel[0].clientHeight - this.levels[i].clientHeight;
			var carosel = this;
			if(i === 0){
				//if this is the first level then we can't access i-1 so handle this different
				//do nothing, assuming this level touches the bottom of the carosel
				//try the event thing here
				$(this.levels[i]).bind('DOMSubtreeModified', function(e){
					
					$(carosel).find('.frontImage').each(function(){$(this).removeClass('frontImage');});
					$($(this).find('img')[0]).addClass('frontImage');
					carosel.frontImage = $(this).find('.frontImage')[0];
				});
				
			}
			else{
				//otherwise, the deeper levels get the closer to the top of the carosel they will approach, so access the calculated top value of the level
				//that is directly on top of this one
				//this levels top value is the top value of the one on top of it - topChange				
				topChange = LEVEL_OFFSET * (parseFloat(this.levels[i].style.height));// / this.levels.length);
				top = (parseFloat(this.levels[i-1].style.top) - topChange);
				
			}
			this.levels[i].style.top= top + 'px';
		}
		
	}
	
	this.updateFront = function(){
		this.frontImage = this.levels[0].getElementsByTagName('IMG')[0];
	}
	this.setLevelSize = function(){
		this.setCommonAttributes();
		
		this.setFrontLevelsSize();
		
		this.setBackLevelsSize();
	}
	
	this.setImageSize = function(){
		for(var i=0; i<this.levels.length; i++){
			var levelWidth = this.levels[i].clientWidth;
			var numImages = (this.levels[i].getElementsByTagName('IMG').length);
			var margins = ( ( (100 - (MAX_IMAGE_WIDTH * numImages) ) / numImages) / 2);
			
			for(var j=0; j<this.levels[i].getElementsByClassName('caroselBox').length; j++){
				var box = this.levels[i].getElementsByClassName('caroselBox')[j];
				box.style.position = "relative";
				box.style.pointerEvents = 'all';
				//the following only applies to levels with more than 1 images
				if(this.levels[i].getElementsByClassName('caroselBox').length > 1){
					box.style.position = "absolute";
					
					//width is defined by global setting for max width
					box.style.maxWidth = MAX_IMAGE_WIDTH + "%";

					//based on that width^^^ we need to specify some margins	
					box.style.marginLeft = margins + "%";
					box.style.marginRight = margins + "%";
					
					//pull images left or right if they are the left or right image
					if(j % 2 == 0){
						box.style.left = 0;
					}
					else{
						box.style.right = 0;
					}
				}
			}	
		}
	}
	
	this.setCaroselSize = function(){
		var firstHeight;
		var lastHeight;
		
		console.log(this.images[0]);
		
		firstHeight = this.images[0].scrollHeight;
		lastHeight = this.images[this.imageCount - 1].scrollHeight;
		
		console.log("firstHeight: " + firstHeight);
		console.log("lastHeight: " + lastHeight);
	}
	/*****
	*
	*
	*
	*ANIMATION
	*
	*
	*
	*
	*
	*
	***********************************************************************/

	this.addAnimationStyle = function(){
		var css = '.caroselBox { ' +
			'transition: all 1s ease;'+
			'-webkit-transition: all 1s ease;' +
			'-o-transition: all 1s ease;' +
			
		'}' +
		'.caroselBox img{ ' +
			'max-height: 100%' +
			
		'}' +
		'.caroselBox:hover { ' +
			'margin-top: -25px !important;' +
			'opacity: 1 !important;' +
			'z-index: 1000 !important;' +
			'transition-duration: 250ms !important;' + 
			'border: 2px solid yellow !important;' +
		'}' + 
		'.oddHover:hover { ' +
			'left: -25px !important;' +
		'}' +
		'.evenHover:hover { ' +
			'right: -25px !important;' +
		'}' + 
		'.levelHover { ' +
			'opacity: 1 !important;' + 
		'}';
		head = document.head || document.getElementsByTagName('head')[0],
		style = document.createElement('style');
		
		style.type = 'text/css';
		if (style.styleSheet){
  			style.styleSheet.cssText = css;
		} 
		else{
  			style.appendChild(document.createTextNode(css));
		}
		
		head.appendChild(style);
	}
	this.addListeners = function(){
		for(var i=0; i<this.images.length; i++){
			var carosel = this;

			this.images[i].addEventListener('click', function(event){
				carosel.spinCarosel(event, this);
			});
			
			if(this.images[i].box().getAttribute('index') != 0){
				this.images[i].box().addEventListener('mouseover', function(event){
					if(this.getAttribute('index') % 2 === 0){
						$(this).addClass('evenHover');
					}
					else {
						$(this).addClass('oddHover');
					}
					
				});
				this.images[i].box().addEventListener('mouseout', function(event){
					if(this.getAttribute('index') % 2 === 0){
						$(this).removeClass('evenHover');
					}
					else{
						$(this).removeClass('oddHover');
					}
					
					
				});	
			}
			
			
		}
	}
	this.addAnimatationControl = function(){
		this.addListeners();	
		
		this.addAnimationStyle();	
	}
	
	this.spinCarosel = function(clickEvent, img){
		
		var target = clickEvent.target.box();
		target = document.getElementById(target.id);
		var frontImage = this.frontImage;
		
		if(frontImage !== target){
			//check to se if left or right spin
			//left spin occurs on index == odd if even then right spin
			if(target.getAttribute('index') % 2 == 0){
				this.spinLeft(target);
			}
			else{
				this.spinRight(target);
			}
		}
		
	}
	
	this.spinRight = function(target){
	
		var movingImage, thisBox, storedImage, storedBox;
		var stop = target.img();
		
		while(stop != this.frontImage){
			activeId = target.prev();
			
			thisBox = document.getElementById(activeId);
			movingImage = thisBox.img();
			firstId = activeId;
			for(var i=0; i<this.boxes.length; i++){
				if(!(document.getElementById(thisBox.prev()).img())){
					$(document.getElementById(thisBox.prev())).append(movingImage);
				}
				else{
					movingImage = $(document.getElementById(thisBox.prev()).img()).replaceWith(movingImage)[0];
				}
				thisBox = document.getElementById(thisBox.prev());
			}
		}
	}
	
	this.spinLeft = function(target){
		var movingImage, thisBox, storedImage, storedBox;
		var stop = target.img();
		while(stop != this.frontImage){
			activeId = target.next();
			
			thisBox = document.getElementById(activeId);
			movingImage = thisBox.img();
			firstId = activeId;
			for(var i=0; i<this.boxes.length; i++){
				if(!(document.getElementById(thisBox.next()).img())){
					$(document.getElementById(thisBox.next())).append(movingImage);
				}
				else{
					movingImage = $(document.getElementById(thisBox.next()).img()).replaceWith(movingImage)[0];
				}
				thisBox = document.getElementById(thisBox.next());
			}	
		}
	}
	
	this.swap = function(settings){
		
		
		var replaceBox, withBox, replaceClone;
		
		replaceBox = settings.replace.box();
		withBox = settings.with.box();
		
		replaceClone = $(settings.replace).replaceWith(settings.with);
		
		$(withBox).append(replaceClone);
		
		//this.swapCss({
		//	a: $(settings.with),
		//	b: $(settings.replace),
		//});
			
		return replaceClone[0];
	}
	this.swapCss = function(settings){
		var cssA, cssB;
	
		cssA = this.css(settings.a);
		cssB = this.css(settings.b);
		
		$(settings.a).removeAttr('style');
		$(settings.b).removeAttr('style');
		
		$(settings.a).css(cssB);
		$(settings.b).css(cssA);
		
		if(cssA.left){
			$(settings.b).css({'left': parseFloat(cssA.left) + 'px'});
		}
		else if(cssA.right){
			$(settings.b).css({'right': parseFloat(cssA.right) + 'px'});
		}
		
		if(cssB.left){
			$(settings.a).css({'left': parseFloat(cssB.left) + 'px'});
		}
		else if(cssB.right){
			$(settings.a).css({'right': parseFloat(cssB.right) + 'px'});
		}
		
	}
	
	this.css = function(a) {
   		var sheets = document.styleSheets, o = {};
    		for (var i in sheets) {
        		var rules = sheets[i].rules || sheets[i].cssRules;
        			for (var r in rules) {
            				if (a.is(rules[r].selectorText)) {
                				o = $.extend(o, this.css2json(rules[r].style), this.css2json(a.attr('style')));
            				}
        			}
    		}
    		return o;
	}

	this.css2json = function(css) {
		var s = {};
    		if (!css) return s;
    		if (css instanceof CSSStyleDeclaration) {
        	for (var i in css) {
            		if ((css[i]).toLowerCase) {
               			s[(css[i]).toLowerCase()] = (css[css[i]]);
            		}
        	}
    		} else if (typeof css == "string") {
        		css = css.split("; ");
        		for (var i in css) {
            			var l = css[i].split(": ");
            			s[l[0].toLowerCase()] = (l[1]);
        		}
    		}
    		return s;
	}
	/*****
	*
	*
	*END
	*ANIMATION
	*
	*
	*
	*
	*
	************************************************************************/
	//the carosel element
	this.carosel = element;
	
	this.caroselHeight = this.carosel[0].offsetHeight;
	//this carosel's images
	this.images =  this.initImages();
	
	//the number of images in the carosel
	this.imageCount =  this.images.length;
	
	//the depth of the carosel
	this.depth = Math.floor((this.imageCount/2)+1);
	
	//the depth array corresponding to the different elements
	this.depths = this.setDepths();
	
	//the different levels made up of wraps
	this.levels = this.addLevels();
	
	//the different boxes inside levels and containing imgs
	this.boxes = this.addBoxes();
	
	this.frontImage = this.levels[0].getElementsByTagName('IMG')[0];
	this.frontImage.className = this.frontImage.className + " frontImage";


	this.addAttributes();
	this.setLevelSize();
	this.setImageSize();
	//at this point the carosel's dimensions are init
	//now do the animation control
	if(settings.animate){
		if(typeof jQuery != 'undefined'){
			this.addAnimatationControl();
		}
		else{
			//console.log('you have to have jquery you dumb bitch');
		}
	}

}
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}