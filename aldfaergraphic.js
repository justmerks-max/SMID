////////////////////////////////////////////////////////////////
//
//  a l d f a e r g r a p h i c . j s
//
//  Ondersteunende functies,
//  bestemd voor gebruik door de door aldfaer gegenereerde
//  grafische overzichten.
//
//  copyright 2007 Aldfaerteam
//
window.onunload = dummy;
function dummy(){}
var mouseCor ={};	// Previous mouse coordinates
var DragObj;		// Object dat moet worden verschoven
var zIndex = 30;	// Initiele z coordinate

//
// Maak een blok zichtbaar
//
function disp( id, e )
{
	e = e || event;
	if (!id || !e) {
		return false;
	}
	var node = getObj( id );
	if ( node && node.style )
	{
		if (node.style.visibility != 'visible' /*&& e.ctrlKey*/ )
		{
			// Haal mouse coordinaten
			var pos = getCoords ( e );
			var dim = windowDimension();
			var off = windowOffset();
			var posX = -20;
			var posY = 20;
			node.style.visibility  = 'visible';
		        // als infoscherm buiten venster komt, opschuiven zodat binnen venster
		        if (dim[0]>node.offsetWidth)
			{
				if (pos[0] + posX < off[0])
					posX = off[0] - pos[0];
				if (pos[0]+ posX + node.offsetWidth > dim[0]+off[0])
					posX = dim[0]+off[0] - pos[0] - node.offsetWidth;
			}
		        if ((dim[1]>node.offsetHeight) && (pos[1]+ posY + node.offsetHeight > dim[1]+off[1]))
			{
				if (pos[1]- node.offsetHeight - 20 > off[1])
					posY = -node.offsetHeight - 20;
				else
					posY = off[1] - pos[1] + 1;
			}
			node.style.left	 = (pos[0]+posX) + 'px';
			node.style.top	  = (pos[1]+posY) + 'px';
			node.style.zIndex   = zIndex++;
		}
	}
	return true;
}

//
// Maak de 'x' van de relatie vet en rood
//
function bold( id, e )
{ 
	if (!id) {
		return false;
	}
	var node = getObj( id );
	if ( node && node.style )
	{
		node.style.fontWeight = 'bold';
		node.style.color = 'red';
	}
	return true;
}

//
// Maak de 'x' van een relatie weer normaal
//
function debold( id, e )
{ 
	if (!id) {
		return false;
	}
	var node = getObj( id );
	if ( node && node.style )
	{
		node.style.fontWeight = 'normal';
		node.style.color = 'black';
	}
	return true;
}

//
// Verberg een blok
//
function nodisp( id )
{
	if (!id) {
		return false;
	}
	var node = getObj( id );
	if ( node && node.style )
	{
		node.style.visibility = 'hidden';
	}
	return true;
}


//
// Start drag. Onthoud het object en onthoud de coordinaten van de muis
//
function StartDrag( id, e )
{
	e = e || event;
	if (!id || !e) {
		return false
	}
	DragObj	 = getObj( id );
	mouseCor = getCoords(e);
	DragObj.style.zIndex = zIndex++;
	// Set eventhandlers voor move
	// en mouse up. Deze events sturen de rest van de drag
	document.onmousemove    = Drag;
	document.onmouseup      = stopDrag;
	return true;
}

//
// Stop drag, het enige dat moet worden gedaan is de eventhandlers
// de-installeren
//
function stopDrag( e )
{
	document.onmousemove = null;
	document.onmouseup   = null;
}

