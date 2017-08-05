import './search';
import './prism';

window.$ = window.jQuery = $;
window._ = _;

$(document).ready(function() {
	// $('ul.tabs').tabs();

	$('.button-collapse').sideNav({
			menuWidth: 300, // Default is 300
			edge: 'right', // Choose the horizontal origin
			closeOnClick: true, // Closes side-nav on <a> clicks, useful for Angular/Meteor
			draggable: true // Choose whether you can drag to open on touch screens
		}
	);

	$('.dropdown-button').dropdown({
			inDuration: 300,
			outDuration: 225,
			constrainWidth: false, // Does not change width of dropdown to that of the activator
			hover: true, // Activate on hover
			gutter: 1, // Spacing from edge
			belowOrigin: true, // Displays dropdown below the button
			alignment: 'left', // Displays dropdown with edge aligned to the left of button
			stopPropagation: true // Stops event propagation
		}
	);
	$('#fullpage').fullpage({
		sectionsColor: ['white', '#fff8e1', 'white', '#1BBC9B'],
		scrollOverflow: true,
		fitToSection: false,
		slideSelector: '.slide-section'
	});
});

       
