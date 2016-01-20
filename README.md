Jive - Export Widget
=======================
The Export widget is a tool for looking up and exporting follower lists and event attendance details (including attendee emails).  This is a [Jive](https://community.jivesoftware.com/welcome) HTML widget project that utilizes the Jive V3 APIs to look up content information and parses the returned information for easier reading and exporting.  The Export widget utilizes [Bootstrap](http://getbootstrap.com) to create a clean user interface.

Prerequisite
------------
The [Content Lookup](https://github.com/fmr-llc/jive-content-lookup) widget installation has essential parts of setting up this widget project.  Make sure to install this widget prior to continuing with the Export installation.

Upload Libraries
----------------
* Extract the export widget zip archive to your local computer.
* Log into your Jive community.
* Navigate to the upload location for your library files.
* Create an Uploaded File in the Library location of your Jive community.  Drag the file "export_widget.css" to the file section of the upload.  Set the file name to "Export Widget CSS Library", put a description of your choosing, tag it, set the authors, and make sure it is being published to the correct Library location.  Click Publish.
* Create another Uploaded File in the Library location of your Jive community.  Drag the file "export_widget.js" to the file section of the upload.  Set the file name to "Export Widget JavaScript Library", put a description of your choosing, tag it, set the authors, and make sure it is being published to the correct Library location.  Click Publish.

Update Library Loader
---------------------
* Use the Content Lookup widget to search for "Library Loader".  Click the link to the file in the results.  If it is not found, contact your administrator and go over the prerequisite above.
* Download a copy of the "Library Loader" file from your community.  Open it for editing.
* Go back to the Content Lookup widget and search for "Export Widget".  You should see the two library files you uploaded to your community above.
* Find the search result for "Export Widget CSS Library" and copy its Content ID.  It should be a number like 694228.
* Update the library_loader.js file line for "export_widget.css" and update the content ID variable (it should be 0 before updating) to the Content ID from step 4.  The result should look similar to:
```
	libraries['export_widget.css'] = { contentID: '694228' };
```
* Find the search result for "Export Widget JavaScript Library" and copy its Content ID.  It should be a number like 694229.
* Update the library_loader.js file line for "export_widget.js" and update the content ID variable (it should be 0 before updating) to the Content ID from step 6.  The result should look similar to:
```
	libraries['export_widget.js'] = { contentID: '694229' };
```
* Save the changes to the library_loader.js file on your computer.
* Edit the "Library Loader" uploaded file in your Jive community.
* Drag the updated file from your computer to the file section of the uploaded file.  Click Publish.

You have now updated the Library Loader in your Jive community with the library files needed to run the export widget.

Install the Export Widget
-------------------------
* Use the Content Lookup widget to search for "jQuery Library" and get the Binary URL for "jQuery Library".  It should look similar to:
```
	https://myjiveinstance.mycompany.com/api/core/v3/attachments/file/694224/data
```  
* Look in the export widget archive on your computer and edit the "export_widget.html" file.
* Find the line:
```
    <script src='JQUERY'></script>
```
replace the text JQUERY with the Binary URL you copied.  It should end up looking similar to:
```
    <script src='https://myjiveinstance.mycompany.com/api/core/v3/attachments/file/694224/data'></script>
```
* Use the Content Lookup widget to search for "Library Loader".It should look similar to:
```
	https://myjiveinstance.mycompany.com/api/core/v3/attachments/file/694223/data
```  
* Edit the "export_widget.html" file again.
* Find the line:
```
    <script src='LIBRARY LOADER'></script>
```
replace the text LIBRARY LOADER with the Binary URL you copied.  It should end up looking similar to:
```
    <script src='https://myjiveinstance.mycompany.com/api/core/v3/attachments/file/694223/data'></script>
```
* Save the edit to the "export_widget.html" file.
* Go to the site you want to put the Export in your community, and go to the Overview page.
* Manage the Overview page, and drag a new HTML widget onto the page.
* Edit the new HTML Widget.
* Copy the updated code from "export_widget.html" and paste it into the "Your HTML" entry field in the new widget.
* Click "Save Properties".
* Click "Publish Layout".

Usage
-----
Once the Export widget is set up, it will display four choices for you to look up:
* Person
* Place
* Blog
* Event

Click one of the selections to limit the search to that type of content.  Next, type in the name of the content you wish to look up.  Note that this widget utilizes the Jive search API, so the same search idiosyncracies in the regular Jive search box must be taken into account here as well.  Click the Lookup button to search for results.  After searching, a ist of the related content matches will be displayed.  If you do not see your item of interest, refine your search and try again.  When you see your intended item, click it to highlight it, and click Export.  It will switch to a prcoessing spinner while the information is gathered and parsed into an export, and then the resuts will be displayed and highlighted for you.  At this point, it is best to copy the highlighted list, and save it to a CSV file on your computer (do not paste into Excel yet).  You can then open the CSV in Excel or similar to view and process the export.

Issues
------
If your widget is not working as expected, please check out [Issues](docs/issues.md)

Additional Jive-n widget projects in this series
------------------------------------------------
* [Accordion widget](https://github.com/fmr-llc/jive-accordion)
* [Content Viewer widget](https://github.com/fmr-llc/jive-content-viewer)
* [Form widget](https://github.com/fmr-llc/jive-form)
* [Form Report widget](https://github.com/fmr-llc/jive-form-report)
* [Menu Bar widget](https://github.com/fmr-llc/jive-menu)
* [Picture Carousel widget](https://github.com/fmr-llc/jive-picture-carousel)
* [Presentation widget](https://github.com/fmr-llc/jive-presentation)
* [Search widget](https://github.com/fmr-llc/jive-advanced-search)
* [Team Listing widget](www.github.com/fmr-llc/jive-team-listing)

Contributing
------------
If you would like to contribute to this project, please check out [Contributing](docs/contributing.md)

License
-------
(c) 2015-2016 Fidelity Investments
Licensed under the [Apache License](docs/LICENSE), Version 2.0