//
// Drag. Wordt bij elke muisverplaatsing aangeroepen.
//
function Drag( e )
{
	e = e || event;
	if (!e) {
		return false
	}
	var dx;
	var dy;
	var c = getCoords( e );
	if (!c) {
		return false;
	}
	if ((c[1] < 0) || (c[0] < 0))
		return false;
	// Kijk hoeveel de muis is verplaatst
	dx = mouseCor.x - c[0]
	dy = mouseCor.y - c[1];
	mouseCor.x = c[0];
	mouseCor.y = c[1];
	if (DragObj) {
		var iTop  = DragObj.offsetTop !== 0 ? DragObj.offsetTop-dy : '0',
		    iLeft = DragObj.offsetLeft !== 0 ? DragObj.offsetLeft-dx : '0';
		if (iTop && iLeft) {
			DragObj.style.top  = iTop  + 'px';
			DragObj.style.left = iLeft + 'px';
		}
	}
	return true;
}


//
// Haal het object met de naam als ingang
//
function getObj(name)
{
	if (document.getElementById)
	{
		return document.getElementById(name);
	}
	else if (document.all)
	{
		return document.all[name];
	}
	else if (document.layers)
	{
		return getObjNN4(document,name);
	}
	else
		return null;
}

//
// Zoek het object recursief voor Netscape 4
//
function getObjNN4( obj, name )
{
	var x = obj.layers;
	var foundLayer;
	for (var i=0;i<x.length;i++)
	{
		if (x[i].id == name)
		{
			foundLayer = x[i];
		}
		else if (x[i].layers.length)
		{
			var tmp = getObjNN4(x[i],name);
		}
		if (tmp) foundLayer = tmp;
	}
	return foundLayer;
}

//
// Haal de muiscoordinaten
//
function getCoords( e )
{
	e = e || event;
	var retVal = [];
	if (e) {
		if (e.pageX || e.pageY)
	 	{
	 		retVal = [e.pageX,e.pageY];
	 	}
	 	else if (e.clientX || e.clientY)
	 	{
	 		retVal = [e.clientX + document.body.scrollLeft+document.documentElement.scrollLeft,
		                  e.clientY + document.body.scrollTop+document.documentElement.scrollTop];
	 	}
	}
	return retVal;
}


//
// Maak een toolbox zichtbaar
//
function show( id, parentId, infoId, posX, posY)
{
	if (!id || !parentId) {
		return false;
	}
	var node = getObj( infoId );
	if ( node && node.style && (node.style.visibility == 'hidden'))
	{
		node = getObj( id );
		if ( node && node.style )
		{
			nodeParent = getObj(parentId); 
			var pos = findPosition(nodeParent);
			var dim = windowDimension();
			var off = windowOffset();
		        // als tooltip buiten venster komt, opschuiven zodat binnen venster
		        if (dim[0]>node.offsetWidth)
			{
				if (pos[0] + posX < off[0])
					posX = off[0] - pos[0];
				if (pos[0] + posX + node.offsetWidth > dim[0]+off[0])
					posX = dim[0]+off[0] - pos[0] - node.offsetWidth;
			}
		        if ((dim[1]>node.offsetHeight) && (pos[1] + posY + node.offsetHeight > dim[1]+off[1]))
			{
				if (posY) 
				{
					if (pos[1]- node.offsetHeight - 1 > off[1])
						posY = - node.offsetHeight - 1;
					else
						posY = off[1] - pos[1];
				}
				else
					posY = dim[1]+off[1] - pos[1] - node.offsetHeight;
			}
			node.style.left = (pos[0]+posX) + 'px';
			node.style.top = (pos[1]+posY) + 'px';
			node.style.visibility = 'visible'; 
		}
	}
	return true;
}

//
// Bepaal dimensies van het schermvenster
//
function windowDimension()
{
	var x, y;
	if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight))
	// all current browsers
	{
		if (document.body)
		// Opera geeft de correcte waarde via body ipv via documentElement zoals het hoort
		{
			if (document.documentElement.clientHeight > document.body.clientHeight)
				y = document.documentElement.clientHeight;
			else 
				y = document.body.clientHeight;
		} 
		else 
			y = document.documentElement.clientHeight;
		x = document.documentElement.clientWidth;
	}
	else if (document.body) // other Explorers
	{
		x = document.body.clientWidth;
		y = document.body.clientHeight;
	}
	else if (self.innerWidth || self.innerHeight) // all except Explorer
	{
		x = self.innerWidth;
		y = self.innerHeight;
	}
	return [x,y];
}

