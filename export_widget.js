/* 
Jive - Export Widget

Copyright (c) 2015-2016 Fidelity Investments
Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

DESCRIPTION
This Jive HTML widget allows users to export followers for people and places as well as export event attendee lists.
*/
var fidosreg_id = 'b764a0a9536448345dc227af95e192521d337b5e4c3560c859b89ecd0407004a';
var placeID = '';
var followerCount = 0;
var followers = '';
var export_type = '';
var max_export_count = 25;
var maybeAttendees = null;
		
// This is required because Jive malforms the json response to prevent cross site injection attacks
jQuery.ajaxSetup({
	dataFilter: function(data, type) {
		return type === 'json' ? jQuery.trim(data.replace(/^throw [^;]*;/, '')) : data;
	}
});//ajax setup

function exportPerson() {
	export_type = 'person';
	exportConfig();
}

function exportPlace() {
	export_type = 'place';
	exportConfig();
}

function exportBlog() {
	export_type = 'blog';
	exportConfig();
}

function exportEvent() {
	export_type = 'event';
	exportConfig();
}

function exportProjects() {
	export_type = 'projects';
	exportConfig();
}

function exportConfig() {
	hideAll();
	$j('#getContainerStatus').text('');
	$j('#getContainerStatus').css({'border-style': 'none' });
	$j('#search_criteria').val('');
	$j('#search_criteria').attr('readonly', false);
	$j('#lookupButton').attr('disabled', false);
	$j('#searchDiv').show();
	$j('#search_criteria').focus();
	resizeMe();
}

/*
*Base Logic
*/
function lookup(){				
	//Disable all of the input until the page and all it's children are found
	$j('#export_button').attr('disabled', true);
	$j('#search_criteria').attr('readonly', true);
	$j('#lookupButton').attr('disabled', true);
	$j('#getContainerStatus').text('Searching...');
	$j('#getContainerStatus').css({'border-style': 'none' });
	var searchURL = '/api/core/v3/search/';
	if (export_type == 'place' || export_type == 'blog'|| export_type == 'projects') {
		searchURL += 'places';
	} else if (export_type == 'event' ) {
		searchURL += 'contents';
	} else {
		searchURL += 'people';
	}
	searchURL += '?filter=search(' + $j('#search_criteria').val() + '*)'
	if (export_type == 'event') {
		searchURL += '&filter=type(event)'
	}
	searchURL += '&count=100';
	$j.ajax({
		type: 'GET',
		url: searchURL,
		dataType: 'json',
		success: function (data) {
			var object_list = "";
			// process the search results into the select list.
			if (export_type == 'place' || export_type == 'projects') {
				$j(data.list).each(function(index, place){ 
					object_list += '<a class="list-group-item" title="' + place.description + '" id="' + place.placeID + '" ';
					if (place.type == 'group') {
						object_list += 'style="background-color: #ddb3da;"';
					} else if (place.type == 'project') {
						object_list += 'style="background-color: white;"';
					} else {
						object_list += 'style="background-color: #fde493;"';
					}
					object_list +=  '>' + place.name + ' - ' + place.followerCount + ' followers</a>';
				});
			} else if (export_type == 'event') {
				$j(data.list).each(function(index, event){
					object_list += '<a class="list-group-item" id="' + event.contentID + '">' + event.subject + ' - ' + (event.attendance.yesAttendees.count + event.attendance.maybeAttendees.count) + ' - attendees</a>';
				});
			} else if (export_type == 'blog') {
				$j(data.list).each(function(index, place){ 
					if (place.resources.blog != undefined ) {
						$j.ajax({	
							type: 'GET',
							url: place.resources.blog.ref,
							dataType: 'json',
							async: false,
							success: function (data) {
								object_list += '<a class="list-group-item" id="' + data.placeID + '">' + data.name + ' - ' + data.followerCount + ' followers</a>';
							},
							error: function (xhr, ajaxOptions, thrownError){
								alert(thrownError);
							},
							complete: function(){
							}
						});
					}	
				});
			} else {
				for (ndx = 0; ndx < data.list.length; ndx++ ) {
					object_list += '<a class="list-group-item" id="' + data.list[ndx].id + '">' + data.list[ndx].displayName + ' - ' + data.list[ndx].followerCount + ' followers</a>';
				}
			}
			$j('#searchResults').html( object_list );
			$j('a').click(function(e){
				activate( this );
				return false;
			});
			hideAll();
			$j('#resultsDiv').show();
			resizeMe();
		},
		error: function (xhr, ajaxOptions, thrownError){
			alert(thrownError);
		},
		complete: function(){
		}
	});					
}//lookup()			

