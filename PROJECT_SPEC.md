# Image Analysis
## Description

A simple app to analyze a user-supplied image for lesion confidences and return a list of recommended cosmetic products.

# Image Upload form
## Description
create a page to demonstrate the API's ability to analyze an image

## ECOA
- create a new next js demo app as a peer of the image proxy repo in our public github

- create an index/home page at the root of the new app’s directory (e.g. /lesionAnalysis/)

- the home page should have a “VisualDx API - Lesion Analysis Example” as an <h1> and the page’s title

- beneath the title should be a paragraph: “Analyze a picture of your skin to find cosmetic product recommendations.”

- beneath that paragraph should be an <a> tag: “Click here to see the code”, which will be a link to the github repo

- beneath that <a> tag should be a file input form that accepts images, just like the UX for DermExpert on the web

- submitting the form sends the image to be analyzed by the api

- handle auth automatically for the image analysis endpoint on the back-end

- keys for authentication will be stored privately, and not committed to the repo

    + Note: keys will be generated for this project that us the new ‘sandbox’ permission

- unlike other demo endpoints, there is no point in caching JSON results - we expect each POST will return a unique answer and we’re not monitoring the input

- handle all expected error states from image analysis endpoint and display appropriate messages (e.g. “This account lacks permission to analyze images“, “Only .png and .jpg Images smaller than 10MB are supported“, etc.)

- show a progress spinner while the image analysis is being processed async

- when the result is returned:

    + clear any previous results or error messages from previous analysis runs

    + display the top lesion finding's name below the input for and scroll the page to the results container.

    + display results based on top lesion finding below the input in a <div> entitled “lesion-analysis”

    + use the attached spreadsheet to determine the new content of the results container: “<p>It looks like you might have [lesionName].</p><p>[Therapy Message]</p>

        - The data in this spreadsheet will be updated in other Jira tickets - persist the data however you wish in the repo itself

        - if a lesion is not listed or is not recognized, the default behavior should be to display: “<p>I'm not sure what the condition of your skin is</p><p>Just to be safe, get this checked out by a dermatologist.</p>”

    + scroll the page to the top of this results container.