//
// Bepaal positie van vensterhoekpunt links bovenaan
//
function windowOffset()
{
	var x,y;
	if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop))
	// all current browsers
	{
		x = document.documentElement.scrollLeft;
		y = document.documentElement.scrollTop;
	}
	else if (document.body) // all other Explorers
	{
		x = document.body.scrollLeft;
		y = document.body.scrollTop;
	}
	else if (self.pageXOffset || self.pageYOffset) // all except Explorer
	{
		x = self.pageXOffset;
		y = self.pageYOffset;
	}
	return [x,y];
}

//
// Verberg een toolbox
//
function noshow( id )
{
	if (!id) {
		return false;
	}
	var node = getObj( id );
	if ( node && node.style )
	{
		node.style.visibility = 'hidden';
	}
	return true;
}

//
// Haal positie van een object
//
function findPosition(obj) 
{
	var curleft = 0;
	var curtop = 0;
	var retVal = [];
	if (obj.offsetParent) 
	{
		while (obj.offsetParent) 
		{
			curleft += obj.offsetLeft;
			curtop += obj.offsetTop;
			obj = obj.offsetParent;
		}
	}
	else 
	{
		if (obj.x)
			curleft += obj.x;
		if (obj.y)
			curtop += obj.y;	
	}
	retVal = [curleft,curtop];
	return retVal;
}


//
// Bepaal leeftijd van levende persoon
//
function getAge(exact,day,month,year)
{
	var now = new Date();
	var days = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	var yearsold = now.getFullYear() - year;
	var monthsold;
	var daysold;
	var string;
	month--;
	if (month < 0)
		monthsold = 0;
	else {
		monthsold = now.getMonth() - month;
		if (monthsold < 0)
		{
			yearsold--;
			monthsold += 12;
		}
	}
	if ((day < 0) || (month < 0))
		daysold = 0;
	else {
		daysold = now.getDate() - day;
		if (daysold < 0)
		{
			if (monthsold > 0)
		   		monthsold--;
			else
			{
				yearsold--;
		   		monthsold += 11;
	   		}
			if (day > days[month])
				daysold += day;
			else
	   			daysold += days[month];
		}
	}
	if (yearsold < 0)
		return 'nog niet geboren';
	if ((yearsold == 0) && (monthsold == 0) && (daysold == 0))
		if ((month>=0) && (day>=0)) {
			switch (exact) {
			case 0: 
				return 'vandaag geboren';
			case 2:
				return 'voor vandaag geboren';
			case 3:
				return 'ongeveer vandaag geboren';
			default:
				return '?';
			}
		} else {
			switch (exact) {
			case 0: 
				if (month < 0)
					return '<1 jaar';
				else
					return '<1 maand';
			case 2:
				if (month < 0)
					return '>0 jaar';
				else
					return '>0 maanden';
			case 3:
				if (month < 0)
					return '±0 jaar';
				else
					return '±0 maanden';
			default:
				return '?';
			}
		}
	if ((yearsold >= 1) && (exact == 0) && (((day < 0) && (monthsold == 0)) || (month < 0))) {
		return (yearsold-1) + ' of ' + yearsold + ' jaar';
	}
	switch (exact) {
	case 1:
		string = '<';
		break;
	case 2: 
		string = '>';
		break;
	case 3:
		string = '±';
		break;
	default:
		string = '';
		break;
	}
	if (yearsold >= 1)
	{
		string += yearsold + ' jaar';
	} else 
	if (monthsold >= 1)
	{
		string += monthsold + ' maand';
		if (monthsold > 1) 
			string += 'en';
	} else 
	if (daysold > 0)
	{
		string += daysold + ' dag';
		if (daysold > 1) 
			string += 'en';	
	}
	return string;
}