function activate(obj) {
	$j('a.active').removeClass('active');
	$j(obj).addClass('active');
	$j('#export_button').attr('disabled', false);
}

function exportFollowers() {
	hideAll();
	$j('#processingDiv').show();
	resizeMe();
	objID = $j('a.active').attr("id");
	if (export_type == 'event') {
		lookupEventAttendees();
	} else {
		exportSet(0);
	}
}

function lookupEventAttendees(){
	$j.ajax({
		type: "GET",
		url: '/api/core/v3/contents/' + objID,
		dataType: "json",
		success: function (data) {
			if(data){
				eventLookup = data.resources.yesAttendees.ref;
				maybeAttendees = data.resources.maybeAttendees.ref;
				exportSet(0);
			}//if(data)
		},
		error: function (xhr, ajaxOptions, thrownError){
			//alert(thrownError);
		},
		complete: function(){
		}//complete
	});//ajax get
}

function exportSet(iteration){
	if (iteration == 0 && followers == '') {
		followerCount = 0;
		if ( export_type == 'projects' ) {
			followers = '"PROJECT","START DATE"\n';
		} else {
			followers = '"CORP ID","NAME","EMAIL","RIBBIT ID"\n';
		}
	}
	if (export_type == 'event') {
		var url = eventLookup + '?count=' + max_export_count + '&startIndex=' + (iteration * max_export_count);
	} else {
		var url = '/api/core/v3/';
		if (export_type == 'place'  | export_type == 'blog' || export_type == 'projects') {
			url += 'places';
		} else {
			url += 'people';
		}
		url += '/' + objID + '/';
		if (export_type == 'person') {
			url += '@';
		}
		if (export_type == 'projects') {
			url += 'places?count=' + max_export_count + '&startIndex=' + (iteration * max_export_count);
		} else {
			url += 'followers?count=' + max_export_count + '&startIndex=' + (iteration * max_export_count);
		}
	}
	$j.ajax({
		type: "GET",
		url: url,
		dataType: "json",
		beforeSend: function(){
		},					
		success: function (data) {
			if(data){
				var count = 0;
				$j(data.list).each(function(index, item){
					count += 1;
					if (export_type == 'projects' ) {
						if (item.type == 'project') {
							addProject(item);
						}
					} else if (export_type != 'event') {
						addFollower(item);
					} else {
						$j.ajax({
							type: "GET",
							url: '/api/core/v3/people/' + item.id,
							dataType: "json",
							async: false,
							success: function (person) {
								addFollower(person);
							},
							error: function (xhr, ajaxOptions, thrownError){
							},
							complete: function(){
							}//complete
						});//ajax get
					}
				});
				if (count >= data.itemsPerPage) {
					exportSet(iteration + 1);
				} else {
					if (export_type == 'event' && maybeAttendees != null) {
						eventLookup = maybeAttendees;
						maybeAttendees = null;
						exportSet(0);
					} else {
						exportComplete();
					}
				}
			}//if(data)
		},
		error: function (xhr, ajaxOptions, thrownError){
			//alert(thrownError);
		},
		complete: function(){
		}//complete
	});//ajax get
}//exportFollowers

function addFollower(person) {
	followerCount += 1;
	followers += '"' + person.jive.username + '","' + person.displayName + '","';
	if (person.emails && person.emails[0]) {
		followers += person.emails[0].value;
	}
	followers +=  '",' + person.id + '\n';
}

function addProject(project) {
	followerCount += 1;
	followers += '"' + project.name + '","' + project.startDate.substring(0,10) + '"\n';
}

function exportComplete() {
	hideAll();
	$j('#followersDiv').show();
	$j('#follower_export').val(followers);
	$j('#follower_export').attr('readonly', true);
	$j('#follower_export').show();
	$j('#follower_export').select();
	resizeMe();
}

function cancel(){
	hideAll();
	followerCount = 0;
	followers = '';
	$j('#initDiv').show();
	resizeMe();
}

function hideAll(){
	$j('#searchDiv').hide();
	$j('#followersDiv').hide();
	$j('#resultsDiv').hide();
	$j('#processingDiv').hide();
	$j('#follower_export').hide();
	$j('#initDiv').hide();
}